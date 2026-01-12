use std::env::var;

#[derive(Debug, Clone)]
pub struct Config{
    pub db_url: String,
}

impl Config{
    pub fn init() -> Self{
        let db_url = var("DATABASE_URL").expect("DATABASE_URL must be set");

        Self { db_url }
    }
}