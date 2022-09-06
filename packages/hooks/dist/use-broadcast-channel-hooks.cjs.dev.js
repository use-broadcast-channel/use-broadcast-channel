'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var broadcastChannel = require('broadcast-channel');

function useBroadcastChannel(options) {
  var broadcastChannelRef = react.useRef(null);
  var handlePostMessage = react.useCallback(function (message) {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage(message);
    }
  }, []);
  react.useEffect(function () {
    var channelName = options.channelName,
        broadcastChannelOptions = options.broadcastChannelOptions,
        _options$unmountAutoC = options.unmountAutoClose,
        unmountAutoClose = _options$unmountAutoC === void 0 ? true : _options$unmountAutoC,
        onMessage = options.onMessage;
    var mounted = true;
    var channel = new broadcastChannel.BroadcastChannel(channelName, broadcastChannelOptions);
    broadcastChannelRef.current = channel;

    var handler = function handler(message) {
      if (!mounted) return;
      onMessage(message);
    };

    channel.addEventListener('message', handler);
    return function () {
      channel.removeEventListener('message', handler);
      mounted = false;
      broadcastChannelRef.current = null;

      if (unmountAutoClose) {
        channel.close();
      }
    };
  }, [options]);
  return {
    postMessage: handlePostMessage
  };
}

exports.useBroadcastChannel = useBroadcastChannel;
