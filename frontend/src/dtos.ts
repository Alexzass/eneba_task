export interface GameDataDto{
    id: number,
    game_name: string,
    region: string,
    platform: string,
    original_price: number,
    current_price: number,
    likes: number
}

export interface GameDataResponseDto{
    games: GameDataDto[],
    found: number
}

export type ContextAPI = {
    setCurrencyContext: (currency: string) => void,
    setPageContext: (page: {limit: number, offset: number}) => void,
    setRefreshContext: () => void,
    currency: string,
    page: {limit: number, offset: number},
    refresh: boolean
}