import { defineCustomElements } from "@what3words/react-components";
import Map from "./components/Map";
import "./App.css";

defineCustomElements(window);

function App() {
  return (
    <div className="App">
      <h2>what3words Map Component - React Vite</h2>
      <Map map_api_key="" api_key="" />
    </div>
  );
}

export default App;
