import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QuoteResponse, getStockList } from "../../api/getStockList";
import { useSubscribeToStocks } from "../../api/useSubscribeToStocks";
import { MOST_POPULAR_STOCKS } from "../../constants";
import styles from "./styles.module.css";
import { StockPrice } from "../../components/StockPrice/StockPrice";
import { Loader } from "../../components/Loader/Loader";

type Asset = QuoteResponse & { price?: string };

const AssetList = () => {
	const [assets, setAssets] = useState<Asset[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAssets = async () => {
			const assets = await getStockList(MOST_POPULAR_STOCKS);
			setAssets(assets);
			setIsLoading(false);
		};
		fetchAssets();
	}, []);

	useSubscribeToStocks(MOST_POPULAR_STOCKS, (message) => {
		setAssets((prevAssets) =>
			prevAssets.map((asset) =>
				asset.symbol === message.symbol
					? { ...asset, price: message.price }
					: asset
			)
		);
	});

	return (
		<div className={styles.container}>
			<h1>Most popular stocks today</h1>
			<ul>
				{isLoading && <Loader />}
				{!isLoading && assets.filter((a) => a.symbol).length === 0 && (
					<h3>No data received; most likely you're out of API quota</h3>
				)}
				{assets
					.filter((a) => a.symbol)
					.map((asset) => (
						<li key={asset.symbol}>
							<Link to={`/asset/${asset.symbol}`}>
								{asset.name} ({asset.symbol}),{" "}
								<StockPrice
									price={asset.price ?? asset.close}
									currency={asset.currency}
								/>{" "}
								| 52 week range {asset.fifty_two_week?.range}
							</Link>
						</li>
					))}
			</ul>
		</div>
	);
};

export default AssetList;
