"use client"

import { createContext, useState } from "react"
import { ContextAPI } from "@/dtos"

export const ClientContext = createContext<ContextAPI | null>(null);

export function ClientContextProvider(
    {children}: {children: React.ReactNode}
){
    const [currency, setCurrency] = useState<string>("EUR");
    const [page, setPage] = useState<{limit: number, offset: number}>({limit: 10, offset: 0})
    const [refresh, setRefresh] = useState<boolean>(false);

    function setCurrencyContext(search: string){
        setCurrency(search)
        console.log(search)
    }

    function setPageContext(page: {limit: number, offset: number}){
        setPage(page)
        console.log(page)
    }

    function setRefreshContext(){
        setRefresh(prev => !prev)
    }


    return (
        <ClientContext value={{setCurrencyContext, setPageContext, setRefreshContext, currency: currency, page: page, refresh: refresh}}>{children}</ClientContext>
    )
}