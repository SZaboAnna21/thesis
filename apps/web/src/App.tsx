import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
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