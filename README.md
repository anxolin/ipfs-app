# Decentralised To do dApp
Simple decentralised **To do** list App.

## Demo
* https://hungry-hugle-fe27e9.netlify.com/
  * Last version. Deployed in Netlify
* http://todo.angelrf.eth
  * Fully decentralized
  * Requires [Metamask](https://metamask.io) or any other ENS resolver
  * IPFS hash: https://ipfs.infura.io/ipfs/QmYmWRUpHkvZ4JTjwxf4P2EtFkQdxLeNJdYoooRKc4WqqK 

## Features
* **Data stored in IPFS**:
  * The app data model is stored in IPFS.
  * It's a basic JSON file
  * The model is upgradable for possible future versions
  * The same logic can be applied to any app, the **To do** is just a proof of
    concept
* **Blockchain backed IPFS Hash**
  * It uses a **Ethereum smart contract** to keeps track of the IPFS hash per user
    (`Ethereum Account`).
* **No login and secure**
  * You only need to have an **Ethereum Account** to create a todo list, so no
    login required
  * Your account is protected with your private key so nobody can alter it.
* **History**
  * The smart contract keeps track of all the other versions of the **To do**
    for every user
  * You could reconstruct the history or revert to previous versions
* **Concurrence protection**
  * Optimistic updates for concurrency within the same user
  * When a user updates the data, it send the number of the version of it that
    is modifying. The transaction is reverted if the data was updated to a
    different version.
* **Fully decentralised dApp**:
  * It generate plain static files
  * It can be published in any server or in **IPFS**
  * If deployed in `IPFS` the content can be referenced using **ENS**
* **Simple and reusable**
  * The core is a general porpoise and small smart contract and the IPFS logic
    that can be reused for any app.

## Run it locally
```bash
# Install dependencies
npm install

# Run it
npm run start
```

Open http://localhost:3000 in a browser. **IMPORTANT** you should have an
Ethereum Wallet like https://metamask.io.

## Generate static files
```bash
npm run build
```

## Development

## Configure solc compiler
The project uses solc docker config, so you need to have it in your system:

```bash
# Download the solc compiler
docker pull ethereum/solc:0.4.25
```

> Check the list of Docker compilers:
> `npx truffle compile --list docker`

To use another version of the compiler, or use `solcjs` you can edit
[./truffle.js](./truffle.js) file:

```bash
# Get List of all version of solcjs
npx truffle compile --list releases --all
```

## Compile contracts and restore network addresses
The deployed contract addresses are stored in [networks.json](networks.json).

To restore the addresses you need to compile the contracts and inject the
network addresses.

For convenience, it can be done using:
```bash
npm run restore
```

## More info
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

More info in [create_react_app.md](./create_react_app.md)
