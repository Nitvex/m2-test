import { renderHook, act } from '@testing-library/react';
import { useSubscribeToStocks } from '../useSubscribeToStocks';

// Mock WebSocket
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  onopen: () => void = () => {};
  onmessage: (event: MessageEvent) => void = () => {};
  onclose: () => void = () => {};
  send: (data: string) => void = jest.fn();
  close: () => void = jest.fn();

  constructor(url: string) {
    MockWebSocket.instances.push(this);
  }

  static clearInstances() {
    MockWebSocket.instances = [];
  }
}

global.WebSocket = MockWebSocket as any;

describe('useSubscribeToStocks', () => {
  beforeEach(() => {
    MockWebSocket.clearInstances();
    jest.clearAllMocks();
  });

  it('should create a WebSocket connection and subscribe to symbols', () => {
    const symbols = ['AAPL', 'GOOGL'];
    const callback = jest.fn();

    renderHook(() => useSubscribeToStocks(symbols, callback));

    expect(MockWebSocket.instances).toHaveLength(1);
    const instance = MockWebSocket.instances[0];
    
    act(() => {
      instance.onopen();
    });

    expect(instance.send).toHaveBeenCalledWith(
      JSON.stringify({
        action: 'subscribe',
        params: { symbols: symbols.join() },
      })
    );
  });

  it('should call the callback when a price message is received', () => {
    const symbols = ['AAPL', 'GOOGL'];
    const callback = jest.fn();
    renderHook(() => useSubscribeToStocks(symbols, callback));

    const instance = MockWebSocket.instances[0];

    act(() => {
      instance.onopen();
    });

    const message = {
      symbol: 'AAPL',
      price: '150.00',
      event: 'price',
    };

    act(() => {
      instance.onmessage({ data: JSON.stringify(message) } as MessageEvent);
    });

    expect(callback).toHaveBeenCalledWith(message);
  });

  it('should close the WebSocket connection on cleanup', () => {
    const symbols = ['AAPL', 'GOOGL'];
    const callback = jest.fn();
    const { unmount } = renderHook(() => useSubscribeToStocks(symbols, callback));

    const instance = MockWebSocket.instances[0];

    unmount();

    expect(instance.close).toHaveBeenCalled();
  });
});
