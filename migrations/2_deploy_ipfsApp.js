/* global artifacts */
/* eslint no-undef: "error" */

const IpfsApp = artifacts.require('./IpfsApp.sol')

module.exports = (deployer) => {
  deployer.deploy (IpfsApp)
}
