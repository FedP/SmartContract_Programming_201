const Wallet = artifacts.require("Wallet");

module.exports = function (deployer) {
  deployer.deploy(Wallet, ["0xbc33db0b8adbfdb74401af3d49a4ddc257bbdc0f","0x7c2013a76bd83f3aacd1d3e8d46ceb90314c98eb","0x1129ee4cd30aae369512f07bd9c376f834ff724e"], 2);
};
