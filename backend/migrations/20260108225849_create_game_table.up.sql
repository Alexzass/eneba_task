-- Add up migration script here
CREATE EXTENSION pg_trgm;

CREATE TABLE "games"(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    original_price FLOAT NOT NULL,
    current_price FLOAT NOT NULL,
    likes INT NOT NULL
);

CREATE INDEX games_game_name_trgm_idx
ON games
USING gin (game_name gin_trgm_ops);