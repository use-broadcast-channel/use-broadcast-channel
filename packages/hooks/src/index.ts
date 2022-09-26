import { useRef, useEffect, useCallback } from 'react';
import { BroadcastChannel, BroadcastChannelOptions } from 'broadcast-channel';

export interface UseBroadcastChannelOptions<T> {
  channelName: string;
  broadcastChannelOptions?: BroadcastChannelOptions;
  onMessage: (message: T) => void;
}

export function useBroadcastChannel<T>(options: UseBroadcastChannelOptions<T>) {
  const broadcastChannelRef = useRef<BroadcastChannel<T> | null>(null);

  const handlePostMessage = useCallback((message: T) => {
    if (broadcastChannelRef.current && broadcastChannelRef.current.isClosed !== true) {
      broadcastChannelRef.current.postMessage(message);
    }
  }, []);

  useEffect(() => {
    const { channelName, broadcastChannelOptions, onMessage } = options;

    let mounted = true;
    const channel = new BroadcastChannel<T>(channelName, broadcastChannelOptions);
    broadcastChannelRef.current = channel;

    const handler = (message: T) => {
      if (!mounted) return;
      onMessage(message);
    };

    channel.onmessage = handler;

    return () => {
      mounted = false;
      broadcastChannelRef.current = null;
      channel.close();
    };
  }, [options]);

  return { postMessage: handlePostMessage };
}
