<template>
  <div class="mvc-contrainer" v-if="store.currentShowWallet == 'MVC'">
    <div
      class="mynft-content"
      v-if="ownNfts.length && mynftsLoading"
      v-infinite-scroll="loadData"
      infinite-scroll-immediate="false"
      :infinite-scroll-disabled="isMvcLoading"
    >
      <!-- <div>{{ ownNfts }}</div> -->
      <div class="nft-data" v-for="(item, index) in ownNfts" :key="index">
        <div class="header-line">
          <div class="left">{{ item.seriesName }}</div>
          <div class="right" @click="goDetail(item)">
            <span>{{ item.count }}</span>
            <img src="@/assets/image/icon_ins.png" alt="" />
          </div>
        </div>
        <div class="bottom-content">
          <div class="nft-icon" v-for="(obj, _index) in item.nftList" :key="_index">
            <img
              :src="getFullImageUrl(obj.icon)"
              alt=""
              class="icon-style"
              @click="toDetail(item, obj)"
            />
          </div>
        </div>
      </div>
      <div v-if="isMvcLoading" class="bottom-style">Loading...</div>
      <div v-if="isMvcNoMore" class="bottom-style">No more</div>
    </div>
    <div class="mynft-content" v-else-if="!mynftsLoading" v-loading="!mynftsLoading"></div>
    <div class="mynft-content nodata" v-else>
      <div class="show-area">
        <img src="../assets/image/nft_icon_nodata.png" alt="" />
        <div>No NFTs at this time</div>
      </div>
    </div>
  </div>
  <div class="btc-contrainer" v-else>
    <div
      class="mynft-content"
      v-if="ownNfts.length && mynftsLoading"
      v-infinite-scroll="loadData"
      infinite-scroll-immediate="false"
      :infinite-scroll-disabled="isBtcLoading"
    >
      <div class="nft-datas">
        <div
          class="nft-data"
          v-for="(item, index) in ownNfts"
          :key="index"
          @click="goBtcDetail(item)"
        >
          <!-- <img
            :src="item.content"
            alt=""
            class="icon-style"
            v-if="item.contentType.includes('image')"
          /> -->

          <div
            class="icon-style"
            :style="{ backgroundImage: 'url(' + item.content + ')' }"
            v-if="item.contentType.includes('image')"
          ></div>

          <div class="content-area" v-else>
            <div class="ordinal-content">
              {{ item.contentBody }}
            </div>
            <div class="rats">{{ item.outputValue }} sats</div>
          </div>

          <div class="nft-title"># {{ item.inscriptionNumber }}</div>
        </div>
      </div>
      <div class="bottom-style" v-if="isBtcLoading">Loading...</div>
      <div class="bottom-style" v-if="isBtcNoMore">No more</div>
    </div>
    <div class="mynft-content" v-else-if="!mynftsLoading" v-loading="!mynftsLoading"></div>
    <div class="mynft-content nodata" v-else>
      <div class="show-area">
        <img src="../assets/image/nft_icon_nodata.png" alt="" />
        <div>No NFTs at this time</div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed, toRefs } from 'vue'

// import { GetTxidForMetasv } from "@/api";  
// import { ElMessage, ElLoading } from "element-plus";
import { router } from '@/router'
import { useStore } from '@/store/index'
const store = useStore()
// @ts-ignore
const props = defineProps<{
  ownNfts: {
    type: Array
    required: true
    default: () => []
  }
  isMvcLoading: {
    type: Boolean
    required: true
    default: false
  }
  isBtcLoading: {
    type: Boolean
    required: true
    default: false
  }
  isMvcNoMore: {
    type: Boolean
    required: true
    default: false
  }
  isBtcNoMore: {
    type: Boolean
    required: true
    default: false
  }
  mynftsLoading: {
    type: Boolean
    required: true
    default: false
  }
}>()
const emit = defineEmits(['scroll-load'])
const albumData = reactive({})
const isAlbumModalVisible = ref(false)
const isNftModalVisible = ref(false)
function goDetail(item) {
  // isAlbumModalVisible.value = true
  // console.log(albumData.name)
  router.push({
    name: 'AlbumDetail',
    params: { genesis: item.genesis, codeHash: item.codeHash },
  })
}
function closeModal() {
  isAlbumModalVisible.value = false
}
function jumpToNftInfo() {
  isAlbumModalVisible.value = false
  isNftModalVisible.value = true
}
function getFullImageUrl(icon) {
  const iconAddress = icon.split('metafile://')[1]
  return `https://api.show3.io/metafile/compress640/${iconAddress}`
}
function getOrdinalImageUrl(icon) {
  const iconAddress = icon.split('metafile://')[1]
  return `https://api.show3.io/metafile/compress640/${iconAddress}`
}
function toDetail(parent, children) {
  router.push({
    name: 'NftDetail',
    params: {
      metaTxid: children.metaTxId,
      index: children.tokenIndex,
      codeHash: parent.codeHash,
      genesis: parent.genesis,
      status: 'false',
      price: 0,
    },
  })
}

function goBtcDetail(item) {
  router.push({
    name: 'OrdinalDetail',
    params: {
      inscriptionId: item.inscriptionId,
    },
  })
}
async function loadData() {
  emit('scroll-load')
}
</script>
  
<style lang="scss" scoped>
.mvc-contrainer {
  box-sizing: border-box;
  height: 70%;
  .mynft-content {
    box-sizing: border-box;
    // margin-top: 10px;
    margin-top: 2%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .nft-data {
      border-radius: 11px;
      border: 2px solid #303133;
      padding: 16px;
      padding-top: 0;
      box-sizing: border-box;
      margin-bottom: 10px;
      // height: 100%;
      height: 50%;
      @media screen and (max-width: 750px) {
        height: 40%;
      }
      font-family: PingFang SC, PingFang SC;

      .header-line {
        font-size: 14px;
        font-family: Montserrat, Montserrat;
        font-weight: 500;
        color: #303133;
        height: 25%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        //   margin-bottom: 16px;
        @media screen and (max-width: 750px) {
          font-family: PingFang SC, PingFang SC;
        }
        .left {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }

        .right {
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            width: 12px;
            height: 12px;
            margin-left: 5px;
          }

          span {
            font-size: 14px;
          }
        }
      }

      .bottom-content {
        height: 75%;
        display: flex;
        // justify-content: space-between;
        //   height: 100%;
        .nft-icon {
          width: 32%;
          margin-right: 2%;
          height: 100%;

          .icon-style {
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .nft-icon:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
    .bottom-style {
      box-sizing: border-box;
      padding-bottom: 10px;
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

  ::-webkit-scrollbar {
    display: none !important;
  }
}

.btc-contrainer {
  box-sizing: border-box;
  height: 70%;
  .mynft-content {
    box-sizing: border-box;
    // margin-top: 10px;
    margin-top: 2%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .nft-datas {
      display: flex;
      box-sizing: border-box;
      text-align: start;
      flex-wrap: wrap;
      // align-content: flex-start;
      // height: 100%;

      .nft-data {
        box-sizing: border-box;
        width: 32%;
        margin-right: 2%;
        // margin-bottom: 2%;
        // height: 37.5%;
        // height: 200px;
        cursor: pointer;
        @media screen and (max-width: 750px) {
          // height: 28%;
          // height: ];
        }

        .content-area {
          width: 100%;
          height: 180px;
          // margin-bottom: 2%;
          box-sizing: border-box;
          background: rgb(245 245 245 / 1);
          position: relative;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          border-radius: 8px;
          @media screen and (max-width: 750px) {
            height: 120px;
            // margin-bottom: 0;
          }
          .ordinal-content {
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 指定行数 */
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rats {
            color: rgb(120 127 255 / 1);
            background-color: rgb(235 236 255 / 1);
            position: absolute;
            bottom: 5%;
            right: 5%;
            padding: 5px 10px;
          }
        }
        .icon-style {
          width: 100%;
          height: 180px;
          // object-fit: cover;
          background-repeat: no-repeat; 
          background-position: center center; 
          background-size:cover; 
          border-radius: 8px;
          @media screen and (max-width: 750px) {
            height: 120px;
          }
        }

        .nft-title {
          font-size: 14px;
          font-family: Montserrat, Montserrat;
          font-weight: 500;
          color: #303133;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          margin: 5px 0;
          @media screen and (max-width: 750px) {
            font-family: PingFang SC, PingFang SC;
            // height: 12%;
          }
        }
      }

      .nft-data:nth-child(3n) {
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

  ::-webkit-scrollbar {
    display: none !important;
  }
}
</style>
  