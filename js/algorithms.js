/**
 * ML Lab Vault - 8 Official Machine Learning Lab Experiments (B.Tech CSE)
 * Structured with dedicated Algorithm, Program Code, and Output fields.
 */

const EXPERIMENTS = [
  {
    id: "exp-01",
    expNumber: "Experiment 01",
    title: "Simple Linear Regression",
    dataset: "california_housing.csv",
    tags: ["Regression", "Linear Regression", "California Housing", "MSE", "R2 Score"],
    algorithm: `1. Start.
2. Import the required libraries, including NumPy, Pandas, Matplotlib, and Scikit-Learn modules.
3. Load the California Housing dataset (california_housing.csv).
4. Select total_rooms as the input feature (X) and median_income as the target variable (Y).
5. Split the dataset into training and testing sets using the train_test_split() function.
6. Create a Linear Regression model and train it using the training data with model.fit().
7. Predict the target values for the test data using model.predict().
8. Evaluate the model using performance metrics such as Mean Squared Error (MSE) and R2 Score.
9. Plot the actual test data as a scatter plot and draw the fitted regression line representing the model's predictions.
10. Display the graph with an appropriate title, axis labels, and a legend.
11. Stop.`,
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Load dataset
dataset = pd.read_csv("california_housing.csv")
print(dataset.head())

# Select input feature and target variable
X = dataset[['total_rooms']]
y = dataset['median_income']

# Split dataset into training and testing sets (80:20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train Linear Regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict target values for test data
y_pred = model.predict(X_test)

# Evaluate performance metrics
print("mean_squared_error(MSE):", mean_squared_error(y_test, y_pred))
print("R2 score:", r2_score(y_test, y_pred))

# Plot actual test data vs fitted regression line
plt.figure(figsize=(8, 5))
plt.scatter(X_test, y_test, color='gray', label='actual data')

sorted_index = X_test['total_rooms'].argsort()
plt.plot(
    X_test.iloc[sorted_index],
    y_pred[sorted_index],
    color='red',
    linewidth=2,
    label='regression line'
)

plt.title("linear regression using california housing dataset")
plt.xlabel("total_rooms")
plt.ylabel("median_house_value")
plt.legend()
plt.show()`,
    output: `mean_squared_error(MSE): 3.404063750791325
R2 score: 0.03819415340256371

[Matplotlib Window: Scatter plot of total_rooms vs median_house_value with red fitted regression line]`
  },
  {
    id: "exp-02",
    expNumber: "Experiment 02",
    title: "Linear vs Polynomial Regression",
    dataset: "auto-mpg.csv",
    tags: ["Regression", "Polynomial Regression", "Auto MPG", "Degree 2", "Feature Transform"],
    algorithm: `1. Start.
2. Import NumPy, Pandas, Matplotlib, and Scikit-Learn regression and preprocessing modules.
3. Load the auto-mpg.csv dataset and drop missing values using dropna(inplace=True).
4. Select displacement as the independent feature (X) and mpg as the dependent target (y).
5. Split dataset into training and testing sets (80:20 split, random_state=42).
6. Fit standard Linear Regression model on training data and predict on test set.
7. Generate degree-2 polynomial features using PolynomialFeatures(degree=2).
8. Train a separate Linear Regression model on the polynomial-transformed features.
9. Calculate and compare Mean Squared Error (MSE) and R2 Score for both Linear and Polynomial models.
10. Plot actual data points scatter alongside fitted Linear Regression line (blue) and Polynomial curve (red).
11. Stop.`,
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score

# Load and clean dataset
df = pd.read_csv("auto-mpg.csv")
print(df.head())
df.dropna(inplace=True)

X = df[['displacement']]
y = df['mpg']

# Split train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 1. Standard Linear Regression
linear_model = LinearRegression()
linear_model.fit(X_train, y_train)
y_pred_linear = linear_model.predict(X_test)

# 2. Polynomial Regression (Degree 2)
poly = PolynomialFeatures(degree=2)
X_train_poly = poly.fit_transform(X_train)
X_test_poly = poly.transform(X_test)

poly_model = LinearRegression()
poly_model.fit(X_train_poly, y_train)
y_pred_poly = poly_model.predict(X_test_poly)

# Evaluation
print("LinearRegression")
print("mean_squared_error(MSE):", mean_squared_error(y_test, y_pred_linear))
print("R2 score:", r2_score(y_test, y_pred_linear))
print()
print("PolynomialRegression")
print("mean_squared_error(MSE):", mean_squared_error(y_test, y_pred_poly))
print("R2 score:", r2_score(y_test, y_pred_poly))

# Plot comparisons
plt.figure(figsize=(8, 6))
plt.scatter(X, y, color='gray', alpha=0.5, label='actual data')

X_range = pd.DataFrame({
    "displacement": np.linspace(X["displacement"].min(), X["displacement"].max(), 100)
})

plt.plot(
    X_range["displacement"],
    linear_model.predict(X_range),
    color="blue",
    linewidth=2,
    label="Linear Regression"
)

plt.plot(
    X_range["displacement"],
    poly_model.predict(poly.transform(X_range)),
    color="red",
    linewidth=2,
    label="Polynomial Regression(Degree 2)"
)

plt.title("linear regression vs Polynomial Regression ")
plt.xlabel("engine displacement")
plt.ylabel("Miles per gallon(MPG)")
plt.legend()
plt.show()`,
    output: `LinearRegression
mean_squared_error(MSE): 18.102543998358946
R2 score: 0.6633114869465596

PolynomialRegression
mean_squared_error(MSE): 15.10735356108076
R2 score: 0.7190189176110284

[Matplotlib Window: Displacement vs MPG curve showing Linear fit (Blue) vs Polynomial fit (Red)]`
  },
  {
    id: "exp-03",
    expNumber: "Experiment 03",
    title: "Linear, Ridge & Lasso Regression",
    dataset: "Diabetes.csv",
    tags: ["Regression", "Ridge Regularization", "Lasso L1", "StandardScaler", "Cross-Validation"],
    algorithm: `1. Start.
2. Import NumPy, Pandas, Scikit-Learn regression models (LinearRegression, RidgeCV, LassoCV), StandardScaler, and metrics.
3. Load the Diabetes dataset (/content/Diabetes.csv).
4. Separate independent features (X) and target variable (y).
5. Standardize the features using StandardScaler to ensure equal regularizing penalty across variables.
6. Split data into training (80%) and testing (20%) sets (random_state=42).
7. Train Linear Regression model using LinearRegression().fit(X_train, y_train).
8. Train Ridge Regression using RidgeCV(alphas=[0.1, 1.0, 10.0]).
9. Train Lasso Regression using LassoCV(cv=5).
10. Predict on the test set and display Mean Squared Error (MSE) and R2 Score across all three models.
11. Stop.`,
    code: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

# Load dataset
data = pd.read_csv("/content/Diabetes.csv")
X = data.iloc[:, :-1]
y = data.iloc[:, -1]

# Standardize features
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Train-Test Split (80:20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Models
lin = LinearRegression().fit(X_train, y_train)
ridge = RidgeCV(alphas=[0.1, 1.0, 10.0]).fit(X_train, y_train)
lasso = LassoCV(cv=5).fit(X_train, y_train)

# Evaluate and compare
for name, model in [('Linear', lin), ('Ridge', ridge), ('Lasso', lasso)]:
    pred = model.predict(X_test)
    print(f"{name} - MSE: {mean_squared_error(y_test, pred):2f},R2: {r2_score(y_test, pred):2f}")`,
    output: `Linear - MSE: 2900.193628, R2: 0.452603
Ridge  - MSE: 2892.030116, R2: 0.454144
Lasso  - MSE: 2800.262710, R2: 0.471464`
  },
  {
    id: "exp-04",
    expNumber: "Experiment 04",
    title: "Logistic Regression MLE & MAP (L1/L2)",
    dataset: "Breast_cancer_Wisconsin.csv",
    tags: ["Classification", "Logistic Regression", "MLE", "MAP", "L1 Lasso", "L2 Ridge"],
    algorithm: `1. Start.
2. Import LogisticRegression, train_test_split, accuracy_score, and Pandas.
3. Load the Breast Cancer Wisconsin dataset (/content/Breast_cancer_Wisconsin.csv).
4. Clean dataset by dropping null columns and separating the 'diagnosis' column as target (y).
5. Split dataset into training (70%) and testing (30%) subsets.
6. Train MLE Logistic Regression model (penalty=None, max_iter=5000).
7. Train MAP Logistic Regression with L2 Gaussian prior (penalty='l2', C=0.1, max_iter=5000).
8. Train MAP Logistic Regression with L1 Laplace prior (penalty='l1', solver='liblinear', C=0.1).
9. Predict on test set and display accuracy scores for MLE, MAP (L2), and MAP (L1).
10. Stop.`,
    code: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd

# Load dataset
data = pd.read_csv("/content/Breast_cancer_Wisconsin.csv")
data.dropna(axis=1, inplace=True)

x = data.drop(['diagnosis'], axis=1)
y = data['diagnosis']

# Train-Test Split (70:30)
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.3)

# 1. MLE Estimation (No penalty)
mle_model = LogisticRegression(penalty=None, max_iter=5000).fit(X_train, y_train)

# 2. MAP Estimation with L2 Regularization (Gaussian Prior)
map_l2 = LogisticRegression(penalty='l2', C=0.1, max_iter=5000).fit(X_train, y_train)

# 3. MAP Estimation with L1 Regularization (Laplace Prior)
map_l1 = LogisticRegression(penalty='l1', solver='liblinear', C=0.1).fit(X_train, y_train)

# Compare Accuracies
print(f"MLE Accuracy: {accuracy_score(y_test, mle_model.predict(X_test)):.2f}")
print(f"MAP (L2) Accuracy: {accuracy_score(y_test, map_l2.predict(X_test)):.2f}")
print(f"MAP (L1) Accuracy: {accuracy_score(y_test, map_l1.predict(X_test)):.2f}")`,
    output: `MLE Accuracy: 0.95
MAP (L2) Accuracy: 0.95
MAP (L1) Accuracy: 0.95`
  },
  {
    id: "exp-05",
    expNumber: "Experiment 05",
    title: "MLE & MAP Estimation of Multinomial Distribution",
    dataset: "20 Newsgroups",
    tags: ["NLP", "Naive Bayes", "MultinomialNB", "MLE", "MAP", "Laplace Smoothing"],
    algorithm: `1. Start.
2. Import the required libraries and Scikit-Learn functions (fetch_20newsgroups, CountVectorizer, MultinomialNB, accuracy_score).
3. Load the 20 Newsgroups dataset for selected text categories ('alt.atheism', 'soc.religion.christian', 'comp.graphics', 'sci.med').
4. Convert text documents into a word-count matrix using CountVectorizer.
5. Split the vectorized data into training and testing sets.
6. Train a MultinomialNB model using Maximum Likelihood Estimation (MLE) with alpha=10.
7. Train a separate MultinomialNB model using Maximum A Posteriori (MAP) estimation by applying Laplace smoothing prior (alpha=1.0).
8. Predict classes of test documents using both MLE and MAP models.
9. Calculate accuracy of both MLE and MAP models.
10. Compare accuracies and evaluate the effect of prior distribution on model performance.
11. Stop.`,
    code: `from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

# Load selected 20 Newsgroups categories
categories = ['alt.atheism', 'soc.religion.christian', 'comp.graphics', 'sci.med']
newsgroups_train = fetch_20newsgroups(subset='train', categories=categories)
newsgroups_test = fetch_20newsgroups(subset='test', categories=categories)

# Vectorize text documents into word-count matrix
vectorizer = CountVectorizer()
x_train = vectorizer.fit_transform(newsgroups_train.data)
y_train = newsgroups_train.target
x_test = vectorizer.transform(newsgroups_test.data)
y_test = newsgroups_test.target

# Train MLE Model (alpha=10)
mle_nb = MultinomialNB(alpha=10).fit(x_train, newsgroups_train.target)

# Train MAP Model (Laplace smoothing prior alpha=1.0)
map_nb = MultinomialNB(alpha=1.0).fit(x_train, newsgroups_train.target)

# Predict and Compare Accuracies
print(f"MLE Accuracy: {accuracy_score(newsgroups_test.target, mle_nb.predict(x_test)):.2f}")
print(f"MAP Accuracy: {accuracy_score(newsgroups_test.target, map_nb.predict(x_test)):.2f}")`,
    output: `MLE Accuracy: 0.78
MAP Accuracy: 0.93`
  },
  {
    id: "exp-06",
    expNumber: "Experiment 06",
    title: "Logistic Regression With vs Without Scaling",
    dataset: "diabetes (2).csv",
    tags: ["Classification", "Logistic Regression", "StandardScaler", "Classification Report", "Normalization"],
    algorithm: `1. Start.
2. Import Pandas, train_test_split, LogisticRegression, StandardScaler, and classification_report.
3. Load the diabetes dataset (/content/diabetes (2).csv) and check column structure.
4. Separate features (X) by dropping 'Outcome' and assign 'Outcome' to target variable (y).
5. Split into training (80%) and testing (20%) sets (random_state=42).
6. Train LogisticRegression model on unscaled raw features and print classification report.
7. Apply StandardScaler to normalize training and testing feature distributions.
8. Train LogisticRegression model on scaled features and print classification report.
9. Compare precision, recall, and f1-scores between unscaled and scaled models.
10. Stop.`,
    code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

# Load dataset
df = pd.read_csv("/content/diabetes (2).csv")
print(df.head())
print(df.columns)

X = df.drop("Outcome", axis=1)
y = df["Outcome"]

# Split data (80:20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 1. Model Without Feature Scaling
model_raw = LogisticRegression(max_iter=500)
model_raw.fit(X_train, y_train)
y_pred_raw = model_raw.predict(X_test)

print("---------WITHOUT SCALING-------")
print(classification_report(y_test, y_pred_raw))

# 2. Model With Feature Scaling (StandardScaler)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model_scaled = LogisticRegression(max_iter=500)
model_scaled.fit(X_train_scaled, y_train)
y_pred_scaled = model_scaled.predict(X_test_scaled)

print("---------WITH SCALING-------")
print(classification_report(y_test, y_pred_scaled))`,
    output: `---------WITHOUT SCALING-------
              precision    recall  f1-score   support

           0       0.81      0.79      0.80        99
           1       0.64      0.67      0.65        55

    accuracy                           0.75       154
   macro avg       0.73      0.73      0.73       154
weighted avg       0.75      0.75      0.75       154

---------WITH SCALING-------
              precision    recall  f1-score   support

           0       0.81      0.80      0.81        99
           1       0.65      0.67      0.66        55

    accuracy                           0.75       154
   macro avg       0.73      0.74      0.73       154
weighted avg       0.76      0.75      0.75       154`
  },
  {
    id: "exp-07",
    expNumber: "Experiment 07",
    title: "Implementation of Naive Bayes Classifier",
    dataset: "20NewsGroups1.csv",
    tags: ["NLP", "MultinomialNB", "BernoulliNB", "Text Classification", "CountVectorizer"],
    algorithm: `1. Start.
2. Load and preprocess the 20 Newsgroups dataset (filtered for 'sci.space' and 'rec.autos').
3. Separate the text data and category labels into input features (X) and targets (Y).
4. Split the dataset into training and testing sets using an 80:20 ratio (random_state=9).
5. For Multinomial Naive Bayes:
   - Convert the training and testing text into word-count matrices using CountVectorizer().
   - Train the MultinomialNB classifier on the training data.
   - Predict the categories of the test data and calculate the model's accuracy.
6. For Bernoulli Naive Bayes:
   - Convert the text into binary word-occurrence matrices using CountVectorizer(binary=True).
   - Train the BernoulliNB classifier on the training data.
   - Predict the categories of the test data and calculate the model's accuracy.
7. Compare the calculated accuracies of the Multinomial NB and Bernoulli NB models.
8. Stop.`,
    code: `from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB, BernoulliNB
from sklearn.metrics import accuracy_score
import pandas as pd

# Load dataset and filter categories
data = pd.read_csv(r"/content/20NewsGroups1.csv")
filtered_data = data[data['category'].isin(['sci.space', 'rec.autos'])]

x = filtered_data['text']
y = filtered_data['category']

# Split data (80:20)
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=9
)

# 1. Multinomial Naive Bayes (Word Counts)
vec_multi = CountVectorizer()
X_train_m = vec_multi.fit_transform(x_train)
X_test_m = vec_multi.transform(x_test)

m_nb = MultinomialNB().fit(X_train_m, y_train)

# 2. Bernoulli Naive Bayes (Binary Word Occurrence)
vec_bern = CountVectorizer(binary=True)
X_train_b = vec_bern.fit_transform(x_train)
X_test_b = vec_bern.transform(x_test)

b_nb = BernoulliNB().fit(X_train_b, y_train)

# Compare Accuracies
print(f"Multinomial Accuracy: {accuracy_score(y_test, m_nb.predict(X_test_m)):.2f}")
print(f"Bernoulli Accuracy: {accuracy_score(y_test, b_nb.predict(X_test_b)):.2f}")`,
    output: `Multinomial Accuracy: 1.00
Bernoulli Accuracy: 0.97`
  },
  {
    id: "exp-08",
    expNumber: "Experiment 08",
    title: "K-Nearest Neighbors (k-NN) Algorithm",
    dataset: "fashion-mnist_train.csv / fashion-mnist_test.csv",
    tags: ["Classification", "k-NN", "Fashion MNIST", "Hyperparameter Tuning", "Normalization"],
    algorithm: `1. Start.
2. Load the Fashion MNIST training and testing datasets.
3. Separate each dataset into features X (pixel values) and targets Y (labels).
4. Select the first 5000 training samples and the first 1000 testing samples to optimize computational efficiency.
5. Normalize the pixel values by dividing each pixel by 255, ensuring all feature values are scaled between 0 and 1.
6. Define three different values for k (the number of nearest neighbors, e.g., k = [3, 7, 15]).
7. For each selected value of k:
   - Create a k-NN classifier configured with the current k value (KNeighborsClassifier(n_neighbors=k)).
   - Train the classifier using the normalized training data.
   - Predict the class labels of the test data.
   - Calculate the prediction accuracy.
8. Display the computed accuracy scores for all tested k values.
9. Compare the accuracies to identify the k value that yields the best performance.
10. Stop.`,
    code: `import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Load Fashion-MNIST datasets
train_data = pd.read_csv(r"/content/fashion-mnist_train.csv")
test_data = pd.read_csv(r"/content/fashion-mnist_test.csv")

X_train = train_data.drop("label", axis=1)
y_train = train_data["label"]
X_test = test_data.drop("label", axis=1)
y_test = test_data["label"]

# Subsample for computational efficiency
X_train = X_train.iloc[:5000]
y_train = y_train.iloc[:5000]
X_test = X_test.iloc[:1000]
y_test = y_test.iloc[:1000]

# Normalize pixel values (0 to 1 range)
X_train = X_train / 255.0
X_test = X_test / 255.0

# Evaluate across multiple k values
for k in [3, 7, 15]:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    pred = knn.predict(X_test)
    accuracy = accuracy_score(y_test, pred)
    print(f"K={k} Accuracy: {accuracy:.2f}")`,
    output: `K=3 Accuracy: 0.81
K=7 Accuracy: 0.82
K=15 Accuracy: 0.81`
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXPERIMENTS };
}
