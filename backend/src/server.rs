use crate::{config::Config, router::create_router};
use std::sync::Arc;
use dotenvy::dotenv;
use tracing_subscriber::filter::LevelFilter;
use tower_http::cors::{CorsLayer, Any};
use axum::{Router, http::Method};
use sqlx::postgres::PgPoolOptions;
use crate::db::DBClient;

#[derive(Debug, Clone)]
pub struct AppState{
    pub config: Config,
    pub db: DBClient
}

#[tokio::main]
pub async fn run_server() {
    tracing_subscriber::fmt().with_max_level(LevelFilter::DEBUG).init();

    dotenv().ok();

    let config: Config = Config::init();

    let pool: sqlx::Pool<sqlx::Postgres> = PgPoolOptions::new().max_connections(10).connect(&config.db_url).await.unwrap();

    let db_client: DBClient = DBClient::new(pool);

    let origins = [
        "https://task.alexaz.dev".parse().unwrap(),
        "http://localhost:3001".parse().unwrap(),
    ];

    let cors: CorsLayer = CorsLayer::new().allow_origin(origins)
        .allow_headers(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT]);

    let app_state: Arc<AppState> = Arc::new(AppState { config: config.clone(), db: db_client });

    let app: Router<()> = create_router(app_state.clone()).layer(cors.clone());

    println!("{}", format!("Server is running"));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}