import { useEffect } from "react";
import "./App.css";
import CryptoTicker from "./components/cryptoTicker";
import { useCryptoTickerContext, WithCryptoTickerContext } from "./contexts/cryptoTickerContext";

function App() {
	const {cryptoInfos, sync, isSyncing} = useCryptoTickerContext()
	useEffect(() => {
		sync()
	}, [])
	if(isSyncing){
		return <div>Loading...</div>
	}
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

export default WithCryptoTickerContext(App);
