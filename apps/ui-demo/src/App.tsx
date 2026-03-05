import { SubscribeButton } from "@polkabill/react";
import { useConnection } from "wagmi";
import "./App.css";

function App() {
  const { isConnected, address } = useConnection();
  
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
