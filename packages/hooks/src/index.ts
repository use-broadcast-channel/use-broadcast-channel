import { useRef, useEffect, useCallback } from 'react';
import { BroadcastChannel, BroadcastChannelOptions } from 'broadcast-channel';

export interface UseBroadcastChannelOptions extends Omit<BroadcastChannelOptions, 'node'> {}

export function useBroadcastChannel<T>(
  channelName: string,
  onMessage: (message: T) => void,
  options?: UseBroadcastChannelOptions,
) {
  const broadcastChannelRef = useRef<BroadcastChannel<T> | null>(null);
  const mountedRef = useRef<boolean>(false);
  const onMessageRef = useRef<((message: T) => void) | null>(null);

  const handlePostMessage = useCallback((message: T) => {
    if (broadcastChannelRef.current && broadcastChannelRef.current.isClosed !== true) {
      broadcastChannelRef.current.postMessage(message);
    }
  }, []);

  const close = () => {
    if (broadcastChannelRef.current && broadcastChannelRef.current.isClosed !== true) {
      broadcastChannelRef.current.close();
    }
    broadcastChannelRef.current = null;
  };

  const createChannel = useCallback((channelName: string, options: UseBroadcastChannelOptions = {}) => {
    const customIDBOnClose = options?.idb?.onclose;
    let channel: BroadcastChannel<T>;
    channel = new BroadcastChannel<T>(channelName, {
      ...options,
      idb: {
        ...options?.idb,
        onclose: () => {
          close();
          createChannel(channelName, options);
          if (customIDBOnClose) {
            customIDBOnClose();
          }
        },
      },
    });

    const handleMessage = (message: T) => {
      if (!mountedRef.current) {
        return;
      }
      onMessageRef.current?.(message);
    };

    channel.onmessage = handleMessage;
    broadcastChannelRef.current = channel;
  }, []);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    mountedRef.current = true;
    createChannel(channelName, options);

    return () => {
      mountedRef.current = false;
      close();
    };
  }, [channelName, options, createChannel]);

  return { postMessage: handlePostMessage };
}
