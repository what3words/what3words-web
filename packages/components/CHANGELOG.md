# what3words components

## 5.0.1 - 20-05-2025

### Fixed

- Fixes cypress autosuggestOptions fixture
- Resolved header parsing bug in `what3words-autosuggest` and `what3words-map` components with a type-guard
- Sanitize workspaces

## 5.0.0 - 05-03-2025

### Added

- Document external builder configuration
- Document framework usage examples
- Automatically update version and package references in component `README`s at build time
- Annotate component `README`s with `Last Updated` and `Version` meta tags
- (autosuggest) Add an autosuggestion validity check
- (notes) Add default function param values

### Changed

- Updated `StencilJS` dependency: ^3.0.0 to ^4.19.2
- Updated `Angular` wrapper core dependency: ^15.2.0 to ^18.0.0
- Improved internal typing
- Rename the following private variables:
  - `request` -> `apiRequestTimeout`
- (autosuggest) Makes default `null` component props optional instead
- (autosuggest) Renames component state variables for better readability
- (autosuggest) Guard against `lat` and `lng` `NaN` errors when `autosuggest_focus` is not provided
- (autosuggest) Guard against invalid bounds when `clip_to_bounding_box` is not provided
- (autosuggest) Guard against invalid bounds when `clip_to_circle` is not provided
- (autosuggest) Guard against missing elements and emits the following new errors:
  - `Input element not found`
- (autosuggest) Rename the following private methods:
  - `getRawInput` -> `getRawValue`
- (map) Make all unintialized props optional
- (map) Auto-default state variables to `null`
- (map) Fix types and internal logic
  - Uses error object properties to distinguish between TransportError and ErrorEvent instances
  - Simplifies default language logic
- (map) Silently fail if no `mapDiv` is found on initialization

### Fixed

- Reduced package sizes
  - `@what3words/javascript-components`
    `previous`: 6 dependencies for a weight of 128.7kB (38.9kB gzipped)
    `current`: 5 dependencies for a weight of 95.01KB (29.39KB gzipped)
- Improved bundling and lazy loading
  - Custom elements can be imported directly from the `@what3words/javascript-components` package for more deterministic integration patterns
    - e.g. `@what3words/javascript-components/components/what3words-autosuggest.js`

### Removed

- Legacy browser support is not guaranteed
- Remove barrel imports in favour of aliased path imports
- Remove unnecessary async/await calls and return statements in the following contexts:

  - Public and private methods
  - setTimeouts

- (map) Remove unnecessary e2e tests
