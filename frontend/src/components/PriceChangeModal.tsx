"use client"

import styles from "@/styles/price-modal.module.css"
import { Dispatch, SetStateAction } from "react"
import updatePrice from "@/utils/UpdatePrice"
import { useContext, useState} from "react"
import { ClientContext } from "./ClientProvider"

export default function PriceChangeModal({setActive, active, id} : {setActive: Dispatch<SetStateAction<boolean>>, active: boolean, id: number}){

    const clientContextAPI = useContext(ClientContext);
    const [pending, setPending] = useState<boolean>(false)

    async function actionWrapper(data: FormData) {
        setPending(true)
        try {
            const res = await updatePrice(data, id);
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


    return <div className={styles.modal} data-active={active ? "true" : "false"} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
        <form className={styles.form} onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            console.log("submitting")
            actionWrapper(data);
        }}>
            <div className={styles.inputGrp}>
                <label>Price</label>
                <input type="number" step={0.01} name="price"/>
            </div>
            <button type="submit">{pending ? "Updating..." : "Set Price"}</button>
        </form>
    </div>
}