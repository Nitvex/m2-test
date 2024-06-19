import { API_KEY } from '../../constants';
import { QuoteResponse, getStockList } from '../getStockList';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ }),
  })
) as jest.Mock;

beforeEach(() => {
  fetch.mockClear();
});

describe('getStockList', () => {
  it('should call the correct API endpoint for each symbol', async () => {
    const symbols = ['AAPL', 'GOOGL'];
    await getStockList(symbols);

    expect(fetch).toHaveBeenCalledTimes(symbols.length);
    symbols.forEach((symbol, index) => {
      expect(fetch).toHaveBeenNthCalledWith(
        index + 1,
        `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`
      );
    });
  });

  it('should return data from the API for each symbol', async () => {
    const mockData: QuoteResponse = {
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
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    ).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );

    const symbols = ['AAPL', 'GOOGL'];
    const data = await getStockList(symbols);

    expect(data).toEqual([mockData, mockData]);
  });
});
