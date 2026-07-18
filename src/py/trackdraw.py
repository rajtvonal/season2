import random

TRACKS_FILE_PATH = "./season2/database/F1/tracks.txt"

GROUPS = ["Current", "Trackpool", "Excluded", "Options"]


def read_tracks(filename):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    sections = content.strip().split("\n\n\n")
    data = { group: [] for group in GROUPS} 

    for section in sections:
        lines = [line.strip() for line in section.splitlines()]
        if not lines:
            continue

        group_name = lines[0]
        if group_name in data:
            data[group_name] = [line for line in lines[1:] if line]

    return data


def write_tracks(filename, data):
    sections = []
    for group in GROUPS:
        section_lines = [group]
        section_lines.extend(data[group])
        sections.append("\n".join(section_lines))

    with open(filename, "w", encoding="utf-8") as f:
        f.write("\n\n\n".join(sections))


def print_groups(data):
    for group in GROUPS:
        print(f"{group}:")
        if data[group]:
            for track in data[group]:
                print(f"  - {track}")
        else:
            print("  (üres)")
        print()



data = read_tracks(TRACKS_FILE_PATH)

current = data["Current"]
trackpool = data["Trackpool"]
excluded = data["Excluded"]
options = data["Options"]

# fill trackpool
if len(trackpool) < 5:
    needed = 5 - len(trackpool)
    if needed > len(options):
        print(
            f"Nincs elég pálya az Options csoportban. "
            f"Szükséges: {needed}, elérhető: {len(options)}"
        )

    selected = random.sample(options, needed)
    for track in selected:
        trackpool.append(track)
        options.remove(track)

# race start / end
if current:
    current_track = current[0]
    current.clear()

    if current_track in trackpool:
        trackpool.remove(current_track)

    if current_track not in excluded:
        excluded.append(current_track)

else:
    if not trackpool:
        raise ValueError("A Trackpool üres, nem lehet pályát választani.")

    selected_track = random.choice(trackpool)
    current.append(selected_track)
    trackpool.remove(selected_track)

    excluded_track = random.choice(trackpool)
    excluded.append(excluded_track)
    trackpool.remove(excluded_track)


# save
write_tracks(TRACKS_FILE_PATH, data)
