import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./styles.module.css";
import { getHistoricalInfo } from "../../api/getHistoricalInfo";
import { Loader } from "../../components/Loader/Loader";
import { useSubscribeToStocks } from "../../api/useSubscribeToStocks";
import { StockPrice } from "../../components/StockPrice/StockPrice";

interface ChartData {
	labels: string[];
	datasets: {
		label: string;
		data: string[];
		borderColor: string;
		fill: boolean;
	}[];
}

const AssetDetail = () => {
	const { symbol } = useParams();
	const [historicalData, setHistoricalData] = useState<ChartData>(
		{} as ChartData
	);
	const [currentPrice, setCurrentPrice] = useState('0');
	const [currency, setCurrency] = useState("");

	useEffect(() => {
		const fetchHistoricalData = async () => {
			if (!symbol) {
				return;
			}
			const data = await getHistoricalInfo(symbol);
			const chartValues = data.values.reverse();
			const chartData = {
				labels: chartValues.map((value) => value.datetime),
				datasets: [
					{
						label: `${symbol} Price`,
						data: chartValues.map((value) => value.close),
						borderColor: "rgba(75,192,192,1)",
						fill: false,
					},
				],
			};
			setCurrency(data.meta.currency);
			setHistoricalData(chartData);
			setCurrentPrice(chartValues.at(-1)?.close ?? "0");
		};
		fetchHistoricalData();
	}, [symbol]);

	useSubscribeToStocks([symbol!], (message) => {
		setCurrentPrice(message.price);
	});

	if (!symbol) {
		return <h1>No such ticker found</h1>
	}

	return (
		<div className={styles.container}>
			<h1>{symbol} Details</h1>
			{historicalData.labels && historicalData.datasets ? (
				<>
					<h2>
						Current price <StockPrice price={currentPrice} currency={currency} />
					</h2>
					<h2>Historical price trend</h2>
					<Line className={styles.chart} data={historicalData} />
				</>
			) : (
				<Loader />
			)}
			<Link className={styles.backToHome} to={`/`}>
				{"<"} Back to home
			</Link>
		</div>
	);
};

export default AssetDetail;
