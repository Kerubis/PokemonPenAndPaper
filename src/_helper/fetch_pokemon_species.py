"""
Fetches all Pokemon from the PokeAPI and generates a species JSON file for each one.
Flaw, strength, and abilityUnlocks are intentionally left empty.

Usage:
    python fetch_pokemon_species.py

Output:
    ../features/pokemon/data/species/<name>.json
"""

import json
import os
import urllib.request

BASE_URL = "https://pokeapi.co/api/v2/pokemon"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "features", "pokemon", "data", "species")


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode())


def get_pokemon_count() -> int:
    data = fetch_json(f"{BASE_URL}/?limit=1")
    return data["count"]


def get_pokemon(pokemon_id: int) -> dict:
    return fetch_json(f"{BASE_URL}/{pokemon_id}")


def build_species_entry(pokemon: dict) -> dict:
    types = pokemon["types"]
    types_sorted = sorted(types, key=lambda t: t["slot"])

    type1 = types_sorted[0]["type"]["name"].capitalize() if len(types_sorted) >= 1 else ""
    type2 = types_sorted[1]["type"]["name"].capitalize() if len(types_sorted) >= 2 else ""

    return {
        "pokedexEntry": pokemon["id"],
        "pokemonName": pokemon["name"].capitalize(),
        "type1": type1,
        "type2": type2,
        "flaw": "",
        "strength": "",
        "abilityUnlocks": [],
    }


def save_species_json(entry: dict) -> None:
    filename = f"{entry['pokemonName'].lower()}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(entry, f, indent=2)
        f.write("\n")


def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Fetching Pokemon count...")
    count = get_pokemon_count()
    print(f"Total Pokemon: {count}")

    for pokemon_id in range(1, count + 1):
        try:
            pokemon = get_pokemon(pokemon_id)
            entry = build_species_entry(pokemon)
            save_species_json(entry)
            print(f"[{pokemon_id}/{count}] Saved {entry['pokemonName']}")
        except Exception as e:
            print(f"[{pokemon_id}/{count}] ERROR: {e}")


if __name__ == "__main__":
    main()
