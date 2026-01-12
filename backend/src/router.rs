use tower_http::trace::TraceLayer;
use std::sync::Arc;
use axum::{Extension, Router};
use crate::{server::AppState};
use crate::handlers::games::games_router;

pub fn create_router(app_state: Arc<AppState>) -> Router{
    let api_routes = Router::new()
        .merge(games_router())
        .layer(TraceLayer::new_for_http())
        .layer(Extension(app_state));

    Router::new().merge(api_routes)
}