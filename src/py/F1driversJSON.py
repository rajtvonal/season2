import csv
import json
import re
from pathlib import Path
from collections import defaultdict


BASE_DIR = Path("season2/database/F1")
OUTPUT_FILE = BASE_DIR / "f1_drivers_and_results.json"


def read_csv(path):
    """CSV fájl beolvasása list of lists formában."""
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.reader(f))


def discover_files():
    """Megkeresi a létező R, Q és S fájlokat 1..20 között."""
    races = {}
    qualis = {}
    sprints = {}

    for x in range(1, 21):
        race_file = BASE_DIR / "races" / f"R{x}.csv"
        quali_file = BASE_DIR / "qualis" / f"Q{x}.csv"
        sprint_file = BASE_DIR / "sprints" / f"S{x}.csv"

        if race_file.exists():
            races[x] = race_file

        if quali_file.exists():
            qualis[x] = quali_file

        if sprint_file.exists():
            sprints[x] = sprint_file

    return races, qualis, sprints


def parse_time_to_seconds(time_str):
    """
    Idő átalakítása másodpercre.

    Példák:
        1:08.300 -> 68.300
        43:24.792 -> 2604.792
    """
    if not time_str or time_str in {"-", ""}:
        return None

    try:
        parts = time_str.split(":")

        if len(parts) == 2:
            minutes = float(parts[0])
            seconds = float(parts[1])
            return minutes * 60 + seconds

        if len(parts) == 3:
            hours = float(parts[0])
            minutes = float(parts[1])
            seconds = float(parts[2])
            return hours * 3600 + minutes * 60 + seconds

    except ValueError:
        pass

    return None


def parse_position(value):
    """
    Helyezés számmá alakítása.
    DNF / DSQ / DNS / DNA esetén None.
    """
    if not value:
        return None

    try:
        return int(value)
    except ValueError:
        return None


def load_points_system(path):
    """
    Pontrendszer betöltése.

    Visszatérési érték:
        {
            "1": 20,
            "2": 16,
            ...
            "DNF": 0
        }
    """
    points = {}

    for row in read_csv(path):
        if len(row) < 2:
            continue

        position = row[0].strip()
        point_value = row[1].strip()

        if not position:
            position = ""

        try:
            points[position] = float(point_value)
        except ValueError:
            points[position] = 0

    return points


def load_drivers():
    """
    drivers.csv betöltése.

    Visszatérési érték:
        {
            pilótanév: {
                "country": ...,
                "division": ...
            }
        }
    """
    drivers_file = BASE_DIR / "drivers.csv"
    drivers = {}

    for row in read_csv(drivers_file):
        if len(row) < 3:
            continue

        country = row[0].strip()
        name = row[1].strip()
        division = row[2].strip()

        drivers[name] = {
            "country": country,
            "division": division
        }

    return drivers


def load_teams():
    """
    csapatok.csv betöltése.

    Visszatérési érték:
        {
            pilótanév: csapatnév
        }
    """
    teams_file = BASE_DIR / "csapatok.csv"
    teams = {}

    for row in read_csv(teams_file):
        if len(row) < 2:
            continue

        team_name = row[0].strip()

        for driver in row[1:]:
            driver = driver.strip()

            if driver:
                teams[driver] = team_name

    return teams


def empty_driver(name, team):
    """Egy pilóta kezdeti statisztikáinak létrehozása."""
    return {
        "name": name,
        "team": team,
        "points": 0,
        "position": None,

        "qualiResults": [],
        "sprintResults": [],
        "raceResults": [],

        "racesStarted": 0,
        "racesFinished": 0,

        "qualiWins": 0,
        "raceWins": 0,
        "sprintWins": 0,

        "avgRace": 0,
        "avgQuali": 0,
        "avgPoints": 0,
        "avgGain": 0,

        # Belső számítási mezők.
        "_race_positions": [],
        "_quali_positions": [],
        "_started_points": []
    }


def add_quali_result(driver, race_number, row):
    """
    Q{x}.csv egy sorának feldolgozása.

    Formátum:
        helyezés, név, köridő, gumiabroncs
    """
    if len(row) < 4:
        return

    position_raw = row[0].strip()
    name = row[1].strip()
    lap_time = row[2].strip()
    tyre = row[3].strip()

    if name != driver["name"]:
        return

    position = parse_position(position_raw)

    result = {
        "race": race_number,
        "position": position,
        "lapTime": lap_time,
        "tyre": tyre
    }

    driver["qualiResults"].append(result)

    if position == 1:
        driver["qualiWins"] += 1

    if position is not None:
        driver["_quali_positions"].append(position)


def add_race_result(driver, race_number, row, points_system):
    """
    R{x}.csv egy sorának feldolgozása.

    Formátum:
        helyezés, név, versenyidő, legjobb_kör, boxkiállások
    """
    if len(row) < 5:
        return

    position_raw = row[0].strip()
    name = row[1].strip()
    race_time = row[2].strip()
    fastest_lap = row[3].strip()
    pit_stops_raw = row[4].strip()

    if name != driver["name"]:
        return

    position = parse_position(position_raw)

    # A pontrendszer kulcsa a nyers eredmény.
    point_key = position_raw.upper()

    if point_key in points_system:
        points = points_system[point_key]
    else:
        points = points_system.get(position_raw, 0)

    result = {
        "race": race_number,
        "position": position,
        "raceTime": race_time,
        "fastestLap": fastest_lap,
        "pitStops": int(pit_stops_raw) if pit_stops_raw.isdigit() else 0,
        "points": points
    }

    driver["raceResults"].append(result)

    # A pontszám minden olyan versenyhez hozzáadódik,
    # ahol a pilóta szerepel az eredményben.
    driver["points"] += points
    driver["_started_points"].append(points)

    if position_raw.upper() in {"DNF", "DSQ"}:
        driver["racesFinished"] += 1

    if position is not None:
        driver["racesStarted"] += 1
        driver["_race_positions"].append(position)

        if position == 1:
            driver["raceWins"] += 1
    else:
        # DNF/DSQ is szereplés, tehát megkezdett versenynek számít.
        driver["racesStarted"] += 1


def add_sprint_result(driver, race_number, row, points_system):
    """
    S{x}.csv egy sorának feldolgozása.

    Formátum:
        helyezés, név, versenyidő, legjobb_kör, boxkiállások
    """
    if len(row) < 5:
        return

    position_raw = row[0].strip()
    name = row[1].strip()
    race_time = row[2].strip()
    fastest_lap = row[3].strip()
    pit_stops_raw = row[4].strip()

    if name != driver["name"]:
        return

    position = parse_position(position_raw)

    point_key = position_raw.upper()

    if point_key in points_system:
        points = points_system[point_key]
    else:
        points = points_system.get(position_raw, 0)

    result = {
        "race": race_number,
        "position": position,
        "raceTime": race_time,
        "fastestLap": fastest_lap,
        "pitStops": int(pit_stops_raw) if pit_stops_raw.isdigit() else 0,
        "points": points
    }

    driver["sprintResults"].append(result)

    driver["points"] += points
    driver["_started_points"].append(points)

    if position_raw.upper() in {"DNF", "DSQ"}:
        driver["racesFinished"] += 1

    # A sprint is szintén egy megkezdett verseny.
    driver["racesStarted"] += 1

    if position is not None:
        if position == 1:
            driver["sprintWins"] += 1


def calculate_averages(driver):
    """Átlagos eredmények kiszámítása."""

    race_positions = driver["_race_positions"]
    quali_positions = driver["_quali_positions"]
    started_points = driver["_started_points"]

    if race_positions:
        driver["avgRace"] = sum(race_positions) / len(race_positions)
    else:
        driver["avgRace"] = 0

    if quali_positions:
        driver["avgQuali"] = sum(quali_positions) / len(quali_positions)
    else:
        driver["avgQuali"] = 0

    if started_points:
        driver["avgPoints"] = sum(started_points) / len(started_points)
    else:
        driver["avgPoints"] = 0

    driver["avgGain"] = driver["avgQuali"] - driver["avgRace"]

    # Belső mezők eltávolítása.
    del driver["_race_positions"]
    del driver["_quali_positions"]
    del driver["_started_points"]


def round_floats(driver):
    """Lebegőpontos statisztikák ésszerű kerekítése."""
    for key in ("avgRace", "avgQuali", "avgPoints", "avgGain"):
        driver[key] = round(driver[key], 3)

    # Ha egész szám lett, JSON-ban is legyen szám, ne pl. 20.0.
    if float(driver["points"]).is_integer():
        driver["points"] = int(driver["points"])


def main():
    # ------------------------------------------------------------
    # 1. Fájlok automatikus felismerése
    # ------------------------------------------------------------
    races, qualis, sprints = discover_files()

    print(f"Versenyfájlok: {len(races)}")
    print(f"Kvalifikációs fájlok: {len(qualis)}")
    print(f"Sprintfájlok: {len(sprints)}")

    print("R:", sorted(races.keys()))
    print("Q:", sorted(qualis.keys()))
    print("S:", sorted(sprints.keys()))

    # ------------------------------------------------------------
    # 2. Alapadatok betöltése
    # ------------------------------------------------------------
    drivers_info = load_drivers()
    teams = load_teams()

    race_points = load_points_system(
        BASE_DIR / "pontrendszer.csv"
    )

    sprint_points = load_points_system(
        BASE_DIR / "pontrendszer_sprint.csv"
    )

    # ------------------------------------------------------------
    # 3. Minden drivers.csv-ben szereplő pilóta létrehozása
    # ------------------------------------------------------------
    drivers = {}

    for name in drivers_info:
        team = teams.get(name, "")

        drivers[name] = empty_driver(
            name=name,
            team=team
        )

    # ------------------------------------------------------------
    # 4. Kvalifikációk feldolgozása
    # ------------------------------------------------------------
    for race_number, path in sorted(qualis.items()):
        for row in read_csv(path):
            if len(row) < 2:
                continue

            name = row[1].strip()

            if name in drivers:
                add_quali_result(
                    drivers[name],
                    race_number,
                    row
                )

    # ------------------------------------------------------------
    # 5. Versenyek feldolgozása
    # ------------------------------------------------------------
    for race_number, path in sorted(races.items()):
        for row in read_csv(path):
            if len(row) < 2:
                continue

            name = row[1].strip()

            if name in drivers:
                add_race_result(
                    drivers[name],
                    race_number,
                    row,
                    race_points
                )

    # ------------------------------------------------------------
    # 6. Sprintek feldolgozása
    # ------------------------------------------------------------
    for race_number, path in sorted(sprints.items()):
        for row in read_csv(path):
            if len(row) < 2:
                continue

            name = row[1].strip()

            if name in drivers:
                add_sprint_result(
                    drivers[name],
                    race_number,
                    row,
                    sprint_points
                )

    # ------------------------------------------------------------
    # 7. Átlagok kiszámítása
    # ------------------------------------------------------------
    for driver in drivers.values():
        calculate_averages(driver)
        round_floats(driver)

    # ------------------------------------------------------------
    # 8. Egyéni bajnoki sorrend
    #
    # Pontazonosságnál stabil másodlagos rendezés:
    # több győzelem, majd több dobogó.
    # ------------------------------------------------------------
    driver_list = list(drivers.values())

    driver_list.sort(
        key=lambda d: (
            -d["points"],
            -d["raceWins"],
            -d["sprintWins"],
            d["name"].lower()
        )
    )

    for position, driver in enumerate(driver_list, start=1):
        driver["position"] = position

    # ------------------------------------------------------------
    # 9. JSON mentése
    # ------------------------------------------------------------
    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        json.dump(
            driver_list,
            f,
            ensure_ascii=False,
            indent=2
        )

    print()
    print(f"Kész: {OUTPUT_FILE}")
    print(f"Pilóták száma: {len(driver_list)}")


if __name__ == "__main__":
    main()