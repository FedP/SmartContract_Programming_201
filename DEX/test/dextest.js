
// The user must have ETH deposited such that deposited ETH >= buy order value
const Dex = artifacts.require("Dex")
const Link = artifacts.require("Link")
const truffleAssert = require("truffle-assertions");

contract.skip("Dex", accounts => {
    //The user must have ETH deposited such that deposited eth >= buy order value
    it("should throw an error if ETH balance is too low when creating BUY limit order", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.reverts(
            dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 10, 1)
        )
        dex.depositEth({value: 10})
        await truffleAssert.passes(
            dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 10, 1)
        )
    })
// The user must have enough tokens deposited such that token balance >= sell order amount
    it("should throw an error if token balance is too low when create SELL limit order", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()

        await truffleAssert.reverts(
            dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"),10,1)
        )
        await link.approve(dex.address, 500);
        await dex.addToken(web3.utils.fromUtf8("LINK"),link.address, {from: accounts[0]})
        await dex.deposit(10, web3.utils.fromUtf8("LINK"));
        await truffleAssert.passes(
            dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"),10,1)
        )
    })
// The first order ([0]) in the BUY order book should have the highest price
    it("The BUY order book should be put in a ascending order. The bigger first.", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 500);
        await dex.depositEth({value: 3000});
        await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 300)
        await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 100)
        await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 200)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0);
        assert(orderbook.length > 0);
        console.log(orderbook);
        for (let i = 0; i < orderbook.length - 1; i++) {
            assert(orderbook[i].price >= orderbook[i+1].price, "Not right order in the buy book!")
        }
    })
    // The first order ([0]) in the SELL order book should have the lowest price
    it("The SELL order book should be put in a ascending order. The smaller first.", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 500);
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 300)
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 100)
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 200)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
        assert(orderbook.length > 0);
        console.log(orderbook);
        for (let i = 0; i < orderbook.length - 1; i++) {
            assert(orderbook[i].price <= orderbook[i+1].price, "Not right order in the sell book!")
        }
    })
})

