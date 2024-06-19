import { API_KEY } from "../constants";

interface HistoricalInfo {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string
  }[]
}

export async function getHistoricalInfo(symbol: string): Promise<HistoricalInfo> {
  const response = await fetch(
    `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${API_KEY}`
  );
  const data = await response.json();
  return data;
}