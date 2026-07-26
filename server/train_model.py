import pandas as pd
import numpy as np
import os
import sys
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix, roc_auc_score
)
import joblib
import json

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE, "dataset", "student-mat.csv")
MODELS_DIR = os.path.join(BASE, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

print("=" * 60)
print("MathPredict AI - Model Training Pipeline")
print("=" * 60)

# ── 1. Load Dataset ──
print(f"\n[1/7] Loading dataset from {DATA_PATH}")
df = pd.read_csv(DATA_PATH, sep=";")
print(f"   Shape: {df.shape}")
print(f"   Columns: {list(df.columns)}")

# Normalize column names to lowercase
df.columns = df.columns.str.lower().str.strip()
df.columns = [c.replace('"', '') for c in df.columns]

# ── 2. Create Target ──
print("\n[2/7] Creating performance target from G3")
df['performance'] = pd.cut(
    df['g3'],
    bins=[-1, 9, 14, 20],
    labels=['Low Performance', 'Average Performance', 'High Performance']
)
print(f"   Class distribution:")
print(df['performance'].value_counts())

# ── 3. Encode Categorical Features ──
print("\n[3/7] Encoding categorical features")
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
categorical_cols = [c for c in categorical_cols if c != 'performance']
print(f"   Categorical columns: {categorical_cols}")

label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le
    print(f"   Encoded '{col}' — {len(le.classes_)} classes")

# Encode target
target_le = LabelEncoder()
df['performance_encoded'] = target_le.fit_transform(df['performance'])
label_encoders['performance'] = target_le
print(f"\n   Target mapping: {dict(zip(target_le.classes_, target_le.transform(target_le.classes_)))}")

# ── 4. Feature Selection ──
print("\n[4/7] Preparing features and target")
feature_cols = [c for c in df.columns if c not in ['g3', 'performance', 'performance_encoded']]
X = df[feature_cols]
y = df['performance_encoded']
print(f"   Features: {len(feature_cols)}")
print(f"   Feature columns: {feature_cols}")

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"   Train: {len(X_train)} samples")
print(f"   Test: {len(X_test)} samples")

# Scale numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print(f"   Features scaled using StandardScaler")

# ── 5. Train Models ──
print("\n[5/7] Training and comparing models")
models = {
    'Logistic Regression': LogisticRegression(max_iter=2000, random_state=42),
    'Decision Tree': DecisionTreeClassifier(max_depth=10, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42),
    'SVM': SVC(kernel='rbf', probability=True, random_state=42),
    'KNN': KNeighborsClassifier(n_neighbors=7),
}

results = []
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring='accuracy')

    try:
        if hasattr(model, 'predict_proba'):
            y_prob = model.predict_proba(X_test_scaled)
            roc_auc = roc_auc_score(y_test, y_prob, multi_class='ovr')
        else:
            roc_auc = 0.0
    except Exception:
        roc_auc = 0.0

    results.append({
        'model': name,
        'accuracy': round(acc, 4),
        'precision': round(prec, 4),
        'recall': round(rec, 4),
        'f1_score': round(f1, 4),
        'roc_auc': round(roc_auc, 4),
        'cv_mean': round(cv_scores.mean(), 4),
        'cv_std': round(cv_scores.std(), 4),
    })
    print(f"   {name:25s}  Acc: {acc:.4f}  F1: {f1:.4f}  CV: {cv_scores.mean():.4f}")

# Sort by accuracy
results_df = pd.DataFrame(results).sort_values('accuracy', ascending=False)
print(f"\n   Model Ranking:")
print(results_df.to_string(index=False))

best_model_name = results_df.iloc[0]['model']
best_model = models[best_model_name]
print(f"\n   Best model: {best_model_name}")

# ── 6. Feature Importance ──
print("\n[6/7] Extracting feature importance")
feature_importance = []
if hasattr(best_model, 'feature_importances_'):
    importances = best_model.feature_importances_
elif best_model_name == 'Logistic Regression':
    importances = np.abs(best_model.coef_).mean(axis=0)
elif best_model_name == 'SVM' and hasattr(best_model, 'coef_'):
    importances = np.abs(best_model.coef_).mean(axis=0)
else:
    importances = np.ones(len(feature_cols)) / len(feature_cols)

for feat, imp in zip(feature_cols, importances):
    feature_importance.append({'feature': feat, 'importance': round(float(imp), 4)})

feature_importance.sort(key=lambda x: x['importance'], reverse=True)
print("   Top 10 features:")
for fi in feature_importance[:10]:
    print(f"      {fi['feature']:20s}  {fi['importance']:.4f}")

# ── 7. Save Model Files ──
print(f"\n[7/7] Saving model artifacts to {MODELS_DIR}/")

# Retrain best model on full training data for final save
final_model = models[best_model_name]
final_model.fit(X_train_scaled, y_train)

# Evaluate on test set for metrics
y_pred = final_model.predict(X_test_scaled)
y_prob = None
if hasattr(final_model, 'predict_proba'):
    y_prob = final_model.predict_proba(X_test_scaled)

# Confusion matrix
cm = confusion_matrix(y_test, y_pred).tolist()
cr = classification_report(y_test, y_pred, target_names=target_le.classes_, output_dict=True, zero_division=0)

# Save model
model_path = os.path.join(MODELS_DIR, 'student_model.pkl')
joblib.dump(final_model, model_path)
print(f"   [OK] student_model.pkl ({best_model_name})")

# Save scaler
scaler_path = os.path.join(MODELS_DIR, 'scaler.pkl')
joblib.dump(scaler, scaler_path)
print(f"   [OK] scaler.pkl")

# Save label encoder
le_data = {
    'performance': target_le,
    'features': label_encoders,
}
joblib.dump(le_data, os.path.join(MODELS_DIR, 'label_encoders.pkl'))
joblib.dump(target_le, os.path.join(MODELS_DIR, 'label_encoder.pkl'))
print(f"   [OK] label_encoder.pkl")

# Save feature columns
np.save(os.path.join(MODELS_DIR, 'feature_columns.npy'), feature_cols)
print(f"   [OK] feature_columns.npy ({len(feature_cols)} features)")

# Save metrics
metrics = {
    'accuracy': round(float(accuracy_score(y_test, y_pred)), 4),
    'precision': round(float(precision_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
    'recall': round(float(recall_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
    'f1_score': round(float(f1_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
    'roc_auc': round(float(roc_auc if y_prob is not None else 0.0), 4),
    'best_model': best_model_name,
    'candidates': list(models.keys()),
    'confusion_matrix': cm,
    'classification_report': cr,
    'n_estimators': best_model.n_estimators if hasattr(best_model, 'n_estimators') else 0,
    'max_depth': best_model.max_depth if hasattr(best_model, 'max_depth') else 0,
    'training_samples': len(X_train),
    'test_samples': len(X_test),
    'cross_validation_score': round(float(results_df.iloc[0]['cv_mean']), 4),
    'feature_importance': feature_importance[:10],
    'model_comparison': results_df.to_dict('records'),
}

with open(os.path.join(MODELS_DIR, 'metrics.json'), 'w') as f:
    json.dump(metrics, f, indent=2)
print(f"   [OK] metrics.json")

print(("\n" + "=" * 60))
print("Training complete! Model artifacts saved to {}/".format(MODELS_DIR))
print("Best model: {} (Accuracy: {:.4f})".format(best_model_name, metrics['accuracy']))
print("=" * 60)

# Save processed datasets
dataset_dir = os.path.join(BASE, "dataset")
df.to_csv(os.path.join(dataset_dir, "student_math_cleaned.csv"), index=False)
print("\nSaved cleaned dataset to dataset/student_math_cleaned.csv")

# Save train/test splits
X_train_df = pd.DataFrame(X_train_scaled, columns=feature_cols)
X_test_df = pd.DataFrame(X_test_scaled, columns=feature_cols)
X_train_df.to_csv(os.path.join(dataset_dir, "X_train.csv"), index=False)
X_test_df.to_csv(os.path.join(dataset_dir, "X_test.csv"), index=False)
pd.Series(y_train).to_csv(os.path.join(dataset_dir, "y_train.csv"), index=False)
pd.Series(y_test).to_csv(os.path.join(dataset_dir, "y_test.csv"), index=False)
print("Saved train/test splits to dataset/")
