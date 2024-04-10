<template>
  <div class="backup-container">
    <div class="first-step" v-if="isShowFirstStep">
      <div class="title">Wallet Backup</div>
      <div class="desc">
        Backing up your wallet is the only way to ensure the safety of your assets.
      </div>
      <div class="content-area">
        <div class="top">
          <img src="../assets/image/icon_1.png" alt="" />
          <div>Anyone can transfer assets as long asthey access the recovery phrase.</div>
        </div>
        <div class="center">
          <img src="../assets/image/icon_2.png" alt="" />
          <div>Don't back up by taking screenshots to avoid being intercepted by malware.</div>
        </div>
        <div class="bottom">
          <img src="../assets/image/icon_3.png" alt="" />
          <div>
            Please write down phrase correctlyand keep it in a safe place, do not usenetwork
            transmission or storage.
          </div>
        </div>
      </div>
      <div class="next-button" @click="next">Next</div>
    </div>
    <div class="second-step" v-show="isShowSecondStep">
      <div class="title">Please copy The Phrase</div>
      <div class="desc">
        The wallet phrase can be used to control yourcryptos, keep in a safe place.
      </div>
      <div class="mnemonic-area">
        <div class="path">Path：m/44'/{{ store.mainnetUserInfo.path }}'/0'</div>
        <div class="mnemonic-content">
          <div v-for="(item, index) in dataSource" :key="index">{{ index + 1 }}.{{ item }}</div>
          <!-- <div>1.chief</div>
                    <div>2.regret</div>
                    <div>3.forget</div>
                    <div>4.chief</div>
                    <div>5.regret</div>
                    <div>6.forget</div>
                    <div>7.tent</div>
                    <div>8.stool</div>
                    <div>9.forest</div>
                    <div>10.alley</div>
                    <div>11.garden</div>
                    <div>12.monitor</div> -->
        </div>
      </div>
      <div class="copy" @click="copyMnemonic">Copy</div>
    </div>
  </div>
</template>
          
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { useStore } from '@/store/index'
import { decryptStorageMnemonic } from '@/lib/api'
const store = useStore()
const isShowFirstStep = ref(true)
const isShowSecondStep = ref(false)
function next() {
  isShowFirstStep.value = false
  isShowSecondStep.value = true
}
const dataSource = reactive([])
function copyMnemonic() {
  const allMnemonic = dataSource.join(' ')
  toClipboard(allMnemonic).then(() => {
    ElMessage.success('Copy Success!')
  })
}
onMounted(() => {
  const mnemonic = decryptStorageMnemonic(store.mnemonicWord,store.mvcMainWalletInfo.publicKey)
  const mnemonicArr = mnemonic.split(' ')
  dataSource.push(...mnemonicArr)
})
</script>
          
<style lang="scss" scoped>
.backup-container {
  .title {
    font-size: 18px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #303133;
    margin-bottom: 10px;
  }

  .desc {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #909399;
    margin-bottom: 32px;
  }

  .content-area {
    box-sizing: border-box;
    border-top: 1px solid #303133;
    padding-top: 32px;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #303133;

    img {
      width: 32px;
      height: 32px;
      margin-right: 16px;
    }

    .top {
      display: flex;
      margin-bottom: 32px;
    }

    .center {
      display: flex;
      margin-bottom: 32px;
    }

    .bottom {
      display: flex;
    }
  }

  .next-button {
    background: #0f7bff;
    border-radius: 12px;
    border: 2px solid #303133;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    box-sizing: border-box;
    padding: 15px;
    cursor: pointer;
    text-align: center;
    margin-top: 48px;
    box-shadow: 3px 3px 0px #303133;
  }

  .mnemonic-area {
    font-size: 15px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #303133;
    box-sizing: border-box;
    border-top: 1px solid #303133;
    border-bottom: 1px solid #303133;

    .path {
      box-sizing: border-box;
      text-align: center;
      border-bottom: 1px solid #303133;
      padding: 16px 0;
    }

    .mnemonic-content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 16px 0;

      div {
        width: 33.33%;
        text-align: center;
        margin-bottom: 16px;
      }

      div:nth-last-child(1) {
        margin-bottom: 0;
      }

      div:nth-last-child(2) {
        margin-bottom: 0;
      }

      div:nth-last-child(3) {
        margin-bottom: 0;
      }
    }
  }

  .copy {
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #0f7bff;
    margin-top: 16px;
    cursor: pointer;
  }
}

@media screen and (max-width: 750px) {
  .backup-container {
    .title {
      font-size: 18px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #303133;
      margin-bottom: 10px;
    }

    .desc {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #909399;
      margin-bottom: 32px;
    }

    .content-area {
      box-sizing: border-box;
      border-top: 1px solid #303133;
      padding-top: 32px;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #303133;

      img {
        width: 32px;
        height: 32px;
        margin-right: 16px;
      }

      .top {
        display: flex;
        margin-bottom: 20px;
      }

      .center {
        display: flex;
        margin-bottom: 20px;
      }

      .bottom {
        display: flex;
      }
    }

    .next-button {
      background: #0f7bff;
      border-radius: 12px;
      border: 2px solid #303133;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      box-sizing: border-box;
      padding: 15px;
      cursor: pointer;
      text-align: center;
      margin-top: 48px;
      box-shadow: 3px 3px 0px #303133;
    }

    .mnemonic-area {
      font-size: 15px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #303133;
      box-sizing: border-box;
      border-top: 1px solid #303133;
      border-bottom: 1px solid #303133;

      .path {
        box-sizing: border-box;
        text-align: center;
        border-bottom: 1px solid #303133;
        padding: 16px 0;
      }

      .mnemonic-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 16px 0;

        div {
          width: 33.33%;
          text-align: center;
          margin-bottom: 16px;
        }

        div:nth-last-child(1) {
          margin-bottom: 0;
        }

        div:nth-last-child(2) {
          margin-bottom: 0;
        }

        div:nth-last-child(3) {
          margin-bottom: 0;
        }
      }
    }

    .copy {
      text-align: center;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #0f7bff;
      margin-top: 16px;
      cursor: pointer;
    }
  }
}
</style>
          