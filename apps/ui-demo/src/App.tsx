import { SubscribeButton } from "@polkabill/react";
import "./App.css";

function App() {
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
