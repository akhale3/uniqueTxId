'use strict';

// Transaction ID format:
// {cardHash}{10}-{STAN}(6)-{RRN}(10)
//
// Math:
// For a single card, i.e. constant cardHash, it is possible to generate
// 548,674,560,000 unique transaction ID values.
// 
// Assuming 3000 TPS for a single card with a 1 minute run, the number of
// unique transaction ID values required is
// 3000 * 60 = 180,000
// Well within the unique space.
//
// To ensure non-collisions among multiple cards, keep a dictionary of used
// transaction ID values as SHA256 hashes, and check the generated values
// against it.
//
// Parameters:
// options.cardCount - Number > 0 -> Number of cards to be generated
// options.cardLength - Number > 0 -> Number of digits in a card number
// options.cardBin - String -> Card BIN
// options.cardSalt - String -> Card Salt
// options.cardHashLength - Number > 0 -> Length of card hash in Transaction ID
// options.stanLength - Number > 0 -> Length of STAN in Transaction ID
// options.rrnLength - Number > 0 -> Length of RRN in Transaction ID

const crypto = require('crypto');
const assert = require('assert');

let UniqueTxId = function (options) {
  options = options || {};

  this.opts = Object.assign({
    cardCount: 1,
    cardLength: 16,
    cardBin: '888888',
    cardSalt: 'salt',
    cardHashLength: 10,
    stanLength: 6,
    rrnLength: 10
  }, options);

  this.dict = {
    cardsUsed: 0,
    txIdsGenerated: {}
  };
};

UniqueTxId.prototype.generateCardNumber = function () {
  if (this.opts.cardNumber === undefined) {
    this.opts.cardNumber = this.opts.cardBin.toString()
      + '0'.padStart(this.opts.cardLength - this.opts.cardBin.length, '0');
  } else {
    // Increment STAN by 1 once RRN space is used up
    if ((this.opts.rrn + 1) % Math.pow(10, this.opts.rrnLength) === 0
      && (this.opts.stan + 1) % Math.pow(10, this.opts.stanLength) === 0) {
      this.dict.cardsUsed = this.dict.cardsUsed + 1;

      if (this.dict.cardsUsed >= this.opts.cardCount) {
        assert.fail('No more unique transaction IDs available.');
      }

      this.opts.cardNumber = (parseInt(this.opts.cardNumber) + 1).toString();
    }
  }

  return this.opts.cardNumber;
};

UniqueTxId.prototype.generateCardHash = function () {
  const hash = crypto.createHash('sha256');
  hash.update(this.generateCardNumber() + this.opts.cardSalt);

  return hash.digest('hex').substring(0, this.opts.cardHashLength);
};

UniqueTxId.prototype.generateStan = function () {
  if (this.opts.stan === undefined) {
    this.opts.stan = 0;
  } else {
    // Increment STAN by 1 once RRN space is used up
    if ((this.opts.rrn + 1) % Math.pow(10, this.opts.rrnLength) === 0) {
      this.opts.stan = (this.opts.stan + 1) % Math.pow(10, this.opts.stanLength);
    }
  }

  return this.opts.stan.toString().padStart(this.opts.stanLength, '0');
};

UniqueTxId.prototype.generateRrn = function () {
  if (this.opts.rrn === undefined) {
    this.opts.rrn = 0;
  } else {
    this.opts.rrn = (this.opts.rrn + 1) % Math.pow(10, this.opts.rrnLength);
  }

  return this.opts.rrn.toString().padStart(this.opts.rrnLength, '0');
};

UniqueTxId.prototype.generateTxId = function () {
  let txId = this.generateCardHash()
   + '-' + this.generateStan()
   + '-' + this.generateRrn();

  if (this.dict.txIdsGenerated[txId]) {
    txId = this.generateTxId();
  }

  this.dict.txIdsGenerated[txId] = true;

  return txId;
};

module.exports = UniqueTxId;
