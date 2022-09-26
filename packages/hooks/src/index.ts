import { useRef, useEffect, useCallback } from 'react';
import { BroadcastChannel, BroadcastChannelOptions } from 'broadcast-channel';

export interface UseBroadcastChannelOptions<T> {
  channelName: string;
  broadcastChannelOptions?: BroadcastChannelOptions;
  onMessage: (message: T) => void;
}

export function useBroadcastChannel<T>(options: UseBroadcastChannelOptions<T>) {
  const broadcastChannelRef = useRef<BroadcastChannel<T> | null>(null);
  const mountedRef = useRef<boolean>(false);

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

  const createChannel = useCallback((options: UseBroadcastChannelOptions<T>) => {
    const { channelName, broadcastChannelOptions, onMessage } = options;
    const customIDBOnClose = broadcastChannelOptions?.idb?.onclose;

    let channel: BroadcastChannel<T>;
    channel = new BroadcastChannel<T>(channelName, {
      ...options,
      idb: {
        ...broadcastChannelOptions?.idb,
        onclose: () => {
          close();
          createChannel(options);
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
      onMessage(message);
    };

    channel.onmessage = handleMessage;
    broadcastChannelRef.current = channel;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    createChannel(options);

    return () => {
      mountedRef.current = false;
      close();
    };
  }, [options]);

  return { postMessage: handlePostMessage };
}
