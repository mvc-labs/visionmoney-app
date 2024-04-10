<template>
  <div class="home-container" :class="[isMobileSafari ? 'safari-container' : '']">
    <div class="home-specific">
      <Menu :activeIndex="activeIndex"></Menu>
      <!-- {{ store.currentMvcWalletAddress }} -->
      <div class="balance-container">
        <div class="center-content">
          <div class="amount">
            <div v-if="store.currentShowWallet == 'MVC'">
              <div class="dollar">$ {{ spaceUsdBalance }}</div>
              <div class="mvc">{{ spaceBalance }} SPACE</div>
            </div>
            <div v-else>
              <div class="dollar">$ {{ btcUsdBalance }}</div>
              <div class="mvc">{{ btcBalance }} BTC</div>
            </div>
          </div>

          <div class="func-button">
            <div class="receive normal" @click="receiveSpace">
              <img src="../assets//image/wallet_icon_receive.png" alt="" />
              <div>Receive</div>
            </div>
            <div class="buy normal" @click="buySpace" v-if="store.currentShowWallet == 'MVC'">
              <img src="../assets/image/wallet_icon_buy.png" alt="" />
              <div>Buy</div>
            </div>
            <div class="buy normal" @click="buyBtc" v-else>
              <img src="../assets/image/wallet_icon_buy.png" alt="" />
              <div>Buy</div>
            </div>
            <div class="send normal" @click="sendSpace" v-if="store.currentShowWallet == 'MVC'">
              <img src="../assets/image/wallet_icon_send.png" alt="" />
              <div>Send</div>
            </div>
            <div class="buy normal" @click="sendBtc" v-else>
              <img src="../assets/image/wallet_icon_buy.png" alt="" />
              <div>Send</div>
            </div>
          </div>
        </div>

        <div v-if="store.currentShowWallet == 'MVC'" class="tx-container">
          <div class="tx-records" v-if="mvcTxData.length">
            <div class="records-header">
              <div class="left">Transaction Records</div>
              <div class="right">
                <!-- <img src="../assets/image/icon_filter.png" alt=""> -->
              </div>
            </div>
            <div
              class="tx-content"
              v-infinite-scroll="loadMvcData"
              infinite-scroll-immediate="false"
              :infinite-scroll-disabled="isMvcLoading"
            >
              <div class="tx-spec" v-for="(item, index) in mvcTxData" :key="index">
                <div class="left">
                  <div :class="[item.income - item.outcome > 0 ? 'come-active' : '']">
                    {{
                      new Decimal(item.income - item.outcome).div(10 ** 8).toNumber() * spaceRates >
                      0
                        ? '+' +
                          parseFloat(
                            new Decimal(item.income - item.outcome).div(10 ** 8).toNumber() *
                              spaceRates
                          ).toFixed(4)
                        : parseFloat(
                            new Decimal(item.income - item.outcome).div(10 ** 8).toNumber() *
                              spaceRates
                          ).toFixed(4)
                    }}
                    USD
                  </div>
                  <div>
                    {{
                      item.income - item.outcome > 0
                        ? '+' + new Decimal(item.income - item.outcome).div(10 ** 8).toNumber()
                        : new Decimal(item.income - item.outcome).div(10 ** 8).toNumber()
                    }}
                    SPACE
                  </div>
                </div>
                <div class="right">
                  <div class="right-top">
                    <img
                      src="../assets/image/icon_tx_nor.png"
                      alt=""
                      @click="jumpToScan(item.txid)"
                    />
                  </div>
                  <div class="right-bottom">
                    {{ $filters.dateTimeFormat(item.time) }}
                  </div>
                </div>
              </div>
              <!-- <div
              v-loading="isLoading"
              element-loading-text="Loading..."
              class="loading-area"
              v-if="isShowLoading"
            ></div> -->
              <!-- <div v-if="noMore">No more</div> -->
              <!-- <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
              <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
            </ul> -->
            </div>
          </div>
          <div class="tx-records nodata" v-else>
            <div class="show-area">
              <img src="../assets/image/icon_records_tx.png" alt="" />
              <div>All transaction records will be displayed here.</div>
            </div>
          </div>
        </div>

        <div v-else class="tx-container">
          <div class="tx-records" v-if="btcTxData.length">
            <div class="records-header">
              <div class="left">Transaction Records</div>
              <div class="right">
                <!-- <img src="../assets/image/icon_filter.png" alt=""> -->
              </div>
            </div>
            <div
              class="tx-content"
              v-infinite-scroll="loadBtcData"
              infinite-scroll-immediate="false"
              :infinite-scroll-disabled="isBtcLoading"
            >
              <div class="tx-spec" v-for="(item, index) in btcTxData" :key="index">
                <div class="left">
                  <div :class="[item.amount > 0 ? 'come-active' : '']">
                    {{
                      item.amount > 0
                        ? '+' + (item.amount * btcRates).toFixed(4)
                        : (item.amount * btcRates).toFixed(4)
                    }}
                    USD
                  </div>
                  <div>
                    {{ item.amount }}
                    BTC
                  </div>
                </div>
                <div class="right">
                  <div class="right-top">
                    <img
                      src="../assets/image/icon_tx_nor.png"
                      alt=""
                      @click="jumpToBtcScan(item.txId)"
                    />
                  </div>
                  <div class="right-bottom">
                    {{ $filters.dateTimeFormat(item.transactionTime.slice(0, -3)) }}
                  </div>
                </div>
              </div>
              <!-- <div
              v-loading="isLoading"
              element-loading-text="Loading..."
              class="loading-area"
              v-if="isShowLoading"
            ></div> -->
              <!-- <div v-if="noMore">No more</div> -->
              <!-- <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
              <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
            </ul> -->
            </div>
          </div>
          <div class="tx-records nodata" v-else>
            <div class="show-area">
              <img src="../assets/image/icon_records_tx.png" alt="" />
              <div>All transaction records will be displayed here.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isReceiveModalVisible" class="receive-overlay">
      <div class="modal">
        <img
          src="@/assets/image/pop_icon_close.png"
          alt=""
          @click="closeModal"
          class="close-style"
        />
        <div class="title-line">Receive</div>
        <div class="qr-code">
          <img
            :src="mvcQrCode"
            alt="Address QR Code"
            class="img-style"
            v-if="store.currentShowWallet == 'MVC'"
          />
          <img :src="btcQrCode" alt="Address QR Code" class="img-style" v-else />

          <!-- <div class="address">
            {{
              store.currentShowWallet == 'MVC'
                ? store.currentMvcWalletAddress
                : store.currentBtcWalletAddress
            }}
          </div> -->

          <div class="address" v-if="store.currentShowWallet == 'MVC'">
            {{ store.currentMvcWalletAddress }}
          </div>
          <div
            class="address"
            v-else-if="store.currentShowWallet == 'BTC' && store.currentBtcAddressType == 'Taproot'"
          >
            {{ truncateString(store.currentBtcWalletAddress, 40) }}
          </div>
          <div class="address" v-else>{{ store.currentBtcWalletAddress }}</div>
          <!-- truncateString(tokenInfo.contractTx, 20) -->
        </div>
        <div class="button-area">
          <div
            class="copy-button"
            @click="copyAddress(store.currentMvcWalletAddress)"
            v-if="store.currentShowWallet == 'MVC'"
          >
            Copy Address
          </div>
          <div class="copy-button" @click="copyAddress(store.currentBtcWalletAddress)" v-else>
            Copy Address
          </div>
        </div>
      </div>
    </div>

    <div v-if="isBuyModalVisible" class="buy-overlay">
      <div class="modal">
        <img
          src="@/assets/image/pop_icon_close.png"
          alt=""
          @click="closeModal"
          class="close-style"
        />
        <div class="title-line">Buy</div>
        <div class="trade-list">
          <div class="line">
            <div class="left">
              <img src="../assets/image/Z8rEfvic_400x400.png" alt="" class="logo-style" />
              <div class="text-style">SafeTrader</div>
            </div>
            <div class="right">
              <img
                src="../assets/image/icon_ins.png"
                alt=""
                class="arrow-style"
                @click="goTrade('safetrade')"
              />
            </div>
          </div>
          <div class="line">
            <div class="left">
              <img src="../assets/image/mexc-logo.png" alt="" class="logo-style" />
              <div class="text-style">MEXC</div>
            </div>
            <div class="right">
              <img
                src="../assets/image/icon_ins.png"
                alt=""
                class="arrow-style"
                @click="goTrade('mexc')"
              />
            </div>
          </div>
        </div>
        <!-- <div class="button-area">
          <div class="copy-button" @click="copyAddress(mvcAddress)">Copy Address</div>
        </div> -->
      </div>
    </div>

    <div v-if="isSendModalVisible" class="send-overlay">
      <div class="modal">
        <img
          src="@/assets/image/pop_icon_close.png"
          alt=""
          @click="closeModal"
          class="close-style"
        />
        <div class="title-line">Send</div>
        <div class="send-content">
          <div class="coin-info">
            <!-- <el-avatar src="../assets/image/login_img_1.png" class="avatar-style" /> -->
            <img src="../assets/image/token_icon_mvc.png" class="avatar-style" />
            <div class="current-amount">{{ spaceBalance }} SPACE</div>
            <div class="balance">Balance</div>
          </div>
          <div class="input-area">
            <el-input v-model="walletAddress" class="top-input" placeholder="Wallet Address">
            </el-input>

            <el-input v-model="amounts" placeholder="Amounts" @keyup="handleKeyUp">
              <template #suffix>
                <div class="text-style">SPACE</div>
              </template>
            </el-input>
            <div class="trans-usd">≈${{ transUsd }}</div>
            <div class="notice" :class="[compareBalance ? 'showNotice' : '']">
              Insufficient balance
            </div>
          </div>
          <div class="button-area">
            <div
              class="send-button"
              @click="send(mvcAddress)"
              :class="[!isInfoComplete || isOperating ? 'isComplete' : '']"
            >
              {{ isOperating ? 'Operating...' : 'Send' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isMessageModalVisible" class="message-overlay">
      <div class="modal">
        <img
          src="@/assets/image/pop_icon_close.png"
          alt=""
          @click="closeModal"
          class="close-style"
        />
        <div class="send-message">
          <img src="../assets/image/pop_icon_suc.png" alt="" />
          <div class="message-text">Transfer successful</div>
        </div>
        <div class="send-info">
          <div class="address">
            <div>Address</div>
            <div>{{ transferAddress }}</div>
          </div>
          <div class="amounts">
            <div>Amounts</div>
            <div>{{ transferSpace }} SPACE</div>
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
      </div>
    </div>

    <div v-if="sendFaultModalVisible" class="fault-overlay">
      <div class="modal">
        <img
          src="@/assets/image/pop_icon_close.png"
          alt=""
          @click="closeModal"
          class="close-style"
        />
        <div class="send-message">
          <img src="../assets/image/pop_icon_fai.png" alt="" />
          <div class="message-text">Transfer Failed</div>
          <div class="fail-message">{{ sendFaultMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  Ref,
  computed,
  inject,
  watchEffect,
} from 'vue'
import { API_NET, API_TARGET, NftManager, mvc, Wallet } from 'meta-contract'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import Menu from '@/components/menu.vue'
import Decimal from 'decimal.js-light'
import { getBalance, getMvcTxHistory, getRates, TxFetcher, getBtcTxHistory,decryptPrivateKey } from '@/lib/api'
import { useStore } from '@/store/index'
import { useQuery } from '@tanstack/vue-query'
// import { ta } from 'element-plus/es/locale'
// import { BtcWallet } from 'utxo-wallet-sdk/src/coin-bitcoin'
// import { BtcWallet } from '@/coin-bitcoin'
const store = useStore()
const activeIndex = ref('balance')
const isReceiveModalVisible = ref(false)
const isSendModalVisible = ref(false)
const isBuyModalVisible = ref(false)
const isMessageModalVisible = ref(false)
const sendFaultModalVisible = ref(false)
const mvcAddress = ref(null)
const walletAddress = ref('')
const amounts = ref(null)
const mvcTxData = ref([])
const btcTxData = ref([])
// const rates = ref(null)
const transferAddress = ref(null)
const transferSpace = ref(null)
const sendFaultMessage = ref(null)
const txId = ref(null)
const isMobileSafari = ref(false)
const lastFlag = ref('')
// const isLoading = ref(false)
const isShowLoading = ref(false)
const mvcLoading = ref(false)
const btcLoading = ref(false)
const isOperating = ref(false)
const txTimer = ref(null)
const isSpaceSend = ref(false)
// const loadMore = ref(false)
// const lastObject = ref({})
const btcTxParams = reactive({
  address: store.currentBtcWalletAddress,
  chain: 'btc',
  page: 1,
  limit: 10,
})

const loadMvcData = async () => {
  const currentAddress = store.currentMvcWalletAddress
  const infiniteParams = {
    address: currentAddress,
    limit: 20,
    flag: lastFlagExample.value,
    isConfirmed: 1,
  }
  getMvcTx(infiniteParams)
}

const loadBtcData = async () => {
  const currentAddress = store.currentBtcWalletAddress
  // const infiniteParams = {
  //   address: currentAddress,
  //   chain: 'btc',
  //   limit: 10,
  //   page: 1,
  // }
  btcTxParams.page += 1
  getBtcTx(btcTxParams)
}

const lastFlagExample = computed(() => {
  const { flag } = mvcTxData.value[mvcTxData.value.length - 1]
  return flag
})
const isMvcLoading = computed(() => {
  return mvcLoading.value
})
const isBtcLoading = computed(() => {
  return btcLoading.value
})
const transUsd = computed(() => {
  return amounts.value == 0 || amounts.value == null
    ? 0
    : parseFloat(amounts.value * spaceRates.value) < 0.01
    ? '<0.01'
    : parseFloat(amounts.value * spaceRates.value).toFixed(2)
})
const isInfoComplete = computed(() => {
  return (
    walletAddress.value &&
    amounts.value != 0 &&
    amounts.value != null &&
    amounts.value < spaceBalance.value
  )
})
const compareBalance = computed(() => {
  return amounts.value > spaceBalance.value
})
function closeModal() {
  isReceiveModalVisible.value = false
  isSendModalVisible.value = false
  isBuyModalVisible.value = false
  isMessageModalVisible.value = false
  sendFaultModalVisible.value = false
  walletAddress.value = ''
  amounts.value = null
}
function receiveSpace() {
  isReceiveModalVisible.value = true
}
function sendSpace() {
  isSendModalVisible.value = true
}
function buySpace() {
  isBuyModalVisible.value = true
}
function buyBtc() {
  ElMessage.warning(`Coming Soon`)
}
function sendBtc() {
  ElMessage.warning(`Coming Soon`)
}
function goTrade(name) {
  if (name == 'safetrade') {
    window.open('https://safe.trade/exchange/SPACE-USDT?type=basic')
  } else if (name == 'mexc') {
    window.open('https://www.mexc.com/zh-CN/exchange/SPACE_USDT')
  }
}
async function send() {
  if (!isInfoComplete.value || isOperating.value) {
    return
  }
  isOperating.value = true
  const FEEB = 1
  // const privateKey = store.currentMvcWalletPrivateKey
  const privateKey = decryptPrivateKey(store.currentMvcWalletPrivateKey,store.mvcMainWalletInfo.publicKey)
  const mvcAddress = store.currentMvcWalletAddress
  const wallet = new Wallet(
    privateKey,
    store.currentNet === 'Mainnet' ? API_NET.MAIN : API_NET.TEST,
    FEEB,
    API_TARGET.MVC
  )

  const walletInstance = toRaw(wallet)
  const sentRes = await walletInstance!
    .send(walletAddress.value, new Decimal(amounts.value).mul(10 ** 8).toNumber())
    .catch((err) => {
      sendFaultMessage.value = err.message
      isSendModalVisible.value = false
      sendFaultModalVisible.value = true
      isOperating.value = false
    })
  if (sentRes) {
    isSendModalVisible.value = false
    isMessageModalVisible.value = true
    transferAddress.value = walletAddress.value
    transferSpace.value = amounts.value
    txId.value = sentRes.txId
    isOperating.value = false
    const params = { address: mvcAddress, limit: 20 }
    txTimer.value = setTimeout(() => {
      isSpaceSend.value = true
      getMvcTx(params)
    }, 5000)
  }
}
function copyAddress(address) {
  toClipboard(address).then(() => {
    ElMessage.success('Copy Success!')
  })
}

const mvcQrCode = useQRCode(store.currentMvcWalletAddress)
const btcQrCode = useQRCode(store.currentBtcWalletAddress)

function jumpToScan(txid) {
  if (store.currentNet == 'Mainnet') {
    window.open(`https://www.mvcscan.com/tx/${txid}`)
  } else {
    window.open(`https://test.mvcscan.com/tx/${txid}`)
  }
}
function jumpToBtcScan(txid) {
  // if (store.currentNet == 'Mainnet') {
  //   window.open(`https://www.mvcscan.com/tx/${txid}`)
  // } else {
  //   window.open(`https://test.mvcscan.com/tx/${txid}`)
  // }
  window.open(`https://mempool.space/zh/tx/${txid}`)
}
function handleKeyUp() {
  const filteredValue = amounts.value.replace(/^\D*(\d*(?:\.\d{0,20})?).*/, '$1')

  amounts.value = filteredValue
}
function tabview(coin) {
  store.tabWallet(coin)
  // if (coin == 'mvc') {

  // } else {
  // }
}
function tabType(type) {
  store.tabBtcAddressType(type)
}
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    const truncatedStart = str.substring(0, maxLength / 2 - 2)
    const truncatedEnd = str.substring(str.length - maxLength / 2 + 2)
    return truncatedStart + '...' + truncatedEnd
  }
  return str
}
async function getMvcTx(params) {
  mvcLoading.value = true
  const res = await getMvcTxHistory(params)
  if (res) {
    if (isSpaceSend.value) {
      mvcTxData.value.length = 0
      mvcTxData.value.push(...res)
      isSpaceSend.value = false
    } else {
      mvcTxData.value.push(...res)
    }
    mvcLoading.value = false
  }
}
async function getBtcTx(params) {
  btcLoading.value = true
  const res = await getBtcTxHistory(params)
  if (res) {
    btcTxData.value.push(...res.data.transactionList)
    btcLoading.value = false
  }
}

const spaceBalance = computed(() => {
  return store.spaceBalance
})
const btcBalance = computed(() => {
  return store.btcBalance
})

const spaceUsdBalance = computed(() => {
  return store.spaceUsdBalance
})
const btcUsdBalance = computed(() => {
  return store.btcUsdBalance
})

const spaceRates = computed(() => {
  return store.spaceRates
})

const btcRates = computed(() => {
  return store.btcRates
})



const checkDevice = () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (/Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent)) {
      isMobileSafari.value = true
    }
  }
}

watchEffect(() => {
  if (store.currentBtcAddressType) {
    const btcParams = {
      net: store.currentNet == 'Mainnet' ? 'livenet' : 'testnet',
      address: store.currentBtcWalletAddress,
    }

    store.getBtcUsdBalance(btcParams)
  }
})
onMounted(() => {
  // const currentAddress = localStorage.getItem('currentAddress')
  // mvcAddress.value = store.currentWalletAddress

  const params = { address: store.currentMvcWalletAddress, limit: 20 }
  getMvcTx(params)


  const btcTxParams = { address: store.currentBtcWalletAddress, limit: 20 }
  if (store.currentNet == 'Mainnet') {
    getBtcTx(btcTxParams)
  } 

  store.getSpaceUsdBalance(store.currentMvcWalletAddress)
  const btcParams = {
    net: store.currentNet == 'Mainnet' ? 'livenet' : 'testnet',
    address: store.currentBtcWalletAddress,
  }

  store.getBtcUsdBalance(btcParams)
  checkDevice()
})

onUnmounted(() => {
  clearTimeout(txTimer.value)
  txTimer.value = null
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
  box-shadow: 10px 10px 0px 0px #0f7bff;
  @media screen and (max-width: 1440px) {
    width: 45%;
    height: 720px;
  }
  @media screen and (max-width: 750px) {
    width: 90%;
  }
  .home-specific {
    display: flex;
    flex-direction: column;
    height: 100%;
    .balance-container {
      height: calc(100% - 52px);
      .center-content {
        text-align: center;
        box-sizing: border-box;
        // padding: 60px 0;
        height: 42%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        @media screen and (max-width: 750px) {
          text-align: center;
          box-sizing: border-box;
          padding: 60px 0;
        }
        .amount {
          .dollar {
            font-size: 30px;
            font-family: Montserrat, Montserrat;
            font-weight: 700;
            color: #303133;
            margin-bottom: 20px;
            @media screen and (max-width: 750px) {
              font-family: PingFang SC, PingFang SC !important;
            }
          }

          .mvc {
            font-size: 19px;
            font-family: Montserrat, Montserrat;
            font-weight: 500;
            color: #606266;
            @media screen and (max-width: 750px) {
              font-size: 16px !important;
              font-family: PingFang SC, PingFang SC !important;
              font-weight: 400;
            }
          }
        }

        .func-button {
          display: flex;
          justify-content: center;
          margin-top: 30px;

          .normal {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #303133;
            margin-right: 60px;
            cursor: pointer;
            @media screen and (max-width: 750px) {
              display: flex;
              flex-direction: column;
              // margin-right: 40px !important;
              justify-content: center;
              align-items: center;
            }
            img {
              width: 54px;
              height: 54px;
              margin-bottom: 10px;
            }
          }
          .normal:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }

      .tx-container {
        height: 58%;
        box-sizing: border-box;
        .tx-records {
          padding: 16px;
          border-top: 2px solid #303133;
          box-sizing: border-box;
          height: 100%;
          .records-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            .left {
              font-size: 19px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #303133;
              @media screen and (max-width: 750px) {
                font-size: 18px !important;
              }
            }

            .right {
              img {
                width: 16px;
                height: 16px;
                cursor: pointer;
              }
            }
          }

          ::-webkit-scrollbar {
            display: none !important;
          }

          .tx-content {
            overflow: auto;
            height: calc(100% - 30px);
            @media screen and (max-width: 750px) {
              height: 250px;
            }
            .tx-spec {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-radius: 11px 11px 11px 11px;
              border: 2px solid #303133;
              box-sizing: border-box;
              padding: 16px;
              margin-bottom: 5px;

              .left {
                div:nth-child(1) {
                  font-size: 18px;
                  font-family: Montserrat, Montserrat;
                  font-weight: 600;
                  color: #303133;
                  margin-bottom: 5px;
                  @media screen and (max-width: 750px) {
                    font-size: 16px;
                    font-family: PingFang SC, PingFang SC;
                  }
                }

                div:nth-child(2) {
                  font-size: 12px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #606266;
                }

                .come-active {
                  color: #0f7bff !important;
                }
              }

              .right {
                text-align: right;

                .right-top {
                  img {
                    width: 14px;
                    height: 14px;
                    cursor: pointer;
                  }
                }

                .right-bottom {
                  font-size: 12px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #606266;
                  margin-top: 5px;
                }
              }
            }
            .loading-area {
              width: 100%;
              height: 10vh;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            ::-webkit-scrollbar {
              display: none !important;
            }

            .tx-spec:nth-last-child(1) {
              margin-bottom: 0;
            }
          }
        }
      }

      .nodata {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .show-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        div {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #909399;
        }
        img {
          width: 22px;
          height: 22px;
          margin-bottom: 20px;
        }
      }
    }
  }

  .receive-overlay {
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
      padding-bottom: 25px;
      border-radius: 12px;
      border: 2px solid #303133;
      box-sizing: border-box;
      @media screen and (max-width: 1200px) {
        width: 35vw;
      }
      @media screen and (max-width: 1000px) {
        width: 40vw;
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
        // height: 5vh;
        // line-height: 5vh;

        @media screen and (max-width: 750px) {
          font-size: 16px;
        }
      }

      .qr-code {
        .img-style {
          width: 12vw;
          @media screen and (max-width: 750px) {
            width: 40vw;
          }
        }

        .address {
          font-size: 16px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #303133;

          @media screen and (max-width: 1440px) {
            font-size: 14px;
          }
          @media screen and (max-width: 750px) {
            font-size: 12px;
          }
        }
      }
      .button-area {
        box-sizing: border-box;
        padding: 0 20px;

        .copy-button {
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

  .buy-overlay {
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
      // padding-bottom: 25px;
      border-radius: 12px;
      border: 2px solid #303133;
      box-sizing: border-box;
      @media screen and (max-width: 1440px) {
        width: 35vw;
      }
      @media screen and (max-width: 1000px) {
        width: 40vw;
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
        // height: 5vh;
        // line-height: 5vh;

        @media screen and (max-width: 750px) {
          font-size: 16px;
        }
      }

      .trade-list {
        box-sizing: border-box;
        padding: 20px;
        .line {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 20px;
          justify-content: space-between;
          .left {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          // justify-content: center;
          .logo-style {
            width: 50px;
            height: 50px;
            margin-right: 10px;
          }
          .text-style {
            font-size: 18px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;
          }
          .arrow-style {
            margin-left: 10px;
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
        }
        .line:last-child {
          margin-bottom: 0;
        }
      }
      .button-area {
        box-sizing: border-box;
        padding: 0 20px;

        .copy-button {
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

  .send-overlay {
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
        width: 30vw;
      }
      @media screen and (max-width: 750px) {
        width: 80vw;
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

      .send-content {
        box-sizing: border-box;
        padding-top: 20px;
        padding: 36px 0;

        .coin-info {
          .avatar-style {
            width: 64px;
            height: 64px;
          }

          .current-amount {
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;
          }

          .balance {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #909399;
          }
        }
        .input-area {
          padding: 20px;

          .top-input {
            margin-bottom: 10px;
          }
          .trans-usd {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #303133;
            text-align: left;
            margin-top: 10px;
          }
          .notice {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: red;
            text-align: left;
            margin-top: 10px;
            opacity: 0;
            // display: none;
          }
          .showNotice {
            opacity: 1;
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
            padding: 12px 16px;
            border-radius: 12px;
          }

          &:deep(.el-input__inner) {
            font-family: PingFang SC, PingFang SC;
            // border: none;
          }
          .text-style {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;
          }
        }
      }

      .button-area {
        padding: 0 20px;
        box-sizing: border-boxs;

        .send-button {
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

  .message-overlay {
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
      // box-sizing: border-box;
      line-height: 1.4;
      border-radius: 12px;
      border: 2px solid #303133;
      box-sizing: border-box;
      padding: 44px 24px 24px;
      width: 28vw;
      @media screen and (max-width: 750px) {
        width: 80vw;
      }
      .close-style {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 12px;
        height: 12px;
        cursor: pointer;
      }

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
          // height: 5vh;
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
    }
  }

  .fault-overlay {
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
      // box-sizing: border-box;
      line-height: 1.4;
      border-radius: 12px;
      border: 2px solid #303133;
      box-sizing: border-box;
      padding: 44px 24px 24px;
      width: 28vw;

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

      .send-message {
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
    }
  }
}
.safari-container {
  height: 100dvh;
  height: calc(100vh - 175px);
}
</style>
      