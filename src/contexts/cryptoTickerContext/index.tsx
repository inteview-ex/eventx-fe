import { CryptoTickerContextProps } from "./type"
import {
	createContext,
	ElementType,
	useContext,
	useEffect,
	useState,
} from "react"
import { CryptoInfo } from "../../assets/types/backend.type"
import axios from "axios"
import { Manager, Socket } from "socket.io-client"
let isInit = false
const CryptoTickerContext = createContext<CryptoTickerContextProps>({
	cryptoInfos: [],
	sync: async () => {},
	isSyncing: false,
})
export enum LogLevel {
	PRODUCTION = 9,
	LOG = 1,
	DEBUG = 0,
}
export interface CryptoTickerContextOptions {
	logLevel?: LogLevel
}

export const useCryptoTickerContext = () => useContext(CryptoTickerContext)
export const WithCryptoTickerContext = (
	Component: ElementType,
	options?: CryptoTickerContextOptions,
) => {
	return function WithCryptoTickerContext(props: any) {
		const baseURL = window._env_.REACT_APP_BACKEND_URL
		const { logLevel = LogLevel.PRODUCTION } = options ?? {}
		const axiosInstance = axios.create({
			baseURL: baseURL,
			timeout: 3000,
		})
		async function handleGetTickers() {
			try {
				const result = await axiosInstance.get<CryptoInfo[]>(
					`/crypto-ticker?tokens=BTC,ETH,LTC,XMR,XRP,DOGE,DASH,MAID,LSK,SJCX`,
				)
				setCryptoInfos(result.data ?? [])
			} catch (error) {
				console.log("error", error)
			}
		}
		const [cryptoInfos, setCryptoInfos] = useState<CryptoInfo[]>([])
		const [isSyncing, setIsSyncing] = useState(false)
		const [socketManager, setSocketManager] = useState<Manager | null>(null)
		const [cryptoTickerSocket, setCryptoTickerSocket] =
			useState<Socket | null>(null)

		const handleSync = async () => {
			setIsSyncing(true)
			await handleGetTickers()
			setIsSyncing(false)
		}
		const initOrGetSocketManaget = () => {
			if (socketManager !== null) {
				return socketManager
			}
			const _socketManager = new Manager(baseURL, {
				transports: ["websocket", "polling"],
			})
			_socketManager.on("open", () => {
				logLevel <= LogLevel.LOG && console.log("Manager connect")
			})
			_socketManager.on("close", (reason) => {
				logLevel <= LogLevel.LOG && console.log("Manager close", reason)
			})
			_socketManager.on("packet", (packet) => {
				if (logLevel <= LogLevel.LOG) {
					console.group("Manager packet")
					console.dir(packet, { depth: null })
					console.groupEnd()
				}
			})
			_socketManager.on("ping", () => {
				logLevel <= LogLevel.DEBUG && console.log("Manager ping")
			})
			_socketManager.on("reconnect", (attempt) => {
				logLevel <= LogLevel.LOG &&
					console.log("Manager Reconnect success: ", attempt)
			})
			_socketManager.on("reconnect_attempt", (attempt) => {
				logLevel <= LogLevel.DEBUG &&
					console.log("Manager Reconnect attempt: ", attempt)
			})
			_socketManager.on("reconnect_error", (err) => {
				logLevel <= LogLevel.DEBUG &&
					console.error("Manager Reconnect err: ", err)
			})
			_socketManager.on("reconnect_failed", () => {
				logLevel <= LogLevel.DEBUG &&
					console.error("Manager Reconnect failed")
			})
			return _socketManager
		}
		const initOrGetCryptoTickerSocket = (manager: Manager) => {
			if (cryptoTickerSocket !== null) {
				return cryptoTickerSocket
			}
			const _socket = manager.socket("/cryptoTicker")
			_socket.on("connect", () => {
				logLevel <= LogLevel.LOG &&
					console.log(`Socket ${_socket.id} connected`)
			})

			_socket.on("disconnect", (reason) => {
				logLevel <= LogLevel.LOG &&
					console.log(
						`Socket ${_socket.id} disconnect due to ${reason}`,
					)
			})

			_socket.on("connect_error", (error) => {
				logLevel <= LogLevel.DEBUG &&
					console.error("Socket Connect err: ", error)
			})

			_socket.onAny((event, data) => {
				socketEventHandler(event, data)
			})
			return _socket
		}
		const handleCryptoInfosUpdate = (_cryptoInfos: CryptoInfo[]) => {
			console.log("update tickers")
			_cryptoInfos.sort((a, b) => {
				if (a.id > b.id) {
					return 1
				}
				if (a.id < b.id) {
					return -1
				}
				return 0
			})
			setCryptoInfos(_cryptoInfos)
		}
		const socketEventHandler = (event: string, data: any) => {
			switch (event) {
				case "TICKERS":
					handleCryptoInfosUpdate(data)
					break
				default:
					console.group("Drop Socket Event")
					console.log("event", event)
					console.log("data", data)
					console.groupEnd()
			}
		}

		const init = async () => {
			logLevel <= LogLevel.LOG && console.log("init cryptoTickerContext")
			const _socketManager = initOrGetSocketManaget()
			const _cryptoTickerSocket =
				initOrGetCryptoTickerSocket(_socketManager)
			setSocketManager(_socketManager)
			setCryptoTickerSocket(_cryptoTickerSocket)
		}

		useEffect(() => {
			if (!isInit) {
				isInit = true
				init()
			}
		}, [])

		try {
			const defaultContextValue: CryptoTickerContextProps = {
				cryptoInfos,
				sync: handleSync,
				isSyncing: isSyncing,
			}

			return (
				<CryptoTickerContext.Provider value={defaultContextValue}>
					<Component {...props} />
				</CryptoTickerContext.Provider>
			)
		} catch (error) {
			console.error("CryptoTickerContext Init Error", error)
			return <div>CryptoTickerContext Init Error</div>
		}
	}
}
