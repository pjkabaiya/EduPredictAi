import json, urllib.request

data = json.dumps({
    "school": "GP",
    "sex": "F",
    "age": 17,
    "address": "U",
    "famsize": "LE3",
    "pstatus": "T",
    "medu": 2,
    "fedu": 2,
    "mjob": "other",
    "fjob": "other",
    "reason": "course",
    "guardian": "mother",
    "traveltime": 2,
    "studytime": 3,
    "failures": 0,
    "schoolsup": "no",
    "famsup": "yes",
    "paid": "no",
    "activities": "no",
    "nursery": "yes",
    "higher": "yes",
    "internet": "yes",
    "romantic": "no",
    "famrel": 4,
    "freetime": 3,
    "goout": 3,
    "dalc": 1,
    "walc": 1,
    "health": 4,
    "absences": 4,
    "g1": 14,
    "g2": 15
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
