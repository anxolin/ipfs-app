import bs58 from 'bs58';

// See https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js

/**
 * @typedef {Object} Multihash
 * @property {string} hash The hash output of hash function in hex with prepended '0x'
 * @property {number} hashFunction The hash function code for the function used
 * @property {number} size The length of hash
 */

/**
 * Partition multihash string into object representing multihash
 *
 * @param {string} multihash A base58 encoded multihash string
 * @returns {Multihash}
 */
function getBytes32FromMultiash (multihash) {
  const decoded = bs58.decode(multihash);

  return {
    hashFunction: decoded[0],
    size: decoded[1],
    hash: `0x${decoded.slice(2).toString('hex')}`
  };
}

/**
 * Encode a multihash structure into base58 encoded multihash string
 *
 * @param {Multihash} multihash
 * @returns {(string|null)} base58 encoded multihash string
 */
function getMultihashFromBytes32 (multihash) {
  const { hash, hashFunction, size } = multihash;
  if (size === 0) return null;

  // cut off leading "0x"
  const hashBytes = Buffer.from(hash.slice(2), 'hex');

  // prepend hashFunction and hash size
  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
  multihashBytes[0] = hashFunction;
  multihashBytes[1] = size;
  multihashBytes.set(hashBytes, 2);

  return bs58.encode(multihashBytes);
}

/**
 * Parse Solidity response in array to a Multihash object
 *
 * @param {array} response Response array from Solidity
 * @returns {Multihash} multihash object
 */
function parseContractResponse (response) {
  const [ hash, hashFunction, size ] = response;
  return {
    hashFunction: hashFunction.toNumber(),
    size: size.toNumber(),
    hash
  };
}

/**
 * Parse Solidity response in array to a base58 encoded multihash string
 *
 * @param {array} response Response array from Solidity
 * @returns {string} base58 encoded multihash string
 */
function getMultihashFromContractResponse (response) {
  return getMultihashFromBytes32(parseContractResponse(response));
}

const multihash = {
  getBytes32FromMultiash,
  getMultihashFromBytes32,
  parseContractResponse,
  getMultihashFromContractResponse
}
window.app = {
  ...window.app,
  multihash
}
export default multihash