use serde::{Serialize, Deserialize};
use crate::models::*;

#[derive(Deserialize)]
pub struct GamesRequestDto{
    pub search: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>
}

#[derive(Serialize)]
pub struct GamesResponseDto{
    pub found: i64,
    pub games: Vec<Game>
}

#[derive(Deserialize)]
pub struct CreateGamesDto{
    pub game: Game,
    pub cnt: i64
}

#[derive(Deserialize)]
pub struct UpdatePriceDto{
    pub price: String,
    pub id: i64
}