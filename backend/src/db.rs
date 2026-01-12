use async_trait::async_trait;
use sqlx::{Pool, Postgres};

use crate::{dtos::GamesResponseDto, models::*};

#[derive(Debug, Clone)]
pub struct DBClient {
    pub pool: Pool<Postgres>
}

impl DBClient {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
pub trait GameExt{
    async fn get_games(
        &self,
        limit: Option<i64>,
        offset: Option<i64>,
        search: Option<String>
    ) -> Result<GamesResponseDto, sqlx::Error>; 

    async fn count_games(
        &self,
        search: String
    ) -> Result<i64, sqlx::Error>;

    async fn create_games( 
        &self, 
        game: Game
    ) -> Result<i64, sqlx::Error>;

    async fn update_price(
        &self,
        price: f64,
        id: i64
    ) -> Result<(), sqlx::Error>;
}

#[async_trait]
impl GameExt for DBClient{
    async fn get_games(
        &self,
        limit: Option<i64>,
        offset: Option<i64>,
        search: Option<String>
    ) -> Result<GamesResponseDto, sqlx::Error>{
        let mut games: Vec<Game> = vec![];
        let mut cnt: i64 = 0;

        match (search, limit, offset){
            (Some(search),Some(limit),Some(offset),) => {
                games = sqlx::query_as!(
                    Game,
                    r#"SELECT id, game_name, region, platform, original_price, current_price, likes 
                    FROM games g 
                    WHERE game_name % $1
                    ORDER BY similarity(game_name, $1) DESC
                    LIMIT $2
                    OFFSET $3;"#,
                    search,
                    limit,
                    offset
                ).fetch_all(&self.pool).await.ok().unwrap();

                cnt = sqlx::query!(
                    r#"
                    SELECT COUNT(*) as "cnt!: i64"
                    FROM games
                    WHERE game_name % $1;
                    "#,
                    search
                ).fetch_one(&self.pool).await.unwrap().cnt;

            },
            (None ,Some(limit),Some(offset),) => {
                games = sqlx::query_as!(
                    Game,
                    r#"SELECT id, game_name, region, platform,  original_price, current_price, likes 
                    FROM games 
                    LIMIT $1
                    OFFSET $2;"#,
                    limit,
                    offset
                ).fetch_all(&self.pool).await.ok().unwrap();

                cnt = sqlx::query!(
                    r#"
                    SELECT COUNT(*) as "cnt!: i64"
                    FROM games;
                    "#
                ).fetch_one(&self.pool).await.unwrap().cnt;

            },
            (Some(search) , None, None) => {
                games = sqlx::query_as!(
                    Game,
                    r#"SELECT id, game_name, region, platform,  original_price, current_price, likes 
                    FROM games 
                    WHERE game_name % $1
                    ORDER BY similarity(game_name, $1) DESC;"#,
                    search
                ).fetch_all(&self.pool).await.ok().unwrap();

                cnt = sqlx::query!(
                    r#"
                    SELECT COUNT(*) as "cnt!: i64"
                    FROM games
                    WHERE game_name % $1;
                    "#,
                    search
                ).fetch_one(&self.pool).await.unwrap().cnt;

            },
            (None, None, None) => {
                games = sqlx::query_as!(
                    Game,
                    r#"SELECT id, game_name, region, platform,  original_price, current_price, likes 
                    FROM games;"#
                ).fetch_all(&self.pool).await.ok().unwrap();

                cnt = sqlx::query!(
                    r#"
                    SELECT COUNT(*) as "cnt!: i64"
                    FROM games;
                    "#
                ).fetch_one(&self.pool).await.unwrap().cnt;
            },
            _ => {}
        }

        Ok(GamesResponseDto { found: cnt, games })
    }

    async fn count_games(
        &self,
        search: String
    ) -> Result<i64, sqlx::Error>{
        let cnt: i64 = sqlx::query!(
            r#"
            SELECT COUNT(*) as "cnt!: i64"
            FROM games
            WHERE game_name % $1;
            "#,
            search
        ).fetch_one(&self.pool).await.unwrap().cnt;

        Ok(cnt)
    }

    async fn create_games( 
        &self, 
        game: Game
    ) -> Result<i64, sqlx::Error>{
        let id = sqlx::query!(
            r#"
            INSERT INTO games (
                game_name,
                region,
                platform,
                original_price,
                current_price,
                likes
            )
            SELECT $1, $2, $3, $4, $5, $6
            RETURNING id;
            "#,
            &game.game_name,
            &game.region,
            &game.platform,
            &game.original_price,
            &game.original_price,
            game.likes as i32
        ).fetch_one(&self.pool).await?;


        Ok(id.id as i64)
    }

    async fn update_price(
        &self,
        price: f64,
        id: i64
    ) -> Result<(), sqlx::Error>{
        sqlx::query!(
            r#"
            UPDATE games
            SET current_price = $1
            WHERE id = $2;
            "#,
            price,
            id as i32
        ).execute(&self.pool).await?;

        Ok(())
    }
}