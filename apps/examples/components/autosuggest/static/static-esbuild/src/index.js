function main() {
  what3words.loader.load({
    script: {
      url: "http://localhost:3000/dist/javascript-components",
      version: process.env.VERSION,
    },
  });

  document.querySelector("what3words-autosuggest").addEventListener(
    "selected_suggestion",
    ({
      detail: {
        suggestion: { words },
      },
    }) => {
      console.log({ selectedSuggestion: words });
    }
  );
}

main();
