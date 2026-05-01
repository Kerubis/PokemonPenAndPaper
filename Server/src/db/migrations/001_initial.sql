-- ============================================================
-- PokemonPenAndPaper – Initial Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS games (
  guid        VARCHAR(36)  NOT NULL PRIMARY KEY,
  game_name   VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL,
  updated_at  DATETIME     NOT NULL
);

CREATE TABLE IF NOT EXISTS pokemon (
  id                  VARCHAR(36)  NOT NULL PRIMARY KEY,
  game_guid           VARCHAR(36)  NOT NULL,
  pokedex_entry       INT          NOT NULL,
  name                VARCHAR(255) NOT NULL,
  level               INT          NOT NULL DEFAULT 1,
  hp                  INT          NOT NULL DEFAULT 0,
  current_hp          INT          NOT NULL DEFAULT 0,
  attack              INT          NOT NULL DEFAULT 0,
  special_attack      INT          NOT NULL DEFAULT 0,
  defense             INT          NOT NULL DEFAULT 0,
  special_defense     INT          NOT NULL DEFAULT 0,
  speed               INT          NOT NULL DEFAULT 0,
  walk_speed          INT          NOT NULL DEFAULT 0,
  swim_speed          INT          NOT NULL DEFAULT 0,
  climb_speed         INT          NOT NULL DEFAULT 0,
  fly_speed           INT          NOT NULL DEFAULT 0,
  is_player_character BOOLEAN      NOT NULL DEFAULT FALSE,
  idx                 INT          NOT NULL DEFAULT 0,
  CONSTRAINT fk_pokemon_game FOREIGN KEY (game_guid)
    REFERENCES games(guid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pokemon_abilities (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pokemon_id  VARCHAR(36)  NOT NULL,
  name        VARCHAR(255) NOT NULL,
  type        VARCHAR(100) NOT NULL,
  accuracy    INT          NOT NULL DEFAULT 0,
  damage_type VARCHAR(100) NOT NULL,
  damage      VARCHAR(100) NOT NULL,
  CONSTRAINT fk_ability_pokemon FOREIGN KEY (pokemon_id)
    REFERENCES pokemon(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS encounters (
  guid        VARCHAR(36)  NOT NULL PRIMARY KEY,
  game_guid   VARCHAR(36)  NOT NULL,
  name        VARCHAR(255) NOT NULL,
  music_link  VARCHAR(500),
  story       TEXT,
  idx         INT          NOT NULL DEFAULT 0,
  finished    BOOLEAN      NOT NULL DEFAULT FALSE,
  map_drawing LONGTEXT,
  CONSTRAINT fk_encounter_game FOREIGN KEY (game_guid)
    REFERENCES games(guid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS encounter_music_links (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  encounter_guid VARCHAR(36)  NOT NULL,
  url            VARCHAR(500) NOT NULL,
  description    VARCHAR(255) NOT NULL DEFAULT '',
  CONSTRAINT fk_music_encounter FOREIGN KEY (encounter_guid)
    REFERENCES encounters(guid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS encounter_pokemon (
  encounter_guid VARCHAR(36) NOT NULL,
  pokemon_id     VARCHAR(36) NOT NULL,
  PRIMARY KEY (encounter_guid, pokemon_id),
  CONSTRAINT fk_ep_encounter FOREIGN KEY (encounter_guid)
    REFERENCES encounters(guid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS turn_orders (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  encounter_guid VARCHAR(36) NOT NULL UNIQUE,
  current_round  INT         NOT NULL DEFAULT 1,
  current_index  INT         NOT NULL DEFAULT 0,
  CONSTRAINT fk_to_encounter FOREIGN KEY (encounter_guid)
    REFERENCES encounters(guid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS turn_order_entries (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  turn_order_id       INT         NOT NULL,
  pokemon_id          VARCHAR(36) NOT NULL,
  base_initiative     INT         NOT NULL DEFAULT 0,
  initiative_override INT,
  CONSTRAINT fk_toe_turn_order FOREIGN KEY (turn_order_id)
    REFERENCES turn_orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS turn_effects (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  turn_order_id    INT          NOT NULL,
  effect_id        VARCHAR(36)  NOT NULL,
  name             VARCHAR(255) NOT NULL,
  description      TEXT,
  remaining_rounds INT          NOT NULL DEFAULT 0,
  pokemon_id       VARCHAR(36),
  CONSTRAINT fk_te_turn_order FOREIGN KEY (turn_order_id)
    REFERENCES turn_orders(id) ON DELETE CASCADE
);
