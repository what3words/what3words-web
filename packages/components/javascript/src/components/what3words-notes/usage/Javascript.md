#### What3Words Notes Component

##### Installation

###### CDN

```html
<head>
  <script
    type="module"
    defer
    src="https://cdn.what3words.com/javascript-components@<PACKAGE-VERSION>/dist/what3words/what3words.esm.js"
  ></script>
  <script
    nomodule
    defer
    src="https://cdn.what3words.com/javascript-components@<PACKAGE-VERSION>/dist/what3words/what3words.js"
  ></script>
  ...
</head>
...
```

###### NPM

```bash
npm install @what3words/javascript-components@<PACKAGE-VERSION>
```

##### Usage

###### Input Slot - Text Area Element

```html
<body>
  <what3words-notes api-key="<W3W-API-KEY>">
    <label slot="label" for="delivery-notes">Delivery Notes</label>
    <textarea
      slot="input"
      name="delivery-notes"
      placeholder="Type delivery instructions with your what3words address"
    ></textarea>
  </what3words-notes>
</body>
```

###### Input Slot - Input Element

```html
<what3words-notes api-key="<YOUR-API-KEY>">
  <label slot="label" for="delivery-notes">Delivery Notes</label>
  <input
    slot="input"
    type="text"
    name="delivery-notes"
    placeholder="Type delivery instructions with your what3words address"
    autocomplete="off"
  />
</what3words-notes>
```

###### Tooltip Slot

```html
<body>
  <what3words-notes api-key="<W3W-API-KEY>">
    <label slot="label" for="delivery-notes">Delivery Notes</label>
    <textarea
      slot="input"
      name="delivery-notes"
      placeholder="Type delivery instructions with your what3words address"
      autocomplete="off"
    ></textarea>
    <div slot="tooltip">
      <h3>Did you know?</h3>
      <p>
        You can add a
        <a
          href="https://delivery.w3w.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          what3words
        </a>
        address to help our delivery partners find you first time
        <br />
        e.g. ///limit.boom.field
      </p>
    </div>
  </what3words-notes>
</body>
```
