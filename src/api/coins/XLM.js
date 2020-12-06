const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'XLM',
    name: 'Stellar',
    color: '#cf8027',
    contract_address: '0x8F1aEfcDFf0aFE6CE86B688C92312111983594F4',
    labels: 'Stellar ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
