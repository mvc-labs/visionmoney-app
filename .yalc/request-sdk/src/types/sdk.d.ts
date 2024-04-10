import { ProtocolOptions } from 'metaidjs'
import { NFTIssueParamsIconType } from '../emums'

export interface SdkMetaidJsOptionsTypes {
  baseUri: string
  oauthSettings: SdkMetaidJsOauthSettingsTypes
}

export interface ShowManRes {
  code: number
  result: {
    data: any[]
  }
}

export interface DotWalletConfig {
  clientID: string
  clientSecret: string
  redirectUrl: string
  env: ENV
}

export interface SdkMetaidJsOauthSettingsTypes {
  clientId: string
  redirectUri: string
  clientSecret?: string
  scope?: string
  responseType?: string
}
export interface ProtocolParamsTypes extends ProtocolOptions, BaseParamsType {
  accessToken: string
  handlerId?: string
}
export interface BaseParamsType {
  accessToken: string
  callback?: Function
  onCancel?: Function
}
declare interface Token {
  access_token: string
  token_type?: string
  refresh_token?: string
  expires_in?: number
  expires_time?: number
}
export interface appMetaIdJsParams {
  accessToken: string
  data: any
  onCancel?: Function
}

export interface appMetaIdJsParams {
  accessToken: string
  data: any
  onCancel?: Function
}

export interface NftFunParams {
  accessToken: string
}

export interface CreateMetaFileFunParams {
  name?: string
  data: string | ArrayBuffer
  encrypt: string
  data_type?: string
}
export interface MetaIdJsRes {
  code: number
  data: any
  status?: string
  handlerId?: string
  appAccessToken?: string
}
export interface SdkGenesisNFTRes extends MetaIdJsRes {
  data: {
    codehash: string
    genesisId: string
    genesisTxid: string
    sensibleId: string
    amount?: number
  }
}

export interface SendMetaDataTxRes extends MetaIdJsRes {
  data: SendMetaDataTxResData
}

export interface SendMetaDataTxResData {
  txId?: string
  usedAmount?: number
  usedAmountCent?: number
  nodeAddress?: string
}

export interface CreateNFTParams extends NFTGenesisParams, NFTIssueParams {
  codeHash?: string
  genesis?: string
  genesisTxId?: string
  sensibleId?: string
}

export enum SdkCallBackCodes {
  success = 200
}

export interface SdkCallBack {
  code: SdkCallBackCodes
  data: any
  status: string
}

export interface IssueNFTResData extends MetaIdJsRes {
  data: {
    metaTdid: string
    nftId: string
    tokenId: string
    txId: string
    tokenIndex: string
    amount?: number
  }
}

export interface GetBalanceRes extends MetaIdJsRes {
  data: {
    bsv: number
    satoshis: number
  }
}

export interface NFTCancelResData extends MetaIdJsRes {
  data: {
    tx: any
    txHex: string
    txid: string
    amount?: number
  }
}

export interface NftBuyResData extends MetaIdJsRes {
  data: {
    tx: any
    txHex: string
    txid: string
    amount?: number
  }
}

export interface NftSellResData extends MetaIdJsRes {
  data: {
    message: string
    txId: string
    transactionHex: string
    fee: number
  }
}
export interface PaytoResData extends MetaIdJsRes {
  data: {
    sellTxHex: string
    sellTxId: string
    txHex: string
    txid: string
    amount?: number
  }
}

export interface NftDataProtocolParams {
  type: string
  name: string 
  intro: string 
  cover: MetaFile 
  originalFile?: MetaFile | string 
  txId?: string 
  checkOnly?: boolean //
}

export interface CreateNFTRes extends MetaIdJsRes {
  data: {
    // IssueNFTResData
    metaTdid: string
    nftId: string
    tokenId: string
    txId: string
    tokenIndex: string
    // SdkGenesisNFTRes
    codehash: string
    genesisId: string
    genesisTxid: string
    sensibleId: string
  }
}

export interface NftBuyParams {
  codehash: string
  genesis: string
  tokenIndex: string
  sellTxId: string
  sellContractTxId: string
  genesisTxid: string
  sensibleId: string
  amount: number
  checkOnly?: boolean
}

export interface CreateNftBuyProtocolParams {
  txId: string 
  txHex: string 
  sellTxId: string 
  codehash: string 
  genesis: string 
  genesisTxid: string 
  tokenIndex: string 
  satoshisPrice: number 
  opreturnData: string 
  createdAt: number 
  buyerMetaId: string 
}

export interface BuyNFTParams extends NftBuyParams {
  amount: number
  address: string
}

export interface NftSellParams {
  codehash: string
  genesis: string
  tokenIndex: string
  satoshisPrice: number
  genesisTxid: string
  sensibleId: string
  sellDesc: string
  checkOnly?: boolean
}
export interface PaytoParams {
  checkOnly: boolean
  to: string
  amount: number
  currency: string
  opReturn: string
}

export interface SellNFTParams extends NftSellParams {}

export interface CreateNftSellProtocolParams extends NftSellParams {
  txid: string 
  sellTxId: string 
  sellTxHex: any 
  createdAt: number 
}

export interface NftCancelParams {
  codehash: string
  genesis: string
  genesisTxid: string
  tokenIndex: string
  sellContractTxId: string
  sellTxId: string
  checkOnly?: boolean
}
export interface CancelSellNFTParams extends NftCancelParams {
  sellTxId: string
  satoshisPrice: number
}

export interface PayToItem {
  address: string
  amount: number
}
export interface NFTIssueParams {
  receiverAddress: string 
  genesisId?: string //
  genesisTxid?: string
  codehash?: string
  sensibleId?: string
  nftname: string
  nftdesc: string
  nfticon: {
    fileType: string
    fileName: string
    data: string
  }
  nftwebsite: string
  nftissuerName: string
  content: NFTIssueData
  iconType: NFTIssueParamsIconType
  checkOnly?: boolean
}

export interface NFTIssueData {
  nftType: string
  classifyList: string
  originalFileTxid: {
    fileType: string
    fileName: string
    data: string
  }
  contentTxId: string
}

export interface NFTGenesisParams {
  nftTotal?: string
  seriesName?: string
  checkOnly?: boolean
}

export interface NFTLIstRes extends MetaIdJsRes {
  data: NFTListItem[]
}

export interface NFTListItem {
  nftBalance: number
  nftCodehash: string
  nftDesc: string
  nftGenesis: string
  nftGenesisTxid: string
  nftIcon: string
  nftIssuer: string
  nftName: string
  nftSymbol: undefined
  nftTimestamp: number
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
  data: {
    nftname: string
    nftdesc: string
    nfticon: string
    nftwebsite: string
    nftissuerName: string
    nftType: string
    classifyList: string
    originalFileTxid: string
    contentTxId?: string
  }
  nftDataStr?: string
}

export interface GetMcRes extends ApiResponse {
  data: FTItem[]
}

export interface FTItem {
  balance: number
  codehash: string
  decimal: number
  genesis: string
  name: string
  pendingBalance: number
  sensibleId: string
  symbol: string
}

export interface ApiResponse {
  code: number
  msg: string
  count: number
  data: any
}

export interface MetaFile {
  base64Data: string
  BufferData: string
  hexData: string
  name: string
  data_type: string
  raw: null | File
  metaFileTxId?: string
}

export interface CreateMetaAccessContentProrocolParams {
  createTime: number
  updateTime: number
  metaAccessService: string
  metaAccessServiceConfigMetanetID: string
  serverCode: string
  serverPublicKey: string
  publicContent: string
  encryptContent: string
  title: string
  cover: MetaFile
  artMark: string
}

export interface CreateMetaAccessProrocolParams
  extends CreateMetaAccessContentProrocolParams {
  amount: number
}
export interface AppMsg {
  name: string
  website: string
  mode: AppMode
  isProduction?: boolean 
}

export interface SendMetaDataTxParams extends CreateMetaFileProtocolOption {
  data: string | ArrayBuffer
  nodeName: string
  brfcId: string 
  attachments?: string[]
  path: string
  payCurrency?: string
  payTo?: { amount: number; address: string }[]
  needConfirm?: boolean
  encrypt?: Encrypt
  dataType?: string
  encoding?: string
  checkOnly?: boolean

  ecdh?: {
    publickey: string 
    type: string 
  }
  nodeKey?: string 
  version?: string 
}

export interface CreateMetaFileProtocolOption {
  nodeName?: string
  brfcId?: string 
  attachments?: string[]
  path?: string
  payCurrency?: string
  payTo?: { amount: number; address: string }[]
  needConfirm?: boolean
  encrypt?: Encrypt
  dataType?: string
  encoding?: string
  checkOnly?: boolean

  ecdh?: {
    publickey: string 
    type: string 
  }
  nodeKey?: string 
  version?: string 
}

export interface SendMetaFileRes extends SendMetaDataTxResData {
  progressRate?: number
}

export interface GetNFTCountRes extends ApiResponse {
  data: {
    address: string
    count: number
    pendingCount: number
  }
}
