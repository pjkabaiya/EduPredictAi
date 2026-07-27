import os
import csv

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset", "student_math_cleaned.csv")

STUDENT_NAMES = [
    "Alice Kamau", "Bob Otieno", "Carol Wanjiku", "David Mwangi",
    "Emily Akinyi", "Frank Njoroge", "Grace Chebet", "Henry Kiplagat",
    "Irene Wambui", "James Ochieng", "Kevin Mutua", "Linda Nyambura",
    "Michael Omondi", "Nancy Wairimu", "Oscar Kiprop", "Purity Achieng",
    "Quinton Barasa", "Rose Kemunto", "Samuel Kiprono", "Tracy Jerono",
    "Victor Kibet", "Winnie Jepkemboi", "Xavier Kipchumba", "Yvonne Chepkoech",
    "Zachary Kiprop", "Abigael Chemutai", "Brian Kipkirui", "Cynthia Jepkoech",
]

NUM_FIELDS = ["age", "medu", "fedu", "traveltime", "studytime",
              "failures", "famrel", "freetime", "goout", "dalc",
              "walc", "health", "absences", "g1", "g2", "g3"]


def load_students():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for i, row in enumerate(reader):
            student = {k.lower().strip(): v.strip() for k, v in row.items()}
            for field in NUM_FIELDS:
                try:
                    student[field] = int(student.get(field, 0))
                except (ValueError, TypeError):
                    student[field] = 0
            g3 = student.get("g3", 0)
            student["performance"] = "High" if g3 >= 15 else "Average" if g3 >= 10 else "Low"
            student["id"] = f"STU{2025001 + i}"
            student["name"] = STUDENT_NAMES[i % len(STUDENT_NAMES)]
            rows.append(student)
        return rows
