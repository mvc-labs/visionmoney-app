<template>
  <div class="footer-container">
    <div class="footer-info">
      <div class="team-link">
        <div class="text">
          <span>@2024 VisionMoney Team</span>
          <img src="@/assets/image/footer_icon_x@2x.png" alt="" @click="goLink('twitter')" />
          <!-- https://twitter.com/showpayio/ -->
          <!-- https://medium.com/@showpay -->

          <!-- <img src="@/assets/image/footer_icon_telegram@2x.png" alt=""> -->
        </div>
      </div>
      <div class="jump-button">
        <!-- <div @click="goLink('about')">About Us</div> -->
        <!-- <div>Terms of Service</div> -->
        <!-- <div>API&Docs</div> -->
        <div @click="goLink('about')">Source code</div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed, nextTick } from 'vue'
import { router } from '@/router'
import { useRoute } from 'vue-router'
const route = useRoute()
function goLink(item) {
  if (item == 'twitter') {
    window.open('https://twitter.com/showpayio')
  } else {
    window.open('https://github.com/mvc-labs/visionmoney-app')
  }
}
onMounted(() => {})
</script>
  
<style lang="scss" scoped>
.footer-container {
  width: 100vw;
  height: 60px;
  line-height: 60px;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 2px solid #303133;

  .footer-info {
    box-sizing: border-box;
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .team-link {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #606266;
      // display: flex;
      // align-items: center;

      .text {
        display: flex;
        align-items: center;

        span {
          margin-right: 30px;
        }

        img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }

    .jump-button {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #606266;
      display: flex;

      div {
        margin-left: 30px;
        cursor: pointer;
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .footer-container {
    width: 100vw;
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 2px solid #303133;

    .footer-info {
      box-sizing: border-box;
      width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .team-link {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #606266;
        // display: flex;
        // align-items: center;

        .text {
          display: flex;
          align-items: center;

          span {
            margin-right: 30px;
          }

          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }

      .jump-button {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #606266;
        display: flex;

        div {
          margin-left: 30px;
          cursor: pointer;
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .footer-container {
    width: 100vw;
    height: 100% !important;
    line-height: 1.2 !important;
    margin-top: 70px;
    // position: fixed;
    // bottom: 0;
    // left: 0;
    position: static !important;
    padding: 10px 0;
    box-sizing: border-box;

    .footer-info {
      box-sizing: border-box;
      width: 80%;
      margin: 0 auto;
      display: block;
      // justify-content: flex-start;
      // flex-wrap: wrap;
      // align-items: center;

      .team-link {
        font-size: 12px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #606266;
        box-sizing: border-box;
        // display: flex;
        // align-items: center;

        .text {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          span {
            margin-right: 10px;
          }

          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }

      .jump-button {
        font-size: 12px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #606266;
        display: flex;
        // justify-content: flex-start;

        div {
          // margin-right: 10px;
          cursor: pointer;
          margin-left: 0;
          margin-right: 10px;
        }

        div:nth-child(4) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
  