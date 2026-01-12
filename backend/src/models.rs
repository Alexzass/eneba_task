use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Game{
    pub id: i64,
    pub game_name: String,
    pub region: String,
    pub platform: String,
    pub original_price: f64,
    pub current_price: f64,
    pub likes: i64
}