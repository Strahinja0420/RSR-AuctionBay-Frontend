import type { Auction } from "../types/Auction.type";
import api from "./axios";

export const getAuctions = async () : Promise<Auction[]> =>{
    const response = await api.get(`/auctions`)
    //console.log(response);
    
    return response.data;
}