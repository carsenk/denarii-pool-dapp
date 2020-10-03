[![Twitter Follow](https://img.shields.io/twitter/follow/DenariiToken.svg?label=denariitoken&style=social)](https://twitter.com/DenariiToken)

# ARI Rewards Dashboard

This is a fork of Mintr for the Denarii Wallet liquidity and incentives programme.

This is the code for the new Synthetix Mintr dApp: https://mintr.synthetix.io.

The dApp communicates with the [Synthetix contracts](https://developer.synthetix.io/api/docs/deployed-contracts.html), allowing users to perform the following actions:

- Mint (aka Issue) `sUSD` by locking `SNX`
- Claim rewards of both `SNX` (inflation) and `sUSD` (exchange fees) every week
- Burn `sUSD` to unlock `SNX`
- Transfer `SNX` to other accounts
- Deposit (or withdrawl) `sUSD` into the `Depot` contract, to go in the queue for exchanging with `ETH` at current market price

Mintr v2 supports the following wallet providers:

- Metamask
- Trezor
- Ledger
- Coinbase Wallet

![mintrv2](https://user-images.githubusercontent.com/799038/67426237-aa7a5c00-f5a7-11e9-96a6-1d721f3c58ba.gif)

---

> Note: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
