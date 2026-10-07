/**
 * ML Lab Vault - Application Logic
 * Renders 8 Machine Learning Experiments with 1-Click Copy for Algorithm, Program & Output.
 */

let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  renderJumpPills();
  renderExperiments();
});

// Render Jump Navigation Pills
function renderJumpPills() {
  const container = document.getElementById("nav-pills-container");
  if (!container || typeof EXPERIMENTS === "undefined") return;

  container.innerHTML = EXPERIMENTS.map(exp => `
    <a href="#${exp.id}" class="nav-pill">
      <span>${exp.expNumber}</span>: ${exp.title.split('(')[0]}
    </a>
  `).join("");
}

// Render All Experiments
function renderExperiments() {
  const container = document.getElementById("experiments-list");
  if (!container || typeof EXPERIMENTS === "undefined") return;

  const filtered = EXPERIMENTS.filter(exp => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      exp.expNumber.toLowerCase().includes(q) ||
      exp.title.toLowerCase().includes(q) ||
      exp.dataset.toLowerCase().includes(q) ||
      exp.tags.some(t => t.toLowerCase().includes(q)) ||
      exp.algorithm.toLowerCase().includes(q) ||
      exp.code.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 1.2rem; font-weight: 600;">No experiments matching "${searchQuery}"</p>
        <p style="font-size: 0.9rem; margin-top: 8px;">Try searching for "linear", "naive bayes", "knn", or "exp 1"</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(exp => `
    <article class="experiment-card" id="${exp.id}">
      <!-- Card Header -->
      <header class="card-header">
        <div class="header-top-row">
          <span class="exp-badge">${exp.expNumber}</span>
          <span class="dataset-badge">📁 Dataset: ${exp.dataset}</span>
        </div>
        <h2 class="exp-title">${exp.expNumber}: ${exp.title}</h2>
        <div class="tags-row">
          ${exp.tags.map(t => `<span class="tag-item">#${t}</span>`).join("")}
        </div>
      </header>

      <!-- 3 Primary Copy Buttons Toolbar -->
      <div class="action-buttons-bar">
        <button class="copy-btn btn-copy-algo" onclick="copyAlgorithm('${exp.id}')">
          <span>📋</span> Copy Algorithm
        </button>
        <button class="copy-btn btn-copy-code" onclick="copyCode('${exp.id}')">
          <span>💻</span> Copy Program
        </button>
        <button class="copy-btn btn-copy-output" onclick="copyOutput('${exp.id}')">
          <span>📊</span> Copy Output
        </button>
      </div>

      <!-- Card Content: 3 Visual Sections -->
      <div class="card-content">
        <!-- Section 1: Algorithm -->
        <section class="section-block">
          <div class="section-header">
            <span class="section-label label-algo">📌 Step-by-Step Algorithm</span>
            <button class="mini-copy-btn" onclick="copyAlgorithm('${exp.id}')">Copy</button>
          </div>
          <div class="algorithm-box">${escapeHtml(exp.algorithm)}</div>
        </section>

        <!-- Section 2: Program Code -->
        <section class="section-block">
          <div class="section-header">
            <span class="section-label label-code">💻 Python Program Code</span>
            <button class="mini-copy-btn" onclick="copyCode('${exp.id}')">Copy Code</button>
          </div>
          <div class="code-container">
            <pre><code class="language-python">${escapeHtml(exp.code)}</code></pre>
          </div>
        </section>

        <!-- Section 3: Execution Output -->
        <section class="section-block">
          <div class="section-header">
            <span class="section-label label-output">📊 Execution Output & Results</span>
            <button class="mini-copy-btn" onclick="copyOutput('${exp.id}')">Copy Output</button>
          </div>
          <div class="output-box">${escapeHtml(exp.output)}</div>
        </section>
      </div>
    </article>
  `).join("");

  // Re-run Prism syntax highlighting on rendered code blocks
  if (typeof Prism !== "undefined") {
    Prism.highlightAll();
  }
}

// Live Search handler
function handleSearch(val) {
  searchQuery = val;
  renderExperiments();
}

// Copy Helper Functions
function getExpById(id) {
  return EXPERIMENTS.find(e => e.id === id);
}

function copyAlgorithm(id) {
  const exp = getExpById(id);
  if (!exp) return;
  navigator.clipboard.writeText(exp.algorithm).then(() => {
    showToast(`📋 Copied ${exp.expNumber} Algorithm!`);
  });
}

function copyCode(id) {
  const exp = getExpById(id);
  if (!exp) return;
  navigator.clipboard.writeText(exp.code).then(() => {
    showToast(`💻 Copied ${exp.expNumber} Python Program!`);
  });
}

function copyOutput(id) {
  const exp = getExpById(id);
  if (!exp) return;
  navigator.clipboard.writeText(exp.output).then(() => {
    showToast(`📊 Copied ${exp.expNumber} Output!`);
  });
}

// Toast Feedback Notification
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// HTML escape helper
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
