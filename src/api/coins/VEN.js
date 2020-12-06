const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'VEN',
    name: 'VeChain',
    color: '#5f9ee8',
    contract_address: '0xD850942eF8811f2A866692A623011bDE52a462C1',
    labels: 'VeChain ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    custom: true,
    networks_availables: [MAINNET]
})
