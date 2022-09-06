import './styles/common.scss';

import { useState } from 'react';
import { useBroadcastChannel } from '@use-broadcast-channel/hooks';

const App = () => {
  const [count, setCount] = useState(0);
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
    <div className='wrapper'>
      <h1>Counter</h1>
      <div>
        <div>Current count: {count}</div>
        <div>
          <button className='btn btn-primary' onClick={handleClick}>
            Count
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
