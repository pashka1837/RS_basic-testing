// Uncomment the code below and write your tests
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    const interval = 200;
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(cb, interval);
    expect(setTimeout).toHaveBeenCalledWith(cb, interval);
  });

  test('should call callback only after timeout', () => {
    const interval = 200;
    const cb = jest.fn();
    doStuffByTimeout(cb, interval);

    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(interval);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    const interval = 100;
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(cb, interval);
    expect(setInterval).toHaveBeenCalledWith(cb, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    const interval = 100;
    const timeFrame = 200;
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(cb, interval);

    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeFrame);
    expect(cb).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'C:/';
    path.join = jest.fn();
    await readFileAsynchronously(pathToFile);
    expect(path.join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'C:/';
    fs.existsSync = jest.fn(() => false);
    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'C:/';
    const myString = 'Hello user';
    fs.existsSync = jest.fn(() => true);
    const readF = jest.spyOn(fsPromises, 'readFile');
    readF.mockResolvedValue(myString);
    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(myString);
  });
});
