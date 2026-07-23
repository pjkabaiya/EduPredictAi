import json, urllib.request

data = json.dumps({
    "age": 20,
    "gender": "Male",
    "kcpe_marks": 380,
    "kcse_grade": "B+",
    "university_previous_grade": "N/A",
    "study_hours_per_week": 25,
    "attendance_percentage": 90,
    "assignment_completion_rate": 85,
    "internet_access": "Yes",
    "parent_education": "Bachelor's",
    "sleep_hours": 7,
    "extracurricular_activities": "Yes"
}).encode()

req = urllib.request.Request(
    "http://localhost:8002/api/predict",
    data=data,
    headers={"Content-Type": "application/json"},
    method="POST"
)
try:
    resp = urllib.request.urlopen(req)
    print(json.dumps(json.loads(resp.read()), indent=2))
except urllib.error.HTTPError as e:
    print(f"Error {e.code}: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
