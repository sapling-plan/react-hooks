import {renderHook} from '@testing-library/react-hooks';
import {useTimeout, useInterval, useStableInterval} from '../index';

const timeout = time => new Promise(resolve => setTimeout(resolve, time));

const sleep = time => {
    const start = Date.now();
    // eslint-disable-next-line no-empty
    while (Date.now() - start < time) {
    }
};

describe('useTimeout', () => {
    test('executes after time', async () => {
        const fn = jest.fn();
        renderHook(() => useTimeout(fn, 4));
        await timeout(5);
        expect(fn).toHaveBeenCalled();
    });

    test('do nothing if time is negative', async () => {
        const fn = jest.fn();
        renderHook(() => useTimeout(fn, -1));
        await timeout(5);
        expect(fn).not.toHaveBeenCalled();
    });

    test('works when callback is undefined', async () => {
        renderHook(() => useTimeout(undefined, 4));
        await timeout(5);
    });
});

describe('useInterval', () => {
    test('executes every time', async () => {
        const fn = jest.fn();
        renderHook(() => useInterval(fn, 4));
        await timeout(10);
        expect(fn).toHaveBeenCalledTimes(2);
    });

    test('do nothing if time is negative', async () => {
        const fn = jest.fn();
        renderHook(() => useInterval(fn, -1));
        await timeout(5);
        expect(fn).not.toHaveBeenCalled();
    });

    test('works when callback is undefined', async () => {
        renderHook(() => useInterval(undefined, 4));
        await timeout(5);
    });
});

describe('useStableInterval', () => {
    test('adjust callback ellapsed time', async () => {
        const fn = jest.fn(() => sleep(10));
        renderHook(() => useStableInterval(fn, 4));
        await timeout(10);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('adjust async resolve time', async () => {
        const fn = jest.fn(() => timeout(8));
        renderHook(() => useStableInterval(fn, 4));
        await timeout(10);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('do nothing if time is negative', async () => {
        const fn = jest.fn();
        renderHook(() => useStableInterval(fn, -1));
        await timeout(5);
        expect(fn).not.toHaveBeenCalled();
    });

    test('works when callback is undefined', async () => {
        renderHook(() => useStableInterval(undefined, 4));
        await timeout(5);
    });
});

