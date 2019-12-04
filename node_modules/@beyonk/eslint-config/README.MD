<p align="center">
  <img width="186" height="90" src="https://user-images.githubusercontent.com/218949/44782765-377e7c80-ab80-11e8-9dd8-fce0e37c235b.png" alt="Beyonk" />
</p>

## ESLint configuration

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/beyonk-adventures/eslint-config.svg?style=shield)](https://circleci.com/gh/beyonk-adventures/eslint-config)

This is essentially a fork of [the eslint-config I made](https://github.com/appliedblockchain/eslint-config/) whilst at Applied Blockchain, but adapted to have Node and Svelte linting, rather than Node and React.

It is based on `standard` with a few minor tweaks for neatness.

## Contributing

Want to add an eslint rule? Open a PR and use gh-polls for voting: https://app.gh-polls.com/

## Usage

Installation:

```bash
npm i -D eslint @beyonk/eslint-config
```

### Node Modules

In your project's package.json, use the shorthand syntax

```json
  "eslintConfig": {
    "extends": "@beyonk"
  }
```

### Svelte Components

In your project's package.json, use the shorthand syntax

```json
  "eslintConfig": {
    "extends": "@beyonk/eslint-config/svelte"
  }
```

## Linting

This project self-lints:

```bash
npm i
npm run lint
```

## Releasing

To release a new version, check out the code on your local machine, then:

```bash
npm version minor
git push && git push --tags
```

Where `minor` is a sensible default for rule changes which will impact existing projects.
