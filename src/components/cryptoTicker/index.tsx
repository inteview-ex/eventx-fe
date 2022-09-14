import React from "react";
import { TimeInterval } from "../../assets/types/backend.type";
import { CryptoTickerProps } from "./type";

function CryptoTicker(props: CryptoTickerProps) {
	const { cryptoInfo, interval = TimeInterval.Day } = props;
	return <div>{cryptoInfo.name}</div>;
}

export default CryptoTicker;
