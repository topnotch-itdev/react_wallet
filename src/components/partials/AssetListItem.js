import React, { Component } from 'react'
import Modal from 'react-modal'
import { createObserver } from 'dop'
import styled from 'styled-components'
import { Coins } from '/api/coins'
import { round } from '/api/numbers'
import styles from '/const/styles'
import { routes } from '/store/router'
import { Fiats } from '/api/fiats'
import state from '/store/state'
import { setHref } from '/store/actions'
import {
    isAssetWithPrivateKeyOrSeed,
    convertBalance,
    formatCurrency,
    getAssetId,
    getLabelOrAddress,
    getParamsFromLocation,
    getSymbolByAssetId
} from '/store/getters'
import AssetItem from '/components/styled/AssetItem'
import ModalCreate from '../views/Modals'


export default class Asset extends Component {
    componentWillMount() {
        this.observe(this.props.asset)
        this.observer.observe(state, 'modalIsOpen')

        this.state.modalIsOpen = false
        // binding
        this.onClick = this.onClick.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.asset !== nextProps.asset) {
            this.observer.destroy()
            this.observe(nextProps.asset)
            return true
        }
        return false
    }

    observe(asset) {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location, 'pathname')
        this.observer.observe(state.prices)
        this.observer.observe(state.assets)
        this.observer.observe(asset, 'label')
        this.observer.observe(asset, 'balance')
    }

    onClick() {
        const assetId = getAssetId(this.props.asset)
        setHref(routes.asset({ asset_id: assetId }))
    }

    render() {
        const asset = this.props.asset
        const { asset_id } = getParamsFromLocation()
        const Coin = Coins[asset.symbol]
        const assetId = getAssetId(asset)
        const coinLabel = asset.label == '' ? asset.symbol : asset.label
        // console.log( 'Render', convertBalance(asset.symbol, asset.balance) )
        return React.createElement(AssetTemplate, {
            asset: this.props.asset,
            asset_id: asset_id,
            location: state.location,
            balance_currency: formatCurrency(
                convertBalance(asset.symbol, asset.balance)
            ),
            logo: Coin.logo,
            balance_asset: Coin.format(asset.balance, 5),
            onClick: this.onClick,
            modal: this.state.modalIsOpen,
            isPrivateKeyOrSeed: isAssetWithPrivateKeyOrSeed(assetId),
            isValid: this.state.isValid,
            label: coinLabel
        })
    }
}

function AssetTemplate({
    asset,
    asset_id,
    location,
    balance_currency,
    balance_asset,
    logo,
    onClick,
    label
}) {
    return (
        <div>
            <AssetStyled
                onClick={onClick}
                selected={asset_id === getAssetId(asset)}
            >
                <AssetItem
                    logo={logo}
                    label={label}
                    balance={
                        <span>
                            <strong>{balance_currency}</strong> ≈ {balance_asset}
                        </span>
                    }
                />
            </AssetStyled>
            
        </div>
    )
}

const AssetStyled = styled.div`
    color: ${styles.color.front3};
    border-bottom: 1px solid ${styles.color.background4};
    cursor: pointer;
    & > div:hover {
        border-left-color: ${styles.color.background2};
    }
    & > div {
        padding: 15px 15px;
        border-left: 5px solid transparent;
    }

    ${props => {
        if (props.selected) {
            return `
        cursor: inherit;
        background: ${styles.color.background1};
        & > div {
            border-left-color: ${styles.color.background2};
        }
        `
        }
    }};
`

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};
