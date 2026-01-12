"use client"

import styles from "@/styles/game.module.css"
import { GameDataDto } from "@/dtos"
import Image from "next/image"
import PriceChangeModal from "./PriceChangeModal";
import { useState } from "react";

export default function Game(
    params: {gameData: GameDataDto, id: number}
){  
    const data = params.gameData;
    const id = params.id
    const game_id = params.gameData.id

    const [active, setActive] = useState<boolean>(false)

    let text = null

    switch (data.platform) {
        case "xbox":
            text = "Xbox Live"
            break
        case "ea":
            text = "EA App"
            break
        case "steam":
            text = "Steam"
            break
        case "ps":
            text = "Playstation"
            break
    } 

    return <div className={styles.game} style={{animationDelay: `${id*0.1}s`}}>
        <div className={styles.cashbackSticker}>
            <Image alt="cashback" width={30} height={30} src={"/cashback.svg"}/>
            <h4>CASHBACK</h4>
        </div>
        <img src={`https://api.alexaz.dev/images/${data.id}.png`} alt="game photo" className={styles.mainImg}/>
        <div className={styles.launcherGrp}>
            <Image alt="launcher" width={20} height={20} src={`/${data.platform}.png`}/>
            <h3>{text}</h3>
        </div>
        <div className={styles.info}>
            <div className={styles.topInfo}>
                <h3>{data.game_name}</h3>
                <h3>{data.region}</h3>
            </div>
            <div className={styles.botInfo}>
                <div className={styles.discountGrp}>
                    <h4>From <span>{data.original_price}</span></h4>
                    <h4>-{100-Math.ceil(data.current_price / (data.original_price/100))}%</h4>
                </div>
                <div className={styles.priceGrp}>
                    <h2>€ {data.current_price}</h2>
                    <Image width={30} height={30} alt="info" src={"/info.svg"} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}/>
                    <PriceChangeModal setActive={setActive} active={active} id={game_id}/>
                </div>
                <h4>Cashback: {Math.ceil((data.current_price * 0.1) * 10) / 10}€</h4>
                <div className={styles.likesGrp}>
                     <Image width={30} height={30} alt="info" src={"/favorite.svg"}/>
                    <h4>{data.likes}</h4>
                </div>
            </div>
        </div>
    </div>
}