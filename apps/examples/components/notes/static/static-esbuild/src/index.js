function main() {
  what3words.loader.load({
    script: {
      url: "http://localhost:3000/dist/javascript-components",
      version: process.env.VERSION,
    },
  });
}

main();
