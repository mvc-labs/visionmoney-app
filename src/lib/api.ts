import mvc from 'mvc-lib'
import HttpRequest from '@/lib/request'
// @ts-ignore
import qs from 'qs'
import { useQuery } from '@tanstack/vue-query'
// @ts-ignore
import { Message } from 'mvc-lib'
import CryptoES from 'crypto-es'
// const { bsv } = require("scryptlib");
import { Utf8 } from 'crypto-es/lib/core.js'
// @ts-ignore
import { AES } from 'crypto-es/lib/aes.js'
// @ts-ignore
import { CBC, Pkcs7 } from 'crypto-es/lib/cipher-core.js'
// @ts-ignore
import { MD5 } from 'crypto-es/lib/md5.js'
// @ts-ignore
import { SHA256 } from 'crypto-es/lib/sha256.js'
// @ts-ignore
import * as bip39 from 'bip39'
import Ripemd128 from 'ripemd128-js/ripemd128.js'
import { englishWords } from './english'
import { Session } from './session'
import { Chains, HdWalletChain, IsEncrypt, Network, NodeName, WalletTxVersion } from './enum'
import ShowmoneyProvider from './showmoney-provider'
import * as ECIES_ from 'mvc-lib/ecies'
import { BtcWallet } from '@metalet/utxo-wallet-sdk'
const ECIES = ECIES_;
// import * as useStore  from '@/store/index'
// 
// console.log(useStore)

// console.log(store)
import { useStore } from '@/store/index'




const env = import.meta.env
let mvcApi = new HttpRequest(env.VITE_MVC_API).request
let mvcApiTest = new HttpRequest(env.VITE_MVCTEST_API).request
let scanApi = new HttpRequest(env.VITE_SCAN_API).request
let showApi = new HttpRequest(env.VITE_SHOW_API).request
let oldBrowserApi = new HttpRequest(env.VITE_OLDBROWER_API).request
let showmoneyApi = new HttpRequest(env.VITE_SHOWMONEY_API).request
let showmoneyApiTest = new HttpRequest(env.VITE_SHOWMONEYTEST_API).request
let visionApi = new HttpRequest(env.VITE_VISIONMONEY_API).request
let metaletApi = new HttpRequest(env.VITE_METALET_API).request
let cyber3Api = new HttpRequest(env.VITE_CYBER3_API).request


export const Utxos = (params?: {
  page?: number
  pageSize?: number
  order?: string
}) => {
  return Dashbroad.get('/utxos', { params })
}



export const getBtcAddressByMnemonic = (network: any, mnemonic: string, type: any) => {
  const btcWallets = new BtcWallet({
    network,
    mnemonic,
    addressIndex: 0,
    addressType: type,
  })
  const thisAddress = btcWallets.getAddress()
  const thisPrivateKey = btcWallets.getPrivateKey()
  const thisPubKey = btcWallets.getPublicKey()

  const encipherPrivateKey = encryptPrivateKey(thisPrivateKey,thisPubKey)
  return { btcAddress: thisAddress, btcPrivateKey: encipherPrivateKey, btcPubKey: thisPubKey }
}


const Dashbroad = new HttpRequest(`https://api.show3.io/tool/api`, {
  header: () => {
    const userStore = useStore()
    if (userStore.isAuthorized) {
      return {
        accessKey: userStore.user?.token,
        userName: userStore.userName,
        timestamp: new Date().getTime(),
      }
    } else {
      return {}
    }
  },
  errorHandel: (error: any) => {
    if (error.response && error.response.data && error.response.data.message !== '') {
      return Promise.reject({
        code: error.response.data.statusCode,
        message: error.response.data.message,
      })
    } else {

      return Promise.reject(error)
    }
  },
}).request


const MetaIdBase = new HttpRequest(`https://api.show3.io/metaid-base`, {
  header: () => {
    const userStore = useStore()
    if (userStore.isAuthorized) {
      return {
        accessKey: userStore.user!.token,
        userName: userStore.userName!,
        timestamp: new Date().getTime(),
        metaId: userStore.user!.metaId,
      }
    } else {
      return {}
    }
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.msg,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const getMvcBalance = (address: string) => {
  const store = useStore()
  if (store.currentNet === 'Mainnet') {
    return mvcApi.get(`/address/${address}/balance`)
  } else {
    return mvcApiTest.get(`/address/${address}/balance`)
  }
}

export const getBtcBalance = (params: {
  net: string
  address: string
}) => {
  return visionApi.get(`/wallet-api/v3/address/btc-balance?net=${params.net}&address=${params.address}`)
}

export const getMvcFt = (address: string) => {
  const store = useStore()
  if (store.currentNet === 'Mainnet') {
    return scanApi.get(`/browser/v1/contract/ft/address/${address}/balance`)
  } else {
    return scanApi.get(`/browser/testnet/v1/contract/ft/address/${address}/balance`)
  }
}

export const getBtcFt = (params: {
  net: string
  address: string
}) => {
  return visionApi.get(`wallet-api/v3/brc20/tokens?net=${params.net}&address=${params.address}`)
}

// export const getFtBalance = (address: string) => {
//   return cyber3.get(`/address/${address}/balance`)
// }
export const getMvcTxHistory = async (params: {
  address: any
  limit: any
  flag?: any
  isConfirmed?: any
}) => {
  const store = useStore()
  if (store.currentNet === 'Mainnet') {
    if (params.isConfirmed == 1) {
      const Qs = qs.stringify({ limit: params.limit, flag: params.flag })

      const confirmed: any = mvcApi.get(`/address/${params.address}/tx?confirmed=true&${Qs}`)

      return confirmed

    } else {
      const Qs = qs.stringify({ limit: params.limit, flag: params.flag })

      const unconfirmed: any = mvcApi.get(`/address/${params.address}/tx?confirmed=false`)

      const confirmed: any = mvcApi.get(`/address/${params.address}/tx?confirmed=true&${Qs}`)

      const [unconfirmedActivities, confirmedActivities] = await Promise.all([unconfirmed, confirmed])

      return [...unconfirmedActivities, ...confirmedActivities]
    }


  } else {
    const Qs = qs.stringify({ limit: params.limit, flag: params.flag })

    const unconfirmed: any = mvcApiTest.get(`/address/${params.address}/tx?confirmed=false`)

    const confirmed: any = mvcApiTest.get(`/address/${params.address}/tx?confirmed=true&${Qs}`)

    const [unconfirmedActivities, confirmedActivities] = await Promise.all([unconfirmed, confirmed])

    return [...unconfirmedActivities, ...confirmedActivities]
  }
}

export const getBtcTxHistory = async (params: {
  address: any
  chain: any
  page: any
  limit: any
}) => {
  return visionApi.get(`/wallet-api/v3/address/activities?address=${params.address}&chain=${params.chain}&page=${params.page}&limit=${params.limit}`)
}
export const getRates = async () => {
  return visionApi.get(`/wallet-api/v3/coin/price`)
}

export const getMvcTokensRates = async () => {
  return visionApi.get(`/wallet-api/v3/coin/contract/ft/price`)
}

export const getBtcTokensRates = async (network) => {
  return visionApi.get(`/wallet-api/v3/coin/brc20/price?net=${network}`)
}


export const getRandomWord = async () => {
  return showApi.get(`/showpaycore/api/v1/mnemonic/getWord`)
}

// export const getNftAlbumsInfo = (address: string) => {
//   const store = useStore()
//   if (store.currentNet === 'Mainnet') {
//     return mvcApi.get(`/contract/nft/address/${address}/summary`)
//   } else {
//     return mvcApiTest.get(`/contract/nft/address/${address}/summary`)
//   }
// }

export const getSoloNftAlbums = (params: {
  net: string
  address: string
  codehash: string
  genesis: string
  size: any
  flag: string
}): Promise<any> => {
  const Qs = qs.stringify(params)
  return visionApi.get(`/wallet-api/v3/address/contract/nft/utxo?${Qs}`)
}


export const getMvcNftAlbumsInfo = (params: {
  address: string
  cursor: number
  size: number
  detailCount: any
  net: string
}): Promise<any> => {
  return visionApi.get(`/wallet-api/v3/address/contract/nft/summary?net=${params.net}&address=${params.address}&detailCount=3&cursor=${params.cursor}&size=${params.size}`)
}

export const getBtcOrdinalInfo = (params: {
  address: string
  cursor: number
  size: number
  net: string
}): Promise<any> => {
  return visionApi.get(`/wallet-api/v3/address/inscriptions?net=${params.net}&address=${params.address}&detailCount=3&cursor=${params.cursor}&size=${params.size}`)
}



export const getBtcOrdinalDetail = (params: {
  net: string
  inscriptionId: string
}): Promise<any> => {
  return visionApi.get(`/wallet-api/v3/inscription/utxo?net=${params.net}&inscriptionId=${params.inscriptionId}`)
}




export const getNftsMounts = (params: {
  net: string
  address: string
}) => {
  return visionApi.get(`/wallet-api/v3/address/contract/nft/count?net=${params.net}&address=${params.address}`)
}



export const getFtUtxos = (params: {
  address: string
  codeHash: string
  genesis: string
}) => {
  return cyber3Api.get(`/contract/ft/address/${params.address}/utxo?codeHash=${params.codeHash}&genesis=${params.genesis}`)
}


// export const getSaleNftAlbumsInfo = (address: string) => {
//   const store = useStore()
//   if (store.currentNet === 'Mainnet') {
//     return mvcApi.get(`/contract/nft/sell/address/${address}/utxo`)
//   } else {
//     return mvcApiTest.get(`/contract/nft/sell/address/${address}/utxo`)
//   }
// }

export const getSaleNftAlbumsInfo = (params: {
  net: string
  address: string
}) => {
  return visionApi.get(`/wallet-api/v3/address/contract/nft/sell/utxo?net=${params.net}&address=${params.address}`)
}

export const getMetaIdByAddress = (address: string) => {
  return showmoneyApi.get(`/aggregation/v2/app/user/metaId/${address}/address`)
}

export const getAllInfoByMetaId = (id: string) => {
  return showmoneyApi.get(`/aggregation/v2/app/user/getUserAllInfo/${id}`)
}


export const getTestMetaIdByAddress = (address: string) => {
  return showmoneyApiTest.get(`/aggregation/v2/app/user/metaId/${address}/address`)
}

export const getTestAllInfoByMetaId = (id) => {
  return showmoneyApiTest.get(`/aggregation/v2/app/user/getUserAllInfo/${id}`)
}

// export const getNftAlbumsInfo = (address: string) => {
//   const { isLoading, isError, isFetching, data, error } = useQuery({
//     queryKey: ["NftAlbums", address],
//     queryFn: () => {
//       return getAlbumByAddress(address);
//     },
//   });

//   return { isLoading, isError, isFetching, data, error };
// };

export const GetNftAlbumsChildren = (params) => {
  const store = useStore()
  if (store.currentNet === 'Mainnet') {
    return mvcApi.get(`/contract/nft/address/${params.address}/utxo?codeHash=${params.codeHash}&genesis=${params.genesis}`)
  } else {
    return mvcApiTest.get(`/contract/nft/address/${params.address}/utxo?codeHash=${params.codeHash}&genesis=${params.genesis}`)
  }
}

export const GetTxidForMetasv = async (tx: string, showScript?: boolean) => {
  const store = useStore()
  if (store.currentNet === 'Mainnet') {
    const queryStr = qs.stringify({ showScript: true })
    const res = await scanApi.get(`/browser/v1/chain/tx/${tx}?${queryStr}`, {})
    if (res.code == 0) return res.data
  } else {
    const queryStr = qs.stringify({ showScript: true })
    const res = await scanApi.get(`/browser/testnet/v1/chain/tx/${tx}?${queryStr}`, {})
    if (res.code == 0) return res.data
  }

}


export const decodeMvcToken = (params: { hex: string; type: string }) => {
  return oldBrowserApi.post(`/script-decoder/v1/mvc-browser/script-decoder`, params)
}

// export const TxFetcher = async (address) => {
//   const unconfirmed: any = mvcApi.get(`/address/${address}/tx?confirmed=false`)
//   const confirmed: any = mvcApi.get(`/address/${address}/tx?confirmed=true`)
//   const [unconfirmedActivities, confirmedActivities] = await Promise.all([unconfirmed, confirmed])

//   return [...unconfirmedActivities, ...confirmedActivities]
// }


export const GetTxChainInfo = (
  txId: string
) => {
  return MetaIdBase.get(`/v1/meta/${txId}/info/chain`)
}




export const hdWalletFromAccount = async (
  account: any,
  network: any,
  path: string
) => {
  // console.log(account)
  const loginName = account.userType === 'phone' ? account.phone : account.email
  const password = account.password

  // console.log('account', account)
  if (!loginName || !password) {
    throw new Error('参数错误')
  }
  let mnemonic: string
  if (account.enCryptedMnemonic) {
    mnemonic = decryptMnemonic(account.enCryptedMnemonic, password)
  } else {
  
    const ppBuffer = Buffer.from([loginName, password].join('/'))
    const ppHex = mvc.crypto.Hash.sha256(ppBuffer).toString('hex')
    let hex: string | Buffer
    if (account.tag === 'old') {
      hex = Buffer.from(ppHex + account.pk2)
      hex = mvc.crypto.Hash.sha256sha256(hex).toString('hex')
    } else {
      hex = Buffer.from((ppHex + account.pk2).toLowerCase(), 'hex').toString('hex')
      hex = Ripemd128(hex).toString()
    }
    mnemonic = bip39.entropyToMnemonic(hex, englishWords)
  }
  // const mnemonic = new Mnemonic(Buffer.from(hex)).toString()
  const wallet = await hdWalletFromMnemonic(mnemonic, network, path)

  const root = wallet.deriveChild(0).deriveChild(0).privateKey
  console.log({
    mnemonic: mnemonic,
    wallet: wallet,
    rootAddress: root.toAddress(network).toString(),
    rootWif: root.toString(),
    network,
  })
  return {
    mnemonic: mnemonic,
    wallet: wallet,
    rootAddress: root.toAddress(network).toString(),
    rootWif: root.toString(),
    network,
  }
}

export const hdWalletFromMnemonic = async (
  mnemonic: string,
  network: string,
  path?: string
) => {
  // const hdPrivateKey = Mnemonic.fromString(mnemonic).toHDPrivateKey()
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const hdPrivateKey = mvc.HDPrivateKey.fromSeed(seed, network)
  const hdWallet = hdPrivateKey.deriveChild(`m/44'/${path}'/0'`)
  return hdWallet
}


export const encryptMnemonic = (mnemonic: string, password: string): string => {
  const mnemonicStr = mnemonic.split(' ').join(',')
  return aesEncrypt(mnemonicStr, password)
}


export const decryptMnemonic = (encryptedMnemonic: string, password: string): string => {
  const mnemonic = aesDecrypt(encryptedMnemonic, password)
  return mnemonic.split(',').join(' ')
}


export const encryptPrivateKey = (privateKey: string, pubKey: string): string => {
  const subPubKey = pubKey.substring(0, 32)
  const encrypt = CryptoES.AES.encrypt(privateKey, CryptoES.enc.Utf8.parse(subPubKey), {
    mode: CryptoES.mode.ECB,
    padding: CryptoES.pad.Pkcs7,
  }).toString()
  return encrypt
}


export const decryptPrivateKey = (encryptPrivateKey: string, pubKey: string): string => {
  const subPubKey = pubKey.substring(0, 32)
  const decrypt = CryptoES.AES.decrypt(encryptPrivateKey, CryptoES.enc.Utf8.parse(subPubKey), {
    mode: CryptoES.mode.ECB,
    padding: CryptoES.pad.Pkcs7,
  }).toString(CryptoES.enc.Utf8)
  return decrypt
}




export const aesEncrypt = (str: string, key: string): string => {

  key = key.length > 16 ? key.padEnd(32, '0') : key.padEnd(16, '0')
  const iv = '0000000000000000'
  const utf8Str = Utf8.parse(str)
  const utf8Key = Utf8.parse(key)
  const utf8Iv = Utf8.parse(iv)
  const cipherText = AES.encrypt(utf8Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  const bufferData = Buffer.from(cipherText.toString(), 'base64')
  const res = bufferData.toString('hex')
  return res
}



export const aesDecrypt = (encryptedStr: string, key: string): string => {
  key = key.length > 16 ? key.padEnd(32, '0') : key.padEnd(16, '0')
  const iv = '0000000000000000'
  const utf8Key = Utf8.parse(key)
  const utf8Iv = Utf8.parse(iv)
  let bufferData
  try {
    bufferData = Buffer.from(encryptedStr.toString(), 'hex')
  } catch {
    return encryptedStr
  }
  const base64Str = bufferData.toString('base64')
  const bytes = AES.decrypt(base64Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  return bytes.toString(Utf8)
}





export const encryptStorageMnemonic = (mnemonic: string, password: string): string => {
  const mnemonicStr = mnemonic.split(' ').join(',')
  return aesEncryptMnemonic(mnemonicStr, password)
}

export const decryptStorageMnemonic = (encryptedMnemonic: string, password: string): string => {
  const mnemonic = aesDecryptMnemonic(encryptedMnemonic, password)
  return mnemonic.split(',').join(' ')
}


export const aesEncryptMnemonic = (str: string, key: string): string => {

  key = key.substring(0, 32)
  const iv = '0000000000000000'
  const utf8Str = Utf8.parse(str)
  const utf8Key = Utf8.parse(key)
  const utf8Iv = Utf8.parse(iv)
  const cipherText = AES.encrypt(utf8Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  const bufferData = Buffer.from(cipherText.toString(), 'base64')
  const res = bufferData.toString('hex')
  return res
}


export const aesDecryptMnemonic = (encryptedStr: string, key: string): string => {
  key = key.substring(0, 32)
  const iv = '0000000000000000'
  const utf8Key = Utf8.parse(key)
  const utf8Iv = Utf8.parse(iv)
  let bufferData
  try {
    bufferData = Buffer.from(encryptedStr.toString(), 'hex')
  } catch {
    return encryptedStr
  }
  const base64Str = bufferData.toString('base64')
  const bytes = AES.decrypt(base64Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  return bytes.toString(Utf8)
}






export const signature = (message: string, privateKey: string) => {
  const hash = mvc.crypto.Hash.sha256(Buffer.from(message))
  const sign = mvc.crypto.ECDSA.sign(hash, new mvc.PrivateKey(privateKey))
  return sign.toBuffer().toString('base64')
}


export const mnemoicLogin = (params: {
  xpub: string
  sign: string 
  word: string
  type: number // 1.web 2.app
  path: number
}) => {
  return showApi.post(`/showpaycore/api/v1/mnemonic/verification`, params)
}






const DEFAULTS = {
  feeb: 1,
  minAmount: 546,
}


export class HdWallet {
  public network = Network.mainnet
  public mnemonic: string = ''
  public wallet: mvc.HDPrivateKey
  public provider: ShowmoneyProvider
  private _utxos = []
  public _root: mvc.PrivateKey
  private protocols = []
  public keyPathMap = {
    Root: {
      keyPath: '0/0',
      parentKeyPath: '0/0',
    },
    Info: {
      keyPath: '0/1',
      parentKeyPath: '0/0',
    },
    Protocols: {
      keyPath: '0/2',
      parentKeyPath: '0/0',
    },

    name: {
      keyPath: '0/2',
      parentKeyPath: '0/1',
    },
    email: {
      keyPath: '0/3',
      parentKeyPath: '0/1',
    },
    phone: {
      keyPath: '0/4',
      parentKeyPath: '0/1',
    },
    avatar: {
      keyPath: '0/5',
      parentKeyPath: '0/1',
    },
    bio: {
      keyPath: '0/6',
      parentKeyPath: '0/1',
    },
  }

  public session = new Session()

 
  private publishkeyList: {
    address: string
    index: number
    path: string
    publicKey: string
    isUsed: boolean
  }[] = []

 
  private userBrfcNodeList: UserProtocolBrfcNode[] = []

  constructor(
    wallet: mvc.HDPrivateKey,
    params?: {
      baseApi?: string
      mvcMetaSvApi?: string
      bsvMetaSvApi?: string
    }
  ) {
    // @ts-ignore
    this.network = wallet.network.alias ? wallet.network.alias : wallet.network.name
    this.wallet = wallet
    const root = wallet.deriveChild(0).deriveChild(0).privateKey
    this._root = root

    if (!params) {
      params = {}
    }
    this.provider = new ShowmoneyProvider({
      ...params,
      network: this.network,
      session: this.session,
    })
  }

  get rootAddress(): string {
    return this._root.toAddress(this.network).toString()
  }

  get protocolAddress(): string {
    return this.createAddress(this.keyPathMap.Protocols.keyPath).address
  }

  get infoAddress(): string {
    return this.createAddress(this.keyPathMap.Info.keyPath).address
  }

  static async createFromAccount(
    account: BaseUserInfoTypes,
    network: Network = Network.mainnet
  ): Promise<HdWallet> {
    try {
      // console.log(account)
      const walletObj = await hdWalletFromAccount(account, network)
      const hdWallet = new HdWallet(walletObj.mnemonic, walletObj.wallet)
      return hdWallet
    } catch (error) {
      throw new Error('生成钱包失败-' + error.message)
    }
  }

  public async getMetaIdInfo(rootAddress: string): Promise<MetaIdInfoTypes> {
    let metaIdInfo: MetaIdInfoTypes = {
      metaId: '',
      infoTxId: '',
      protocolTxId: '',
      name: '',
      phone: '',
      email: '',
    }
    const metaId = await this.provider.getMetaId(rootAddress).catch(error => {
      ElMessage.error(error.message)
    })
    if (metaId) {
      const info = await this.provider.getMetaIdInfo(metaId)
      metaIdInfo = {
        ...metaIdInfo,
        ...info,
      }
    }
    return metaIdInfo
  }



  public onlyCreateMetaidNode() {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const metaIdInfo: any = await this.getMetaIdInfo(this.rootAddress)
        metaIdInfo.pubKey = this._root.toPublicKey().toString()

        if (metaIdInfo.metaId && metaIdInfo.infoTxId && metaIdInfo.protocolTxId) {
          console.log('metaidinfo 完整')
          resolve(metaIdInfo)
        } else {
          let utxos: UtxoItem[] = []
          utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
          if (!metaIdInfo.metaId) {
   
            if (!utxos.length) {
              const initUtxo = await this.provider.getInitAmount({
                address: this.rootAddress,
                xpub: this.wallet.xpubkey.toString(),
              })
              utxos = [initUtxo]
            }

            let outputs: any[] = []
            const rootTx = await this.createNode({
              nodeName: 'Root',
              metaIdTag: 'metaid',
              data: 'NULL',
              dataType: 'NULL',
              encoding: 'NULL',
              utxos: utxos,
              outputs: outputs,
            })
            metaIdInfo.metaId = rootTx.txId
            let errorMsg: any
       
            try {
              await this.provider.broadcast(rootTx.hex!)
            } catch (error) {
              errorMsg = error
            }
            if (errorMsg) {
              throw new Error(errorMsg.message)
            } else {
              resolve(metaIdInfo.metaId)
            }
          }
        }
      } catch (error) { }
    })
  }


  public initMetaIdNode(account: BaseUserInfoTypes, retry: number = 10) {
    return new Promise<MetaIdInfoTypes>(async (resolve, reject) => {
      try {
        const metaIdInfo: any = await this.getMetaIdInfo(this.rootAddress)
        metaIdInfo.pubKey = this._root.toPublicKey().toString()

        if (metaIdInfo.metaId && metaIdInfo.infoTxId && metaIdInfo.protocolTxId) {
          console.log('metaidinfo 完整')
          resolve(metaIdInfo)
        } else {
          let utxos: UtxoItem[] = []
          const hexTxs = []
          const infoAddress = this.getPathPrivateKey(this.keyPathMap.Info.keyPath)
          utxos = await this.provider.getUtxos(
            this.wallet.xpubkey.toString(),
            HdWalletChain.MVC,
            false
          )


          if (!metaIdInfo.metaId) {


            if (!utxos.length) {
              const initUtxo = await this.provider.getInitAmount({
                address: this.rootAddress,
                xpub: this.wallet.xpubkey.toString(),
                token: account.token || account.accessKey || '',
                userName: account.userType === 'phone' ? account.phone : account.email,
              })
              utxos = [initUtxo]
            }

            let outputs = []
            if (account.referrerId) {
              outputs = [
                {
                  script: mvc.Script.buildSafeDataOut(['ref:' + account.referrerId]),
                  satoshis: 0,
                },
              ]
            }
            const root = await this.createNode({
              nodeName: 'Root',
              metaIdTag: 'metaid',
              data: 'NULL',
              dataType: 'NULL',
              encoding: 'NULL',
              utxos: utxos,
              outputs: outputs,
            })
            hexTxs.push(root.transaction.toString())
            metaIdInfo.metaId = root.txId
            const newUtxo = await this.utxoFromTx({
              tx: root.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 0,
              },
            })
            if (newUtxo) {
              utxos = [newUtxo]
            }
          }


          if (!metaIdInfo.protocolTxId) {
            const protocol = await this.createNode({
              nodeName: 'Protocols',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: 'metaid',
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
            })
            hexTxs.push(protocol.transaction.toString())
            metaIdInfo.protocolTxId = protocol.txId
            const newUtxo = await this.utxoFromTx({
              tx: protocol.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 0,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }


          if (!metaIdInfo.infoTxId) {
            const info = await this.createNode({
              nodeName: 'Info',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: 'metaid',
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
              change: infoAddress.publicKey.toAddress(this.network).toString(),
            })
            hexTxs.push(info.transaction.toString())
            metaIdInfo.infoTxId = info.txId
            const newUtxo = await this.utxoFromTx({
              tx: info.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 1,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }


          if (!metaIdInfo.name) {
            const name = await this.createNode({
              nodeName: 'name',
              parentTxId: metaIdInfo.infoTxId,
              metaIdTag: 'metaid',
              data: account.name,
              utxos: utxos,
              change: this.rootAddress,  ///  最后一笔操作打到 零地址（根地址） 
            })
            hexTxs.push(name.transaction.toString())
            metaIdInfo.name = account.name
            const newUtxo = await this.utxoFromTx({
              tx: name.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 1,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }


          let errorMsg: any
   
          for (let i = 0; i < hexTxs.length; i++) {
            try {
              const tx = hexTxs[i]
              await this.provider.broadcast(tx)
            } catch (error) {
              errorMsg = error
            }
            if (errorMsg) {
              break
            }
          }

          if (errorMsg) {
            throw new Error(errorMsg.message)
          } else {
            resolve(metaIdInfo)
          }
        }
      } catch (error) {
        retry--
        if (retry <= 0) {
          reject(error)
        } else {
          this.initMetaIdNode(account, retry)
        }
      }
    })
  }

  private reverceFtByteString(str) {
    str = str.substr(0, str.length - 8)
    let ret = ''
    for (let i = 0; i < str.length; i += 2) {
      ret = str[i] + str[i + 1] + ret
    }
    return ret
  }

  public transferNft(
    params: {
      receiverAddress: string
      codehash: string
      genesis: string
      tokenIndex: string
      utxos?: any[]
    },
    option?: {
      isBroadcast: boolean
    }
  ) {
    return new Promise<{
      txHex: string
      txid: string
      tx: mvc.Transaction
    }>(async (resolve, reject) => {
      const initOption = {
        isBroadcast: true,
      }
      option = {
        ...initOption,
        ...option,
      }
      const nftManager = await this.getNftManager()
      let transferParams: any = {
        codehash: params.codehash,
        genesis: params.genesis,
        receiverAddress: params.receiverAddress,
        senderWif: this.wallet!.deriveChild(0)
          .deriveChild(0)
          .privateKey.toString(),
        tokenIndex: params.tokenIndex,
        noBroadcast: !option!.isBroadcast,
      }
      if (params.utxos?.length) {
        transferParams = { ...transferParams, utxos: params.utxos }
      }
      const result = await nftManager.transfer(transferParams)
      resolve(result)
    })

    // const genesisTxid = this.reverceFtByteString(payload.sensibleId)
    // const signersRes = await this.provider.getNftGenesisInfo(genesisTxid)
    // const signersRaw = signersRes.signers
    // const { signers, signerSelecteds } = await SensibleNFT.selectSigners(signersRaw)
    // const nft = new SensibleNFT({
    //   network: API_NET.MAIN,
    //   apiTarget: API_TARGET.METASV,
    //   feeb: 0.1,
    //   signers,
    //   signerSelecteds,
    // })
    // nft.sensibleApi.authorize({
    //   privateKey: metasvServiceSecret,
    // })
    // const utxoRes = await this.provider.getUtxos(this.wallet.xpubkey.toString())
    // const utxos = utxoRes.map(item => {
    //   item.wif = this.getPathPrivateKey(`${item.addressType}/${item.addressIndex}`).toString()
    //   return item
    // })
    // console.log('params: ', {
    //   senderWif: this._root.toString(),
    //   receiverAddress: payload.receiverAddress,
    //   codehash: payload.codehash,
    //   genesis: payload.genesis,
    //   tokenIndex: payload.tokenIndex,
    //   utxos: utxos,
    // })
    // const res = await nft.transfer({
    //   senderWif: this._root.toString(),
    //   receiverAddress: payload.receiverAddress,
    //   codehash: payload.codehash,
    //   genesis: payload.genesis,
    //   tokenIndex: payload.tokenIndex,
    //   utxos: utxos,
    //   opreturnData: '',
    //   noBroadcast: true,
    // })

    // let result
    // if (isBroadcast) {
    //   result = await this.provider.broadcast(res.txHex)
    // }
    // if ((isBroadcast && result) || !isBroadcast) {
    //   return {
    //     txId: res.txid,
    //     ...res,
    //   }
    // }
  }

  public sigMessage(msg: string, path = '0/0') {
    const privateKey = this.getPathPrivateKey(path)
    const message = new Message(msg)
    return message.sign(privateKey)
  }


  public getPathPrivateKey(keyPath: string) {
    const privateKey = this.wallet
      .deriveChild(+keyPath.split('/')[0])
      .deriveChild(+keyPath.split('/')[1]).privateKey
    return privateKey
  }

  public getPathPubliceKey(keyPath: string) {
    alert(111)
    const privateKey = this.wallet
      .deriveChild(+keyPath.split('/')[0])
      .deriveChild(+keyPath.split('/')[1]).publicKey
    return privateKey
  }

  public async createNode({
    nodeName,
    payTo = [],
    utxos = [],
    change,
    metaIdTag = 'metaid',
    parentTxId = 'NULL',
    data = 'NULL',
    encrypt = IsEncrypt.No,
    version = '1.0.1',
    dataType = 'text/plain',
    encoding = 'UTF-8',
    outputs = [],
    node,
    chain = HdWalletChain.MVC,
  }: CreateNodeOptions) {
    return new Promise<CreateNodeBaseRes>(async (resolve, reject) => {
      try {
        if (!nodeName) {
          throw new Error('Parameter Error: NodeName can not empty')
        }
        let privateKey = this.getPathPrivateKey('0/0')
     

        if (this.keyPathMap[nodeName]) {
          const nodeInfo = this.keyPathMap[nodeName]
          node = {
            path: nodeInfo.keyPath,
            publicKey: this.createAddress(nodeInfo.keyPath).publicKey,
            address: this.createAddress(nodeInfo.keyPath).address,
          }
        } else {
          if (encoding === encoding) {
          
            if (!node) {
              // @ts-ignore
              const _privateKey = new mvc.PrivateKey(undefined, this.network)
              const _publickey = _privateKey.toPublicKey().toString()
              const _address = _privateKey.toAddress().toString()
              node = {
                address: _address,
                publicKey: _publickey,
                path: `-1/-1`,
              }
            }
          } else {
            if (!node) {
              throw new Error('Parameter Error: node can not empty')
            }
          }
        }
    
        if (+encrypt === 1) {
          data = this.eciesEncryptData(data, privateKey, privateKey.publicKey).toString('hex')
        } else {
          if (encoding.toLowerCase() === 'binary') {
            data = Buffer.from(data.toString('hex'), 'hex')
          }
        }

        const chain = await this.provider.getTxChainInfo(parentTxId)
        const scriptPlayload = [
          'mvc',
          node.publicKey.toString(),
          `${chain}:${parentTxId}`,
          metaIdTag.toLowerCase(),
          nodeName,
          data,
          encrypt.toString(),
          version,
          dataType,
          encoding,
        ]
        const makeTxOptions = {
          from: [],
          utxos: utxos,
          opReturn: scriptPlayload,
          change: change,
          outputs,
          payTo,
          chain,
        }

        const nodeTx = await this.makeTx(makeTxOptions)

        if (nodeTx) {
          resolve({
            hex: nodeTx.toString(),
            transaction: nodeTx,
            txId: nodeTx.id,
            address: node.address,
            addressType: parseInt(node.path.split('/')[0]),
            addressIndex: parseInt(node.path.split('/')[1]),
            scriptPlayload: scriptPlayload,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  public createAddress(
    keyPath: string
  ): {
    address: string
    publicKey: string
  } {
    const privateKey = this.getPathPrivateKey(keyPath)
    const address = privateKey.toAddress(this.network).toString()
    return {
      address: address,
      publicKey: privateKey.toPublicKey(),
    }
  }

  public async makeTx({
    payTo = [],
    outputs = [],
    change = this.rootAddress,
    opReturn,
    utxos,
    useFeeb = DEFAULTS.feeb,
    chain = HdWalletChain.MVC,
  }): Promise<mvc.Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const { tx } = await this.makeTxNotUtxos({
          payTo,
          outputs,
          opReturn,
          useFeeb,
          utxos,
          chain,
        })
        tx.change(change)
        // @ts-ignore
        tx.getNeedFee = function () {
          // @ts-ignore
          const amount = Math.ceil(
            // @ts-ignore
            (30 + this._estimateSize() + 182) * useFeeb
          )
          // @ts-ignore
          const offerFed = Math.ceil(amount * useFeeb)
          // if (amount < minAmount) amount = minAmount
          const total =
            offerFed + amount < mvc.Transaction.DUST_AMOUNT
              ? mvc.Transaction.DUST_AMOUNT + 30
              : offerFed + amount

          return total
        }
        // @ts-ignore
        tx.isNeedChange = function () {
          return (
            // @ts-ignore
            ((this._getUnspentValue() - this.getNeedFee()) as number) >= mvc.Transaction.DUST_AMOUNT
          )
        }
        // @ts-ignore
        tx.getChangeAmount = function () {
          // @ts-ignore
          return (this._getUnspentValue() - this.getNeedFee()) as number
        }

        if (utxos) {
          tx.from(utxos)
        }

        tx.fee(Math.ceil(tx._estimateSize() * useFeeb))
        console.log('tx', tx)

        const privateKeys = this.getUtxosPrivateKeys(utxos)
        tx.sign(privateKeys)

        resolve(tx)
      } catch (error) {
        reject(error)
      }
    })
  }

  public async makeTxNotUtxos({
    payTo = [],
    outputs = [],
    utxos = [],
    opReturn,
    useFeeb = DEFAULTS.feeb,
    chain = HdWalletChain.MVC,
  }) {
    if (!this.wallet) {
      throw new Error('Wallet uninitialized! (core-makeTx)')
    }
    const tx = new mvc.Transaction()
    if (chain === HdWalletChain.BSV) tx.version = WalletTxVersion.BSV
    if (Array.isArray(payTo) && payTo.length) {
      payTo.forEach(item => {
        if (!this.isValidOutput(item)) {
          throw new Error('Output format error.')
        }
        tx.to(item.address, item.amount)
      })
    }

    if (opReturn) {
      tx.addOutput(
        new mvc.Transaction.Output({
          script: mvc.Script.buildSafeDataOut(opReturn),
          satoshis: 0,
        })
      )
    }

    if (Array.isArray(outputs) && outputs.length) {
      outputs.forEach(output => {
        tx.addOutput(new mvc.Transaction.Output(output))
      })
    }

    if (utxos.length > 0) {
      tx.from(utxos)
    }

    return {
      tx,
    }
  }

  public async getOneUtxoFee(params?: { useFeeb?: number; utxo?: UtxoItem }) {
    return new Promise<number>(resolve => {
      if (!params) params = {}
      if (!params?.useFeeb) params.useFeeb = DEFAULTS.feeb
      const tx = new mvc.Transaction()
      tx.change(this.rootAddress)
      // @ts-ignore
      tx.from(params.utxo)
      // @ts-ignore
      const privateKeys = this.getUtxosPrivateKeys([params.utxo])
      tx.sign(privateKeys)
      // @ts-ignore
      const amount = Math.ceil(tx._estimateSize() * params!.useFeeb!)
      resolve(amount)
    })
  }

  utxoFromTx(params: {
    tx: mvc.Transaction
    addressInfo?: {
      addressType: number
      addressIndex: number
    }
    outPutIndex?: number
    chain?: HdWalletChain
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof params?.outPutIndex === 'undefined') {
          if (params.tx._changeIndex) {
            params.outPutIndex = params.tx._changeIndex
          } else {
            params.outPutIndex = params.tx.outputs.length - 1
          }
        }
        const OutPut = params.tx.outputs[params.outPutIndex]
        if (!params.chain) params.chain = HdWalletChain.MVC
        if (!params.addressInfo) {
          const res = await this.session.getAddressPath(
            OutPut.script.toAddress(this.network).toString()
          )
          params.addressInfo = {
            addressType: 0,
            addressIndex: res.path,
          }
        }
        this.provider.isUsedUtxos.push({
          txId: params.tx.id,
          address: OutPut.script.toAddress(this.network).toString(),
        })

        resolve({
          address: OutPut.script.toAddress(this.network).toString(),
          satoshis: OutPut.satoshis,
          amount: OutPut.satoshis * 1e-8,
          script: OutPut.script.toHex(),
          outputIndex: params.outPutIndex!,
          txId: params.tx.id,
          addressType: params!.addressInfo?.addressType!,
          addressIndex: params!.addressInfo?.addressIndex!,
          xpub: this.wallet.xpubkey.toString(),
          wif: this.getPathPrivateKey(
            `${params!.addressInfo?.addressType!}/${params!.addressInfo?.addressIndex!}`
          )!.toString(),
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  private isValidOutput(output: OutputTypes): boolean {
    return (
      isNaturalNumber(output.amount) &&
      +output.amount >= DEFAULTS.minAmount &&
      isBtcAddress(output.address)
    )
  }

  public pickUtxosByAmount(
    pickedUtxos: [],
    utxos: [],
    amount: number
  ) {
    let balance = 0
    let unUsedInputs = []
    // console.log('amount', amount)

    for (const utxo of utxos) {
      let isPicked = false
      for (const pickedItem of pickedUtxos) {
        if (utxo.txId === pickedItem.txId && utxo.outputIndex === pickedItem.outputIndex) {
          isPicked = true
          break
        }
      }
      if (!isPicked && !utxo.isSpend) {
        unUsedInputs = [...unUsedInputs, utxo]
      }
    }

    // utxos = unUsedInputs

    let isEnoughBalance = false
    const newPickedUtxos = []
    for (const utxo of unUsedInputs) {
      balance += Number(utxo.value)
      newPickedUtxos.push(utxo)
      if (balance > amount + DEFAULTS.minAmount + 200) {
        isEnoughBalance = true
        break
      }
    }
    return {
      isEnoughBalance: isEnoughBalance,
      newPickedUtxos: newPickedUtxos,
    }
  }

  public getUtxosPrivateKeys(utxos): mvc.PrivateKey[] {
    return utxos.map(u => {
      return this.wallet.deriveChild(u.addressType || 0).deriveChild(u.addressIndex || 0).privateKey
    })
  }

  public eciesEncryptData(
    data: string | Buffer,
    privateKey?: mvc.PrivateKey,
    publicKey?: mvc.PublicKey
  ): Buffer {
    privateKey = privateKey || this.getPathPrivateKey('0/0')
    publicKey = publicKey || this.getPathPrivateKey('0/0').toPublicKey()
    const ecies = ECIES()
      .privateKey(privateKey)
      .publicKey(publicKey)
    return ecies.encrypt(data)
  }


  public eciesDecryptData(
    data: Buffer | string,
    privateKey?: mvc.PrivateKey | string,
    publicKey?: string
  ): string {
    privateKey = privateKey || this.getPathPrivateKey('0/0')
    publicKey = publicKey || data.toString().substring(8, 74)
    let ecies = ECIES()
      .privateKey(privateKey)
      .publicKey(publicKey)
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data, 'hex')
    }
    let res = ''
    try {
      res = ecies.decrypt(data).toString()
    } catch (error) {
      try {
        ecies = ECIES({ noKey: true })
          .privateKey(privateKey)
          .publicKey(publicKey)
        res = ecies.decrypt(data).toString()
      } catch (error) {
        throw new Error('error')
      }
    }
    return res
  }

  public devideUtxo(
    devides: { amount: number; address: string }[],
    utxos?: any,
    isBroadcast = true
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!utxos) {
          utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
        }
        let balance = 0 
        let useAmount = 50 * (devides.length - 1)
        for (const item of devides) {
          useAmount += item.amount
        }
        for (const item of utxos) {
          balance += item.value
        }
        if (balance < useAmount) {
        }
        const tx = await this.sendMoney({
          payTo: devides,
          utxos: utxos,
          isBroadcast,
        })
        if (tx) {
          resolve(tx)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  public async batchTransferNft(NftList: any[], receiverAddress: string, noBroadcast = false) {
    return new Promise<PromiseSettledResult<NftTransferResult>[]>(async (resolve, reject) => {
      try {
        const utxos = await this.getUsefulUtxos(NftList.length)
        const transferTasks = []
        for (let i = 0; i < NftList.length; i++) {
          const transferTask = this.createTransferTask(
            NftList[i],
            utxos[i],
            receiverAddress,
            noBroadcast
          )

          transferTasks.push(transferTask)
        }
        const transferResult = await Promise.allSettled(transferTasks)

        resolve(transferResult)
      } catch (error) {
        reject(error)
      }
    })
  }

  private async createTransferTask(
    nft: any,
    utxo: any,
    receiverAddress: string,
    noBroadcast = false
  ) {
    const nftManager = await this.getSensibleNftManager()

    return await nftManager.transfer({
      senderWif: this._root.toString(),
      receiverAddress,
      codehash: nft.codehash,
      genesis: nft.genesis,
      tokenIndex: String(nft.tokenIndex),
      utxos: [utxo],
      noBroadcast,
    })
  }

  public getUsefulUtxos = async (neededUtxosCount = 1): Promise<UtxoWithWif[]> => {
    const wallet = this.getSensibleWallet()

    const usefulThreshold = 1000 
    const allUtxos = await wallet.blockChainApi.getUnspents(this.rootAddress)
    const usefulUtxos = allUtxos.filter(utxo => utxo.satoshis >= usefulThreshold)

    if (usefulUtxos.length >= neededUtxosCount) {
      return this.addWifToUtxos(usefulUtxos)
    }

    try {
      await this.gatherAllUtxos()
    } catch (e) {
      console.log(e)
    }

    const balance = await wallet.blockChainApi
      .getBalance(this.rootAddress)
      .then(res => res.balance + res.pendingBalance)

    if (balance < usefulThreshold * neededUtxosCount) {
    }

    const satsPerUtxo = Math.floor((balance / neededUtxosCount) * 0.9) 

    const receivers = []
    for (let i = 0; i < neededUtxosCount; i++) {
      receivers.push({
        address: this.rootAddress,
        amount: satsPerUtxo,
      })
    }
    await wallet.sendArray(receivers)

    const divided = await wallet.blockChainApi.getUnspents(this.rootAddress)
    return this.addWifToUtxos(divided)

  }

  private addWifToUtxos = (utxos: SA_utxo[]): UtxoWithWif[] => {
    const wif = this._root.toString()
    return utxos.map(utxo => {
      const u = utxo as UtxoWithWif
      u.wif = wif

      return u
    })
  }

  private getSensibleWallet = (): Wallet => {
    const wallet = new Wallet(this._root.toString(), API_NET.MAIN, 0.05, API_TARGET.METASV)
    wallet.blockChainApi.authorize({
      privateKey: metasvServiceSecret,
    })

    return wallet
  }

  public getNftManager = (): NftManager => {
    const nftManager = new NftManager({
      apiTarget: API_TARGET.MVC,
      // @ts-ignore
      network: this.network,
      purse: this.wallet!.deriveChild(0)
        .deriveChild(0)
        .privateKey.toString(),
      feeb: DEFAULTS.feeb,
      apiHost: import.meta.env.VITE_META_SV_API,
    })
    return nftManager
  }

  public getFtManager = (): FtManager => {
    const ftManager = new FtManager({
      apiTarget: API_TARGET.MVC,
      // @ts-ignore
      network: this.network,
      purse: this.wallet!.deriveChild(0)
        .deriveChild(0)
        .privateKey.toString(),
      feeb: DEFAULTS.feeb,
      apiHost: import.meta.env.VITE_META_SV_API,
    })
    return ftManager
  }

  private async gatherAllUtxos() {
    const utxosFromAll = await this.getAllAddressUtxos()
    if (
      utxosFromAll.length === 0 ||
      (utxosFromAll.length === 1 && utxosFromAll[0].address === this.rootAddress)
    ) {
      return
    }

    const tx = new mvc.Transaction()
    const fee = Math.ceil((utxosFromAll.length * 148 + 34 + 10) * 0.5)
    const totalAmount = utxosFromAll.reduce((acc: number, utxo: any) => acc + utxo.value, 0)
    tx.addOutput(
      new mvc.Transaction.Output({
        satoshis: totalAmount - fee,
        script: mvc.Script.fromAddress(this.rootAddress),
      })
    )

    const utxos = utxosFromAll.map((utxo: any) => {
      return {
        txId: utxo.txid,
        outputIndex: utxo.txIndex,
        satoshis: utxo.value,
        script: mvc.Script.buildPublicKeyHashOut(utxo.address).toHex(),
      }
    })
    const privateKeys = utxosFromAll.map((utxo: any) => {
      return mvc.HDPrivateKey.fromString(this.wallet.xprivkey.toString())
        .deriveChild(utxo.addressType)
        .deriveChild(utxo.addressIndex).privateKey
    })

    tx.from(utxos)
    tx.fee(fee)
    tx.sign(privateKeys)

    const result = await this.broadcast(tx.serialize())

    return result.txid
  }

  private async getAllAddressUtxos() {
    const xPublicKey = this.wallet.xpubkey.toString()

    return await fetch(`https://apiv2.metasv.com/xpubLite/${xPublicKey}/utxo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlcm5hbF90ZXN0X3Nob3dwYXkiLCJpc3MiOiJNZXRhU1YiLCJleHAiOjE2NTM4OTc0MTB9.genUip-PcA3tdQtOMKZUzwuc7XxC3zF7Vy5wdYAfKsM',
      },
    }).then(response => {
      return response.json()
    })
  }

  private async broadcast(hex: string) {
    const response = await fetch('https://apiv2.metasv.com/tx/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlcm5hbF90ZXN0X3Nob3dwYXkiLCJpc3MiOiJNZXRhU1YiLCJleHAiOjE2NTM4OTc0MTB9.genUip-PcA3tdQtOMKZUzwuc7XxC3zF7Vy5wdYAfKsM',
      },
      body: JSON.stringify({ hex }),
    }).then(async response => JSON.parse(await response.text()))

    return response
  }

  // getter
  get userProtocols() {
    return this.userBrfcNodeList
  }

  async getProtocolInfo(
    nodeName: NodeName,
    protocolsTxId: string,
    brfcId: string,
    chain = HdWalletChain.MVC
  ) {
    return new Promise<ProtocolBrfcNode | null>(async (resolve, reject) => {
      try {
        let brfcNode = this.userBrfcNodeList.find(
          item => item.nodeName == nodeName && item.brfcId === brfcId
        )

        if (brfcNode) {
          resolve(brfcNode)
        } else {
          const protocols: any = await this.getProtocols({
            protocolsTxId: protocolsTxId,
            protocolType: nodeName,
          })

          const protocol = protocols.filter((item: any) => {
            return item?.nodeName === nodeName && item?.data === brfcId
          })[0]
          if (protocol) {
            const res = await this.session.getAddressPath(protocol.address)
            const protocolInfo = {
              xpub: this.wallet.xpubkey.toString(),
              address: protocol.address,
              addressType: 0,
              addressIndex: res.path,
            }
            if (protocolInfo) {
              this.userBrfcNodeList.push({
                ...protocol,
                ...protocolInfo,
                nodeName,
                brfcId,
              })
              resolve({
                ...protocol,
                ...protocolInfo,
              })
            }
          } else {
            resolve(null)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async getProtocols({ protocolsTxId, protocolType }: GetProtocolsTypes) {
    return new Promise((resolve, reject) => {
      fetch(import.meta.env.VITE_BASEAPI + '/serviceapi/api/v1/protocol/getProtocolDataList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: JSON.stringify({
            protocolTxId: protocolsTxId,
            nodeName: protocolType,
          }),
        }),
      })
        .then((response: Response) => {
          return response.json()
        })
        .then(json => {
          if (json && json.code === 200 && json.result.data) {
            resolve(json.result.data)
          } else {
            resolve([])
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  public createBrfcNode(
    params: CreateBrfcNodePrams,
    option?: {
      isBroadcast?: boolean
      chain?: HdWalletChain
    }
  ) {
    return new Promise<CreateNodeBrfcRes>(async (resolve, reject) => {
      try {
        const initParams = {
          useFeeb: DEFAULTS.feeb,
          payTo: [],
          utxos: [],
        }
        const initOption = {
          isBroadcast: true,
          chain: HdWalletChain.MVC,
        }
        params = {
          ...initParams,
          ...params,
        }
        option = {
          ...initOption,
          ...option,
        }
        if (!params.useFeeb) params.useFeeb = DEFAULTS.feeb
        if (!params.payTo) params.payTo = []

        const nodeName = AllNodeName[params.nodeName]

        let protocol = await this.getProtocolInfo(
          params.nodeName,
          params.parentTxId,
          nodeName.brfcId,
          option!.chain!
        )

        if (protocol) {
          resolve({
            address: protocol.address,
            txId: protocol.txId,
            addressType: protocol.addressType,
            addressIndex: protocol.addressIndex,
          })
        } else {
          const newBrfcNodeBaseInfo = await this.provider.getNewBrfcNodeBaseInfo(
            this.wallet.xpubkey.toString(),
            params.parentTxId
          )

          const protocolRoot = await this.createNode({
            ...params,
            metaIdTag: 'metaid',
            data: nodeName.brfcId,
            utxos: params.utxos,
            node: newBrfcNodeBaseInfo,
            chain: option!.chain!,
          })
          if (protocolRoot) {
            if (option.isBroadcast) {
              await this.provider.broadcast(protocolRoot.transaction.toString(), option!.chain)
            }

            resolve({
              address: protocolRoot.address,
              txId: protocolRoot.txId,
              addressType: parseInt(newBrfcNodeBaseInfo.path!.split('/')[0]),
              addressIndex: parseInt(newBrfcNodeBaseInfo.path!.split('/')[1]),
              transaction: protocolRoot.transaction,
            })
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  public async createBrfcChildNode(
    params: HdWalletCreateBrfcChildNodeParams,
    option?: {
      isBroadcast: boolean 
      chain?: HdWalletChain
    }
  ): Promise<CreateNodeBrfcRes> {
    return new Promise<CreateNodeBrfcRes>(async (resolve, reject) => {
      const initParams = {
        autoRename: true,
        version: '0.0.9',
        data: 'NULL',
        dataType: 'application/json',
        encoding: 'UTF-8',
        payCurrency: 'Space',
        payTo: [],
        attachments: [],
        utxos: [],
        useFeeb: DEFAULTS.feeb,
      }
      const initOption = {
        isBroadcast: true,
        chain: HdWalletChain.MVC,
      }
      params = {
        ...initParams,
        ...params,
      }
      option = {
        ...initOption,
        ...option,
      }
      try {
        let address
        let publickey
        const addressType = -1 
        const addressIndex = -1 
        if (params.publickey) {
          publickey = params.publickey
          address = mvc.PublicKey.fromHex(params.publickey)
            .toAddress(this.network)
            .toString()
        } else {
          const privateKey = new mvc.PrivateKey(undefined, this.network)
          publickey = privateKey.toPublicKey().toString()
          address = privateKey.toAddress().toString()
        }
        const node: NewNodeBaseInfo = {
          address,
          publicKey: publickey,
          path: `${addressType}/${addressIndex}`,
        }

        if (params.ecdh) {

        }
        const res = await this.createNode({
          nodeName: params.autoRename
            ? [params.nodeName, publickey.toString().slice(0, 11)].join('-')
            : params.nodeName,
          metaIdTag: 'metaid',
          parentTxId: params.brfcTxId,
          encrypt: params.encrypt,
          data: params.data,
          payTo: params.payTo,
          dataType: params.dataType,
          version: params.version,
          encoding: params.encoding,
          utxos: params.utxos,
          node,
          chain: option.chain,
        })
        if (res) {
          if (option.isBroadcast) {
            const response = await this.provider.broadcast(res.transaction!.toString())
            if (response?.txid) {
              resolve(res)
            }
          } else {
            resolve(res)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * sendMoney
   */
  public async sendMoney(params: {
    payTo: PayToItem[]
    isBroadcast?: boolean
    opReturn?: string[]
    utxos?: UtxoItem[]
    chain?: HdWalletChain
  }) {
    return new Promise<mvc.Transaction>(async (resolve, reject) => {
      try {
        const initParams = {
          payTo: [],
          isBroadcast: true,
          opReturn: [import.meta.env.VITE_App_Key],
          utxos: [],
          chain: HdWalletChain.MVC,
        }
        params = {
          ...initParams,
          ...params,
        }
        if (!params.utxos!.length) {
          let totalAmount = mvc.Transaction.DUST_AMOUNT
          for (const item of params.payTo) {
            totalAmount += item.amount
          }
          params.utxos = await this.provider.getAmountUnUesedUtxos(
            totalAmount,
            this.wallet.xpubkey.toString(),
            params.chain
          )
        }
        for (const item of params.payTo) {
          if (!item.address) {
          }
          if (isEmail(item.address)) {
            item.address = await this.provider.getPayMailAddress(item.address)
          }
        }
        const tx = await this.makeTx({
          payCurrency: 'SPACE',
          payTo: params.payTo,
          opReturn: params.opReturn,
          utxos: params.utxos,
          chain: params!.chain,
        })
        if (params.isBroadcast) {
          const res = await this.provider.broadcast(tx.toString(), params.chain)
          if (res) {
            resolve(tx)
          }
        } else {
          resolve(tx)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  ftGenesis() {
    return new Promise(async resolve => {
      const userStore = useUserStore()
      const tokenName = 'SPACE-MIT'
      const tokenSymbol = 'SMIT'
      const decimalNum = 8

      let utxos
      let bFrcRes = await this.createBrfcNode(
        {
          nodeName: NodeName.FtGenesis,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
        },
        {
          isBroadcast: false,
        }
      )
      if (bFrcRes.transaction) {
        const allUtxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
        const tx = await this.sendMoney({
          payTo: [{ amount: 1000, address: this.protocolAddress }],
          utxos: allUtxos,
        })
        const utxo = await this.utxoFromTx({
          tx,
          addressInfo: {
            addressType: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[0]),
            addressIndex: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[1]),
          },
          outPutIndex: 0,
        })
        utxo.wif = this.getPathPrivateKey(`${utxo.addressType}/${utxo.addressIndex}`).toString()
        utxos = [utxo]
        bFrcRes = await this.createBrfcNode({
          nodeName: NodeName.FtGenesis,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
          utxos,
        })
      }

      const allUtxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
      const tx = await this.sendMoney({
        payTo: [{ amount: 20000, address: bFrcRes.address }],
        utxos: allUtxos,
      })
      const utxo = await this.utxoFromTx({
        tx,
        addressInfo: {
          addressType: bFrcRes.addressType,
          addressIndex: bFrcRes.addressIndex,
        },
        outPutIndex: 0,
      })
      utxo.wif = this.getPathPrivateKey(`${utxo.addressType}/${utxo.addressIndex}`).toString()
      utxos = [utxo]
      const response = await this.createBrfcChildNode(
        {
          nodeName: NodeName.FtGenesis,
          data: JSON.stringify({
            type: 'metacontract',
            tokenName,
            tokenSymbol,
            decimalNum,
            desc:
              'SPACE-MIT(SMIT) is a reward token launched for the MVC Incentivized Testnet (MIT). You can swap the reward to the Mainnet coin in a specific ratio after the launch of MVC Mainnet.',
            icon: 'metafile://37657797410a92f7ed37440ea54d2b7940c1e0acc150a86f4e677565fc8c3e05.png',
            website: 'https://mvc.space/',
            issuerName: 'MVC Foundation',
            utxos,
            useFeeb: 1,
          }),
          ...AllNodeName[NodeName.FtGenesis],
          brfcTxId: bFrcRes.txId,
        },
        {
          isBroadcast: false,
        }
      )

      const ft = new FtManager({
        network: this.network,
        feeb: 1,
        purse: this.getPathPrivateKey(`0/0`).toString(),
      })

      const genesis = await ft.genesis({
        tokenName,
        tokenSymbol,
        decimalNum,
        opreturnData: response.scriptPlayload,
        // noBroadcast: true,
        utxos,
        changeAddress: userStore.user!.address,
        genesisWif: this.getPathPrivateKey(`0/0`).toString(),
      })
      console.log('genesisWif', this.getPathPrivateKey(`0/0`).toString())
      // await this.provider.broadcast(genesis.txHex)

      let IssueFrfcRes = await this.createBrfcNode(
        {
          nodeName: NodeName.FtIssue,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
        },
        {
          isBroadcast: false,
        }
      )
      if (IssueFrfcRes.transaction) {
        const allUtxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
        const tx = await this.sendMoney({
          payTo: [{ amount: 20000, address: this.protocolAddress }],
          utxos: allUtxos,
        })
        await sleep(2000)
        const utxo = await this.utxoFromTx({
          tx,
          addressInfo: {
            addressType: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[0]),
            addressIndex: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[1]),
          },
          outPutIndex: 0,
        })
        utxo.wif = this.getPathPrivateKey(`${utxo.addressType}/${utxo.addressIndex}`).toString()
        utxos = [utxo]
        IssueFrfcRes = await this.createBrfcNode({
          nodeName: NodeName.FtIssue,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
          utxos,
        })
      }

      await sleep(2000)

      const allUtxos2 = await this.provider.getUtxos(this.wallet.xpubkey.toString())
      const tx2 = await this.sendMoney({
        payTo: [{ amount: 20000, address: IssueFrfcRes.address }],
        utxos: allUtxos2,
      })
      await sleep(2000)
      const utxo2 = await this.utxoFromTx({
        tx: tx2,
        addressInfo: {
          addressType: IssueFrfcRes.addressType,
          addressIndex: IssueFrfcRes.addressIndex,
        },
        outPutIndex: 0,
      })
      utxo2.wif = this.getPathPrivateKey(`${utxo2.addressType}/${utxo2.addressIndex}`).toString()
      utxos = [utxo2]
      const response2 = await this.createBrfcChildNode(
        {
          nodeName: NodeName.FtIssue,
          data: JSON.stringify({
            type: 'metacontract',
            genesisId: genesis.genesis,
            sensibleId: genesis.sensibleId,
            tokenAmount: '30000000000000',
            genesisAddress: userStore.user!.address,
            address: userStore.user!.address,
            allowIncreaseIssues: true,
          }),
          ...AllNodeName[NodeName.FtIssue],
          brfcTxId: IssueFrfcRes.txId,
          utxos,
          useFeeb: 1,
        },
        {
          isBroadcast: false,
        }
      )
      console.log('genesisWif', this.getPathPrivateKey(`0/0`).toString())
      console.log({
        brfcAddress: bFrcRes.address,
        address1: utxos[0].address,
        address2: mvc.PrivateKey.fromWIF(utxos[0].wif)
          .toAddress('testnet')
          .toString(),
        path: `${utxos[0].addressType}/${utxos[0].addressIndex}`,
      })
      const result = await ft.issue({
        genesis: genesis.genesis,
        codehash: genesis.codehash,
        sensibleId: genesis.sensibleId,
        genesisWif: this.getPathPrivateKey(`0/0`).toString(),
        receiverAddress: userStore.user!.address,
        tokenAmount: '30000000000000',
        allowIncreaseMints: true, //if true then you can issue again
        opreturnData: response2.scriptPlayload,
        utxos,
        // noBroadcast: true,
        changeAddress: userStore.user!.address,
      })

      // await this.provider.broadcast(result.txHex)
    })
  }

  public async MetaNameBeforeReq(params: { name: string; op: MetaNameOp }) {
    return this.provider.reqMetaNameArgs({ ...params, address: this.rootAddress })
  }
}
