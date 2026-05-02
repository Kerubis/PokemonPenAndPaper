import type { TurnOrder } from './TurnOrder';

export interface MusicLink {
    url: string;
    description: string;
}

export interface Encounter {
    readonly guid: string;
    readonly name: string;
    readonly musicLinks: readonly MusicLink[];
    readonly pokemonGuids: readonly string[];
    readonly story: string;
    readonly index: number;
    readonly finished: boolean;
    readonly mapDrawing: string;
    readonly turnOrder: TurnOrder | null;
}
