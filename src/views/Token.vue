<template>
  <div class="home-container" :class="[isMobileSafari ? 'safari-container' : '']">
    <div class="home-specific">
      <Menu :activeIndex="activeIndex"></Menu>
      <div class="mvc" v-if="store.currentShowWallet == 'MVC'">
        <div class="token-container" v-if="isMvcDataLoaded && mvcTokenData.length">
          <div class="token-mount">
            <div class="center-content">
              <div class="title">Total Value</div>
              <div class="value">${{ mvcTotalAmounts }}</div>
            </div>
          </div>
          <div class="token-list" v-infinite-scroll="load1">
            <div
              class="token-data"
              v-for="(item, index) in mvcTokenData"
              :key="index"
              @click="openSendModal(item)"
            >
              <div class="data-left">
                <el-avatar
                  :src="getFullImageUrl(item.icon)"
                  class="avatar-style"
                  v-if="item.icon"
                />
                <div class="name-bg" v-else>
                  <div class="number">{{ item.symbol.charAt(0).toUpperCase() }}</div>
                </div>
                <div class="name">
                  <div>{{ item.symbol }}</div>
                  <div>{{ item.name }}</div>
                </div>
              </div>
              <div class="data-right">
                <div>
                  {{
                    $filters.formatNum(
                      new Decimal(item.confirmed + item.unconfirmed)
                        .div(10 ** item.decimal)
                        .toNumber()
                    )
                  }}
                </div>
                <!-- <div>${{ new Decimal(item.confirmedString).div(10 **item.decimal) * rates}}</div> -->
                <div>
                  {{
                    item.rates ? '$' + ((item.rates * item.confirmed) / 10 ** 8).toFixed(2) : '-'
                  }}
                </div>
              </div>
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
                  <el-avatar :src="getSendImageUrl()" class="avatar-style" v-if="currentSendIcon" />
                  <div class="name-bg" v-else>
                    <div class="number">{{ ftSymbol.charAt(0).toUpperCase() }}</div>
                  </div>
                  <!-- <img :src="getSendImageUrl()" class="avatar-style" /> -->
                  <div class="current-amount">{{ ftBalance }} {{ ftSymbol }}</div>
                  <div class="balance">Balance</div>
                </div>
                <div class="input-area">
                  <el-input v-model="walletAddress" class="top-input" placeholder="Wallet Address">
                  </el-input>

                  <el-input v-model="amounts" placeholder="Amounts" @keyup="handleKeyUp">
                    <template #suffix>
                      <div class="text-style">{{ ftSymbol }}</div>
                    </template>
                  </el-input>
                  <!-- <div class="trans-usd">≈${{ transUsd }}</div> -->
                  <div class="notice" :class="[compareBalance ? 'showNotice' : '']">
                    Insufficient balance
                  </div>
                </div>
                <div class="button-area">
                  <div
                    class="send-button"
                    @click="send"
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
                  <div>{{ transferAmounts }} {{ ftSymbol }}</div>
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
        <div
          class="token-container"
          v-else-if="!isMvcDataLoaded"
          v-loading="!isMvcDataLoaded"
        ></div>
        <div class="nodata-page" v-else>
          <div class="show-area">
            <img src="../assets/image/nft_img_defualt@2x.png" alt="" class="big-img" />
            <div class="text-style">
              <span class="left-text">No more, go</span>
              <div @click="goExchange">
                <span class="right-text">exchange</span>
                <img src="../assets/image/icon_ins@2x.png" alt="" class="arrow-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="btc" v-else>
        <div class="token-container" v-if="isBtcDataLoaded && btcTokenData.length">
          <div class="token-mount">
            <div class="center-content">
              <div class="title">Total Value</div>
              <div class="value">${{ btcTotalAmounts }}</div>
            </div>
          </div>
          <div class="token-list" v-infinite-scroll="load1">
            <div
              class="token-data"
              v-for="(item, index) in btcTokenData"
              :key="index"
            >
              <div class="data-left">
                <el-avatar
                  :src="getFullImageUrl(item.icon)"
                  class="avatar-style"
                  v-if="item.icon"
                />
                <div class="name-bg" v-else>
                  <div class="number">{{ item.ticker.charAt(0).toUpperCase() }}</div>
                </div>
                <div class="name">
                  <div>{{ item.ticker }}</div>
                  <div>{{ item.ticker }}</div>
                </div>
              </div>
              <div class="data-right">
                <div class="top">
                  <div>{{ item.availableBalance }}</div>
                  <!-- <div>${{ new Decimal(item.confirmedString).div(10 **item.decimal) * rates}}</div> -->
                  <div>
                    {{
                      item.rates ? '$' + (item.rates * item.availableBalance).toFixed(2) : '-'
                    }}
                  </div>
                </div>
                <div class="bottom">
                  <div class="one-line">
                    <div class="left">Transferable:</div>
                    <div class="right">{{item.transferableBalance}}</div>
                  </div>
                  <div class="two-line">
                    <div class="left">Available:</div>
                    <div class="right">{{item.availableBalance}}</div>
                  </div>
                </div>
              </div>
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
                  <el-avatar :src="getSendImageUrl()" class="avatar-style" v-if="currentSendIcon" />
                  <div class="name-bg" v-else>
                    <div class="number">{{ ftSymbol.charAt(0).toUpperCase() }}</div>
                  </div>
                  <!-- <img :src="getSendImageUrl()" class="avatar-style" /> -->
                  <div class="current-amount">{{ ftBalance }} {{ ftSymbol }}</div>
                  <div class="balance">Balance</div>
                </div>
                <div class="input-area">
                  <el-input v-model="walletAddress" class="top-input" placeholder="Wallet Address">
                  </el-input>

                  <el-input v-model="amounts" placeholder="Amounts" @keyup="handleKeyUp">
                    <template #suffix>
                      <div class="text-style">{{ ftSymbol }}</div>
                    </template>
                  </el-input>
                  <!-- <div class="trans-usd">≈${{ transUsd }}</div> -->
                  <div class="notice" :class="[compareBalance ? 'showNotice' : '']">
                    Insufficient balance
                  </div>
                </div>
                <div class="button-area">
                  <div
                    class="send-button"
                    @click="send"
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
                  <div>{{ transferAmounts }} {{ ftSymbol }}</div>
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
        <div
          class="token-container"
          v-else-if="!isBtcDataLoaded"
          v-loading="!isBtcDataLoaded"
        ></div>
        <div class="nodata-page" v-else>
          <div class="show-area">
            <img src="../assets/image/nft_img_defualt@2x.png" alt="" class="big-img" />
            <div class="text-style">
              <span class="left-text">No more, go</span>
              <div @click="goExchange">
                <span class="right-text">exchange</span>
                <img src="../assets/image/icon_ins@2x.png" alt="" class="arrow-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
        
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'
import Menu from '@/components/menu.vue'
import { getMvcFt, getBtcFt, getMvcTokensRates, getBtcTokensRates, getFtUtxos,decryptPrivateKey } from '@/lib/api'
import { useStore } from '@/store/index'
import Decimal from 'decimal.js-light'
import { API_NET, FtManager } from 'meta-contract'

const store = useStore()
const activeIndex = ref('token')
const baseUrl = 'https://api.mvcscan.com/browser'
const mvcTokenData = reactive([])
const btcTokenData = reactive([])
const rates = ref(null)
const totalBalance = ref(null)
const isMobileSafari = ref(false)
const mvcTotalAmounts = ref(0)
const btcTotalAmounts = ref(0)
const isMvcDataLoaded = ref(false)
const isBtcDataLoaded = ref(false)
const isSendModalVisible = ref(false)
const isMessageModalVisible = ref(false)
const sendFaultModalVisible = ref(false)
const sendFaultMessage = ref(null)
const ftBalance = ref(null)
const ftSymbol = ref(null)
const transferAddress = ref('')
const transferAmounts = ref(null)
const txId = ref(null)
const isOperating = ref(false)
const currentSendIcon = ref(null)
const walletAddress = ref('')
const amounts = ref(null)
const ftCodeHash = ref(null)
const ftGenesis = ref(null)
const ftTimer = ref(null)
const ftDecimal = ref(null)
const ftUnconfirmed = ref(null)
const ftConfirmed = ref(null)
const handleSelect = (key: string, keyPath: string[]) => {
}
const compareBalance = computed(() => {
  return (
    parseFloat(amounts.value) >
    new Decimal(ftUnconfirmed.value + ftConfirmed.value).div(10 ** ftDecimal.value).toNumber()
  )
})
// const usdPrice = store.usdBalance
const checkDevice = () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (/Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent)) {
      isMobileSafari.value = true
    }
  }
}
const isInfoComplete = computed(() => {
  return (
    walletAddress.value &&
    parseFloat(amounts.value) != 0 &&
    parseFloat(amounts.value) != null &&
    parseFloat(amounts.value) <=
      new Decimal(ftUnconfirmed.value + ftConfirmed.value).div(10 ** ftDecimal.value).toNumber()
    // new Decimal(obj.confirmed + obj.unconfirmed).div(10 ** obj.decimal).toNumber()
  )
})
function tabview(coin) {
  store.tabWallet(coin)
  // if (coin == 'mvc') {

  // } else {
  // }
}
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    const truncatedStart = str.substring(0, maxLength / 2 - 2)
    const truncatedEnd = str.substring(str.length - maxLength / 2 + 2)
    return truncatedStart + '...' + truncatedEnd
  }
  return str
}
const load1 = () => {}
async function getMvcFtByAddress(address) {
  const res = await getMvcFt(address)
  if (res.code == 0) {
    mvcTokenData.length = 0
    mvcTokenData.push(...res.data.data)
    const result = await getMvcTokensRates()
    if (result) {
      mvcTokenData.forEach((item) => {
        const key = item.symbol
        if (result.data.priceInfo.hasOwnProperty(key)) {
          item.rates = result.data.priceInfo[key]
          // console.log(typeof((item.rates * item.confirmed)/ 10 ** 8))
          // console.log(typeof(Number((item.rates * item.confirmed/ 10 ** 8).toFixed(2))))
          // console.log(Number(item.rates * item.confirmed/ 10 ** 8).toFixed(2))
          // console.log(Number(((item.rates * item.confirmed)/ 10 ** 8).toFixed(2)))
          // totalAmounts.value += new Decimal(((item.rates * item.confirmed)/ 10 ** 8).toFixed(2))
          mvcTotalAmounts.value = new Decimal(mvcTotalAmounts.value)
            .plus(new Decimal((item.rates * item.confirmed) / 10 ** 8).toFixed(2))
            .toNumber()
        }
      })
      isMvcDataLoaded.value = true
    } else {
      isMvcDataLoaded.value = true
    }
  } else {
    isMvcDataLoaded.value = true
  }
}
function handleKeyUp() {
  const filteredValue = amounts.value.replace(/^\D*(\d*(?:\.\d{0,20})?).*/, '$1')
  amounts.value = filteredValue
}
function goExchange() {
  window.open('https://mvcswap.com/#/swap')
}
function getFullImageUrl(iconUrl) {
  return baseUrl + iconUrl
}
function getSendImageUrl() {
  return baseUrl + currentSendIcon.value
}
function jumpToScan(txid) {
  if (store.currentNet == 'Mainnet') {
    window.open(`https://www.mvcscan.com/tx/${txid}`)
  } else {
    window.open(`https://test.mvcscan.com/tx/${txid}`)
  }
}
function openSendModal(obj) {
  walletAddress.value = ''
  amounts.value = null
  // ftBalance.value = new Decimal(obj.confirmed + obj.unconfirmed).div(10 ** obj.decimal).toNumber()
  ftBalance.value = formatNum(
    new Decimal(obj.confirmed + obj.unconfirmed).div(10 ** obj.decimal).toNumber()
  )
  ftSymbol.value = obj.symbol
  currentSendIcon.value = obj.icon
  ftCodeHash.value = obj.codeHash
  ftGenesis.value = obj.genesis
  ftDecimal.value = obj.decimal
  ftUnconfirmed.value = obj.unconfirmed
  ftConfirmed.value = obj.confirmed
  isSendModalVisible.value = true
}
function closeModal() {
  isSendModalVisible.value = false
  sendFaultModalVisible.value = false
  isMessageModalVisible.value = false
}
async function send() {
  if (!isInfoComplete.value || isOperating.value) {
    return
  }
  isOperating.value = true

  const result = await getFtUtxos({
    address: store.currentMvcWalletAddress,
    codeHash: ftCodeHash.value,
    genesis: ftGenesis.value,
  })

  if (result) {
    const privateKey = decryptPrivateKey(store.currentMvcWalletPrivateKey,store.mvcMainWalletInfo.publicKey)
    const ftManager = new FtManager({
      network: store.currentNet === 'Mainnet' ? API_NET.MAIN : API_NET.TEST,
      purse: privateKey,
    })
    const params = { codehash: ftCodeHash.value, genesis: ftGenesis.value, ownerWif: privateKey }
    let quotient = Math.floor(result.length / 20)
    if (result.length != 1 && quotient >= 0) {
      for (let i = 0; i < quotient + 1; i++) {
        const merUtxo = await ftManager.merge(params)
      }
    }
    const largestUtxo = await ftManager.api
      .getUnspents(store.currentMvcWalletAddress)
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
    const transferRes = await ftManager
      .transfer({
        codehash: ftCodeHash.value,
        genesis: ftGenesis.value,
        senderWif: privateKey,
        receivers: [
          {
            address: walletAddress.value,
            amount: new Decimal(amounts.value).mul(10 ** ftDecimal.value).toNumber(),
          },
        ],
        utxos: [largestUtxo],
      })
      .catch((err) => {
        sendFaultMessage.value = err.message
        isSendModalVisible.value = false
        sendFaultModalVisible.value = true
        isOperating.value = false
      })

    if (transferRes && transferRes.txid) {
      isSendModalVisible.value = false
      isMessageModalVisible.value = true
      transferAddress.value = walletAddress.value
      transferAmounts.value = amounts.value
      txId.value = transferRes.txid
      isOperating.value = false
      ftTimer.value = setTimeout(() => {
        getMvcFtByAddress(store.currentWalletAddress)
      }, 5000)
    }
  }
}
function formatNum(num: any) {
  if (num == '--') {
    return '--'
  }
  num = new Decimal(num).toString().split('.')
  let arr = num[0].split('').reverse() 
  let res: any = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',')
    }
    res.push(arr[i])
  }
  res.reverse() 
  if (num[1]) {
   
    res = res.join('').concat('.' + num[1])
  } else {
    res = res.join('')
  }

  return res
}
const amountInSats = computed(() => {
  const _amount = Number(amounts.value)
  if (Number.isNaN(amounts)) return 0
  return _amount * 10 ** 8
})
// async function getRatesForTokens(){
//   const result = await getTokensRates()
//   if(result){
//     console.log(result.data.priceInfo[0])
//   }
// }
async function getBtcFtByAddress(params) {
  const res = await getBtcFt(params)
  if (res) {
    btcTokenData.length = 0
    btcTokenData.push(...res.data.list)
    const result = await getBtcTokensRates(params.net)
    if (result) {
      btcTokenData.forEach((item) => {
        const key = item.ticker.toLowerCase()
        if (result.data.priceInfo.hasOwnProperty(key)) {
          item.rates = result.data.priceInfo[key]
          // console.log(typeof((item.rates * item.confirmed)/ 10 ** 8))
          // console.log(typeof(Number((item.rates * item.confirmed/ 10 ** 8).toFixed(2))))
          // console.log(Number(item.rates * item.confirmed/ 10 ** 8).toFixed(2))
          // console.log(Number(((item.rates * item.confirmed)/ 10 ** 8).toFixed(2)))
          // totalAmounts.value += new Decimal(((item.rates * item.confirmed)/ 10 ** 8).toFixed(2))
          btcTotalAmounts.value = new Decimal(btcTotalAmounts.value)
            .plus(new Decimal(item.rates * item.availableBalance).toFixed(2))
            .toNumber()
        }
      })
      isBtcDataLoaded.value = true
    } else {
      isBtcDataLoaded.value = true
    }
  } else {
    isBtcDataLoaded.value = false
  }
}
onMounted(() => {
  // const currentAddress = store.currentWalletAddress
  // const currentAddress = '1GE6xYebznxPUbQwWqNowzYnQ8PSVwQEaS'
  // const currentAddress = '1Nc1zjzowZQMwnEGV6o9mKCuTU4qMEpqnF'

  getMvcFtByAddress(store.currentMvcWalletAddress)
    
  const btcParams = {
    net: store.currentNet == 'Mainnet' ? 'livenet' : 'testnet',
    address: store.currentBtcWalletAddress,
  }
  getBtcFtByAddress(btcParams)

  checkDevice()
})
onUnmounted(() => {
  clearTimeout(ftTimer.value)
  ftTimer.value = null
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
    width: 90% !important;
  }

  .home-specific {
    display: flex;
    flex-direction: column;
    height: 100%;
    // align-items: center;
    // text-align: left;

    .mvc {
      // height: 100%;
      // display: flex;
      // flex-direction: column;
      height: calc(100% - 52px);
      .token-container {
        box-sizing: border-box;
        padding: 0 21px;
        height: 100%;
        .token-mount {
          box-sizing: border-box;
          height: 22%;
          display: flex;
          align-items: center;
          justify-content: center;
          .center-content {
            display: flex;
            flex-direction: column;
            .title {
              font-size: 16px;
              font-family: Montserrat, Montserrat;
              font-weight: 400;
              color: #606266;
              margin-bottom: 11px;
              text-align: center;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }

            .value {
              font-size: 30px;
              font-family: Montserrat, Montserrat;
              font-weight: 700;
              color: #303133;
              text-align: center;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }
          }
        }

        .token-list {
          display: flex;
          box-sizing: border-box;
          flex-direction: column;
          height: 78%;
          overflow-x: hidden;
          overflow-y: auto;
          .token-data {
            display: flex;
            justify-content: space-between;
            border-radius: 11px 11px 11px 11px;
            border: 2px solid #303133;
            box-sizing: border-box;
            padding: 16px;
            margin-bottom: 11px;
            cursor: pointer;

            .data-left {
              display: flex;
              align-items: center;

              .avatar-style {
                box-sizing: border-box;
                border: 2px solid #303133;
                margin-right: 15px;
              }
              .name-bg {
                box-sizing: border-box;
                background: #edeff2;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #303133;
                margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                .number {
                  font-size: 18px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 500;
                  color: #303133;
                }
              }

              .name {
                box-sizing: border-box;

                div:nth-child(1) {
                  font-size: 16px;
                  font-family: Montserrat, Montserrat;
                  font-weight: 600;
                  color: #303133;
                  margin-bottom: 5px;
                  @media screen and (max-width: 750px) {
                    font-family: PingFang SC, PingFang SC;
                  }
                }

                div:nth-child(2) {
                  font-size: 12px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #606266;
                }
              }
            }

            .data-right {
              box-sizing: border-box;

              div:nth-child(1) {
                font-size: 16px;
                font-family: Montserrat, Montserrat;
                font-weight: 600;
                color: #303133;
                text-align: right;
                margin-bottom: 5px;
                @media screen and (max-width: 750px) {
                  font-family: PingFang SC, PingFang SC;
                }
              }

              div:nth-child(2) {
                font-size: 12px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                color: #606266;
                text-align: right;
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
                display: flex;
                flex-direction: column;
                align-items: center;
                .avatar-style {
                  width: 64px;
                  height: 64px;
                  border: 2px solid #303133;
                  border-radius: 50%;
                  margin-bottom: 5px;
                }
                .name-bg {
                  box-sizing: border-box;
                  background: #edeff2;
                  width: 64px;
                  height: 64px;
                  border-radius: 50%;
                  border: 2px solid #303133;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 5px;
                  .number {
                    font-size: 18px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 500;
                    color: #303133;
                  }
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

      .nodata-page {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100% - 52px);
        .show-area {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .big-img {
            width: 136px;
            height: 132px;
          }
          .text-style {
            font-size: 14px;
            font-family: Montserrat, Montserrat;
            font-weight: 500;
            color: #303133;
            display: flex;
            align-items: center;

            @media screen and (max-width: 750px) {
              font-family: PingFang SC, PingFang SC;
            }
            .left-text {
            }
            .right-text {
              color: #0f7bff;
              margin-left: 5px;
              cursor: pointer;
            }
            .arrow-img {
              width: 12px;
              height: 12px;
              margin-left: 5px;
              cursor: pointer;
            }
          }
        }
      }
    }

    .btc {
      // height: 100%;
      // display: flex;
      // flex-direction: column;
      height: calc(100% - 52px);
      .token-container {
        box-sizing: border-box;
        padding: 0 21px;
        height: 100%;
        .token-mount {
          box-sizing: border-box;
          height: 22%;
          display: flex;
          align-items: center;
          justify-content: center;
          .center-content {
            display: flex;
            flex-direction: column;
            .title {
              font-size: 16px;
              font-family: Montserrat, Montserrat;
              font-weight: 400;
              color: #606266;
              margin-bottom: 11px;
              text-align: center;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }

            .value {
              font-size: 30px;
              font-family: Montserrat, Montserrat;
              font-weight: 700;
              color: #303133;
              text-align: center;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }
          }
        }

        .token-list {
          display: flex;
          box-sizing: border-box;
          flex-direction: column;
          height: 78%;
          overflow-x: hidden;
          overflow-y: auto;
          .token-data {
            display: flex;
            justify-content: space-between;
            border-radius: 11px 11px 11px 11px;
            border: 2px solid #303133;
            box-sizing: border-box;
            padding: 16px;
            margin-bottom: 11px;
            cursor: pointer;

            .data-left {
              display: flex;
              align-items: center;

              .avatar-style {
                box-sizing: border-box;
                border: 2px solid #303133;
                margin-right: 15px;
              }
              .name-bg {
                box-sizing: border-box;
                background: #edeff2;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #303133;
                margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                .number {
                  font-size: 18px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 500;
                  color: #303133;
                }
              }

              .name {
                box-sizing: border-box;

                div:nth-child(1) {
                  font-size: 16px;
                  font-family: Montserrat, Montserrat;
                  font-weight: 600;
                  color: #303133;
                  margin-bottom: 5px;
                  @media screen and (max-width: 750px) {
                    font-family: PingFang SC, PingFang SC;
                  }
                }

                div:nth-child(2) {
                  font-size: 12px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #606266;
                }
              }
            }

            .data-right {
              box-sizing: border-box;
              width: 30%;
              @media screen and (max-width: 750px) {
                width: 50%;
              }
              .top {
                box-sizing: border-box;
                padding-bottom: 10px;
                div:nth-child(1) {
                  font-size: 16px;
                  font-family: Montserrat, Montserrat;
                  font-weight: 600;
                  color: #303133;
                  text-align: right;
                  margin-bottom: 5px;
                  @media screen and (max-width: 750px) {
                    font-family: PingFang SC, PingFang SC;
                  }
                }

                div:nth-child(2) {
                  font-size: 12px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #606266;
                  text-align: right;
                }
              }
              .bottom {
                box-sizing: border-box;
                padding-top: 10px;
                border-top: 1px dashed rgb(216 216 216 / 1);
                .one-line {
                  display: flex;
                  justify-content: space-between;
                  .left {
                    font-size: 16px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    color: #606266;
                  }
                  .right {
                    font-size: 16px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 600;
                  }
                }
                .two-line {
                  display: flex;
                  justify-content: space-between;
                  .left {
                    font-size: 16px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    color: #606266;
                  }
                  .right {
                    font-size: 16px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 600;
                  }
                }
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
                display: flex;
                flex-direction: column;
                align-items: center;
                .avatar-style {
                  width: 64px;
                  height: 64px;
                  border: 2px solid #303133;
                  border-radius: 50%;
                  margin-bottom: 5px;
                }
                .name-bg {
                  box-sizing: border-box;
                  background: #edeff2;
                  width: 64px;
                  height: 64px;
                  border-radius: 50%;
                  border: 2px solid #303133;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 5px;
                  .number {
                    font-size: 18px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 500;
                    color: #303133;
                  }
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

      .nodata-page {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100% - 52px);
        .show-area {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .big-img {
            width: 136px;
            height: 132px;
          }
          .text-style {
            font-size: 14px;
            font-family: Montserrat, Montserrat;
            font-weight: 500;
            color: #303133;
            display: flex;
            align-items: center;

            @media screen and (max-width: 750px) {
              font-family: PingFang SC, PingFang SC;
            }
            .left-text {
            }
            .right-text {
              color: #0f7bff;
              margin-left: 5px;
              cursor: pointer;
            }
            .arrow-img {
              width: 12px;
              height: 12px;
              margin-left: 5px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
::-webkit-scrollbar {
  display: none !important;
}
.safari-container {
  height: calc(100vh - 175px);
}
</style>
        