import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { CryptoInfo } from "./assets/types/backend.type";
import CryptoTicker from "./components/cryptoTicker";

function App() {
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

	// on page init
	useEffect(() => {
		handleGetTickers();
	}, []);

	return (
		<div className="page_container">
			<div className="ticker_wrapper">
				<div className="ticker_header">
					<h1>Cryptocurrency Realtime Price</h1>
				</div>
				<div className="ticker_container">
					{cryptoInfos.map((e, i) => {
						return <CryptoTicker key={e.id} cryptoInfo={e} />;
					})}
				</div>
			</div>
		</div>
	);
}

export default App;
