import { defineStore, acceptHMRUpdate } from 'pinia'
import { getMvcBalance, getBtcBalance, getRates, getAllInfoByMetaId, getBtcAddressByMnemonic } from '@/lib/api'
import Decimal from 'decimal.js-light'
import localImage from '/assets/image/avatar_defualt.png'
import { toRaw } from 'vue'

export const useStore = defineStore('root', {
  state: () => {
    return {
      spaceUsdBalance: 0,
      spaceBalance: 0,
      btcUsdBalance: 0,
      btcBalance: 0,
      spaceRates: null,
      btcRates: null,
      currentNet: 'Mainnet',
      mvcTestWalletInfo: {},
      mvcMainWalletInfo: {},
      btcMainWalletInfo: {},
      btcTestWalletInfo: {},
      currentWalletAddress: '',
      currentWalletPrivateKey: '',
      mnemonicWord: '',
      mainnetUserInfo: { email: '', enCryptedMnemonic: '', name: '', register: '', tag: '', token: '', metaId: '', phone: '', path: '' },
      testnetUserInfo: { email: '', enCryptedMnemonic: '', name: '', register: '', tag: '', token: '', metaId: '', phone: '', path: '' },
      isAuthenticated: false,

      currentMvcWalletAddress: '',
      currentMvcWalletPrivateKey: '',

      currentBtcWalletAddress: '',
      currentBtcWalletPrivateKey: '',

      // baseAvator:localImage
      // mainnetUserInfo:{},
      // testnetUserInfo:{}
      wallet: null,
      metaletLogin: Boolean(Number(localStorage.getItem('useMetaletLogin'))) || Boolean(0),



      currentShowWallet: 'MVC',

      currentBtcAddressType: 'Same as MVC'
    }
  },
  getters: {

    showWallet: state => {
      if (state.metaletLogin) {
        return (state.wallet ? toRaw(state.wallet) : state.wallet)
      }
      return (state.wallet ? toRaw(state.wallet) : state.wallet)
    },

  },

  actions: {
    getSpaceUsdBalance(address) {
      const resBalance = new Promise((resolve, reject) => {
        getMvcBalance(address).then(res => {
          resolve(new Decimal(res.confirmed + res.unconfirmed).div(10 ** 8).toNumber())
        }).catch(err => {
          reject(err)
        })
      })
      const resRates = new Promise((resolve, reject) => {
        getRates().then(res => {
          // resolve(res.result.rates[0].price.USD)
          resolve(res.data.priceInfo.space)
        }).catch(err => {
          reject(err)
        })
      })
      Promise.all([resBalance, resRates]).then(res => {
        console.log(res)
        this.spaceRates = res[1];
        this.spaceBalance = res[0];
        this.spaceUsdBalance = parseFloat(this.spaceBalance * parseFloat(this.spaceRates)).toFixed(2)
      }).catch(err => {

      })
    },

    getBtcUsdBalance(params) {
      const resBalance = new Promise((resolve, reject) => {
        getBtcBalance(params).then(res => {
          resolve(res.data.balance)
          // resolve(new Decimal(res.balance).div(10 ** 8).toNumber())
        }).catch(err => {
          reject(err)
        })
      })
      const resRates = new Promise((resolve, reject) => {
        getRates().then(res => {
          resolve(res.data.priceInfo.btc)
        }).catch(err => {
          reject(err)
        })
      })
      Promise.all([resBalance, resRates]).then(res => {
        this.btcRates = res[1];
        this.btcBalance = res[0];
        this.btcUsdBalance = parseFloat(this.btcBalance * parseFloat(this.btcRates)).toFixed(2)
      }).catch(err => {

      })
    },
    setCurrentNetWork(netWork) {
      this.currentNet = netWork
      if (netWork === 'Mainnet') {
        // this.currentWalletAddress = this.mvcMainWalletInfo.mvcAddress
        // this.currentWalletPrivateKey = this.mvcMainWalletInfo.privateKey

        this.currentMvcWalletAddress = this.mvcMainWalletInfo.mvcAddress
        this.currentMvcWalletPrivateKey = this.mvcMainWalletInfo.privateKey
        this.currentBtcWalletAddress = this.btcMainWalletInfo.btcAddress
        this.currentBtcWalletPrivateKey = this.btcMainWalletInfo.privateKey

      } else {
        // this.currentWalletAddress = this.mvcTestWalletInfo.mvcAddress
        // this.currentWalletPrivateKey = this.mvcTestWalletInfo.privateKey
        this.currentMvcWalletAddress = this.mvcTestWalletInfo.mvcAddress
        this.currentMvcWalletPrivateKey = this.mvcTestWalletInfo.privateKey
        this.currentBtcWalletAddress = this.btcTestWalletInfo.btcAddress
        this.currentBtcWalletPrivateKey = this.btcTestWalletInfo.btcPrivateKey
        // this.userInfo = {}
        // getTestnetUserInfo()
        // getTestMetaIdByAddress()
        // getTestAllInfoByMetaId()
      }
    },
    changeAuthenticated() {
      this.isAuthenticated = true
    },
    getId(id) {
      this.mainnetUserInfo.metaId = id
    },
    tabWallet(walletType) {
      if (walletType == 'MVC') {
        this.currentShowWallet = 'MVC'
      } else {
        this.currentShowWallet = 'BTC'
      }
    },
    tabBtcAddressType(type) {

      if (type == 'Native Segwit') {
        this.currentBtcAddressType = 'Native Segwit'
      } else if (type == 'Nested Segwit') {
        this.currentBtcAddressType = 'Nested Segwit'
      } else if (type == 'Taproot') {
        this.currentBtcAddressType = 'Taproot'
      } else if (type == 'Legacy') {
        this.currentBtcAddressType = 'Legacy'
      } else if (type == 'Same as MVC') {
        this.currentBtcAddressType = 'Same as MVC'
      }
      const btcMainWalletInfo = getBtcAddressByMnemonic('livenet', this.mnemonicWord, this.currentBtcAddressType)
      const btcTestWalletInfo = getBtcAddressByMnemonic('testnet', this.mnemonicWord, this.currentBtcAddressType)

      this.btcMainWalletInfo = btcMainWalletInfo
      this.btcTestWalletInfo = btcTestWalletInfo

      if (this.currentNet == 'Mainnet') {
        this.currentBtcWalletAddress = btcMainWalletInfo.btcAddress
        this.currentBtcWalletPrivateKey = btcMainWalletInfo.btcPrivateKey
      }else{
        this.currentBtcWalletAddress = btcTestWalletInfo.btcAddress
        this.currentBtcWalletPrivateKey = btcTestWalletInfo.btcPrivateKey
      }
      console.log(btcMainWalletInfo)
      console.log(btcTestWalletInfo)
    }

  },
  persist: true,
})
// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
// }

