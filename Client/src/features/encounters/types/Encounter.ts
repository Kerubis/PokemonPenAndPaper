import type { TurnOrder } from './TurnOrder';

export interface MusicLink {
    url: string;
    description: string;
}

export class Encounter {
    private _guid: string;
    private _name: string;
    private _musicLinks: MusicLink[];
    private _pokemonGuids: string[];
    private _story: string;
    private _index: number;
    private _finished: boolean;
    private _mapDrawing: string;
    private _turnOrder: TurnOrder | null;

    constructor(
        {
            guid = crypto.randomUUID(),
            name = "",
            musicLinks = [],
            pokemonGuids = [],
            story = "",
            index = 0,
            finished = false,
            mapDrawing = "",
            turnOrder = null,
        }: {
            guid?: string;
            name?: string;
            musicLinks?: MusicLink[];
            pokemonGuids?: string[];
            story?: string;
            index?: number;
            finished?: boolean;
            mapDrawing?: string;
            turnOrder?: TurnOrder | null;
        } = {}
    ) {
        this._guid = guid;
        this._name = name;
        this._musicLinks = musicLinks;
        this._pokemonGuids = pokemonGuids;
        this._story = story;
        this._index = index;
        this._finished = finished;
        this._mapDrawing = mapDrawing;
        this._turnOrder = turnOrder;
    }

    // Getters
    get guid(): string {
        return this._guid;
    }

    get name(): string {
        return this._name;
    }

    get musicLinks(): MusicLink[] {
        return [...this._musicLinks];
    }

    get pokemonGuids(): string[] {
        return [...this._pokemonGuids];
    }

    get story(): string {
        return this._story;
    }

    get index(): number {
        return this._index;
    }

    get finished(): boolean {
        return this._finished;
    }

    get mapDrawing(): string {
        return this._mapDrawing;
    }

    get turnOrder(): TurnOrder | null {
        return this._turnOrder;
    }

    // Setters
    setName(name: string): void {
        this._name = name;
    }

    addMusicLink(link: MusicLink): void {
        this._musicLinks.push(link);
    }

    updateMusicLink(index: number, link: MusicLink): void {
        if (index >= 0 && index < this._musicLinks.length) {
            this._musicLinks[index] = link;
        }
    }

    removeMusicLink(index: number): void {
        this._musicLinks.splice(index, 1);
    }

    setMusicLinks(links: MusicLink[]): void {
        this._musicLinks = [...links];
    }

    setStory(story: string): void {
        this._story = story;
    }

    setIndex(index: number): void {
        this._index = index;
    }

    setFinished(finished: boolean): void {
        this._finished = finished;
    }

    setMapDrawing(mapDrawing: string): void {
        this._mapDrawing = mapDrawing;
    }

    setTurnOrder(turnOrder: TurnOrder | null): void {
        this._turnOrder = turnOrder;
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
