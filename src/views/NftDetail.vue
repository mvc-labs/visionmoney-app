<template>
  <div class="home-container" :class="[isMobileSafari ? 'safari-container' : '']">
    <div class="home-specific">
      <div class="nft-container">
        <div class="top-line">
          <ArrowLeft class="back-style" @click="goBack()" />
          <div class="center-text">NFT Details</div>
        </div>
        <div class="nft-info" v-if="dataSource">
          <img :src="getFullImageUrl()" alt="" class="icon-style" />
          <div class="nft-name">{{ dataSource.nftName }} #{{ route.params.index }}</div>
          <div class="price" v-if="route.params.status === 'true'">
            Price:{{ new Decimal(route.params.price).div(10 ** 8).toNumber() }} Space
          </div>
          <div class="button" v-if="route.params.status === 'false'">
            <div class="sale" @click="saleModal">Sale</div>
            <div class="transfer" @click="transferModal">Transfer</div>
          </div>
          <div class="offsale-button" v-else>
            <div class="offsale" @click="offSaleModal">Off Sale</div>
          </div>
          <div class="text">
            <div class="desc">
              <div class="left gray">Introduction</div>
              <div class="right" ref="rightContent" :class="{ expanded: expanded }">
                {{ dataSource.desc }}
              </div>
              <div v-if="showExpandButton" class="func-button" @click="openInfoModal">All</div>
            </div>
            <div class="index">
              <div class="left gray">Token Index</div>
              <div class="right">#{{ route.params.index }}</div>
            </div>
            <div class="creator">
              <div class="left gray">Creator</div>
              <div class="right">{{ dataSource.creator }}</div>
            </div>
            <div class="creater-time">
              <div class="left gray">Create Time</div>
              <div class="right">{{ $filters.dateTimeFormat(dataSource.creatorTimestamp) }}</div>
            </div>
            <div class="genesis">
              <div class="left gray">Series Genesis</div>
              <div class="right">{{ route.params.genesis }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isSaleModalVisible" class="sale-overlay">
        <div class="modal">
          <img
            src="@/assets/image/pop_icon_close.png"
            alt=""
            @click="closeModal"
            class="close-style"
            v-if="isSellConfirm"
          />
          <div class="sell-content" v-if="isSellConfirm">
            <div class="title-line">Sell</div>
            <div class="transfer-content">
              <div class="info-area">
                <img :src="getFullImageUrl()" alt="" class="left-img" />
                <div class="right-info">
                  <div class="name">{{ dataSource.nftName }}</div>
                  <div class="index">#{{ route.params.index }}</div>
                </div>
              </div>
              <div class="input-area">
                <div class="text-style">Selling price</div>
                <el-input v-model="sellPrice" placeholder="Set Selling price" class="top-input">
                  <template #suffix>
                    <div>SPACE</div>
                  </template>
                </el-input>
              </div>
              <div class="button-area">
                <div
                  class="transfer-button"
                  @click="Sell"
                  :class="[!isSellInfoComplete || isSellOperating ? 'isComplete' : '']"
                >
                  {{ isSellOperating ? 'Operating...' : 'Sell' }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="isSaleSuccess" class="sale-success">
            <div class="success-message">
              <img src="../assets/image/pop_icon_suc.png" alt="" />
              <div class="message-text">Sell Successful</div>
            </div>
            <div class="button-area">
              <div class="done-button" @click="jumpToNfts()">Done</div>
            </div>
          </div>
          <div v-if="isSaleFault" class="sale-fault">
            <div class="fault-message">
              <img src="../assets/image/pop_icon_fai.png" alt="" />
              <div class="message-text">Sell Failed</div>
              <div class="fault-text">{{ saleFaultMessage }}</div>
            </div>
            <div class="button-area">
              <div class="done-button" @click="closeModal">Done</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isOffSaleModalVisible" class="offsale-overlay">
        <div class="modal">
          <img
            src="@/assets/image/pop_icon_close.png"
            alt=""
            @click="closeModal"
            class="close-style"
            v-if="isConfirmArea"
          />
          <div v-show="isConfirmArea" class="confirm-area">
            <div class="title-line">Confirm Offsell</div>
            <div class="offsale-content">
              <div class="info-area">
                <img :src="getFullImageUrl()" alt="" class="left-img" />
                <div class="right-info">
                  <div class="name">{{ dataSource.nftName }}</div>
                  <div class="index">#{{ route.params.index }}</div>
                </div>
              </div>
              <div class="button-area">
                <div class="cancel-button" @click="CancelOffSell">Cancel</div>
                <div
                  class="confirm-button"
                  @click="Confirm"
                  :class="[isOffSellOperating ? 'isComplete' : '']"
                >
                  {{ isOffSellOperating ? 'Operating...' : 'Confirm' }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="isOffsaleSuccess" class="offsale-success">
            <div class="success-message">
              <img src="../assets/image/pop_icon_suc.png" alt="" />
              <div class="message-text">Offsell Successful</div>
            </div>
            <div class="button-area">
              <div class="done-button" @click="jumpToNfts()">Done</div>
            </div>
          </div>
          <div v-if="isOffsaleFault" class="offsale-fault">
            <div class="fault-message">
              <img src="../assets/image/pop_icon_fai.png" alt="" />
              <div class="message-text">Offsell Failed</div>
              <div class="fault-text">{{ offsellFaultMessage }}</div>
            </div>
            <div class="button-area">
              <div class="done-button" @click="closeModal">Done</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isTransferModalVisible" class="transfer-overlay">
        <div class="modal">
          <img
            src="@/assets/image/pop_icon_close.png"
            alt=""
            @click="closeModal"
            class="close-style"
            v-if="transferProcess"
          />
          <div class="title-line" v-show="transferProcess">Transfer</div>

          <div v-show="transferProcess">
            <div class="transfer-content">
              <div class="info-area">
                <img :src="getFullImageUrl()" alt="" class="left-img" />
                <div class="right-info">
                  <div class="name">{{ dataSource.nftName }}</div>
                  <div class="index">#{{ route.params.index }}</div>
                </div>
              </div>
              <div class="input-area">
                <div class="text-style">Transfer Account</div>
                <el-input
                  v-model="transferAddress"
                  placeholder="Wallet Address"
                  class="top-input"
                />
              </div>
              <div class="button-area">
                <div
                  class="transfer-button"
                  @click="Transfer"
                  :class="[!isTransferInfoComplete || isTransferOperating ? 'isComplete' : '']"
                >
                  {{ isTransferOperating ? 'Operating...' : 'Transfer' }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="transferSuccess">
            <div class="transfer-success">
              <!-- <img
                src="@/assets/image/pop_icon_close.png"
                alt=""
                @click="closeModal"
                class="close-style"
              /> -->
              <div class="send-message">
                <img src="../assets/image/pop_icon_suc.png" alt="" />
                <div class="message-text">Transfer Successful</div>
              </div>
              <div class="send-info">
                <div class="address">
                  <div>Address</div>
                  <div>{{ transferAddress }}</div>
                </div>
                <div class="time">
                  <div>Time</div>
                  <div>{{ $filters.dateTimeFormat(Date.now()) }}</div>
                </div>
                <div class="tx">
                  <div>TX</div>
                  <div @click="jumpToScan(txId)">{{ truncateString(txId, 20) }}</div>
                </div>
              </div>
              <div class="button-area">
                <div class="done-button" @click="jumpToNfts">Done</div>
              </div>
            </div>
          </div>
          <div v-if="transferFault">
            <div class="transfer-fault">
              <img
                src="@/assets/image/pop_icon_close.png"
                alt=""
                @click="closeModal"
                class="close-style"
              />
              <div class="fault-message">
                <img src="../assets/image/pop_icon_fai.png" alt="" />
                <div class="message-text">Transfer Failed</div>
                <div class="fault-text">{{ transferFaultMessage }}</div>
              </div>
              <div class="button-area">
                <div class="done-button" @click="closeModal">Done</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isInfoModalVisible" class="info-overlay">
        <div class="modal">
          <img
            src="@/assets/image/pop_icon_close.png"
            alt=""
            @click="closeModal"
            class="close-style"
          />
          <div class="title-line">NFT Info</div>
          <div class="info-content">
            <div class="info-area">
              <div class="area-content" v-html="formattedText"></div>
            </div>
            <div class="button-area">
              <div class="transfer-button" @click="closeModal">Done</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed, watchEffect } from 'vue'

// import { ElMessage, Eloading } from "element-plus";
import { router } from '@/router'
import { useRoute, useRouter } from 'vue-router'
import { GetTxidForMetasv, decodeMvcToken, decryptPrivateKey } from '@/lib/api'
import { API_NET, API_TARGET, NftManager, mvc, Wallet } from 'meta-contract'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import Decimal from 'decimal.js-light'
import { useStore } from '@/store/index'
const store = useStore()
// @ts-ignore
const route = useRoute()
const dataSource = ref(null)
const isSaleModalVisible = ref(false)
const isTransferModalVisible = ref(false)
const isOffSaleModalVisible = ref(false)
const isInfoModalVisible = ref(false)
const isConfirmArea = ref(true)
const isOffsaleSuccess = ref(false)
const isOffsaleFault = ref(false)
const transferAddress = ref(null)
const sellPrice = ref(null)
const transferProcess = ref(true)
const transferSuccess = ref(false)
const transferFault = ref(false)
const isSellConfirm = ref(true)
const isSaleSuccess = ref(false)
const isSaleFault = ref(false)
const txId = ref(null)
const transferFaultMessage = ref(null)
const saleFaultMessage = ref(null)
const offsellFaultMessage = ref(null)
const isMobileSafari = ref(false)
const expanded = ref(false)
const showExpandButton = ref(false)
const rightContent = ref(null)
const isSellOperating = ref(false)
const isOffSellOperating = ref(false)
const isTransferOperating = ref(false)
const transferTimer = ref(null)
const sellTimer = ref(null)
const offsellTimer = ref(null)
const getNftInfo = async (metaTxid) => {
  const nftResponse = await GetTxidForMetasv(metaTxid)
  const finalResult = await decodeMvcToken({
    hex: nftResponse.outputs[0].lockScript,
    type: 'metaid',
  })
  const creatorTimestamp = nftResponse.txDetail.timestamp
  const issueTxId = nftResponse.txDetail.txid
  const finalDecode = finalResult.data.data
  const regexName = /"name":"(.*?)"/
  const matchName = finalDecode.match(regexName)
  // const regexImgUrl = /"icon":"metafile:\/\/([^"]*)"/
  // const regexImgUrl = /"icon":"metafile:\/\/(.*?)(?:\.png)?"/;
  // const matchImgUrl = finalDecode.match(regexImgUrl)
  const regexCreator = /"issuerName":"(.*?)"/
  const matchCreator = finalDecode.match(regexCreator)
  const regexDesc = /"desc":"(.*?)"/
  const matchDesc = finalDecode.match(regexDesc)

  return {
    nftName: matchName[1],
    // imageUrl: imgUrl,
    metaTxid: metaTxid,
    creator: matchCreator[1],
    desc: matchDesc[1],
    creatorTimestamp: creatorTimestamp,
    issueTxId: issueTxId,
  }
}
const checkDevice = () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (/Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent)) {
      isMobileSafari.value = true
    }
  }
}

onMounted(async () => {
  const metaTxid = route.params.metaTxid
  dataSource.value = await getNftInfo(metaTxid)
  checkDevice()
  updateButtonVisibility()
})
watchEffect(() => {
  updateButtonVisibility()
})

const formattedText = computed(() => {
  return dataSource.value.desc.replace(/\\n/g, '<br>')
})
const getFullImageUrl = () => {
  return `https://api.show3.io/metafile/metacontract/${route.params.codeHash}/${route.params.genesis}/${route.params.index}`
}
const isSellInfoComplete = computed(() => {
  return sellPrice.value
})
const isTransferInfoComplete = computed(() => {
  return transferAddress.value
})
function updateButtonVisibility() {
  if (rightContent.value) {
    const isOverflowed = rightContent.value.scrollWidth > rightContent.value.clientWidth
    showExpandButton.value = isOverflowed
  }
}
function jumpToScan(txid) {
  if (store.currentNet == 'Mainnet') {
    window.open(`https://www.mvcscan.com/tx/${txid}`)
  } else {
    window.open(`https://test.mvcscan.com/tx/${txid}`)
  }
}
function saleModal() {
  isSaleModalVisible.value = true
  isSellConfirm.value = true
  isSaleSuccess.value = false
  isSaleFault.value = false
}
function transferModal() {
  isTransferModalVisible.value = true
  transferProcess.value = true
  transferSuccess.value = false
  transferFault.value = false
}
function closeModal() {
  isSaleModalVisible.value = false
  isTransferModalVisible.value = false
  transferSuccess.value = false
  transferFault.value = false
  isSaleSuccess.value = false
  isSaleFault.value = false
  isInfoModalVisible.value = false
  isOffSaleModalVisible.value = false
  transferAddress.value = ''
  sellPrice.value = ''
}
function openInfoModal() {
  isInfoModalVisible.value = true
}
function offSaleModal() {
  isOffSaleModalVisible.value = true
}
function CancelOffSell() {
  isOffSaleModalVisible.value = false
}
function closeTransferModal() {}
function goBack() {
  router.go(-1)
}
function copyTx(tx: string) {
  toClipboard(tx).then(() => {
    ElMessage.success('Copy Success!')
  })
}
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    const truncatedStart = str.substring(0, maxLength / 2 - 2)
    const truncatedEnd = str.substring(str.length - maxLength / 2 + 2)
    return truncatedStart + '...' + truncatedEnd
  }
  return str
}
function jumpToNfts() {
  router.push({
    name: 'nfts',
  })
}

async function Transfer() {
  if (!isTransferInfoComplete.value || isTransferOperating.value) {
    return
  }
  isTransferOperating.value = true
  const privateKey = decryptPrivateKey(
    store.currentMvcWalletPrivateKey,
    store.mvcMainWalletInfo.publicKey
  )
  const mvcAddress = store.currentMvcWalletAddress
  const nftManager = new NftManager({
    network: store.currentNet === 'Mainnet' ? API_NET.MAIN : API_NET.TEST,
    apiTarget: API_TARGET.MVC,
    purse: privateKey,
  })

  const largestUtxo = await nftManager.api
    .getUnspents(mvcAddress)
    .then((utxos) => {
      return utxos.reduce((prev, curr) => {
        if (curr.satoshis > prev.satoshis) return curr
        return prev
      })
    })
    .then((utxo) => {
      // add wif to utxo
      return {
        ...utxo,
        wif: privateKey,
      }
    })

  const transferRes = await nftManager
    .transfer({
      codehash: route.params.codeHash,
      genesis: route.params.genesis,
      tokenIndex: route.params.index.toString(),
      senderWif: privateKey,
      receiverAddress: transferAddress.value,
      utxos: [largestUtxo],
    })
    .catch((err) => {
      transferFaultMessage.value = err.message
      transferProcess.value = false
      transferFault.value = true
      isTransferOperating.value = false
    })
  if (transferRes && transferRes.txid) {
    txId.value = transferRes.txid
    transferTimer.value = setTimeout(() => {
      transferProcess.value = false
      transferSuccess.value = true
      isTransferOperating.value = false
    }, 3000)
    // transferProcess.value = false
    // transferSuccess.value = true
    // isTransferOperating.value = false
  }
}
async function Sell() {
  if (!isSellInfoComplete.value || isSellOperating.value) {
    return
  }
  isSellOperating.value = true
  const privateKey = decryptPrivateKey(
    store.currentMvcWalletPrivateKey,
    store.mvcMainWalletInfo.publicKey
  )
  const mvcAddress = store.currentMvcWalletAddress
  const nftManager = new NftManager({
    network: store.currentNet === 'Mainnet' ? API_NET.MAIN : API_NET.TEST,
    apiTarget: API_TARGET.MVC,
    purse: privateKey,
  })

  const largestUtxo = await nftManager.api
    .getUnspents(mvcAddress)
    .then((utxos) => {
      return utxos.reduce((prev, curr) => {
        if (curr.satoshis > prev.satoshis) return curr
        return prev
      })
    })
    .then((utxo) => {
      // add wif to utxo
      return {
        ...utxo,
        wif: privateKey,
      }
    })

  // console.log('siyao', new mvc.PrivateKey(privateKey!, 'mainnet').toWIF().toString(), route.params)

  const SellRes = await nftManager
    .sell({
      codehash: route.params.codeHash,
      genesis: route.params.genesis,
      tokenIndex: route.params.index.toString(),
      sellerWif: privateKey,
      price: +sellPrice.value! * 10 ** 8,
      utxos: [largestUtxo],
    })
    .catch((err) => {
      saleFaultMessage.value = err.message
      isSellConfirm.value = false
      isSaleFault.value = true
      isSellOperating.value = false
    })
  if (SellRes && SellRes.txid) {
    // isSellConfirm.value = false
    // isSaleSuccess.value = true
    // isSellOperating.value = false
    sellTimer.value = setTimeout(() => {
      isSellConfirm.value = false
      isSaleSuccess.value = true
      isSellOperating.value = false
    }, 3000)
  }
}
async function Confirm() {
  isOffSellOperating.value = true
  const FEEB = 1
  const privateKey = decryptPrivateKey(
    store.currentMvcWalletPrivateKey,
    store.mvcMainWalletInfo.publicKey
  )
  const mvcAddress = store.currentMvcWalletAddress
  const wallet = new Wallet(
    privateKey,
    store.currentNet === 'Mainnet' ? API_NET.MAIN : API_NET.TEST,
    FEEB,
    API_TARGET.MVC
  )
  const merUtxo = await wallet.merge()
  const nftManager = new NftManager({
    network: store.currentNet === 'Mainnet' ? API_NET.MAIN : API_NET.TEST,
    apiTarget: API_TARGET.MVC,
    purse: privateKey,
  })

  const largestUtxo = await nftManager.api
    .getUnspents(mvcAddress)
    .then((utxos) => {
      return utxos.reduce((prev, curr) => {
        if (curr.satoshis > prev.satoshis) return curr
        return prev
      })
    })
    .then((utxo) => {
      // add wif to utxo
      return {
        ...utxo,
        wif: privateKey,
      }
    })
  const cancelSellRes = await nftManager
    .cancelSell({
      codehash: route.params.codeHash,
      genesis: route.params.genesis,
      tokenIndex: route.params.index.toString(),
      sellerWif: privateKey,
    })
    .catch((err) => {
      offsellFaultMessage.value = err.message
      isConfirmArea.value = false
      isOffsaleFault.value = true
      isOffSellOperating.value = false
    })
  if (cancelSellRes) {
    // isConfirmArea.value = false
    // isOffsaleSuccess.value = true
    // isOffSellOperating.value = false
    offsellTimer.value = setTimeout(() => {
      isConfirmArea.value = false
      isOffsaleSuccess.value = true
      isOffSellOperating.value = false
    }, 3000)
  }
}
onUnmounted(() => {
  clearTimeout(transferTimer.value)
  transferTimer.value = null
  clearTimeout(sellTimer.value)
  sellTimer.value = null
  clearTimeout(offsellTimer.value)
  offsellTimer.value = null
})
</script>
    
<style lang="scss" scoped>
.home-container {
  width: 35%;
  margin: 0 auto;
  height: calc(100vh - 100px);
  border-radius: 12px;
  opacity: 1;
  border: 2px solid #303133;
  box-sizing: border-box;
  box-shadow: 10px 10px 0px -1px #0f7bff;

  @media screen and (max-width: 1440px) {
    width: 45%;
    height: 720px;
  }
  @media screen and (max-width: 750px) {
    width: 90%;
    overflow: auto;
  }

  .home-specific {
    display: flex;
    flex-direction: column;

    // align-items: center;
    // text-align: left;
    .nft-container {
      padding: 0 16px 16px;

      .top-line {
        position: relative;
        width: 100%;
        font-size: 20px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #303133;
        height: 6vh;
        line-height: 6vh;
        text-align: center;

        .back-style {
          width: 30px;
          height: 30px;
          position: absolute;
          top: 10px;
          left: 0;
          cursor: pointer;
        }

        .center-text {
        }
      }

      .nft-info {
        display: flex;
        flex-direction: column;
        padding-top: 16px;

        .icon-style {
          width: 200px;
          margin: 0 auto;
        }
        .nft-name {
          text-align: center;
          font-size: 18px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #303133;
          margin-top: 20px;
        }

        .price {
          text-align: center;
          margin-top: 20px;
          font-size: 16px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
        }

        .button {
          display: flex;
          margin-top: 20px;

          .sale {
            box-sizing: border-box;
            background: #ffffff;
            border-radius: 12px;
            border: 2px solid #303133;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #0f7bff;
            padding: 15px;
            cursor: pointer;
            width: 49%;
            margin-right: 2%;
            text-align: center;
            box-shadow: 3px 3px 0px #303133;
          }

          .transfer {
            box-sizing: border-box;
            background: #0f7bff;
            border-radius: 12px;
            border: 2px solid #303133;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            padding: 15px;
            cursor: pointer;
            width: 49%;
            text-align: center;
            box-shadow: 3px 3px 0px #303133;
          }
        }

        .offsale-button {
          // margin: 0 auto;
          margin-top: 20px;
          display: flex;
          justify-content: center;

          .offsale {
            box-sizing: border-box;
            background: #0f7bff;
            border-radius: 12px;
            border: 2px solid #303133;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            padding: 15px;
            cursor: pointer;
            width: 49%;
            text-align: center;
            box-shadow: 3px 3px 0px #303133;
          }
        }

        .text {
          box-sizing: border-box;
          padding-top: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-top: 30px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          border-top: 1px solid rgba(48, 49, 51, 0.05);
          @media screen and (max-width: 750px) {
            word-wrap: break-word;
          }
          .desc {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            .left {
              // flex-grow: 2;
              width: 50%;
            }
            .right {
              width: 50%;
              white-space: nowrap; 
              overflow: hidden; 
              text-overflow: ellipsis; 
              text-align: right;
            }
            .func-button {
              color: #0f7bff;
              cursor: pointer;
            }
          }
          .index {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
          }
          .creator {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
          }
          .creater-time {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
          }
          .genesis {
            display: flex;
            justify-content: space-between;
            .left {
              width: 45%;
            }
            .right {
              width: 55%;
              text-align: right;
              word-break: break-all;
            }
          }
          .gray {
            color: #909399;
          }
        }
      }
    }

    .transfer-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9;

      .modal {
        background: #fff;
        text-align: center;
        position: relative;
        width: 25vw;
        // height: 50vh;
        // box-sizing: border-box;
        line-height: 1.4;
        border-radius: 12px;
        border: 2px solid #303133;
        box-sizing: border-box;
        @media screen and (max-width: 1440px) {
          width: 35vw;
        }
        @media screen and (max-width: 750px) {
          width: 75vw;
        }

        .close-style {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 12px;
          height: 12px;
          cursor: pointer;
        }

        .title-line {
          font-size: 18px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #303133;
          border-bottom: 2px solid #303133;
          padding: 15px 0;
        }

        .transfer-content {
          box-sizing: border-box;
          padding-top: 20px;
          padding: 36px 0;
          font-family: PingFang SC, PingFang SC;
          .info-area {
            display: flex;
            padding: 0 20px;
            box-sizing: border-box;

            .left-img {
              width: 100px;
            }

            .right-info {
              text-align: left;
              margin-left: 10px;

              .name {
                margin-bottom: 10px;
              }

              .index {
              }
            }
          }

          .input-area {
            padding: 20px;
            box-sizing: border-box;

            .text-style {
              text-align: left;
              margin-bottom: 10px;
            }

            .top-input {
            }

            .el-input {
              // border-radius: 16px;

              box-shadow: none !important;
              // border-color: transparent;
              // border: 2px solid #303133;
              // --el-input-border: var(--el-border);
              --el-input-hover-border: transparent;
              --el-input-focus-border: transparent;
              --el-input-transparent-border: 0 0 0 1px transparent inset;
              // --el-input-border-color: var(--el-border-color);
              // --el-input-border-radius: var(--el-border-radius-base);
              // --el-input-bg-color: var(--el-fill-color-blank);
              --el-input-hover-border-color: transparent;
              --el-input-clear-hover-color: transparent;
              --el-input-focus-border-color: transparent;
            }

            &:deep(.el-input__wrapper) {
              box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
              resize: none;
              cursor: default;
              border: 2px solid #303133;
            }

            .el-input__inner {
              // border: none;
            }
          }
        }

        .transfer-success {
          padding: 44px 24px 24px;

          .send-message {
            box-sizing: border-box;
            border-bottom: 1px solid #303133;
            box-sizing: border-box;
            margin-bottom: 20px;
            padding-bottom: 20px;
            font-size: 18px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;

            img {
              width: 64px;
              height: 64px;
            }
          }

          .send-info {
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #303133;
            box-sizing: border-box;

            .address {
              display: flex;
              justify-content: space-between;
              height: 5vh;
              margin-bottom: 10px;

              div:nth-child(1) {
                width: 20%;
                text-align: left;
              }

              div:nth-child(2) {
                width: 80%;
                text-align: right;
                word-wrap: break-word;
              }
            }

            .amounts {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }

            .time {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }

            .tx {
              display: flex;
              justify-content: space-between;

              div:nth-child(1) {
              }

              div:nth-child(2) {
                color: #0d78f6;
                cursor: pointer;
              }
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }

        .transfer-fault {
          padding: 44px 24px 24px;
          font-family: PingFang SC, PingFang SC;
          .fault-message {
            box-sizing: border-box;
            box-sizing: border-box;
            margin-bottom: 20px;
            padding-bottom: 20px;
            font-size: 18px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;

            img {
              width: 64px;
              height: 64px;
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }

        .button-area {
          padding: 0 20px;

          .transfer-button {
            background: #0f7bff;
            border-radius: 12px;
            border: 2px solid #303133;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            box-sizing: border-box;
            padding: 15px;
            cursor: pointer;
            margin-top: 20px;
            box-shadow: 3px 3px 0px #303133;
          }
          .isComplete {
            background-color: #edeff2 !important;
            color: #bfc2cc !important;
            border: 2px solid #bfc2cc !important;
            box-shadow: 3px 3px 0px #bfc2cc !important;
          }
          .done-button {
            background: #0f7bff;
            border-radius: 12px;
            border: 2px solid #303133;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            box-sizing: border-box;
            padding: 15px;
            cursor: pointer;
            margin-top: 20px;
            box-shadow: 3px 3px 0px #303133;
          }
        }
      }
    }

    .sale-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9;

      .modal {
        background: #fff;
        text-align: center;
        position: relative;
        width: 25vw;
        // height: 50vh;
        // box-sizing: border-box;
        line-height: 1.4;
        border-radius: 12px;
        border: 2px solid #303133;
        box-sizing: border-box;
        @media screen and (max-width: 1440px) {
          width: 35vw;
        }
        @media screen and (max-width: 750px) {
          width: 75vw;
        }

        .close-style {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 12px;
          height: 12px;
          cursor: pointer;
        }

        .sell-content {
          font-family: PingFang SC, PingFang SC;
          .title-line {
            font-size: 18px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;
            border-bottom: 2px solid #303133;
            padding: 15px 0;
          }

          .transfer-content {
            box-sizing: border-box;
            padding-top: 20px;
            padding: 36px 0;

            .info-area {
              display: flex;
              padding: 0 20px;
              box-sizing: border-box;
              .left-img {
                width: 100px;
              }

              .right-info {
                text-align: left;
                margin-left: 10px;

                .name {
                  margin-bottom: 10px;
                }

                .index {
                }
              }
            }

            .input-area {
              padding: 20px;
              box-sizing: border-box;

              .text-style {
                text-align: left;
                margin-bottom: 10px;
              }

              .top-input {
              }

              .el-input {
                // border-radius: 16px;

                box-shadow: none !important;
                // border-color: transparent;
                // border: 2px solid #303133;
                // --el-input-border: var(--el-border);
                --el-input-hover-border: transparent;
                --el-input-focus-border: transparent;
                --el-input-transparent-border: 0 0 0 1px transparent inset;
                // --el-input-border-color: var(--el-border-color);
                // --el-input-border-radius: var(--el-border-radius-base);
                // --el-input-bg-color: var(--el-fill-color-blank);
                --el-input-hover-border-color: transparent;
                --el-input-clear-hover-color: transparent;
                --el-input-focus-border-color: transparent;
              }

              &:deep(.el-input__wrapper) {
                box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
                resize: none;
                cursor: default;
                border: 2px solid #303133;
              }

              .el-input__inner {
                // border: none;
              }
            }

            .button-area {
              padding: 0 20px;

              .transfer-button {
                background: #0f7bff;
                border-radius: 12px;
                border: 2px solid #303133;
                font-size: 16px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                color: #ffffff;
                box-sizing: border-box;
                padding: 15px;
                cursor: pointer;
                margin-top: 20px;
                box-shadow: 3px 3px 0px #303133;
              }
              .isComplete {
                background-color: #edeff2 !important;
                color: #bfc2cc !important;
                border: 2px solid #bfc2cc !important;
                box-shadow: 3px 3px 0px #bfc2cc !important;
              }
            }
          }
        }

        .sale-success {
          box-sizing: border-box;
          padding: 40px 36px 36px;
          font-family: PingFang SC, PingFang SC;
          .success-message {
            img {
              width: 60px;
              height: 60px;
            }

            .message-text {
              margin: 10px 0;
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }

        .sale-fault {
          box-sizing: border-box;
          padding: 40px 36px 36px;
          font-family: PingFang SC, PingFang SC;
          .fault-message {
            img {
              width: 60px;
              height: 60px;
            }

            .message-text {
              margin: 10px 0;
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }
      }
    }
    .info-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9;

      .modal {
        background: #fff;
        text-align: center;
        position: relative;
        width: 25vw;
        // height: 50vh;
        // box-sizing: border-box;
        line-height: 1.4;
        border-radius: 12px;
        border: 2px solid #303133;
        box-sizing: border-box;
        @media screen and (max-width: 1440px) {
          width: 35vw;
        }
        @media screen and (max-width: 750px) {
          width: 75vw;
        }

        .close-style {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 12px;
          height: 12px;
          cursor: pointer;
        }
        .title-line {
          font-size: 18px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #303133;
          border-bottom: 2px solid #303133;
          padding: 15px 0;
        }

        .info-content {
          box-sizing: border-box;
          padding: 16px;
          padding-bottom: 30px;

          .info-area {
            // height: 15vh;
            overflow: auto;
            display: flex;
            justify-content: center;
            align-content: center;
            max-height: 30vh;
            .area-content {
              text-align: left;
            }
            // @media screen and (max-width: 1440px) {
            //   width: 35vw;
            // }
            // @media screen and (max-width: 750px) {
            //   width: 75vw;
            // }
            .left-img {
            }

            .right-info {
              text-align: left;
              margin-left: 10px;

              .name {
                margin-bottom: 10px;
              }

              .index {
              }
            }
          }

          .input-area {
            padding: 20px;
            box-sizing: border-box;

            .text-style {
              text-align: left;
              margin-bottom: 10px;
            }

            .top-input {
            }

            .el-input {
              // border-radius: 16px;

              box-shadow: none !important;
              // border-color: transparent;
              // border: 2px solid #303133;
              // --el-input-border: var(--el-border);
              --el-input-hover-border: transparent;
              --el-input-focus-border: transparent;
              --el-input-transparent-border: 0 0 0 1px transparent inset;
              // --el-input-border-color: var(--el-border-color);
              // --el-input-border-radius: var(--el-border-radius-base);
              // --el-input-bg-color: var(--el-fill-color-blank);
              --el-input-hover-border-color: transparent;
              --el-input-clear-hover-color: transparent;
              --el-input-focus-border-color: transparent;
            }

            &:deep(.el-input__wrapper) {
              box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
              resize: none;
              cursor: default;
              border: 2px solid #303133;
            }

            .el-input__inner {
              // border: none;
            }
          }

          .button-area {
            padding: 0;

            .transfer-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }

        .sale-success {
          box-sizing: border-box;
          padding: 40px 36px 36px;
          font-family: PingFang SC, PingFang SC;
          .success-message {
            img {
              width: 60px;
              height: 60px;
            }

            .message-text {
              margin: 10px 0;
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }

        .sale-fault {
          box-sizing: border-box;
          padding: 40px 36px 36px;
          font-family: PingFang SC, PingFang SC;
          .fault-message {
            img {
              width: 60px;
              height: 60px;
            }

            .message-text {
              margin: 10px 0;
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }
      }
      ::-webkit-scrollbar {
        display: none !important;
      }
    }
    .offsale-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9;

      .modal {
        background: #fff;
        text-align: center;
        position: relative;
        width: 25vw;
        // height: 50vh;
        // box-sizing: border-box;
        line-height: 1.4;
        border-radius: 12px;
        border: 2px solid #303133;
        box-sizing: border-box;
        @media screen and (max-width: 1440px) {
          width: 35vw;
        }
        @media screen and (max-width: 750px) {
          width: 75vw;
        }

        .close-style {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 12px;
          height: 12px;
          cursor: pointer;
        }

        .confirm-area {
          font-family: PingFang SC, PingFang SC;
          .title-line {
            font-size: 18px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;
            border-bottom: 2px solid #303133;
            padding: 15px 0;
          }

          .offsale-content {
            box-sizing: border-box;
            padding-top: 20px;
            padding: 36px 0;

            .info-area {
              display: flex;
              padding: 0 20px;
              .left-img {
                width: 100px;
              }

              .right-info {
                text-align: left;
                margin-left: 10px;

                .name {
                  margin-bottom: 10px;
                }

                .index {
                }
              }
            }

            .button-area {
              box-sizing: border-box;
              display: flex;
              padding: 0 20px;
              margin-top: 20px;

              .cancel-button {
                box-sizing: border-box;
                background: #ffffff;
                border-radius: 12px;
                border: 2px solid #303133;
                font-size: 16px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                color: #0f7bff;
                padding: 15px;
                cursor: pointer;
                width: 45%;
                margin-right: 10%;
                text-align: center;
                box-shadow: 3px 3px 0px #303133;
              }

              .confirm-button {
                box-sizing: border-box;
                background: #0f7bff;
                border-radius: 12px;
                border: 2px solid #303133;
                font-size: 16px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                color: #ffffff;
                padding: 15px;
                cursor: pointer;
                width: 45%;
                text-align: center;
                box-shadow: 3px 3px 0px #303133;
              }
              .isComplete {
                background-color: #edeff2 !important;
                color: #bfc2cc !important;
                border: 2px solid #bfc2cc !important;
                box-shadow: 3px 3px 0px #bfc2cc !important;
              }
            }
          }
        }

        .offsale-success {
          box-sizing: border-box;
          padding: 40px 36px 36px;
          font-family: PingFang SC, PingFang SC;
          .success-message {
            img {
              width: 60px;
              height: 60px;
            }

            .message-text {
              margin: 10px 0;
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }

        .offsale-fault {
          box-sizing: border-box;
          padding: 40px 36px 36px;
          font-family: PingFang SC, PingFang SC;
          .fault-message {
            img {
              width: 60px;
              height: 60px;
            }

            .message-text {
              margin: 10px 0;
            }
          }

          .button-area {
            padding: 0;

            .done-button {
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              box-sizing: border-box;
              padding: 15px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 3px 3px 0px #303133;
            }
          }
        }
      }
    }
  }
}
.safari-container {
  height: calc(100vh - 175px);
}
</style>
    