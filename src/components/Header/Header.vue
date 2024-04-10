<template>
  <div class="header-wrapper flex flex-align-center">
    <div class="header-contanier flex flex-align-center">
      <div class="header-left flex flex-align-center">
        <div class="logo flex flex-align-center" @click="toHome">
          <img class="logo_img" src="@/assets/image/logo.png" alt="" />
          <span
            v-show="
              !isMobile ||
              router.currentRoute.value.path === '/' ||
              router.currentRoute.value.path === '/register'
            "
            >VisionMoney</span
          >
        </div>
      </div>
      <div class="header-right flex flex-align-center">
        <!-- <UseDark v-slot="{ isDark, toggleDark }">
          <button @click="toggleDark()">Is Dark: {{ isDark }}</button>
        </UseDark> -->
        <!-- <div class="lang" @click="">
          <span>{{}}</span>
          <el-icon>
            <CaretBottom />
          </el-icon>
        </div> -->

        <!-- <el-button class="login-btn"> </el-button> -->
        <!-- <div
          v-if="
            router.currentRoute.value.path !== '/' && router.currentRoute.value.path !== '/register'
          "
        >
          <el-dropdown @command="handleCommand" class="network-style">
            <span class="el-dropdown-link">
              {{ currentNet }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="currentNet == 'Mainnet' ? 'Testnet' : 'Mainnet'">{{
                  currentNet == 'Mainnet' ? 'Testnet' : 'Mainnet'
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div> -->

        <div
          v-if="
            router.currentRoute.value.path !== '/' && router.currentRoute.value.path !== '/register'
          "
        >
          <el-dropdown class="network-style">
            <span class="el-dropdown-link">
              <img
                src="@/assets/image/mainnet_btc.png"
                alt=""
                class="show-coin"
                v-if="store.currentShowWallet == 'BTC'"
              />
              <img src="@/assets/image/mainnet_mvc.png" alt="" class="show-coin" v-else />
              {{ store.currentShowWallet }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <div class="top-line">
                <div class="top-title">{{ currentNet }}-Chain</div>
                <div class="net-tab" @click="tabNet()">
                  <img src="@/assets/image/icon_change.png" alt="" class="icon-style" />
                  <div class="net-name">{{ currentNet == 'Mainnet' ? 'Testnet' : 'Mainnet' }}</div>
                  <!-- <div class="net-name"></div> -->
                </div>
              </div>
              <div class="tab-wallet">
                <div
                  class="wallet-type"
                  v-for="(item, index) in chainType"
                  :key="index"
                  @click="selectChain(index, item.name)"
                >
                  <div class="left-content">
                    <img :src="getImageUrl(item.icon)" alt="" class="chain-icon" />
                    <div class="text">{{ item.name }}</div>
                  </div>
                  <!-- <img src="@/assets/image/icon_hook.png" alt="" class="right-content" v-show="selectedChainIndex === index" /> -->
                  <img
                    src="@/assets/image/icon_hook.png"
                    alt=""
                    class="right-content"
                    v-show="store.currentShowWallet === item.name"
                  />
                </div>

                <!-- <div class="wallet-type">
                  <div class="left-content">
                    <img src="@/assets/image/mainnet_mvc.png" alt="" class="chain-icon" />
                    <div class="text">MVC</div>
                  </div>
                  <img src="@/assets/image/icon_hook.png" alt="" class="right-content" />
                </div>
                <div class="wallet-type">
                  <div class="left-content">
                    <img src="@/assets/image/mainnet_btc.png" alt="" class="chain-icon" />
                    <div class="text">BTC</div>
                  </div>
                  <img src="@/assets/image/icon_hook.png" alt="" class="right-content" />
                </div> -->
                <div class="btc-address" v-if="store.currentShowWallet == 'BTC'">
                  <div class="title">BTC Address Type</div>
                  <div class="address-type">
                    <div
                      class="line"
                      v-for="(item, index) in addressTypeOptions"
                      :key="index"
                      :class="{ selected: store.currentBtcAddressType === item.name }"
                      @click="selectAddressType(index, item.name)"
                    >
                      <img
                        src="@/assets/image/list_icon_sel.png"
                        alt=""
                        v-show="store.currentBtcAddressType === item.name"
                      />
                      <div class="content">
                        <div class="one-line">{{ item.name }}</div>
                        <div class="two-line">{{ item.path }}</div>
                      </div>
                    </div>

                    <!-- <div class="line">
                      <img src="@/assets/image/list_icon_sel.png" alt="" />
                      <div class="content">
                        <div>Same as MVC</div>
                        <div>P2PKH·m/44'/10001'/0'/0/0</div>
                      </div>
                    </div>
                    <div class="line">
                      <img src="@/assets/image/list_icon_sel.png" alt="" />
                      <div class="content">
                        <div>Native Segwit</div>
                        <div>P2WPKH·m/84'/0"/0"/0/0</div>
                      </div>
                    </div>
                    <div class="line">
                      <img src="@/assets/image/list_icon_sel.png" alt="" />
                      <div class="content">
                        <div>Nested Segwit</div>
                        <div>P2SH-P2WPKH · m/49'/0'/0'/0/0</div>
                      </div>
                    </div>
                    <div class="line">
                      <img src="@/assets/image/list_icon_sel.png" alt="" />
                      <div class="content">
                        <div>Taproot</div>
                        <div>P2TR · m/86'/0'/0'/0/0</div>
                      </div>
                    </div>
                    <div class="line">
                      <img src="@/assets/image/list_icon_sel.png" alt="" />
                      <div class="content">
                        <div>Legacy</div>
                        <div>P2PKH · m/44'/0'/0'/0/0</div>
                      </div>
                    </div> -->
                  </div>
                </div>
              </div>
            </template>
          </el-dropdown>
        </div>

        <img
          src="@/assets/image/wallet_lock.png"
          alt=""
          class="wallet-lock"
          @click="setLock"
          v-if="
            router.currentRoute.value.path !== '/' && router.currentRoute.value.path !== '/register'
          "
        />
        <!-- <div class="header-avatar"> -->

        <!-- </div> -->
        <div
          v-if="
            router.currentRoute.value.path !== '/' && router.currentRoute.value.path !== '/register'
          "
        >
          <!-- <el-dropdown class="avatar-dropdown">
            <el-avatar :src="userAvator ? userAvator : baseAvator" class="avatar-style" />
            <template #dropdown>
              <el-dropdown-item @click="goSetting">Setting</el-dropdown-item>
              <el-dropdown-item @click="logout">Logout</el-dropdown-item>
            </template>
          </el-dropdown> -->

          <Dropdown>
            <el-avatar :src="userAvator ? userAvator : baseAvator" class="avatar-style" />
            <template #list>
              <DropdownMenu>
                <DropdownItem @click="goSetting">Setting</DropdownItem>
                <DropdownItem @click="logout">Logout</DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>



        </div>
      </div>

      <div v-if="isModalVisible" class="overlay">
        <div class="modal">
          <img
            src="@/assets/image/pop_icon_close.png"
            alt=""
            @click="closeModal"
            class="close-style"
          />
          <div class="start-lock" v-if="isStartLock">
            <img src="@/assets/image/modal_wallet_lock.png" alt="" class="lock-icon" />
            <div class="modal-title">Set wallet Lock password</div>
            <div class="info">
              The Wallet Lock feature keeps your assets safe and prevents other people from
              manipulating your wallet.
            </div>
            <div class="add-lock" @click="SetWalletLock">Add Lock Password</div>
          </div>

          <div class="setPwd" v-show="isSetPwd">
            <div class="modal-title">Set wallet Lock Password</div>
            <div class="info">Please set a 6-digit wallet lock password</div>
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
            <div
              class="add-lock"
              @click="confirmPassword"
              :class="[!isPasswordComplete ? 'isComplete' : '']"
            >
              Next
            </div>
          </div>

          <div class="confirmPwd" v-show="isConfirmPwd">
            <div class="modal-title">Confirm Lock Password</div>
            <div class="info">Please re-enter the lock Password</div>
            <div class="input-area">
              <input
                v-for="(digit, index) in confirmPasswordDigits"
                :key="index"
                v-model="confirmPasswordDigits[index]"
                @input="() => handleConfirmInput(index)"
                @keydown="handleConfirmKeyDown(index)"
                maxlength="1"
                :ref="(el) => (confirmPasswordInputs[index] = el)"
                type="password"
              />
            </div>
            <div
              class="add-lock"
              @click="handlePasswordConfirmation"
              :class="[!isConfirmPasswordComplete ? 'isComplete' : '']"
            >
              Next
            </div>
          </div>

          <div class="set-success" v-show="isSuccess">
            <img src="../../assets/image/pop_icon_suc.png" alt="" />
            <div class="modal-title">Wallet lock password set successfully!</div>
            <div class="info">
              Don't forget to turn on the lock code when you leave your web wallet. You can manage
              it in the settings.
            </div>
            <div class="add-lock" @click="closeModal">Done</div>
          </div>

          <div class="set-fault" v-show="isFault">
            <img src="../../assets/image/pop_icon_fai.png" alt="" />
            <div class="modal-title">Wallet lock password set failed!</div>
            <div class="info">Passwords do not match. Please try again.</div>
            <div class="add-lock" @click="closeModal">Done</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed, nextTick, watchEffect } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { router } from '@/router'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import localImage from '@/assets/image/avatar_defualt.png'
import { metafile } from '@/utils/filters'
import {
  getMetaIdByAddress,
  getAllInfoByMetaId,
  getTestMetaIdByAddress,
  getTestAllInfoByMetaId,
} from '@/lib/api'
const store = useStore()
const route = useRoute()
const isModalVisible = ref(false)
const isStartLock = ref(true)
const isSetPwd = ref(false)
const isConfirmPwd = ref(false)
const isSuccess = ref(false)
const isFault = ref(false)
const isMobile = ref(false)
const passwordDigits = ref(['', '', '', '', '', ''])
const passwordInputs = ref([])
const confirmPasswordDigits = ref(['', '', '', '', '', ''])
const confirmPasswordInputs = ref([])
const baseAvator = localImage
const userAvator = ref(null)
const chainType = ref([
  { name: 'MVC', icon: 'mainnet_mvc' },
  { name: 'BTC', icon: 'mainnet_btc' },
])
const addressTypeOptions = ref([
  { name: 'Same as MVC', path: `P2PKH · m/44'/10001'/0'/0/0` },
  { name: 'Native Segwit', path: `P2WPKH · m/84'/0"/0"/0/0` },
  { name: 'Nested Segwit', path: `P2SH-P2WPKH · m/49'/0'/0'/0/0` },
  { name: 'Taproot', path: `P2TR · m/86'/0'/0'/0/0` },
  { name: 'Legacy', path: `P2PKH · m/44'/0'/0'/0/0` },
])
const selectedTypeIndex = ref(0)
const selectedChainIndex = ref(0)
function selectAddressType(index, name) {
  selectedTypeIndex.value = index
  store.tabBtcAddressType(name)
  if (router.currentRoute.value.path == '/balance') {
    router.go(0)
  } else {
    router.push({ name: 'balance' })
  }
}
function selectChain(index, name) {
  selectedChainIndex.value = index
  store.tabWallet(name)
}
function tabNet() {
  const netWork = currentNet.value == 'Mainnet' ? 'Testnet' : 'Mainnet'
  store.setCurrentNetWork(netWork)
  if (router.currentRoute.value.path == '/balance') {
    router.go(0)
  } else {
    router.push({ name: 'balance' })
  }
}
function setLock() {
  let luckInfo = localStorage.getItem('lockInfo')
  luckInfo = JSON.parse(luckInfo)
  if (luckInfo && luckInfo?.lockNum) {
    const editLockInfo = { lockNum: luckInfo.lockNum, lockStatus: true }
    localStorage.setItem('lockInfo', JSON.stringify(editLockInfo))
    router.push({ name: 'lock' })
  } else {
    isModalVisible.value = true
    isStartLock.value = true
    isSetPwd.value = false
    isConfirmPwd.value = false
    isSuccess.value = false
    isFault.value = false
  }
}
function SetWalletLock() {
  isStartLock.value = false
  isSetPwd.value = true
  // passwordDigits.value[0].focus();
  nextTick(() => {
    passwordInputs.value[0].focus()
  })
}
const getImageUrl = (name: string, type: string = 'png') => {
  return new URL(`/src/assets/image/${name}.${type}`, import.meta.url).href
}
const currentNet = computed(() => {
  return store.currentNet
})
const handleCommand = (command) => {
  store.setCurrentNetWork(command)
  if (router.currentRoute.value.path == '/balance') {
    router.go(0)
  } else {
    router.push({ name: 'balance' })
  }
  // console.log(router.currentRoute.value.path)
}
const confirmPassword = () => {
  if (!isPasswordComplete.value) {
    return
  }
  isSetPwd.value = false
  isConfirmPwd.value = true

  confirmPasswordDigits.value = ['', '', '', '', '', '']

  // confirmPasswordInputs.value[0].focus();
  nextTick(() => {
    confirmPasswordInputs.value[0].focus()
  })
}

const handlePasswordConfirmation = () => {
  if (!isConfirmPasswordComplete.value) {
    return
  }

  const password = passwordDigits.value.join('')
  const confirmPassword = confirmPasswordDigits.value.join('')
  if (password === confirmPassword) {
    isSuccess.value = true
    isFault.value = false
    isSetPwd.value = false
    isConfirmPwd.value = false
    const lockInfo = { lockNum: confirmPassword, lockStatus: false }
    localStorage.setItem('lockInfo', JSON.stringify(lockInfo))
  } else {
    isFault.value = true
    isSuccess.value = false
    isSetPwd.value = false
    isConfirmPwd.value = false

    passwordDigits.value = ['', '', '', '', '', '']
    confirmPasswordDigits.value = ['', '', '', '', '', '']

    confirmPasswordInputs.value[0].focus()
  }
}
function closeModal() {
  isModalVisible.value = false
  isStartLock.value = false
  isSetPwd.value = false
  isConfirmPwd.value = false
  isSuccess.value = false
  isFault.value = false
  passwordDigits.value = ['', '', '', '', '', '']
  confirmPasswordDigits.value = ['', '', '', '', '', '']
}
function goSetting() {
  router.push({ name: 'setting' })
}
function toHome() {
  router.push({ name: 'balance' })
}
function logout() {
  localStorage.removeItem('lockInfo')
  localStorage.removeItem('userInfo')
  // store.clearAllInfo()
  store.$reset()
  // localStorage.removeItem('root')
  router.push({ name: 'login' })
}
const handleInput = (index) => {
  if (index < 5 && passwordDigits.value[index] !== '') {
    passwordInputs.value[index + 1].focus()
  }
}
const handleConfirmInput = (index) => {
  if (index < 5 && confirmPasswordDigits.value[index] !== '') {
    confirmPasswordInputs.value[index + 1].focus()
  }
}

const isPasswordComplete = computed(() => {
  return passwordDigits.value.every((digit) => digit !== '')
})


const isConfirmPasswordComplete = computed(() => {
  return confirmPasswordDigits.value.every((digit) => digit !== '')
})

const handleKeyDown = (index) => {
  if (event.key === 'Backspace' && !passwordDigits.value[index]) {
    event.preventDefault()
    if (index > 0) {
      passwordInputs.value[index - 1].focus()
    }
  }
}
const handleConfirmKeyDown = (index) => {
  if (event.key === 'Backspace' && !confirmPasswordDigits.value[index]) {
    event.preventDefault()

    if (index > 0) {
      confirmPasswordInputs.value[index - 1].focus()
    }
  }
}
const avatarSource = async (id) => {
  const result = await getAllInfoByMetaId(id)
  if (result.code == 0) {
    return result.data.avatarImage
  }
}
async function getMetaId(address) {
  if (store.currentNet == 'Mainnet') {
    const res = await getMetaIdByAddress(address)
    if (res.code == 0) {
      const userMetaId = res.data
      if (userMetaId) {
        const result = await getAllInfoByMetaId(userMetaId)
        if (result.code == 0) {
          // userInfo.data.name = res.data.name
          return result.data.avatarImage
        }
      }
    }
  } else {
    const res = await getTestMetaIdByAddress(address)
    if (res.code == 0) {
      const userMetaId = res.data
      if (userMetaId) {
        const result = await getTestAllInfoByMetaId(userMetaId)
        if (result.code == 0) {
          return result.data.avatarImage
        }
      }
    }
  }
}
async function getAvator() {
  if (store.currentNet == 'Mainnet') {
    if (store.mainnetUserInfo.metaId) {
      userAvator.value = `https://api.show3.io/metafile/avatar/${store.mainnetUserInfo.metaId}`
    } else {
      userAvator.value = null
    }
  } else {
    // getMetaId(store.currentWalletAddress)
    const testAvatorSource = await getMetaId(store.currentWalletAddress)
    if (testAvatorSource) {
      const finalAvatar = metafile(testAvatorSource)
      userAvator.value = finalAvatar
    } else {
      userAvator.value = null
    }
  }
}
watchEffect(() => {
  if (store.isAuthenticated) {
  
    getAvator()
  }
})
onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
  // const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  getAvator()
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>

<style lang="scss" src="./Header.scss"></style>
