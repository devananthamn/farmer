import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_and_save_model():
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'crop_recommendation.csv')
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'crop_rf_model.joblib')

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)

    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    target = 'label'

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training Random Forest Classifier on {len(X_train)} samples...")
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        random_state=42,
        class_weight='balanced'
    )
    rf.fit(X_train, y_train)

    y_pred = rf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Test Accuracy: {acc * 100:.2f}%")

    # Save model and feature names
    artifact = {
        'model': rf,
        'features': features,
        'classes': rf.classes_.tolist(),
        'accuracy': float(acc)
    }

    joblib.dump(artifact, model_path)
    print(f"Model successfully saved to: {model_path}")

    # Compute feature importances
    importances = dict(zip(features, rf.feature_importances_))
    print("Feature Importances:")
    for feat, imp in sorted(importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  {feat}: {imp:.4f}")

    return acc

if __name__ == '__main__':
    train_and_save_model()
