import { defineCustomElements } from "@what3words/react-components";

import Autosuggest from "./components/Autosuggest";

import "./App.css";

defineCustomElements(window);

function App() {
  return (
    <>
      <h2>what3words Autosuggest Component - React Vite</h2>
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          console.log({ target: e.target });
        }}
      >
        <div className="form-container">
          <Autosuggest api_key=""></Autosuggest>
        </div>
        <button type="submit" data-testid="submit">
          Complete
        </button>
      </form>
    </>
  );
}

export default App;
