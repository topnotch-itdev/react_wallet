const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'MDZA',
    name: 'MDZA',
    color: '#3bc02c',
    contract_address: '0x8B12D44651c552854ba54f9a3Fc49FFb395113d9',
    labels: 'MEDOZA ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
