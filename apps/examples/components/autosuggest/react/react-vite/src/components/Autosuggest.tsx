import { useEffect, useState } from "react";
import { load } from "@what3words/javascript-loader";

import { What3wordsAutosuggest } from "@what3words/react-components";

export function Autosuggest(props: Record<string, string>) {
  const [value, setValue] = useState("");
  const [attributes, setAttributes] = useState({ ...props });

  useEffect(() => {
    const attributes = load({
      lazy: true,
    });
    const populatedAttributes: Record<string, string> = {};
    Object.keys(attributes.autosuggest).forEach((key) => {
      if (attributes.autosuggest[key].length) {
        populatedAttributes[key] = attributes.autosuggest[key];
      }
    });
    setAttributes(populatedAttributes);
  }, []);

  return (
    <div className="form-field">
      <label htmlFor="w3w-as-input">what3words address (optional):</label>
      <What3wordsAutosuggest {...attributes}>
        <input
          type="text"
          id="w3w-as-input"
          name="w3w-as-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for your business"
          autoComplete="off"
        />
      </What3wordsAutosuggest>
    </div>
  );
}

export default Autosuggest;
