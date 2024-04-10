<template>
  <div class="home-container" :class="[isMobileSafari ? 'safari-container' : '']">
    <div class="home-specific">
      <div class="album-container">
        <div class="top-line">
          <ArrowLeft class="back-style" @click="goBack()" />
          <div class="center-text">NFT Collection</div>
        </div>
        <div class="album-content" v-if="isDataLoaded && dataShow.list.length">
          <div class="album-info">
            <div class="album-name">{{ dataShow.seriesName }}</div>
            <div class="album-total" v-if="dataShow.tokenSupply">
              Total Supply: {{ dataShow.tokenSupply }}
            </div>
          </div>
          <div
            class="infinite-area"
            v-infinite-scroll="loadData"
            infinite-scroll-immediate="false"
            :infinite-scroll-disabled="isLoading"
          >
            <div class="nfts">
              <div
                class="nft"
                v-for="(Item, Index) in dataShow.list"
                :key="Index"
                @click="goNftDetail(Item)"
              >
                <!-- <img :src="getFullImageUrl(Item.icon)" alt="" class="icon-style" /> -->
                <div
                  class="icon-style"
                  :style="{ backgroundImage: 'url(' + getFullImageUrl(Item.icon) + ')' }"
                ></div>
                <div class="index"># {{ Item.tokenIndex }}</div>
                <div class="nftName">{{ Item.name }}</div>
              </div>
            </div>
            <div v-if="isLoading" class="bottom-style">Loading...</div>
            <div v-if="noMore" class="bottom-style">No more</div>
          </div>
        </div>
        <div class="album-content" v-loading="!isDataLoaded" v-else></div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'

// import { ElMessage, Eloading } from "element-plus";
import { router } from '@/router'
import { useRoute, useRouter } from 'vue-router'
import { generatorGenesisId } from '@/utils/filters'
import { GetTxidForMetasv, decodeMvcToken, GetNftAlbumsChildren, getSoloNftAlbums } from '@/lib/api'
import { useStore } from '@/store/index'
// @ts-ignore
const store = useStore()
const activeIndex = ref('nft')
const route = useRoute()
const dataShow = reactive({ seriesName: null, tokenSupply: null, list: [] })
const isMobileSafari = ref(false)
const isDataLoaded = ref(false)
const noMore = ref(false)
const sourceLoad = ref(false)
const dataSource = reactive({
  // address: store.currentWalletAddress,
  address: '1Nc1zjzowZQMwnEGV6o9mKCuTU4qMEpqnF',
  net: 'livenet',
  codehash: route.params.codeHash,
  genesis: route.params.genesis,
  size: 25,
  flag: null,
})
const isLoading = ref(false)
const checkDevice = () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (/Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent)) {
      isMobileSafari.value = true
    }
  }
}

const lastFlagExample = computed(() => {
  const { flag } = dataShow.list[dataShow.list.length - 1]
  return flag
})
const loadData = async () => {
  dataSource.flag = lastFlagExample.value
  getAlbumInfo(dataSource)
}
function goNftDetail(data) {
  router.push({
    name: 'NftDetail',
    params: {
      metaTxid: data.metaTxId,
      index: data.tokenIndex,
      codeHash: data.codeHash,
      genesis: data.genesis,
      status: 'false',
      price: 0,
    },
  })
}
async function getAlbumInfo(info) {
  isLoading.value = true
  const res = await getSoloNftAlbums(info)
  if (res.data.list.length) {
    const result = res.data
    // for (const key in result) {
    //   dataShow[key] = result[key]
    // }
    dataShow.seriesName = res.data.seriesName
    dataShow.tokenSupply = res.data.tokenSupply
    dataShow.list.push(...res.data.list)
    isLoading.value = false
    isDataLoaded.value = true
    noMore.value = false
  } else {
    isLoading.value = false
    isDataLoaded.value = true
    noMore.value = true
  }
}
function goBack() {
  router.go(-1)
}
onMounted(async () => {
  // const currentAddress = store.currentWalletAddress
  // const currentAddress = '1Nc1zjzowZQMwnEGV6o9mKCuTU4qMEpqnF'
  // const dataSource = {
  //   address: currentAddress,
  //   net: 'livenet',
  //   codeHash: route.params.codeHash,
  //   genesis: route.params.genesis,
  //   size: 20,
  //   flag: null,
  // }
  getAlbumInfo(dataSource)
  checkDevice()
})

function getFullImageUrl(imgUrl) {
  // return `https://filecdn.showpay.top/metaFile/original/${imgUrl}?x-oss-process=image/resize,l_100`
  const iconAddress = imgUrl.split('metafile://')[1]
  return `https://api.show3.io/metafile/compress640/${iconAddress}`
}
</script>
  
<style lang="scss" scoped>
.home-container {
  width: 35%;
  margin: 0 auto;
  height: 90vh;
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
  }
  .home-specific {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    // align-items: center;
    // text-align: left;
    .album-container {
      box-sizing: border-box;
      padding: 0 16px 16px;
      height: 100%;

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
      .album-content {
        height: calc(100% - 6vh);
        .album-info {
          box-sizing: border-box;
          text-align: left;
          // padding-top: 20px;
          height: 10%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .album-name {
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #303133;
            margin-bottom: 10px;
          }

          .album-total {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #909399;
          }
        }
        .infinite-area {
          box-sizing: border-box;
          // overflow: auto;
          height: 90%;
          overflow-x: hidden;
          overflow-y: auto;
         

          .nfts {
            display: flex;
            box-sizing: border-box;
            text-align: start;
            flex-wrap: wrap;
            align-content: flex-start;
            // height: 100%;
            .nft {
              // flex: 1;
              box-sizing: border-box;
              // height: 25%;
              width: 18%;
              margin-right: 2.5%;
              text-align: center;
              cursor: pointer;
              // flex-grow: 0;
              margin-bottom: 10px;


              .icon-style {
                width: 100%;
                height: 120px;
                background-repeat: no-repeat; 
                background-position: center center; 
                background-size: contain;
              }

              .index {
                font-size: 14px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                color: #909399;
                // height: 10%;
              }

              .nftName {
                font-size: 16px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                color: #303133;
                // margin-bottom: 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                // height: 10%;
              }
            }

            .nft:nth-child(5n) {
              margin-right: 0;
            }
          }
          .bottom-style {
            box-sizing: border-box;
            padding-bottom: 10px;
            text-align: center;
            height: 2%;
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
  height: 100dvh;
  height: calc(100vh - 175px);
}
</style>
  