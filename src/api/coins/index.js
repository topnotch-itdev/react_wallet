const { localStorageGet } = require('../browser')
const { MAINNET, TESTNET, LOCALSTORAGE_NETWORK } = require('../../const/')

const Coins = {}
const list = [
    // 'MDZA',
    // 'BTC',
    'ETH',
    'XRP',
    'EOS',
    'XLM',
    'LTC',
    'OMG',
    // 'ADA',
    'TRON',
    'VEN',
    // 'BCH',
    'ANT',
    'ZRX',
    'QTUM',
    'TRX',
    'BNB',
    'MKR',
    'SNT',
    'REP',
    'SALT',
    'QASH',
    'BAT',
    'GNT',
    'ETHOS',
    'FUN',
    'REQ',
    'KNC',
    'DAI'
]

export const rootToken = [
    'ETH',
    // 'XRP',
    // 'EOS',
    // 'XLM',
    // 'LTC',
    // 'OMG',
    // 'TRON',
    // 'VEN'
]

exports.Coins = Coins

const network_id = Number(localStorageGet(LOCALSTORAGE_NETWORK)) || MAINNET

list.forEach(symbol => {
    const coin = require('./' + symbol)
    if (coin.setupNetwork(network_id, coin.networks)) {
        Coins[symbol] = coin
        exports[symbol] = coin
    }
})

// const CoinsCopy = Object.assign({}, Coins)
// delete CoinsCopy.Coins
// Coins.Coins = CoinsCopy
