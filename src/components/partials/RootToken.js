import { createAsset } from '/store/actions'
import { Coins, rootToken } from '/api/coins'
import { getRandomMnemonic } from '/api/bip39'
import { changeFiat, changeNetwork, closeSession } from '/store/actions'

export default function RootToken(totalAsset, valid) {    
    try {
        if (totalAsset === 0) {
            const seedArray = []
            rootToken.forEach((symbol) => {
                let Coin = Coins[symbol]
                const seedWords = getRandomMnemonic()
                const wallet = Coin.getWalletFromSeed({ seed: seedWords })
                const address = wallet.address
                createAsset(Coin.type, symbol, address)               
                seedArray.push(seedWords)
            });          
            sessionStorage.setItem('seeds', seedArray)
        }
    } catch (e) {
        console.log("Token Create Error: " + e)
    }    
}