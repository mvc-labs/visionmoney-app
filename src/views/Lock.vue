<template>
  <div class="out-overlay">
    <div class="lock-container" :class="[isMobileSafari ? 'safari-container' : '']">
      <img src="@/assets/image/modal_wallet_lock.png" alt="" class="lock-icon" />
      <div class="modal-title">The Wallet is Locked</div>
      <div class="info">Please enter the lock password to unlock the wallet.</div>
      <div class="input-area">
        <input
          v-for="(digit, index) in passwordDigits"
          :key="index"
          v-model="passwordDigits[index]"
          @input="() => handleInput(index)"
          @keydown="handleKeyDown(index)"
          maxlength="1"
          :ref="(el) => (passwordInputs[index] = el)"
          type="password"
        />
      </div>
      <div class="notice" :class="[passwordError ? 'showNotice' : '']">Password error</div>
      <div class="button-area">
        <div
          class="remove-lock"
          @click="unlockPage"
          :class="[!isPasswordComplete ? 'isComplete' : '']"
        >
          Unlock
        </div>
      </div>
    </div>
  </div>
</template>
        
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'
import Menu from '@/components/menu.vue'
import { useStore } from '@/store/index'
import Decimal from 'decimal.js-light'
import { router } from '@/router'
import { useRoute } from 'vue-router'
const route = useRoute()
const store = useStore()
const passwordDigits = ref(['', '', '', '', '', ''])
const passwordInputs = ref([])
const isMobileSafari = ref(false)
const passwordError = ref(false)
const checkDevice = () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (/Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent)) {
      isMobileSafari.value = true
    }
  }
}
const isPasswordComplete = computed(() => {
  return passwordDigits.value.every((digit) => digit !== '')
})
const handleInput = (index) => {
  if (index < 5 && passwordDigits.value[index] !== '') {
    passwordInputs.value[index + 1].focus()
  }
}
const handleKeyDown = (index) => {
  if (event.key === 'Backspace' && !passwordDigits.value[index]) {
    event.preventDefault()

    if (index > 0) {
      passwordInputs.value[index - 1].focus()
    }
  }
}
function unlockPage() {
  if (!isPasswordComplete.value) {
    return
  }
  const password = passwordDigits.value.join('')
  let luckInfo = localStorage.getItem('lockInfo')
  luckInfo = JSON.parse(luckInfo)
  let lockNum = luckInfo.lockNum
  if (password == lockNum) {
    passwordError.value = false
    const editLockInfo = { lockNum: lockNum, lockStatus: false }
    localStorage.setItem('lockInfo', JSON.stringify(editLockInfo))
    router.push({ name: 'balance' })
  } else {
    passwordError.value = true
  }
}
onMounted(() => {})
</script>
        
<style lang="scss" scoped>
.out-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(220, 236, 255, 0.5);
  z-index: 9999;
  padding-top: 70px;
  .lock-container {
    width: 35%;
    margin: 0 auto;
    // height: calc(100vh - 200px);
    // height: 300px;
    border-radius: 12px;
    opacity: 1;
    border: 2px solid #303133;
    box-sizing: border-box;
    box-shadow: 10px 10px 0px -1px #0f7bff;

    background: #fff;
    padding: 40px 20px 70px;
    text-align: center;
    @media screen and (max-width: 750px) {
      width: 90%;
    }
    .lock-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 40px;
    }
    .modal-title {
      font-size: 16px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #303133;
      margin-bottom: 20px;
    }
    .info {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #909399;
      margin-bottom: 20px;
    }
    .input-area {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 0 20%;
      @media screen and (max-width: 750px) {
        padding: 0 10%;
      }

      input {
        width: 10%;
        padding: 10px 0;
        text-align: center;
        font-size: 20px;
        border-radius: 4px;
        border: 2px solid #303133;
        @media screen and (max-width: 750px) {
          padding: 8px 0;
        }
      }
    }
    .notice {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: red;
      text-align: left;
      padding: 0 20%;
      margin-top: 10px;
      opacity: 0;
      margin-bottom: 20px;
      // display: none;
      @media screen and (max-width: 750px) {
        padding: 0 10%;
      }
    }
    .showNotice {
      opacity: 1;
    }

    .button-area {
      padding: 0 20%;
      @media screen and (max-width: 750px) {
        padding: 0 10%;
      }
      .remove-lock {
        background: #0f7bff;
        border-radius: 12px;
        border: 2px solid #303133;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        box-sizing: border-box;
        padding: 16px 0;
        cursor: pointer;
        box-shadow: 3px 3px 0px #303133;
      }
      .isComplete {
        background-color: #edeff2 !important;
        color: #bfc2cc !important;
        border: 2px solid #bfc2cc !important;
        box-shadow: 3px 3px 0px #BFC2CC!important;
      }
    }
  }
}
</style>
        