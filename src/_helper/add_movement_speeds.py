"""
Adds movement speed fields to all Pokemon species JSON files.

Rules:
  - walkSpeed = 5 for all Pokemon
  - swimSpeed = 5 if type1 or type2 is "Water"
  - flySpeed  = 5 if type1 or type2 is "Flying"

Usage:
    python add_movement_speeds.py
"""

import json
import os

SPECIES_DIR = os.path.join(os.path.dirname(__file__), "..", "features", "pokemon", "data", "species")


def process_file(filepath: str) -> None:
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    types = {data.get("type1", ""), data.get("type2", "")}

    data["walkSpeed"] = 5
    data["swimSpeed"] = 5 if "Water" in types else 0
    data["climbSpeed"] = 0
    data["flySpeed"] = 5 if "Flying" in types else 0

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def main() -> None:
    files = [f for f in os.listdir(SPECIES_DIR) if f.endswith(".json")]
    files.sort()

    for filename in files:
        filepath = os.path.join(SPECIES_DIR, filename)
        process_file(filepath)
        print(f"Updated: {filename}")

    print(f"\nDone. Processed {len(files)} files.")


if __name__ == "__main__":
    main()
