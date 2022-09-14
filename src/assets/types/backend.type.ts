export const enum TimeInterval {
	Hour = "1h",
	Day = "1d",
	Week = "7d",
	Month = "30d",
	Year = "365d",
}

export type CryptoIntervalInfo = {
	volume: string;
	price_change: string;
	price_change_pct: string;
	volume_change: string;
	volume_change_pct: string;
	market_cap_change?: string;
	market_cap_change_pct?: string;
};
export type CryptoInfo = {
	id: string;

	currency: string;

	symbol: string;

	name?: string;

	logo_url?: string;

	price: string;

	max_supply?: string;

	market_cap?: string;

	[TimeInterval.Hour]?: CryptoIntervalInfo;

	[TimeInterval.Day]?: CryptoIntervalInfo;

	[TimeInterval.Week]?: CryptoIntervalInfo;

	[TimeInterval.Month]?: CryptoIntervalInfo;

	[TimeInterval.Year]?: CryptoIntervalInfo;

    createAt:Date
    
    updateAt:Date
};
