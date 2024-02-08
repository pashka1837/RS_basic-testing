// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const relativePath = 'todos/1';
  const baseURL = 'https://jsonplaceholder.typicode.com';
  const response = {
    data: 'hello',
  };

  test('should create instance with provided base url', async () => {
    const axiosClient = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axiosClient).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    axios.create = jest.fn(() => axios);
    axios.get = jest.fn().mockResolvedValue(response);

    await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    axios.create = jest.fn(() => axios);
    axios.get = jest.fn().mockResolvedValue(response);

    jest.advanceTimersByTime(THROTTLE_TIME);
    await expect(throttledGetDataFromApi(relativePath)).resolves.toBe(
      response.data,
    );
  });
});
