/* eslint no-console: "off" */
const HDWalletProvider = require('truffle-hdwallet-provider');
const assert = require('assert');

const DEFAULT_GAS_PRICE_GWEI = 5;
// const GAS_LIMIT = 6.5e6;
const DEFAULT_MNEMONIC = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';

function truffleConfig ({
  mnemonic = process.env.MNEMONIC || DEFAULT_MNEMONIC,
  gasPriceGWei = DEFAULT_GAS_PRICE_GWEI,
  // gas = GAS_LIMIT,
  optimizedEnabled = true,
  urlRinkeby = 'https://rinkeby.infura.io',
  urlMainnet = 'https://mainnet.infura.io',
  urlKovan = 'https://kovan.infura.io',
  urlDevelopment = 'localhost',
  portDevelopment = 8545
} = {}) {
  assert(mnemonic, 'The mnemonic has not been provided');
  // console.log(`Using gas limit: ${gas / 1000} K`);
  console.log(`Using gas price: ${gasPriceGWei} Gwei`);
  console.log(`Optimizer enabled: ${optimizedEnabled}`);
  console.log('Using default mnemonic: %s', mnemonic === DEFAULT_MNEMONIC);
  const gasPrice = gasPriceGWei * 1e9;

  const _getProvider = url => {
    return () => new HDWalletProvider(mnemonic, url);
  };

  return {
    networks: {
      development: {
        host: urlDevelopment,
        port: portDevelopment,
        // gas,
        gasPrice,
        network_id: '*'
      },
      mainnet: {
        provider: _getProvider(urlMainnet),
        network_id: '1',
        // gas,
        gasPrice
      },
      rinkeby: {
        provider: _getProvider(urlRinkeby),
        network_id: '4',
        // gas,
        gasPrice
      },
      kovan: {
        provider: _getProvider(urlKovan),
        network_id: '42',
        // gas,
        gasPrice
      }
    },
    compilers: {
      solc: {
        version: "0.4.25",   // Any published image name
        docker: true,
        settings: {
          optimizer: {
            enabled: false, // Default: false
            runs: 200
          },
          evmVersion: "byzantium"  // Default: "byzantium". Others:  "homestead", ...
        }
      }
    }
  };
}

module.exports = truffleConfig({
  optimizedEnabled: true
});
