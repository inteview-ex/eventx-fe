import { CryptoInfo, TimeInterval } from "../../assets/types/backend.type";

export interface CryptoTickerProps{
    cryptoInfo:CryptoInfo
    interval?:TimeInterval
}