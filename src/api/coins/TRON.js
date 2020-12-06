const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'TRX',
    name: 'TRON',
    color: '#000000',
    contract_address: '0x0259aF45Cb3dA7C621bE2aA2E94b6B594E1507c9',
    labels: 'TRON ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
