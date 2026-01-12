"use client"

import Image from "next/image"
import { useState, useRef, RefAttributes } from "react"
import styles from "@/styles/header.module.css"
import { useContext } from "react"
import { ClientContext } from "./ClientProvider"

export default function Header(){
    const [lang, setLang] = useState("en");
    const [typing, setTyping] = useState(false);
    const langRef = useRef<HTMLDivElement | null>(null);
    const currencyRef = useRef<HTMLDivElement | null>(null);
    const clientContextApi = useContext(ClientContext);

    function handleLangDropdown(){
        if (langRef.current === null) {
            return
        }

        const dropdown: HTMLDivElement = langRef.current;
        dropdown.dataset.active = dropdown.dataset.active === "true" ? "false" : "true"
    }
    function handlecurrencyDropdown(){
        if (currencyRef.current === null) {
            return
        }

        const dropdown: HTMLDivElement = currencyRef.current;
        dropdown.dataset.active = dropdown.dataset.active === "true" ? "false" : "true"
    }

    return <div className={styles.headerWrapper}>
        <header className={styles.header}>
            <div className={styles.navGroup}>
                <h1>eneba</h1>
                <form className={styles.search}>
                    <Image width={30} height={30} alt="search" src={"search.svg"}/>
                    <input name="search" type="text"></input>
                    {typing && <Image width={30} height={30} alt="close" src={"close.svg"}/>}
                </form>
                <div className={styles.options}>
                    <div className={styles.lang} onClick={(e) => {
                        handleLangDropdown();
                    }}>
                        <div className={styles.langOption}>
                            <Image width={20} height={20} alt="language" src={`/${lang}.png`}/>
                            <h5>{lang === "en" ? "ENGLISH" : "LITHUANIAN"}</h5>
                            <h5>{lang.toUpperCase()}</h5>
                        </div>
                        <div className={styles.langDropdown} ref={langRef} data-active="false">
                            <div className={styles.langOption}>
                                <Image width={20} height={20} alt="en" src={`/en.png`}/>
                                <h5>ENGLISH</h5>
                                <h5>EN</h5>
                            </div>
                            <div className={styles.langOption}>
                                <Image width={20} height={20} alt="lt" src={`/lt.png`}/>
                                <h5>LITHUANIAN</h5>
                                <h5>LT</h5>
                            </div>
                        </div>
                    </div>
                    <div className={styles.currency} onClick={(e) => {
                        handlecurrencyDropdown();
                    }}>
                        <h5>{clientContextApi?.currency.toUpperCase()}</h5>
                        <div className={styles.currencyDropdown} ref={currencyRef} data-active="false">
                            <h5 onClick={() => {clientContextApi?.setCurrencyContext("EUR")}}>EUR</h5>
                            <h5 onClick={() => {clientContextApi?.setCurrencyContext("USD")}}>USD</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <Image width={40} height={40} alt="favorite" src={`/favorite.svg`}/>
                <Image width={40} height={40} alt="cart" src={`/cart.svg`}/>
                <Image width={40} height={40} alt="cart" src={`/pfp.png`}/>
            </div>
        </header>
    </div>
}