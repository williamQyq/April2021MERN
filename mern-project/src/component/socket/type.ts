import {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
} from "@redux-action/types"

export enum SocketAction {
    subscribe = "subscribe",
    dealsUpdated = "dealsUpdated",
    retrievedBBItemsOnlinePrice = ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    retrievedMSItemsOnlinePrice = ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    retrievedBBItemsOnlinePriceErr = RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    retrievedMSItemsOnlinePriceErr = RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR

}

export enum SocketRoom {
    dealsRoom = "dealsRoom",
}