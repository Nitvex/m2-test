import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface StockPriceProps {
	currency: string;
	price: string;
}

export function StockPrice({ currency, price }: StockPriceProps) {
	const [oldPrice, setOldPrice] = useState(Number(price));
	const formattedPrice = Number(price).toFixed(2);
	const [currentStyle, setCurrentStyle] = useState<string>('');

	useEffect(() => {
		const newPrice = Number(price);
		if (newPrice > oldPrice) {
			setCurrentStyle(styles.increased);
		} else if (newPrice < oldPrice) {
			setCurrentStyle(styles.decreased);
		}
		setOldPrice(newPrice);
    setTimeout(() => setCurrentStyle(''), 700);
	}, [price]);

	return (
		<span className={currentStyle}>
			{formattedPrice} {currency}
		</span>
	);
}
