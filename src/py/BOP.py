import json
import math
import os
from dataclasses import dataclass, field
from collections import defaultdict

# ====================
# MANUAL CONFIG
# ====================
PARTICIPANTS_GT3 = 24
PARTICIPANTS_HYPER = 10

MAX_BOP_GT3 = 30
MAX_BOP_HYPER = 20

TOTAL_RACES = 8

SEASON = {
    1: "Bahrain",
    2: "Jeddah",
    3: "Imola",
    4: "Spa",
    5: "Hungaroring",
    6: "Fuji",
    7: "Austin",
    8: "Le Mans"
}

LENGTH, TURNS, LAPTIME, FUEL = 0, 1, 2, 3
TRACKS = {
#      Track       Length Turns Laptime Fuel
    "Bahrain":      [5.412, 15, 95000,  1.00],
    "Jeddah":       [6.174, 27, 105000, 1.00],
    "Imola":        [4.909, 19, 93000,  1.00],
    "Spa":          [7.004, 20, 140000, 1.00],
    "Hungaroring":  [4.381, 14, 98000,  1.00],
    "Fuji":         [4.563, 16, 102000, 1.00],
    "Austin":       [5.513, 20, 108000, 1.00],
    "Le Mans":      [13.626,38, 220000, 1.00]
}

AVG_TRACK_LENGTH = ( sum(track[LENGTH] for track in TRACKS.values()) / len(TRACKS) )

# RUNTIME GLOBALS
MAX_POINTS_PER_RACE = 0
RACES_DONE = 0
CURRENT_RACE = None


# ====================
# DRIVER CLASS
# ====================
@dataclass
class Driver:
    name: str
    driver_class: str
    car: str
    car_num: int

    total_points: int = 0
    results: list = field(default_factory=list)
    points_per_race: list = field(default_factory=list)
    races_started: int = 0
    wins: int = 0
    podiums: int = 0
    avg_position: float = 0.0
    position: int = 0

    bop: float = 0.0
    bop_factors: dict = field(default_factory=dict)

    def add_result(self, result):
        pos = result["position"]
        pts = result["pointTotal"]
        self.results.append(pos)
        self.points_per_race.append(pts)
        self.total_points += pts

        if not result["dns"]:
            self.races_started += 1

        if pos == 1:
            self.wins += 1

        if pos <= 3:
            self.podiums += 1

    def finalize(self):
        if self.results:
            self.avg_position = sum(self.results) / len(self.results)


# ====================
# LOAD FILES
# ====================
def load_race_files():
    global MAX_POINTS_PER_RACE
    global RACES_DONE
    global CURRENT_RACE

    drivers = {}
    races_dir = "./season2/database/SM/races/"
    loaded_races = []
    for race_number in range(1, TOTAL_RACES + 1):
        path = os.path.join(races_dir, f"R{race_number}.json")
        print(path)
        if not os.path.isfile(path):
            continue

        loaded_races.append(path)

        with open(path, "r", encoding="utf-8") as f:
            race_data = json.load(f)

        for class_data in race_data:
            class_name = class_data["carClass"]
            if (MAX_POINTS_PER_RACE == 0 and len(class_data["result"]) > 0):
                MAX_POINTS_PER_RACE = (class_data["result"][0]["pointsGiven"])

            for result in class_data["result"]:
                name = result["id"]
                key = (class_name, name)
                if key not in drivers:
                    drivers[key] = Driver(
                        name=name,
                        driver_class=class_name,
                        car=result["car"],
                        car_num=result["carNum"]
                    )
                drivers[key].add_result(result)

    RACES_DONE = len(loaded_races)
    if RACES_DONE >= TOTAL_RACES:
        CURRENT_RACE = None
    else:
        CURRENT_RACE = RACES_DONE + 1

    for driver in drivers.values():
        driver.finalize()

    return drivers


# ====================
# STANDINGS
# ====================
def assign_championship_positions(drivers):
    classes = defaultdict(list)

    for driver in drivers.values():
        classes[driver.driver_class].append(driver)

    for class_name, class_drivers in classes.items():
        class_drivers.sort(
            key=lambda x: (
                -x.total_points,
                -x.wins,
                -x.podiums
            )
        )
        for pos, driver in enumerate(class_drivers, start=1):
            driver.position = pos


# ====================
# FACTORS
# ====================
def season_progress_factor():
    if CURRENT_RACE is None:
        progress = 1.0
    else:
        progress = CURRENT_RACE / TOTAL_RACES

    if progress >= 0.60:
        return 1.0
    return progress / 0.60


def track_factor():
    if CURRENT_RACE is None:
        race_id = TOTAL_RACES
    else:
        race_id = CURRENT_RACE

    track_name = SEASON[race_id]
    length, turns, laptime, fuel_rate = TRACKS[track_name]

    length_factor = AVG_TRACK_LENGTH / length
    turns_factor = 18 / turns
    lap_factor = 120000 / laptime
    factor = (
        length_factor * 0.50 +
        turns_factor * 0.20 +
        lap_factor * 0.30
    )

    return max(0.40, min(1.50, factor))


def fuel_factor():
    if CURRENT_RACE is None:
        race_id = TOTAL_RACES
    else:
        race_id = CURRENT_RACE

    track_name = SEASON[race_id]
    fuel_rate = TRACKS[track_name][FUEL]

    return fuel_rate


def gap_factor(driver, class_drivers):
    leader_points = class_drivers[0].total_points
    gap = leader_points - driver.total_points

    h = max(MAX_POINTS_PER_RACE * 1.5, 1)

    return math.exp(-gap / h)


def dominance_factor(driver):
    max_possible_points = RACES_DONE * MAX_POINTS_PER_RACE
    if max_possible_points <= 0:
        return 0

    return driver.total_points / max_possible_points


def neighbour_factor(driver, class_drivers):
    idx = driver.position - 1

    max_possible = RACES_DONE * MAX_POINTS_PER_RACE
    if max_possible <= 0:
        return 0

    if len(class_drivers) == 1:
        return 0

    ahead_gap = 0
    behind_gap = 0

    if idx > 0:
        ahead_gap = class_drivers[idx - 1].total_points   -   driver.total_points

    if idx < len(class_drivers) - 1:
        behind_gap = driver.total_points   -   class_drivers[idx + 1].total_points

    neighbour_advantage = behind_gap - ahead_gap

    return max(-1, min(1, neighbour_advantage / max_possible) )


def consistency_factor(driver):
    if len(driver.results) < 2:
        return 0.5

    avg = sum(driver.results) / len(driver.results)
    variance = (
        sum(
            (x - avg) ** 2
            for x in driver.results
        )
        / len(driver.results)
    )

    std_dev = math.sqrt(variance)

    factor = 1 / (1 + std_dev)
    return factor


def catch_up_factor(driver, class_drivers):
    field_size = len(class_drivers)
    if driver.position <= field_size / 2:
        return 1.0
    return 0.85


# ====================
# BOP
# ====================
def calculate_bop(drivers):
    classes = defaultdict(list)

    for driver in drivers.values():
        classes[driver.driver_class].append(driver)

    season_factor = season_progress_factor()
    track_mod = track_factor()
    fuel_mod = fuel_factor()

    for class_name, class_drivers in classes.items():
        class_drivers.sort(key=lambda x: x.position)
        max_bop = (MAX_BOP_HYPER if "Hyper" in class_name else MAX_BOP_GT3)

        for driver in class_drivers:
            gap = gap_factor(driver, class_drivers)
            dominance = dominance_factor(driver)
            neighbour = neighbour_factor(driver, class_drivers)
            consistency = consistency_factor(driver)
            catch_up = catch_up_factor(driver, class_drivers)
            score = (
                gap * 0.35 +
                dominance * 0.25 +
                consistency * 0.15 +
                max(0, neighbour) * 0.25
            )
            bop = (
                max_bop *
                score *
                season_factor *
                track_mod *
                fuel_mod *
                catch_up
            )
            bop = round( max(0, min(max_bop, bop)), 2)

            driver.bop = bop
            driver.bop_factors = {
                "season_progress": round(season_factor, 4),
                "track_factor": round(track_mod, 4),
                "fuel_factor": round(fuel_mod, 4),
                "gap_factor": round(gap, 4),
                "dominance_factor": round(dominance, 4),
                "neighbour_factor": round(neighbour, 4),
                "consistency_factor": round(consistency, 4),
                "catch_up_factor": round(catch_up, 4)
            }


# ====================
# OUTPUT
# ====================
def save_class_bop(filename, class_drivers):
    output = []
    for driver in class_drivers:
        output.append({
            "name": driver.name,
            "class": driver.driver_class,
            "car": driver.car,
            "carNum": driver.car_num,
            "position": driver.position,
            "bop": driver.bop,
            "factors": driver.bop_factors
        })

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=4)


def print_bop(drivers):
    classes = defaultdict(list)

    for driver in drivers.values():
        classes[driver.driver_class].append(driver)

    for class_name, class_drivers in classes.items():
        class_drivers.sort(key=lambda x: x.position)

        print()
        print("=" * 60)
        print(class_name)
        print("=" * 60)

        for driver in class_drivers:
            factors = ", ".join(
                f"{k}:{v}"
                for k, v in driver.bop_factors.items()
            )

            print(
                f"{driver.name} - "
                f"{driver.bop} kg | "
                f"{{{factors}}}"
            )

        if "Hyper" in class_name:
            save_class_bop("./season2/database/SM//BOP/BOP_Hyper.json", class_drivers)
        else:
            save_class_bop("./season2/database/SM/BOP/BOP_GT3.json", class_drivers)


# ====================
# MAIN
# ====================
def main():
    drivers = load_race_files()

    assign_championship_positions(drivers)

    calculate_bop(drivers)

    print()
    print("===============")
    print("SEASON INFO")
    print("===============")
    print("MAX_POINTS_PER_RACE:", MAX_POINTS_PER_RACE)
    print("RACES_DONE:", RACES_DONE)
    print("CURRENT_RACE:", CURRENT_RACE)
    print("AVG_TRACK_LENGTH:", round(AVG_TRACK_LENGTH, 3))
    print()

    print_bop(drivers)


if __name__ == "__main__":
    main()
