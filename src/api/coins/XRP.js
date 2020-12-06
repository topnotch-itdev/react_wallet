const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'XRP',
    name: 'Ripple',
    color: '#3a79d8',
    contract_address: '0x6Fe1909b3F8077A2852de71615c5281243Bb6f51',
    labels: 'Ripple ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
