import { API_KEY } from '../../constants';
import { getHistoricalInfo } from '../getHistoricalInfo';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ }),
  })
) as jest.Mock;

beforeEach(() => {
  fetch.mockClear();
});

describe('getHistoricalInfo', () => {
  it('should call the correct API endpoint with the provided symbol', async () => {
    const symbol = 'AAPL';
    await getHistoricalInfo(symbol);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${API_KEY}`
    );
  });

  it('should return data from the API', async () => {
    const mockData = { values: [{ datetime: '2023-06-15', close: '150.00' }] };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );

    const symbol = 'AAPL';
    const data = await getHistoricalInfo(symbol);

    expect(data).toEqual(mockData);
  });
});
