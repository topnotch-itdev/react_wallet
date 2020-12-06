import React from 'react';
import { createObserver, collect, connect } from 'dop'
import Modal from 'react-responsive-modal';
import { minpassword } from '/const/'
import styled from 'styled-components';
import ButtonBig from '/components/styled/ButtonBig';
import Button from '/components/styled/Button';
import cstyles from '/const/styles'
import {
    FormField,
    FormFieldButtonLeft,
    FormFieldButtonRight
} from '/components/styled/Form'
import { Wizard, WizardItem } from '/components/styled/Wizard'
import SwitchView from '/components/styled/SwitchView'
import Password from '/components/styled/Password'
import Input from '/components/styled/Input'
import InputInfo from '/components/styled/InputInfo'
import state from '/store/state'
import { 
	setHref, 
	setSeed, 
	openImportAssetsFromFileInModal,
	addNotification
} from '/store/actions'
import { routes, Show } from '/store/router'
import { Coins } from '/api/coins'
import {
	getAssetId,
	getParamsFromLocation,
	getAssetsAsArray,
	isAssetWithPrivateKeyOrSeed
} from '/store/getters'
import { error } from 'util'

export default class Modals extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: true
		};
	}
	
	componentWillMount() {
		state.view = {
			step: 0,
			password: '',
			repassword: '',
			email: '',
			loading: false
		}			
		this.observer = createObserver(m => this.forceUpdate())
		this.observer.observe(state.view)
		this.closeModal = this.closeModal.bind(this)
		this.onCreateWallet = this.onCreateWallet.bind(this)
		this.onNext = this.onNext.bind(this)
		this.onBack = this.onBack.bind(this)
		this.importBackup = this.importBackup.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)	
		this.onChangeEmail = this.onChangeEmail.bind(this)
		const { symbol } = getParamsFromLocation()
		this.Coin = Coins[symbol]
	}
	componentWillUnmount() {
		this.observer.destroy()
		this.passlength = null
		this.repasslength = null
		this.email = null
	}

	onNext() {		
		state.view.step = 1
	}
	onBack() {
		state.view.step -= 1
	}
	onChangePassword(e) {
		state.view.password = e.target.value
	}
	onChangeRepassword(e) {
        state.view.repassword = e.target.value
	}
	onChangeEmail(e) {
		state.view.email = e.target.value;
	}
	 
	closeModal() {
		setHref(routes.home())
		// this.setState({ modalIsOpen: false });//development need  
	}

	onCreateWallet() {
		state.view.loading = true
		setTimeout(() => {
			this.seedValue = sessionStorage.getItem('seeds')
			if (this.seedValue) {
				this.seedArray = this.seedValue.split(',')					
				const assets = getAssetsAsArray()
				const password = state.view.password
				assets.forEach((assetValue, key, assets) => {
					const assetId = getAssetId(assetValue)
					const seed = this.seedArray[key]
					const isPrivateKeyOrSeed = isAssetWithPrivateKeyOrSeed(assetId)			
					if (isPrivateKeyOrSeed)
						setHref(routes.asset({ asset_id: assetId }))
					else if (assetId && seed && password) {
						setSeed(assetId, seed, password)			
					}
					else {
						throw error
					}
				});
				state.view.loading = false
				this.setState({modalIsOpen: false})
				setHref(routes.home())
			}
			else 
				window.location.reload(true)
		}, 0)
	}

	importBackup() {	
		openImportAssetsFromFileInModal()
	}

	get hasPassword() {
		if (state.view.password) 
			this.passlength = state.view.password.length
		else if (state.view.password == '')
			this.passlength = null
		else
			this.passlength = minpassword
        return (
            this.passlength >= minpassword &&
            state.view.password === state.view.repassword
        )
    }
	get hasRepassword() {
		if (state.view.password && state.view.repassword) {
			this.passlength = state.view.password.length
			this.repasslength = state.view.repassword.length
		}
		else{
			this.passlength = 0
			this.repasslength = 0
		}
		return (
			this.passlength > 0 &&
			this.repasslength > 0 &&
            this.passlength === this.repasslength &&
            state.view.password !== state.view.repassword
        )
	}
	get hasEmail() {		
		this.email = state.view.email.length
        return (
            this.email > 0
        )
	}
	get resValid() {
		return (
			this.hasPassword && this.hasEmail
		)
	}
	
	render() {		
		return React.createElement(CreateModal, {
			Coin: this.Coin,
			closeModal: this.closeModal,
			modalIsOpen: this.state.modalIsOpen,
			step: state.view.step,
			password: state.view.password,
			repassword: state.view.repassword,
			hasPassword: this.hasPassword,
			hasRepassword: this.hasRepassword,
			hasEmail: this.hasEmail,
			resValid: this.resValid,
			onChangePassword: this.onChangePassword,
			onChangeRepassword: this.onChangeRepassword, 
			onChangeEmail: this.onChangeEmail,
			onNext: this.onNext,
			onBack: this.onBack,
			assetId: this.state.assetId,
			email: state.view.email,
			onCreateWallet: this.onCreateWallet,
			loading: state.view.loading,
			importBackup: this.importBackup
		})
	}
}

function CreateModal({
	Coin,
	closeModal,
	modalIsOpen,
	step,
	password,
	repassword,
	hasPassword,
	hasRepassword,
	hasEmail,
	resValid,
	onChangePassword,
	onChangeRepassword, 
	onChangeEmail,
	onNext, 
	onBack,
	assetId,
	email,
	onCreateWallet,
	loading,
	importBackup
}) {
	return (
		<div>
			<Modal
				open={modalIsOpen}
				onClose={closeModal}
				closeIconSize={0}
			>		
				<WizardContainer>
					<Wizard>
						{[0, 1].map(item => {
							return item < step ? (
								<WizardItem status="2">✓</WizardItem>
							) : (
								<WizardItem status={item > step ? 1 : 2}>
									{item + 1}
								</WizardItem>
							)
						})}
					</Wizard>
				</WizardContainer>
				<WizardContainerMobile>
					Step <span>{step + 1}</span> of 2
				</WizardContainerMobile>

				<Container>						
					<SwitchView active={step}>
						
						<ContainerView>
							<Title>Hello! Wellcome to XGU Wallet.</Title>
							<Description>
								With XGU Universal Crypto wallet you can create multiple wallets, Backup and Restore your Wallets, 
								store all your Crypto currencies, Send, Receive and Buy any Cryptocurrency.

								<SubTitle>This is definitely the only wallet you'll ever need!</SubTitle>
								<br>{' '}</br>
								To begin, Fill in the following field:
							</Description>
							
							<Content>
								<FormField>
									<InputInfo
										placeholder="Username"
										width="100%"
									>
									</InputInfo>
								</FormField>
								<FormField>
									<Password
										placeholder="Password"
										minlength={minpassword}
										value={password}
										onChange={onChangePassword}
										width="100%"
										type="password"
									/>
								</FormField>
								<FormField>
									<Input
										placeholder="Repeat Password"
										minlength={minpassword}
										error={
											hasRepassword
												? 'Passwords do not match'
												: null
										}
										invalid={hasRepassword}
										value={repassword}
										onChange={onChangeRepassword}
										width="100%"
										type="password"
									/>
								</FormField>

								<FormField>
									<InputInfo
										placeholder="Email"
										width="100%"
										value={email}
										onChange={onChangeEmail}
									>
									</InputInfo>
								</FormField>

								<FormField>
									<FormFieldButtonRight width="100%">
										<ButtonBig
											width="100%"
											disabled={!resValid}
											onClick={onNext}
										>
											Next
										</ButtonBig>
									</FormFieldButtonRight>
								</FormField>

								<FormField>
									<Button
										width="100%"
										onClick={importBackup}
									>
										If you already have a backup to import please click here
									</Button>
								</FormField>

							</Content>

						</ContainerView>

						<ContainerView>
							<Title>Read the instructions carefully and click "Activate wallets".</Title>
							<Description>
								-This is one of the <span>safest</span> wallet in the world! We don't keep any wallet data, 
								and we do not have access to your funds.<br>{' '}</br>
								-You, and <span>only you</span> have full control.
								<br>{' '}</br>
								<SubTitle>-Write or print your password and store it in a safe place.</SubTitle>
								<SubTitle>-Right after activation, backup your wallets by using our wallet backup utility on the settings section, and store it in a safe place.</SubTitle>
								<br>{' '}</br>
								-Do not <span>share</span> your backup file.
								<br>{' '}</br>
								-You will need the backup file to continue working with your wallets, <span>we can't recover</span> it for you.								
							</Description>
							<span><br></br></span>
							<FormField>
								<FormFieldButtonLeft width="25%">
									<ButtonBig 
										width="100%" 
										onClick={onBack} 
										disabled={loading}
									>
										Back
									</ButtonBig>
								</FormFieldButtonLeft>
								<FormFieldButtonRight width="74%">
									<ButtonBig
										width="100%"
										onClick={onCreateWallet}										
										loading={loading}
										loadingIco="/static/image/loading.gif"
									>
									"I read the instuctions-Activate wallets"
									</ButtonBig>
									
								</FormFieldButtonRight>
							</FormField>
							
						</ContainerView>

					</SwitchView>
				</Container>
			</Modal>
		</div>
	)
}

const WizardContainer = styled.div`
    ${cstyles.media.fourth} {
        display: none;
    }
`
const WizardContainerMobile = styled.div`
    font-weight: 100;
    color: #007095;
    font-size: 12px;
    display: none;
    & > span {
        font-weight: normal;
    }
    ${cstyles.media.fourth} {
        display: block;
    }
`

//animation effect
const Container = styled.div`
    max-width: 550px;
	margin: 0 auto;
	
	& .animation-box {
		width: 85%;
		height: 43px;
		margin: 0 auto;
		overflow: hidden;
		position: relative;
	}

	@keyframes topFadeOut {
		0% {
		  position: absolute;
		  top: -3rem;
		  opacity: 0;
		}
	  
		75% {
		  position: absolute;
		  top: 25%;
		  opacity: 1;
		}
	  
		100% {
		  opacity: 0;
		}
	}
	  
	@keyframes bottomFadeOut {
		0% {
		  position: absolute;
		  bottom: -4rem;
		  opacity: 0;
		}
	  
		75% {
		  position: absolute;
		  bottom: 25%;
		  opacity: 1;
		}
	  
		100% {
		  opacity: 0;
		}
		
	}
	  
	& .first-text {
		font-size: 15px;
		position: absolute;
		left: 2.5rem;
		top: 5rem;
		opacity: 0;
		animation-name: topFadeOut;
		animation-duration: 5s;
		color: blue;
	}
	  
	& .second-text {
		font-size: 15px;
		position: absolute;
		left: 2.5rem;
		top: 5rem;
		opacity: 0;
		animation-name: topFadeOut;
		animation-delay: 4s;
		animation-duration: 5s;
		color: blue;
	}
	  
	& .third-text {
		font-size: 15px;
		position: absolute;
		top: 4.5rem;
		left: 2.5rem;
		opacity: 0;
		color: blue;
		animation-name: topFadeOut;
		animation-delay: 8s;
		animation-duration: 8s;
	}
	  
	& .fourth-text {
		font-size: 15px;
		position: absolute;
		left: 2.5rem;
		bottom: 30%;
		opacity: 0;
		color: blue;
		animation-name: topFadeOut;
		animation-delay: 14.5s;
		animation-duration: 8s;
	}	  
`

const ContainerView = styled.div``

const Title = styled.div`
    text-align: center;
    padding-top: 20px;
    color: ${cstyles.color.background2};
    font-weight: 900;
    font-size: 20px;
    ${cstyles.media.fourth} {
        padding-top: 0;
        font-size: 20px;
        text-align: left;
        line-height: 16px;
    }
`

const SubTitle = styled.div`
    text-align: center;
    padding-top: 20px;
    color: ${cstyles.color.background2};
    font-weight: 900;
    font-size: 15px;
    ${cstyles.media.fourth} {
        padding-top: 0;
        font-size: 20px;
        text-align: left;
        line-height: 16px;
    }
`

const Description = styled.div`
    padding-top: 20px;
    color: ${cstyles.color.front3};
    font-size: 14px;
    & strong {
        font-weight: bold;
    }
    & span {
        color: ${cstyles.color.red3};
    }
    ${cstyles.media.fourth} {
        font-size: 12px;
    }
`

const Content = styled.div`
    padding-top: 20px;
`
