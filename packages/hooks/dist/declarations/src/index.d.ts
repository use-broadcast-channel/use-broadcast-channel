import { BroadcastChannelOptions } from 'broadcast-channel';
export interface UseBroadcastChannelOptions<T> {
    channelName: string;
    broadcastChannelOptions?: BroadcastChannelOptions;
    /** @default true */
    unmountAutoClose?: boolean;
    onMessage: (message: T) => void;
}
export declare function useBroadcastChannel<T>(options: UseBroadcastChannelOptions<T>): {
    postMessage: (message: T) => void;
};
