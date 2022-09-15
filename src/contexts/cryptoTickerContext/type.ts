import { CryptoInfo } from "../../assets/types/backend.type"

export interface CryptoTickerContextProps {
	cryptoInfos: CryptoInfo[]
    sync: () => Promise<void>
	isSyncing: boolean
}