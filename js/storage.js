/**
 * Storage Manager for ML CodeVault
 * Handles LocalStorage, JSON backup/restore, and GitHub Gist Cloud Sync
 */

const STORAGE_KEY_SNIPPETS = 'ml_codevault_custom_snippets';
const STORAGE_KEY_FAVORITES = 'ml_codevault_favorites';
const STORAGE_KEY_GIST_CONFIG = 'ml_codevault_gist_config';

class StorageManager {
  constructor() {
    this.customSnippets = this.loadCustomSnippets();
    this.favorites = this.loadFavorites();
  }

  loadCustomSnippets() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SNIPPETS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read custom snippets from localStorage", e);
      return [];
    }
  }

  saveCustomSnippets() {
    try {
      localStorage.setItem(STORAGE_KEY_SNIPPETS, JSON.stringify(this.customSnippets));
    } catch (e) {
      console.error("Failed to save custom snippets to localStorage", e);
    }
  }

  loadFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return data ? new Set(JSON.parse(data)) : new Set();
    } catch (e) {
      return new Set();
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  }

  toggleFavorite(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.saveFavorites();
    return this.favorites.has(id);
  }

  isFavorite(id) {
    return this.favorites.has(id);
  }

  getAllSnippets() {
    // Combine built-in default snippets + user's custom created snippets
    const defaults = typeof DEFAULT_SNIPPETS !== 'undefined' ? DEFAULT_SNIPPETS : [];
    // If a custom snippet has the same id as default, custom overrides it
    const customMap = new Map(this.customSnippets.map(s => [s.id, s]));
    const result = defaults.map(d => customMap.has(d.id) ? customMap.get(d.id) : d);
    
    // Add custom snippets that are brand new IDs
    const defaultIds = new Set(defaults.map(d => d.id));
    for (const custom of this.customSnippets) {
      if (!defaultIds.has(custom.id)) {
        result.unshift(custom); // Show newly created on top
      }
    }
    return result;
  }

  getSnippetById(id) {
    const all = this.getAllSnippets();
    return all.find(s => s.id === id);
  }

  saveSnippet(snippet) {
    const isNew = !snippet.id;
    if (isNew) {
      snippet.id = 'custom-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      snippet.isCustom = true;
      snippet.createdAt = new Date().toISOString();
      this.customSnippets.unshift(snippet);
    } else {
      snippet.updatedAt = new Date().toISOString();
      const idx = this.customSnippets.findIndex(s => s.id === snippet.id);
      if (idx >= 0) {
        this.customSnippets[idx] = snippet;
      } else {
        snippet.isCustom = true;
        this.customSnippets.push(snippet);
      }
    }
    this.saveCustomSnippets();
    return snippet;
  }

  deleteSnippet(id) {
    this.customSnippets = this.customSnippets.filter(s => s.id !== id);
    this.favorites.delete(id);
    this.saveCustomSnippets();
    this.saveFavorites();
  }

  // Export all custom + starred data as a backup JSON file
  exportBackupJSON() {
    const payload = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      customSnippets: this.customSnippets,
      favorites: Array.from(this.favorites)
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ml_codevault_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Import JSON backup
  importBackupJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.customSnippets && Array.isArray(parsed.customSnippets)) {
        const existingMap = new Map(this.customSnippets.map(s => [s.id, s]));
        for (const item of parsed.customSnippets) {
          existingMap.set(item.id, item);
        }
        this.customSnippets = Array.from(existingMap.values());
        this.saveCustomSnippets();
      }
      if (parsed.favorites && Array.isArray(parsed.favorites)) {
        for (const fav of parsed.favorites) {
          this.favorites.add(fav);
        }
        this.saveFavorites();
      }
      return { success: true, count: parsed.customSnippets ? parsed.customSnippets.length : 0 };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Gist Configuration
  getGistConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_GIST_CONFIG);
      return data ? JSON.parse(data) : { token: '', gistId: '', autoSync: false };
    } catch (e) {
      return { token: '', gistId: '', autoSync: false };
    }
  }

  saveGistConfig(config) {
    localStorage.setItem(STORAGE_KEY_GIST_CONFIG, JSON.stringify(config));
  }

  // Push snippets to GitHub Gist
  async syncToGist(token, gistId) {
    const filename = "ml_codevault_backup.json";
    const content = JSON.stringify({
      version: "1.0",
      updatedAt: new Date().toISOString(),
      customSnippets: this.customSnippets,
      favorites: Array.from(this.favorites)
    }, null, 2);

    const headers = {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`
    };

    let url = "https://api.github.com/gists";
    let method = "POST";
    let body = {
      description: "ML CodeVault Sync Backup",
      public: false,
      files: {
        [filename]: { content: content }
      }
    };

    if (gistId) {
      url = `https://api.github.com/gists/${gistId}`;
      method = "PATCH";
    }

    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to push to GitHub Gist");
    }

    const resData = await response.json();
    return resData.id;
  }

  // Pull snippets from GitHub Gist
  async pullFromGist(token, gistId) {
    const headers = {
      "Accept": "application/vnd.github+json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: headers
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch GitHub Gist");
    }

    const data = await response.json();
    const targetFile = data.files["ml_codevault_backup.json"] || Object.values(data.files)[0];
    if (!targetFile || !targetFile.content) {
      throw new Error("No valid JSON snippet file found in this Gist");
    }

    const result = this.importBackupJSON(targetFile.content);
    if (!result.success) {
      throw new Error("Invalid Gist format: " + result.error);
    }
    return result;
  }
}

const storage = new StorageManager();
