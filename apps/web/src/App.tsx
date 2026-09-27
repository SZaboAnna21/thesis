import './App.css'
import { hello } from "@automata-lab/automata-core";

function App() {
  return (
    <div>
      <h1>{hello()}</h1>
    </div>
  );
}

export default App;