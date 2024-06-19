import { useEffect } from "react";
import { API_KEY } from "../constants";

interface PriceChangeMessage {
  symbol: string;
  price: string;
  event: string;
}

export function useSubscribeToStocks(symbols: string[], callback: (asset: PriceChangeMessage) => void) {
  useEffect(() => {
    const ws = new WebSocket(
      `wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`
    );

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: "subscribe",
          params: { symbols: symbols.join() },
        })
      );
    };

    ws.onmessage = (event) => {
      const message: PriceChangeMessage = JSON.parse(event.data);
      if (message.event === "price") {
        callback(message);
      }
    };

    return () => {
      ws.close();
    };
  }, [symbols, callback]);
}