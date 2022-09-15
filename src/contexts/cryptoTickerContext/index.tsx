import { CryptoTickerContextProps } from "./type";
import { createContext, ElementType, useContext, useState } from "react";
import { CryptoInfo } from "../../assets/types/backend.type";
import axios from "axios";
import { Manager } from "socket.io-client";
const CryptoTickerContext = createContext<CryptoTickerContextProps>({
	cryptoInfos: [],
	sync: async () => {},
	isSyncing: false,
});
export const useCryptoTickerContext = () => useContext(CryptoTickerContext);
export const WithCryptoTickerContext = (Component: ElementType) => {
	return function WithCryptoTickerContext(props: any) {
		const axiosInstance = axios.create({
			baseURL: process.env.REACT_APP_BACKEND_URL,
			timeout: 3000,
		});
		async function handleGetTickers() {
			try {
				const result = await axiosInstance.get<CryptoInfo[]>(
					`/crypto-ticker?tokens=BTC,ETH,LTC,XMR,XRP,DOGE,DASH,MAID,LSK,SJCX`
				);
				console.log("result", result.data);
				setCryptoInfos(result.data ?? []);
			} catch (error) {
				console.log("error", error);
			}
		}
		const [cryptoInfos, setCryptoInfos] = useState<CryptoInfo[]>([]);
		const [isSyncing, setIsSyncing] = useState(false);

		const handleSync = async () => {
			setIsSyncing(true);
			await handleGetTickers();
			setIsSyncing(false);
		};
		try {
			const socketManager = new Manager(
				process.env.REACT_APP_BACKEND_URL
			);
			socketManager.on("open", () => {
				console.log("Manager connect");
			});
			socketManager.on("close", (reason) => {
				console.log("Manager close", reason);
			});
			socketManager.on("packet", (packet) => {
				console.group("Manager packet");
				console.dir(packet, { depth: null });
				console.groupEnd();
			});
			socketManager.on("ping", () => {
				console.log("Manager ping");
			});
			socketManager.on("reconnect", (attempt) => {
				console.log("Manager Reconnect success: ", attempt);
			});
			socketManager.on("reconnect_attempt", (attempt) => {
				console.log("Manager Reconnect attempt: ", attempt);
			});
			socketManager.on("reconnect_error", (err) => {
				console.error("Manager Reconnect err: ", err);
			});
			socketManager.on("reconnect_failed", () => {
				console.error("Manager Reconnect failed");
			});
			const socket = socketManager.socket("/cryptoTicker");
			socket.on("connect", () => {
				console.log(`Socket connected`);
			});

			socket.on("disconnect", (reason) => {
				console.log(`Socket disconnect due to ${reason}`);
			});

			socket.on("connect_error", (error) => {
				console.error("Socket Connect err: ", error);
			});

			socket.onAny((event, data) => {
				socketEventHandler(event, data);
			});
			const socketEventHandler = (event: string, data: any) => {
				switch (event) {
					default:
						console.group("Drop Socket Event");
						console.log("event", event);
						console.log("data", data);
						console.groupEnd();
				}
			};
			const defaultContextValue: CryptoTickerContextProps = {
                cryptoInfos,
				sync: handleSync,
				isSyncing: isSyncing,
			};

			return (
				<CryptoTickerContext.Provider value={defaultContextValue}>
					<Component {...props} />
				</CryptoTickerContext.Provider>
			);
		} catch (error) {
			console.error("CryptoTickerContext Init Error", error);
			return <div>CryptoTickerContext Init Error</div>;
		}
	};
};
