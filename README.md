# UniqueTxId

A lightweight, customizable script to generate unique, non-colliding transaction
ID values.

## Prerequesites

This project requires the following components to be installed and available:
- git
- npm (v4.x+, use --harmony for v4)

## Installation

```zsh
# Clone the repository
git clone git@github.com:akhale3/uniqueTxId.git

# Switch to cloned directory
cd uniqueTxId

# Install dependencies
npm install
```

## Usage

```js
// Require the module
var UniqueTxId = require('uniqueTxId');

// Instantiate with default options
var u = new UniqueTxId();

// Or, instantiate with overriding options
var u = new UniqueTxId({
  cardCount: 1000000,
  cardBin: '123456',
  cardSalt: 'salty!'
});

// Generate transaction ID
console.log(u.generateTxId()); // Output -> 7da5b173cd-000000-0000000000
console.log(u.generateTxId()); // Output -> 7da5b173cd-000000-0000000001
// ...
```

## Options

The following options are recognized by the constructor:

| Name           | Type   | Description                           | Default Value |
|----------------|--------|---------------------------------------|---------------|
| cardCount      | Number | Number of cards to be generated       | 1             |
| cardLength     | Number | Number of digits in a card number     | 16            |
| cardBin        | String | Card BIN                              | 888888        |
| cardSalt       | String | Card Salt                             | salt          |
| cardHashLength | Number | Length of card hash in Transaction ID | 10            |
| stanLength     | Number | Length of STAN in Transaction ID      | 6             |
| rrnLength      | Number | Length of RRN in Transaction ID       | 10            |
