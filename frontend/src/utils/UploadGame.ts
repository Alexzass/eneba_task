export default async function createGame(data: FormData){
    let res = await fetch("https://api.alexaz.dev/upload_game", {method: "POST", body: data});

    return res
};