use std::{io::Write, sync::Arc};
use axum::{Extension, Router, body::Bytes, extract::{Json, Path, Query}, http::{HeaderMap, HeaderValue, StatusCode, header}, response::IntoResponse, routing::{get, post, put}};
use crate::{db::GameExt, dtos::*, models::Game};
use std::{fs::File, io::Read, path::PathBuf};

use axum::extract::Multipart;

use crate::server::AppState;

pub fn games_router() -> Router{
    Router::new()
        .route("/list", get(games))
        .route("/create", post(create_games))
        .route("/images/{id}", get(image))
        .route("/upload_game", post(create_games))
        .route("/update_price", put(update_price))
}

pub async fn games(
    Extension(app_state): Extension<Arc<AppState>>,
    Query(data): Query<GamesRequestDto>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let db_res: GamesResponseDto = app_state
        .db
        .get_games(data.limit, data.offset, data.search)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                e.to_string(),
            )
        })?;

    Ok(Json(db_res))
}

pub async fn update_price(
    Extension(app_state): Extension<Arc<AppState>>,
    Json(payload): Json<UpdatePriceDto>
) -> Result<impl IntoResponse, (StatusCode, String)>{
    println!("{}, {}", payload.price, payload.id);
    app_state.db.update_price(payload.price.parse::<f64>().unwrap(), payload.id).await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            e.to_string()
        )
    })?;

    Ok(())
}

pub async fn create_games(
    Extension(app_state): Extension<Arc<AppState>>,
    mut multipart: Multipart
) -> Result<impl IntoResponse, (StatusCode, String)>{

    let mut game_name: Option<String> = None;
    let mut region: Option<String> = None;
    let mut platform: Option<String> = None;
    let mut price: Option<f64> = None;
    let mut likes: Option<i64> = None;
    let mut bytes: Option<Bytes> = None;

    while let Some(field) = multipart.next_field().await.unwrap() {
        match field.name() {
            Some("name") => game_name = Some(field.text().await.unwrap()),
            Some("region") => region = Some(field.text().await.unwrap()),
            Some("platform") => platform = Some(field.text().await.unwrap()),
            Some("price") => price = Some(field.text().await.unwrap().parse::<f64>().unwrap()),
            Some("likes") => likes = Some(field.text().await.unwrap().parse::<i64>().unwrap()),
            Some("image") => {
                bytes = Some(field.bytes().await.unwrap());
            },
            _ => {}
        }
    }

    let (id, game_name) = app_state.db
        .create_games(Game { id: 0, 
            game_name: game_name.unwrap(), 
            region: region.unwrap(), 
            platform: platform.unwrap(), 
            original_price: price.unwrap(), 
            current_price: 0.0, 
            likes: likes.unwrap() }
        )
        .await.map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                e.to_string()
            )
        })?;

    let file_path = format!("photos/{}-{}.png", id.to_string(), game_name);

    let mut file = File::create(&file_path).ok().unwrap();
    file.write_all(&bytes.unwrap()).map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                e.to_string()
            )
        })?;

    Ok((StatusCode::OK, "Created games successfully!".to_string()))
}

pub async fn image(
    Extension(_app_state): Extension<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let path = PathBuf::from(format!("photos/{}", id));

    match File::open(&path) {
        Ok(mut file) => {
            let mut buf: Vec<u8> = Vec::new();

            file.read_to_end(&mut buf).unwrap();


            let mime_type = match path.extension().and_then(|ext| ext.to_str()) {
                Some("jpg") | Some("jpeg") => "image/jpeg",
                Some("png") => "image/png",
                Some("gif") => "image/gif",
                _ => "application/octet-stream"
            };

            let mut headers = HeaderMap::new();

            headers.insert("Content-Type", HeaderValue::from_static(mime_type));

            Ok((StatusCode::OK, headers, buf))
        },
        Err(e) => Err(
                (StatusCode::INTERNAL_SERVER_ERROR,
                e.to_string())
            )
    }
}