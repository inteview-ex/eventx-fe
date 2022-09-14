import React from "react";
import { TimeInterval } from "../../assets/types/backend.type";
import { CryptoTickerProps } from "./type";
function numberStringCheck(numStr?:string){
    const defaultRes = {
        isDefined:false,
        isPositive:false
    }
    const num = Number(numStr)
    if(isNaN(num)){
        return defaultRes
    }

    // number defined
    defaultRes.isDefined = true

    if(num > 0){
        defaultRes.isPositive = true
    }

    return defaultRes
}
function CryptoTicker(props: CryptoTickerProps) {
	const { cryptoInfo, interval = TimeInterval.Day } = props;
	const intervalData = cryptoInfo[interval];
    // if(intervalData){
    //     intervalData.price_change = "500"
    // }
    const numCheckPriceChange = numberStringCheck(intervalData?.price_change)
	return (
		<div
			style={{
				border: "1px solid grey",
                borderRadius:"8px",
				width: "320px",
				height: "150px",
				boxSizing: "border-box",
				padding: "12px",

				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "flex-start",
			}}
		>
			{/* name */}
			<span
				style={{
					fontSize: "40px",
					fontWeight: "600",
				}}
			>
				{cryptoInfo.name}
			</span>
			{/* price */}
			<span
				style={{
					fontSize: "20px",
					fontWeight: "500",
					color: "orange",
				}}
			>{`$${cryptoInfo.price}`}</span>
			{/* info area */}

			<div
				style={{
                    width:"100%",
					display: "flex",
					flexDirection: "row",
					columnGap: "10px",
				}}
			>
				{/* volumn */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						columnGap: "5px",
                        width:"55%",
					}}
				>
					<span
						style={{
							fontSize: "14px",
							fontWeight: "500",
							color: "grey",
						}}
					>
						volumn:
					</span>
					<span
						style={{
							fontWeight: "500",
							color: "grey",
						}}
					>{`${intervalData?.volume ?? "-"}`}</span>
				</div>
				{/* price change */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						columnGap: "5px",
                        flex:1,
					}}
				>
					<span
						style={{
							fontSize: "14px",
							fontWeight: "500",
							color: "grey",
						}}
					>
						price change:
					</span>
					<span
						style={{
							fontWeight: "500",
							color: !numCheckPriceChange.isDefined ? "black" : numCheckPriceChange.isPositive ? "green" : 'red',
						}}
					>{`${intervalData?.price_change ?? "-"}`}</span>
				</div>
			</div>
		</div>
	);
}

export default CryptoTicker;
