import { API_KEY } from "../constants";

export interface QuoteResponse {
  "symbol": string,
  "name": string,
  "exchange": string,
  "mic_code": string,
  "currency": string,
  "datetime": string,
  "timestamp": number,
  "open": string,
  "high": string,
  "low": string,
  "close": string,
  "volume": string,
  "previous_close": string,
  "change": string,
  "percent_change": string,
  "average_volume": string,
  "is_market_open": boolean,
  "fifty_two_week": {
    "low": string,
    "high": string,
    "low_change": string,
    "high_change": string,
    "low_change_percent": string,
    "high_change_percent": string,
    "range": string
  }
}

export async function getStockList(symbols: string[]): Promise<QuoteResponse[]> {
  const result = [];
  for (const symbol of symbols) {
    const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
    const body = await response.json();
    result.push(body);
  }
  return result;
}