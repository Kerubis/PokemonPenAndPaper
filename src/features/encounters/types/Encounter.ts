export class Encounter {
    private _guid: string;
    private _name: string;
    private _musicLink: string;
    private _pokemonGuids: string[];
    private _story: string;

    constructor(
        {
            guid = crypto.randomUUID(),
            name = "",
            musicLink = "",
            pokemonGuids = [],
            story = "",
        }: {
            guid?: string;
            name?: string;
            musicLink?: string;
            pokemonGuids?: string[];
            story?: string;
        } = {}
    ) {
        this._guid = guid;
        this._name = name;
        this._musicLink = musicLink;
        this._pokemonGuids = pokemonGuids;
        this._story = story;
    }

    // Getters
    get guid(): string {
        return this._guid;
    }

    get name(): string {
        return this._name;
    }

    get musicLink(): string {
        return this._musicLink;
    }

    get pokemonGuids(): string[] {
        return [...this._pokemonGuids];
    }

    get story(): string {
        return this._story;
    }

    // Setters
    setName(name: string): void {
        this._name = name;
    }

    setMusicLink(musicLink: string): void {
        this._musicLink = musicLink;
    }

    setStory(story: string): void {
        this._story = story;
    }

    // Pokemon management
    addPokemon(pokemonGuid: string): void {
        if (!this._pokemonGuids.includes(pokemonGuid)) {
            this._pokemonGuids.push(pokemonGuid);
        }
    }

    removePokemon(pokemonGuid: string): void {
        this._pokemonGuids = this._pokemonGuids.filter(guid => guid !== pokemonGuid);
    }

    hasPokemon(pokemonGuid: string): boolean {
        return this._pokemonGuids.includes(pokemonGuid);
    }

    clearPokemon(): void {
        this._pokemonGuids = [];
    }
}
