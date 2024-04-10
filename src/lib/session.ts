import { useStore } from '@/store/index'
import { mvc } from 'meta-contract'
// import i18n from '../i18n'
// import { UtxoItem } from '@/@types/sdk'

interface AddressPathItem {
  address: string
  path: number
}

interface TxChainInfoItem {
  txId: string
  chain: string
}

// interface UnUsedUtxoItem extends UtxoItem {
//   metaId: string
// }
export class Session {
  addressSessionKey = 'AddressPath'
  txChainInfoSessionKeys = 'txChainInfo'
  unUsedUtxosKey = 'unUsedUtxosKey'

  addressPaths: AddressPathItem[] = window.sessionStorage.getItem(this.addressSessionKey)
    ? JSON.parse(window.sessionStorage.getItem(this.addressSessionKey)!)
    : []

  txChainInfos: TxChainInfoItem[] = window.sessionStorage.getItem(this.txChainInfoSessionKeys)
    ? JSON.parse(window.sessionStorage.getItem(this.txChainInfoSessionKeys)!)
    : []

  unUsedUtxos = window.sessionStorage.getItem(this.unUsedUtxosKey)
    ? JSON.parse(window.sessionStorage.getItem(this.unUsedUtxosKey)!)
    : []

  constructor() {}

  async getAddressPath(address: string) {
    const userStore = useStore()
    let item = this.addressPaths.find(item => item.address === address)
    if (item) {
      return item
    } else {
      if (userStore.metaletLogin) {
        for (let i = 0; i <= 10000; i++) {
          const _address = await userStore.showWallet!.wallet!.metaIDJsWallet.getAddress({
            path: `0/${i}`,
          })

          console.log('_address', _address)
          if (_address === address) {
            console.log('path', i)
            item = {
              address: address,
              path: i,
            }
            this.addressPaths.push(item)
            window.sessionStorage.setItem(this.addressSessionKey, JSON.stringify(this.addressPaths))
            break
          }
        }
      } else {
        for (let i = 0; i <= 10000; i++) {
          const _address = userStore
            .showWallet!.wallet!.wallet.deriveChild(`m/0/${i}`)
            .privateKey.toAddress()
            .toString()
          if (_address === address) {
            console.log('path', i)
            item = {
              address: address,
              path: i,
            }
            this.addressPaths.push(item)
            window.sessionStorage.setItem(this.addressSessionKey, JSON.stringify(this.addressPaths))
            break
          }
        }
      }

      if (item) {
        return item
      } else {
        // @ts-ignore
        // throw new Error(i18n.global.t('PathMoreThan10000'))
        throw new Error(alert('PathMoreThan10000'))
      }
    }
  }

  addTxChainInfo(item: TxChainInfoItem) {
    this.txChainInfos.push(item)
    sessionStorage.setItem(this.txChainInfoSessionKeys, JSON.stringify(this.txChainInfos))
  }

  addUnUsedUtxos(utxo) {
    this.unUsedUtxos.push(utxo)
    sessionStorage.setItem(this.unUsedUtxosKey, JSON.stringify(this.unUsedUtxosKey))
  }
}
