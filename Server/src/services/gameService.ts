import pool from '../db';
import type { PoolConnection } from 'mysql2/promise';
import type {
  GameState,
  SerializedPokemon,
  SerializedAbility,
  SerializedEncounter,
  SerializedMusicLink,
  SerializedTurnOrder,
  SerializedTurnOrderEntry,
  SerializedTurnEffect,
} from '../types/GameState';

// ---- Load ----------------------------------------------------------------

export async function loadGame(): Promise<GameState | null> {
  const conn = await pool.getConnection();
  try {
    // There is only one game per server instance (single-campaign app).
    const [games] = await conn.execute<any[]>('SELECT * FROM games LIMIT 1');
    if (!games.length) return null;
    const game = games[0];

    const pokemon = await loadPokemon(conn, game.guid);
    const encounters = await loadEncounters(conn, game.guid);

    return {
      guid: game.guid,
      gameName: game.game_name,
      pokemon,
      encounters,
      createdAt: game.created_at instanceof Date ? game.created_at.toISOString() : String(game.created_at),
      updatedAt: game.updated_at instanceof Date ? game.updated_at.toISOString() : String(game.updated_at),
    };
  } finally {
    conn.release();
  }
}

async function loadPokemon(conn: PoolConnection, gameGuid: string): Promise<SerializedPokemon[]> {
  const [rows] = await conn.execute<any[]>(
    'SELECT * FROM pokemon WHERE game_guid = ? ORDER BY idx',
    [gameGuid],
  );
  const pokemon: SerializedPokemon[] = [];
  for (const row of rows) {
    const [abilityRows] = await conn.execute<any[]>(
      'SELECT * FROM pokemon_abilities WHERE pokemon_id = ?',
      [row.id],
    );
    const abilities: SerializedAbility[] = abilityRows.map(a => ({
      name: a.name,
      type: a.type,
      accuracy: a.accuracy,
      damageType: a.damage_type,
      damage: a.damage,
    }));
    pokemon.push({
      id: row.id,
      pokedexEntry: row.pokedex_entry,
      name: row.name,
      level: row.level,
      hp: row.hp,
      currentHp: row.current_hp,
      attack: row.attack,
      specialAttack: row.special_attack,
      defense: row.defense,
      specialDefense: row.special_defense,
      speed: row.speed,
      walkSpeed: row.walk_speed,
      swimSpeed: row.swim_speed,
      climbSpeed: row.climb_speed,
      flySpeed: row.fly_speed,
      isPlayerCharacter: Boolean(row.is_player_character),
      abilities,
      index: row.idx,
    });
  }
  return pokemon;
}

async function loadEncounters(conn: PoolConnection, gameGuid: string): Promise<SerializedEncounter[]> {
  const [rows] = await conn.execute<any[]>(
    'SELECT * FROM encounters WHERE game_guid = ? ORDER BY idx',
    [gameGuid],
  );
  const encounters: SerializedEncounter[] = [];
  for (const row of rows) {
    const [musicRows] = await conn.execute<any[]>(
      'SELECT * FROM encounter_music_links WHERE encounter_guid = ?',
      [row.guid],
    );
    const musicLinks: SerializedMusicLink[] = musicRows.map(m => ({
      url: m.url,
      description: m.description,
    }));

    const [pokemonRows] = await conn.execute<any[]>(
      'SELECT pokemon_id FROM encounter_pokemon WHERE encounter_guid = ?',
      [row.guid],
    );
    const pokemonGuids: string[] = pokemonRows.map(p => p.pokemon_id);

    const [toRows] = await conn.execute<any[]>(
      'SELECT * FROM turn_orders WHERE encounter_guid = ?',
      [row.guid],
    );
    let turnOrder: SerializedTurnOrder | undefined;
    if (toRows.length) {
      const to = toRows[0];
      const [entryRows] = await conn.execute<any[]>(
        'SELECT * FROM turn_order_entries WHERE turn_order_id = ?',
        [to.id],
      );
      const entries: SerializedTurnOrderEntry[] = entryRows.map(e => ({
        pokemonId: e.pokemon_id,
        baseInitiative: e.base_initiative,
        initiativeOverride: e.initiative_override ?? null,
      }));

      const [effectRows] = await conn.execute<any[]>(
        'SELECT * FROM turn_effects WHERE turn_order_id = ?',
        [to.id],
      );
      const effects: SerializedTurnEffect[] = effectRows.map(e => ({
        id: e.effect_id,
        name: e.name,
        description: e.description ?? undefined,
        remainingRounds: e.remaining_rounds,
        pokemonId: e.pokemon_id ?? undefined,
      }));

      turnOrder = {
        entries,
        currentRound: to.current_round,
        currentIndex: to.current_index,
        effects,
      };
    }

    encounters.push({
      guid: row.guid,
      name: row.name,
      musicLinks,
      pokemonGuids,
      story: row.story ?? '',
      index: row.idx,
      finished: Boolean(row.finished),
      mapDrawing: row.map_drawing ?? '',
      turnOrder,
    });
  }
  return encounters;
}

// ---- Save ----------------------------------------------------------------

export async function saveGame(state: GameState): Promise<GameState> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Upsert game row
    const [existing] = await conn.execute<any[]>(
      'SELECT guid, created_at FROM games WHERE guid = ?',
      [state.guid],
    );
    const createdAt = existing.length
      ? existing[0].created_at
      : now;

    await conn.execute(
      `INSERT INTO games (guid, game_name, created_at, updated_at)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE game_name = VALUES(game_name), updated_at = VALUES(updated_at)`,
      [state.guid, state.gameName, createdAt, now],
    );

    // Replace pokemon
    await conn.execute('DELETE FROM pokemon WHERE game_guid = ?', [state.guid]);
    for (const p of state.pokemon) {
      await conn.execute(
        `INSERT INTO pokemon
           (id, game_guid, pokedex_entry, name, level, hp, current_hp,
            attack, special_attack, defense, special_defense, speed,
            walk_speed, swim_speed, climb_speed, fly_speed, is_player_character, idx)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          p.id, state.guid, p.pokedexEntry, p.name, p.level, p.hp, p.currentHp,
          p.attack, p.specialAttack, p.defense, p.specialDefense, p.speed,
          p.walkSpeed, p.swimSpeed, p.climbSpeed, p.flySpeed, p.isPlayerCharacter, p.index,
        ],
      );
      for (const a of p.abilities) {
        await conn.execute(
          `INSERT INTO pokemon_abilities (pokemon_id, name, type, accuracy, damage_type, damage)
           VALUES (?,?,?,?,?,?)`,
          [p.id, a.name, a.type, a.accuracy, a.damageType, a.damage],
        );
      }
    }

    // Replace encounters
    await conn.execute('DELETE FROM encounters WHERE game_guid = ?', [state.guid]);
    for (const e of state.encounters) {
      await conn.execute(
        `INSERT INTO encounters (guid, game_guid, name, story, idx, finished, map_drawing)
         VALUES (?,?,?,?,?,?,?)`,
        [e.guid, state.guid, e.name, e.story ?? '', e.index, e.finished, e.mapDrawing ?? ''],
      );

      for (const ml of (e.musicLinks ?? [])) {
        await conn.execute(
          'INSERT INTO encounter_music_links (encounter_guid, url, description) VALUES (?,?,?)',
          [e.guid, ml.url, ml.description ?? ''],
        );
      }

      for (const pId of (e.pokemonGuids ?? [])) {
        await conn.execute(
          'INSERT INTO encounter_pokemon (encounter_guid, pokemon_id) VALUES (?,?)',
          [e.guid, pId],
        );
      }

      if (e.turnOrder) {
        const [toResult]: any = await conn.execute(
          `INSERT INTO turn_orders (encounter_guid, current_round, current_index)
           VALUES (?,?,?)`,
          [e.guid, e.turnOrder.currentRound, e.turnOrder.currentIndex],
        );
        const turnOrderId = toResult.insertId;
        for (const entry of (e.turnOrder.entries ?? [])) {
          await conn.execute(
            `INSERT INTO turn_order_entries (turn_order_id, pokemon_id, base_initiative, initiative_override)
             VALUES (?,?,?,?)`,
            [turnOrderId, entry.pokemonId, entry.baseInitiative, entry.initiativeOverride ?? null],
          );
        }
        for (const effect of (e.turnOrder.effects ?? [])) {
          await conn.execute(
            `INSERT INTO turn_effects (turn_order_id, effect_id, name, description, remaining_rounds, pokemon_id)
             VALUES (?,?,?,?,?,?)`,
            [turnOrderId, effect.id, effect.name, effect.description ?? null, effect.remainingRounds, effect.pokemonId ?? null],
          );
        }
      }
    }

    await conn.commit();

    return {
      ...state,
      createdAt: typeof createdAt === 'string' ? createdAt : now,
      updatedAt: now,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
