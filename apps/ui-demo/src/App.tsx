import { SubscribeButton } from '@polkabill/react';
import { useBalance, useConnection } from 'wagmi';
import './App.css';

function App() {
  const { address , chain} = useConnection();
  const { data } = useBalance({
    chainId: chain?.id,
    address,
  });
  console.log({ address, chain, data });

  return (
    <div>
      <h1>Polkabill SDK Demo (By User)</h1>

      <div>
        <SubscribeButton planId={1} />
      </div>
    </div>
  );
}

export default App;
