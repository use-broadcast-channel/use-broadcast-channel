# useBroadcastChannel

React hooks for [pubkey/broadcast-channel](https://github.com/pubkey/broadcast-channel)

```sh
npm i @use-broadcast-channel/hooks broadcast-channel
```

## Preview

![dsiTtXln0r](https://user-images.githubusercontent.com/16166356/189964534-3d552b6f-c9f7-477f-8e96-9291ee8a7111.gif)

## Usage

```tsx
import { useState } from 'react';
import { useBroadcastChannel } from '@use-broadcast-channel/hooks';

const App = () => {
  const [count, setCount] = useState<number>(0);
  const { postMessage } = useBroadcastChannel<number>({
    channelName: 'test-app',
    onMessage: (message) => {
      setCount(message);
    },
  });

  const handleClick = () => {
    setCount((prev) => {
      const next = prev + 1;
      postMessage(next);
      return next;
    });
  };

  return (
    <div>
      <h1>Counter</h1>
      <div>
        <div>Current count: {count}</div>
        <div>
          <button onClick={handleClick}>Count</button>
        </div>
      </div>
    </div>
  );
};

export default App;
```

## Examples

- [Counter](https://codesandbox.io/s/github/use-broadcast-channel/use-broadcast-channel/tree/main/examples/counter)
