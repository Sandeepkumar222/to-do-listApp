import React from "react";
import "./App.css";
import Home from "./components/Home";
import About from "./components/About";
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/about" component={About} exact />
    </div>
  );
}

export default App;
