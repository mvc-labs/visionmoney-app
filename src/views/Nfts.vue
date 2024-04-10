<template>
  <div class="home-container" :class="[isMobileSafari ? 'safari-container' : '']">
    <div class="home-specific">
      <Menu :activeIndex="activeIndex"></Menu>

      <div class="mvc" v-if="store.currentShowWallet == 'MVC'">
        <div
          class="nft-container"
          v-if="isMvcDataLoaded && (mvcTotalMounts || mvcSaleNftsData.length)"
        >
          <div class="center-content">
            <div class="amount">
              <div class="title">Total NFTs</div>
              <div class="number">{{ mvcTotalMounts }}</div>
            </div>
            <div class="tabs-menu">
              <div
                @click="switchCom(item, index)"
                :class="[bColor == index ? 'active' : '']"
                class="tabs-card"
                v-for="(item, index) in dataCom"
              >
                <div>{{ item.name }}</div>
              </div>
            </div>
            <component
              :is="comId"
              :ownNfts="mvcNftsData"
              :saleNfts="mvcSaleNftsData"
              :isMvcLoading="isMvcLoading"
              :isMvcNoMore="mvcNoMore"
              :mynftsLoading="getMvcNfsDataLoadingSwitch"
              @scroll-load="loadingMvcNewData"
            ></component>
          </div>
        </div>
        <div class="nft-container" v-else-if="!isMvcDataLoaded" v-loading="!isMvcDataLoaded"></div>
        <div class="nodata-page" v-else>
          <div class="show-area">
            <img src="../assets/image/nft_img_defualt@2x.png" alt="" class="big-img" />
            <div class="text-style">
              <span class="left-text">No more, go</span>
              <div @click="goNftMarket">
                <span class="right-text">NFT Market</span>
                <img src="../assets/image/icon_ins@2x.png" alt="" class="arrow-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="btc" v-else>
        <div
          class="nft-container"
          v-if="isBtcDataLoaded && (btcTotalMounts || btcSaleNftsData.length)"
        >
          <div class="center-content">
            <div class="amount">
              <div class="title">Total NFTs</div>
              <div class="number">{{ btcTotalMounts }}</div>
            </div>
            <div class="tabs-menu">
              <div
                @click="switchCom(item, index)"
                :class="[bColor == index ? 'active' : '']"
                class="tabs-card"
                v-for="(item, index) in dataCom"
              >
                <div>{{ item.name }}</div>
              </div>
            </div>
            <component
              :is="comId"
              :ownNfts="btcOrdinalData"
              :saleNfts="btcSaleNftsData"
              :isBtcLoading="isBtcLoading"
              :isBtcNoMore="btcNoMore"
              :mynftsLoading="getBtcOrdinalDataLoadingSwitch"
              @scroll-load="loadingBtcNewData"
            ></component>
          </div>
        </div>
        <div class="nft-container" v-else-if="!isBtcDataLoaded" v-loading="!isBtcDataLoaded"></div>
        <div class="nodata-page" v-else>
          <div class="show-area">
            <img src="../assets/image/nft_img_defualt@2x.png" alt="" class="big-img" />
            <div class="text-style">
              <span class="left-text">No more, go</span>
              <div @click="goNftMarket">
                <span class="right-text">NFT Market</span>
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
import {
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  markRaw,
  computed,
  shallowRef,
  watchEffect,
} from 'vue'
import Menu from '@/components/menu.vue'
import mynft from '@/components/mynft.vue'
import onsalenft from '@/components/onsalenft.vue'
import {
  getMvcNftAlbumsInfo,
  GetNftAlbumsChildren,
  GetTxidForMetasv,
  decodeMvcToken,
  getSaleNftAlbumsInfo,
  getNftsMounts,
  getBtcOrdinalInfo,
} from '@/lib/api'
import { generatorGenesisId } from '@/utils/filters'
import type { TabsPaneContext } from 'element-plus'
import { useStore } from '@/store/index'
const store = useStore()
const activeIndex = ref('nfts')
const comId = shallowRef(mynft)
const bColor = ref(0)
const nftAlbums = reactive([])
const mvcNftsData = reactive([])
const btcOrdinalData = reactive([])
const mvcSaleNftsData = reactive([])
const btcSaleNftsData = reactive([])
const mvcTotalMounts = ref(0)
const btcTotalMounts = ref(0)
const nftsAmount = ref(0)
const isMobileSafari = ref(false)
const isMvcDataLoaded = ref(false)
const isBtcDataLoaded = ref(false)
const isMvcLoading = ref(false)
const isBtcLoading = ref(false)
const mvcNoMore = ref(false)
const btcNoMore = ref(false)
const getMvcNfsDataLoadingSwitch = ref(false)
const getBtcOrdinalDataLoadingSwitch = ref(false)
const isMvcLoadingMore = ref(true)
const isBtcLoadingMore = ref(true)
const nftsInfoParams = reactive({
  address: store.currentMvcWalletAddress,
  // address: '1Nc1zjzowZQMwnEGV6o9mKCuTU4qMEpqnF',
  net: store.currentNet == 'Mainnet' ? 'livenet' : 'testnet',
  // net: 'livenet',
  cursor: 0,
  size: 5,
})

const btcParams = reactive({
  net: store.currentNet == 'Mainnet' ? 'livenet' : 'testnet',
  address: store.currentBtcWalletAddress,
  // address: 'tb1q7nk6q6czgl49tft6utue3xgvkhus6sk8kzy8u0',
  cursor: 0,
  size: 9,
})

const dataCom = reactive([
  {
    name: 'My NFT',
    com: markRaw(mynft),
  },
  {
    name: 'On Sale',
    com: markRaw(onsalenft),
  },
])
const checkDevice = () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (/Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent)) {
      isMobileSafari.value = true
    }
  }
}
// const nftMounts = computed(() => {
//   const amounts = nftAlbums.reduce((accumulator, currentValue) => {
//     return accumulator + currentValue.count
//   }, 0)
//   return amounts + saleNftsData.length
// })
const switchCom = (item: any, index: number) => {
  comId.value = item.com
  bColor.value = index
}
function goNftMarket() {
  window.open('https://www.show3.io/nft/collection/index')
}
function tabview(coin) {
  store.tabWallet(coin)
  // if (coin == 'mvc') {
  // } else {
  // }
}
async function loadingMvcNewData() {
  if (isMvcLoadingMore.value) {
    nftsInfoParams.cursor += 5
    getMvcNftInfo(nftsInfoParams)
  }
}
async function loadingBtcNewData() {
  if (isBtcLoadingMore.value) {
    btcParams.cursor += 9
    getBtcOrdinalNfts(btcParams)
  }
}

async function getMvcNftMounts(params) {
  const res = await getNftsMounts(params)
  if (res.code == 0) {
    mvcTotalMounts.value = res.data.count
    isMvcDataLoaded.value = true
  }
}


async function getSaleNftByAddress(address) {
  const res = await getSaleNftAlbumsInfo(address)
  if (res) {
    console.log(res)
    mvcSaleNftsData.push(...res.data.list)
  }
}

async function getMvcNftInfo(params) {
  isMvcLoading.value = true
  const res = await getMvcNftAlbumsInfo(params)
  if (res.code == 0) {
    // console.log(res)
    if (res.data.list.length) {
      mvcNftsData.push(...res.data.list)
      isMvcLoading.value = false
      // isDataLoaded.value = true
      mvcNoMore.value = false
      getMvcNfsDataLoadingSwitch.value = true
      isMvcLoadingMore.value = true
    } else {
      isMvcLoading.value = false
      mvcNoMore.value = true
      // isDataLoaded.value = true
      getMvcNfsDataLoadingSwitch.value = true
      isMvcLoadingMore.value = false
    }
  }
}

async function getBtcOrdinalNfts(params) {
  isBtcLoading.value = true
  const res = await getBtcOrdinalInfo(params)
  if (res.code == 0) {
    // console.log(res)
    if (res.data.list.length) {
      isBtcDataLoaded.value = true
      btcTotalMounts.value = res.data.total
      btcOrdinalData.push(...res.data.list)
      // btcOrdinalData.forEach((item) => {})
      isBtcLoading.value = false
      // isDataLoaded.value = true
      btcNoMore.value = false
      getBtcOrdinalDataLoadingSwitch.value = true
      isBtcLoadingMore.value = true
    } else {
      isBtcDataLoaded.value = true
      isBtcLoading.value = false
      btcNoMore.value = true
      // isDataLoaded.value = true
      getBtcOrdinalDataLoadingSwitch.value = true
      isBtcLoadingMore.value = false
    }
  }
}

// getSaleNftByAddress(currentAddress)
onMounted(() => {


  getMvcNftMounts(nftsInfoParams)
  getMvcNftInfo(nftsInfoParams)
  // getNftByAddress(nftsInfoParams)
  getSaleNftByAddress(nftsInfoParams)

  getBtcOrdinalNfts(btcParams)

  checkDevice()
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

  .home-specific {
    display: flex;
    flex-direction: column;
    height: 100%;
    // align-items: center;
    // text-align: left;

    .mvc {
      height: calc(100% - 52px);
      .nft-container {
        box-sizing: border-box;
        padding: 0 16px;
        height: 100%;
        .center-content {
          text-align: center;
          box-sizing: border-box;
          // padding-top: 60px;
          height: 100%;

          .amount {
            // margin-bottom: 60px;
            height: 22%;
            display: flex;
            justify-content: center;
            flex-direction: column;

            .title {
              font-size: 18px;
              font-family: Montserrat, Montserrat;
              font-weight: 500;
              color: #606266;
              margin-bottom: 10px;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }

            .number {
              font-size: 30px;
              font-family: Montserrat, Montserrat;
              font-weight: 700;
              color: #303133;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }
          }

          .tabs-menu {
            display: flex;
            border-radius: 11px;
            border: 2px solid #303133;
            height: 6%;
            // padding: 10px 0;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;

            .tabs-card {
              flex: 1;
              // padding: 5px 10px;
              cursor: pointer;
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #303133;
              line-height: 1.2;
            }

            .active {
              background: linear-gradient(270deg, #72f5f6 0%, #171aff 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent !important;
              border-image: linear-gradient(270deg, #72f5f6 0%, #171aff 100%) 2 2 2 2;
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
      height: calc(100% - 52px);
      .nft-container {
        box-sizing: border-box;
        padding: 0 16px;
        height: 100%;
        .center-content {
          text-align: center;
          box-sizing: border-box;
          // padding-top: 60px;
          height: 100%;

          .amount {
            // margin-bottom: 60px;
            height: 22%;
            display: flex;
            justify-content: center;
            flex-direction: column;

            .title {
              font-size: 18px;
              font-family: Montserrat, Montserrat;
              font-weight: 500;
              color: #606266;
              margin-bottom: 10px;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }

            .number {
              font-size: 30px;
              font-family: Montserrat, Montserrat;
              font-weight: 700;
              color: #303133;
              @media screen and (max-width: 750px) {
                font-family: PingFang SC, PingFang SC;
              }
            }
          }

          .tabs-menu {
            display: flex;
            border-radius: 11px;
            border: 2px solid #303133;
            height: 6%;
            // padding: 10px 0;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;

            .tabs-card {
              flex: 1;
              // padding: 5px 10px;
              cursor: pointer;
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #303133;
              line-height: 1.2;
            }

            .active {
              background: linear-gradient(270deg, #72f5f6 0%, #171aff 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent !important;
              border-image: linear-gradient(270deg, #72f5f6 0%, #171aff 100%) 2 2 2 2;
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
@media screen and (max-width: 1440px) {
  .home-container {
    width: 45%;
    margin: 0 auto;
    height: 720px;
    border-radius: 12px;
    opacity: 1;
    border: 2px solid #303133;
    box-sizing: border-box;
    box-shadow: 10px 10px 0px -1px #0f7bff;

    .home-specific {
      display: flex;
      flex-direction: column;
      height: 100%;
      // align-items: center;
      // text-align: left;
      .nft-container {
        box-sizing: border-box;
        padding: 0 16px;
        height: calc(100% - 52px);
        .center-content {
          text-align: center;
          box-sizing: border-box;
          // padding-top: 60px;
          height: 100%;

          .tabs-menu {
            display: flex;
            border-radius: 11px;
            border: 2px solid #303133;
            height: 6%;
            // padding: 10px 0;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;

            .tabs-card {
              flex: 1;
              // padding: 5px 10px;
              cursor: pointer;
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #303133;
              line-height: 1.2;
            }

            .active {
              background: linear-gradient(270deg, #72f5f6 0%, #171aff 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent !important;
              border-image: linear-gradient(270deg, #72f5f6 0%, #171aff 100%) 2 2 2 2;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .home-container {
    width: 90%;

    .home-specific {
      .nft-container {
        .center-content {
          .amount {
            .title {
              font-family: PingFang SC, PingFang SC !important;
              font-size: 16px;
              font-weight: 400;
            }

            .number {
              font-family: PingFang SC, PingFang SC;
            }
          }

          .tabs-menu {
          }
        }
      }
    }
  }
  .safari-container {
    height: calc(100vh - 175px);
  }
}
</style>
        