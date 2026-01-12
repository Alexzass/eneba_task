"use client"

import styles from "@/styles/modal.module.css"
import { useState, useRef, useEffect, useContext } from "react"
import createGame from "@/utils/UploadGame"
import { redirect } from "next/navigation"
import { ClientContext } from "./ClientProvider"

export default function CreateGameModal(){
    const [file, setFile] = useState("No file selected")
    const [region, setRegion] = useState("")
    const [platform, setPlatform] = useState("")
    const [active, setActive] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const clientContextAPI = useContext(ClientContext);

    async  function submitWrapper(data: FormData){
        data.append("region", region);
        data.append("platform", platform);

        setPending(true);

        try {
        const res = await createGame(data);
        console.log(res.status);

        if (!res.ok) {

        }
        } catch (err) {
            return
        } finally {
            clientContextAPI?.setRefreshContext();
            setPending(false);
        }

    }

    useEffect(() => {
        if (inputRef.current === null){
            return
        }

        inputRef.current.addEventListener("change", () => {
            if (inputRef.current === null){
            return
        }
            setFile(inputRef.current.files?.length ? inputRef.current.files[0].name : "No file Selected")
        })
    })

    return <div className={styles.modal} data-active={active ? "true" : "false"}>
        <button data-active={active ? "true" : "false"} onClick={() => {
            setActive(prev => !prev)
        }} className={styles.navBtn}>{active ? "X" : "Upload Game"}</button>
        <form data-active={active ? "true" : "false"} onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            submitWrapper(formData)
            
            }} className={styles.form}>
            <div className={styles.inputGrp}>
                <label>Name</label>
                <input type="text" name="name"/>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.inputGrp}>
                    <label>Price</label>
                    <input type="number" step={0.01} name="price"/>
                </div>
                <div className={styles.inputGrp}>
                    <label>Likes</label>
                    <input type="number" name="likes"/>
                </div>
            </div>
            <div className={styles.selectGrp}>
                <h2 data-active={region === "Europe" ? "true" : "false"} onClick={() => {setRegion("Europe")}}>EU</h2>
                <h2 data-active={region === "United States" ? "true" : "false"} onClick={() => {setRegion("United States")}}>US</h2>
                <h2 data-active={region === "World Wide" ? "true" : "false"} onClick={() => {setRegion("World Wide")}}>Worldwide</h2>
                <h2 data-active={region === "Australia" ? "true" : "false"} onClick={() => {setRegion("Australia")}}>AU</h2>
            </div>
            <div className={styles.selectGrp}>
                <img src="/steam.png" alt="steam" data-active={platform === "steam" ? "true" : "false"} onClick={() => {setPlatform("steam")}}/>
                <img src="/ea.png" alt="ea" data-active={platform === "ea" ? "true" : "false"} onClick={() => {setPlatform("ea")}}/>
                <img src="/xbox.png" alt="xbox" data-active={platform === "xbox" ? "true" : "false"} onClick={() => {setPlatform("xbox")}}/>
                <img src="/ps.png" alt="ps" data-active={platform === "ps" ? "true" : "false"} onClick={() => {setPlatform("ps")}}/>
            </div>
            <div className={styles.fileDiv}>
                <input type="file" id="file" name="image" ref={inputRef} hidden/>
                <label htmlFor="file" className={styles.fileBtn}>Upload photo</label>
                <h3>{file}</h3>
            </div>
            <button>{pending ? "UPLOADING..." : "UPLOAD"}</button>
        </form>
    </div>
}