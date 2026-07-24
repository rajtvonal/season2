import csv
import json
import os
import re


def load_pointsystem(filename):
    points = {}
    with open(filename, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if not row:
                continue
            position = int(row[0])
            point = float(row[1])
            points[position] = point
    return points


def load_previous_totals(filename):
    if not os.path.exists(filename):
        return {}

    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)

    totals = {}

    for car_class in data:
        for driver in car_class["result"]:
            totals[(car_class["carClass"], driver["id"])] = driver.get("pointTotal", 0.0) or 0.0

    return totals


def main():
    current_file = "R1_sg.json"

    match = re.match(r"R(\d+)_sg\.json$", current_file)
    if not match:
        print("Hibás fájlnév!")
        return

    current_round = int(match.group(1))
    previous_file = f"R{current_round - 1}.json"
    output_file = f"season2/database/SM/races/R{current_round}.json"

    hyper_points = load_pointsystem("season2/database/SM/pontrendszer_hyper.csv")
    gt_points = load_pointsystem("season2/database/SM/pontrendszer_gt.csv")

    previous_totals = load_previous_totals(previous_file)

    with open(f"season2/database/SM/races/{current_file}", "r", encoding="utf-8") as f:
        current_data = json.load(f)

    for car_class in current_data:
        class_name = car_class["carClass"].lower()
        if "hyper" in class_name:   pointsystem = hyper_points
        else:                       pointsystem = gt_points

        for driver in car_class["result"]:
            previous_total = previous_totals.get( (car_class["carClass"], driver["id"]) , 0.0)

            if driver.get("dnf", False):
                driver["pointsGiven"] = 0.0
                driver["pointTotal"] = previous_total
            else:
                points_given = pointsystem.get(driver["position"], 0.0)
                driver["pointsGiven"] = points_given
                driver["pointTotal"] = previous_total + points_given
            
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(current_data, f, ensure_ascii=False, indent=3)

    print(f"{output_file} létrehozva")


if __name__ == "__main__":
    main()
