import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [melding, setMelding] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((json) => setMelding(json.message));
  });

  return (
    <div className="App">
      <p>Meldingen er: {melding}</p>
    </div>
  );
}

export default App;
