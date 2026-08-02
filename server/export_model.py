import os
import json
import joblib
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "client", "public", "model.json")


def main():
    model = joblib.load(os.path.join(MODELS_DIR, "student_model.pkl"))
    scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
    label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
    feature_columns = np.load(os.path.join(MODELS_DIR, "feature_columns.npy"), allow_pickle=True).tolist()

    feature_encoders = {}
    encoders_path = os.path.join(MODELS_DIR, "label_encoders.pkl")
    if os.path.exists(encoders_path):
        data = joblib.load(encoders_path)
        feature_encoders = data.get("features", {})

    tree = model.tree_
    tree_data = {
        "children_left": tree.children_left.tolist(),
        "children_right": tree.children_right.tolist(),
        "feature": tree.feature.tolist(),
        "threshold": tree.threshold.tolist(),
        "values": tree.value.tolist(),
    }

    encoders_json = {}
    for col, enc in feature_encoders.items():
        if hasattr(enc, "classes_"):
            encoders_json[col] = enc.classes_.tolist()

    payload = {
        "model_type": "decision_tree",
        "feature_columns": feature_columns,
        "tree": tree_data,
        "scaler_mean": scaler.mean_.tolist(),
        "scaler_scale": scaler.scale_.tolist(),
        "target_classes": label_encoder.classes_.tolist(),
        "feature_encoders": encoders_json,
    }

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w") as f:
        json.dump(payload, f)
    print(f"Exported model to {OUTPUT}")
    print(f"Target classes: {payload['target_classes']}")
    print(f"Features: {len(feature_columns)}")


if __name__ == "__main__":
    main()
