import {localenv} from "./env"

function App() {
  return (
    <div className="app">
      <p className="text-info">{localenv.apiHostname}</p>
    </div>
  );
}

export default App;
