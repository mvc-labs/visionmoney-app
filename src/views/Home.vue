<template>
  <!-- <div class="home-container">
    <div class="home-specific">
      <div class="top-menu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="balance">Balance</el-menu-item>
          <el-menu-item index="token">Token</el-menu-item>
          <el-menu-item index="nft">NFT</el-menu-item>
          <el-menu-item index="app">APP</el-menu-item>
        </el-menu>
      </div>
      <component :is="navName"></component>
    </div>
  </div> -->
</template>
    
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed,shallowRef } from 'vue'
import balance from "@/components/balance.vue";
import nft from "@/components/nft.vue";
import token from "@/components/token.vue";
import app from "@/components/app.vue";
const activeIndex = ref('balance')
const navName = shallowRef(balance)

const handleSelect = (key: string, keyPath: string[]) => {
  // if()
}
</script>
    
<style lang="scss" scoped>
.home-container {
  width: 35%;
  margin: 0 auto;
  height: 100%;
  border-radius: 12px;
  opacity: 1;
  border: 2px solid #303133;
  box-sizing: border-box;
  box-shadow: 10px 10px 0px -1px #0F7BFF;

  .home-specific {
    display: flex;
    flex-direction: column;
    // align-items: center;
    // text-align: left;

    .top-menu {
      box-sizing: border-box;

      .el-menu {
        padding: 0 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        background-color: transparent !important;
        border-bottom: 1px solid rgba(48, 49, 51, 0.05);

        .el-menu-item {
          // flex: 1;
          font-size: 19px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #303133;
        }

        &:deep(.el-menu-item.is-active) {
          background: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
          border-bottom: 2px solid;
          border-image: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%) 2 2 2 2;
        }
      }
    }
  }
}
</style>
    