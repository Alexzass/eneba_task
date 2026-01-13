"use client"

import styles from "@/styles/home.module.css"
import Game from "./Game"
import { useSearchParams } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { ClientContext } from "./ClientProvider";
import { GameDataDto, GameDataResponseDto } from "@/dtos";

export default function Home(
){  

    const searchParams = useSearchParams()
    const search = searchParams.get("search")
    const clientContextApi = useContext(ClientContext);
    const [games, setGames] = useState<GameDataResponseDto | null>(null);

    useEffect(() => {
        async function fetchGames(){
            const res = await fetch(`https://api.alexaz.dev/list${
                search === null || search.length < 1 ? 
                `?limit=${clientContextApi?.page.limit}&offset=${clientContextApi?.page.offset}` :
                `?search=${search}&limit=${clientContextApi?.page.limit}&offset=${clientContextApi?.page.offset}`}`,
                {method: "GET", headers: {"Content-Type": "application/x-www-form-urlencoded"}}
            )

            const data: GameDataResponseDto = await res.json();
            setGames(data)
        }

        fetchGames()
    }, [clientContextApi?.page, clientContextApi?.refresh])

    return <main className={styles.main}>
        <h3 className={styles.results}>Results found: {games?.found}</h3>
        <div className={styles.games}>
            {games?.games.map((game, idx) => {
                return <Game key={idx} gameData={game} id={idx}/>
            })}
        </div>
    </main>
}