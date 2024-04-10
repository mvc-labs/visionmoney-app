<template>
  <div class="salenft-content" v-infinite-scroll="load1" v-if="saleNfts.length">
    <div class="nft-data" v-for="(item, index) in saleNfts" :key="index" @click="toDetail(item)">
      <img :src="getFullImageUrl(item.icon)" alt="" class="icon-style" />
      <div class="nft-title">{{ item.name }}</div>
    </div>
  </div>
  <div class="nodata" v-else>
    <div class="show-area">
      <img src="../assets/image/nft_icon_nodata.png" alt="" />
      <div>No NFTs on sale at this time</div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed, toRefs } from 'vue'
import { useStore } from '@/store/index'

import { router } from '@/router'
// @ts-ignore
const props = defineProps<{
  saleNfts: {
    type: Array
    required: true
    default: () => []
  }
}>()
const store = useStore()
const albumData = reactive({})
const isAlbumModalVisible = ref(false)
const isNftModalVisible = ref(false)
const load1 = () => {
  //   count.value += 2
}
const load2 = () => {
  //   count.value += 2
}
function closeModal() {
  isAlbumModalVisible.value = false
}
function jumpToNftInfo() {
  isAlbumModalVisible.value = false
  isNftModalVisible.value = true
}
function getFullImageUrl(icon) {

  const iconAddress = icon.split("metafile://")[1]
  return `https://api.show3.io/metafile/compress640/${iconAddress}`
}
function toDetail(item) {
  // console.log(children)
  router.push({
    name: 'NftDetail',
    params: {
      metaTxid: item.metaTxId,
      index: item.tokenIndex,
      codeHash: item.codeHash,
      genesis: item.genesis,
      status: 'true',
      price: item.price,
    },
  })
}
onMounted(() => {})
</script>
  
<style lang="scss" scoped>
.salenft-content {
  box-sizing: border-box;
  margin-top: 2%;
  height: 70%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;

  .nft-data {
    box-sizing: border-box;
    width: 32%;
    margin-right: 2%;
    margin-bottom: 2%;
    height: 37.5%;
    cursor: pointer;
    @media screen and (max-width: 750px) {
      height: 28%;
    }

    .icon-style {
      width: 100%;
      height: 93%;
      // margin-bottom: 5px;
      margin-bottom: 2%;
      object-fit: cover;
    }

    .nft-title {
      height: 8%;
      font-size: 14px;
      font-family: Montserrat, Montserrat;
      font-weight: 500;
      color: #303133;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      @media screen and (max-width: 750px) {
        font-family: PingFang SC, PingFang SC;
        height: 12%;
    }
    }
  }

  .nft-data:nth-child(3n) {
    margin-right: 0;
  }
}
.nodata {
  box-sizing: border-box;
  margin-top: 2%;
  height: 70%;
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


</style>
  