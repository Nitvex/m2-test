import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AssetList from '../AssetList';
import { getStockList } from '../../../api/getStockList';
import { useSubscribeToStocks } from '../../../api/useSubscribeToStocks';

jest.mock('../../../api/getStockList');
jest.mock('../../../api/useSubscribeToStocks');

const mockGetStockList = getStockList as jest.MockedFunction<typeof getStockList>;
const mockUseSubscribeToStocks = useSubscribeToStocks as jest.MockedFunction<typeof useSubscribeToStocks>;

const mockAssets = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    mic_code: 'XNAS',
    currency: 'USD',
    datetime: '2023-06-15',
    timestamp: 1623777600,
    open: '130.00',
    high: '135.00',
    low: '128.00',
    close: '134.00',
    volume: '75000000',
    previous_close: '129.00',
    change: '5.00',
    percent_change: '3.88',
    average_volume: '80000000',
    is_market_open: false,
    fifty_two_week: {
      low: '103.00',
      high: '145.00',
      low_change: '31.00',
      high_change: '-11.00',
      low_change_percent: '30.10',
      high_change_percent: '-7.59',
      range: '103.00 - 145.00'
    }
  },
];

mockGetStockList.mockResolvedValue(mockAssets);

describe("AssetList", () => {
	it("renders the list of assets and subscribes to price updates", async () => {
		render(
			<MemoryRouter>
				<AssetList />
			</MemoryRouter>
		);

		await waitFor(() => {
			mockAssets.forEach((asset) => {
				const elements = screen.getAllByText((content, element) => {
					return (
						element?.textContent ===
						`${asset.name} (${asset.symbol}), ${asset.close} ${asset.currency} | 52 week range ${asset.fifty_two_week.range}`
					);
				});
				expect(elements.length).toBeGreaterThan(0);
			});
		});

		// Simulate a price update
		const priceChangeMessage = {
			symbol: "AAPL",
			price: "150.00",
			event: "price",
		};
		const callback = mockUseSubscribeToStocks.mock.calls[0][1];
		act(() => {
			callback(priceChangeMessage);
		});

		await waitFor(() => {
			const elements = screen.getAllByText((content, element) => {
				return element?.textContent?.includes("150.00 USD");
			});
			expect(elements.length).toBeGreaterThan(0);
		});
	});

	it("renders 52 week range correctly", async () => {
		render(
			<MemoryRouter>
				<AssetList />
			</MemoryRouter>
		);

		await waitFor(() => {
			mockAssets.forEach((asset) => {
				const elements = screen.getAllByText((content, element) => {
					return element?.textContent?.includes(
						`52 week range ${asset.fifty_two_week.range}`
					);
				});
				expect(elements.length).toBeGreaterThan(0);
			});
		});
	});
});