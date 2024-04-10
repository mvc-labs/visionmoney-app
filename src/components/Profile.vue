<template>
  <div class="profile-container">
    <div class="title">Profile</div>
    <div class="desc">
      When the profile changes, the MetaID information of other applications is also updated.
    </div>
    <div></div>
    <div class="info-text">
      <div class="avatar">
        <div class="left">Avatar</div>
        <div class="right">
          <el-avatar
            :src="userInfo.data.avatar ? userInfo.data.avatar : baseAvator"
            class="avatar-style"
          />
          <!-- <img src="@/assets/image/icon_ins.png" alt="" class="arrow-style" /> -->
        </div>
      </div>
      <div class="name">
        <div class="left">User Name</div>
        <div class="right">
          <div>{{ userInfo.data.name ? userInfo.data.name : '-' }}</div>
          <!-- <img
            src="@/assets/image/icon_ins.png"
            alt=""
            class="arrow-style"
            @click="editUserNameModal"
          /> -->
        </div>
      </div>
      <div class="meta">
        <div class="left">MetaID</div>
        <div class="right" v-if="userInfo.data.metaId">
          <div>{{ userInfo.data.metaId ? truncateString(userInfo.data.metaId, 18) : '-' }}</div>
          <img
            src="@/assets/image/icon_copy.png"
            alt=""
            class="copy-style"
            v-if="userInfo.data.metaId"
            @click="copyMetaId(userInfo.data.metaId as string)"
          />
        </div>
        <div class="right" v-else>
          <div class="get-id" v-loading="getMetaIdLoading" @click="generateMetaId" v-if="store.currentNet == 'Mainnet'">
            Generate MetaID
          </div>
          <div v-else>
            -
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-if="isUserNameModalVisible" class="offsale-overlay">
      <div class="modal">
        <img
          src="@/assets/image/pop_icon_close.png"
          alt=""
          @click="closeModal"
          class="close-style"
        />
        <div v-show="isConfirmArea" class="confirm-area">
          <div class="title-line">Edit UserName</div>
          <div class="offsale-content">
            <div class="info-area">
              <el-input v-model="newUserName" placeholder="User Name" class="bottom-input" />
              <div class="text-line">
                Notice：To update your username, it will cost approximately 3000 satoshis. Please
                ensure that your account balance is sufficient; otherwise, the update may not be
                successful.
              </div>
            </div>
            <div class="button-area">
              <div
                class="confirm-button"
                @click="Confirm"
                :class="[isOffSellOperating ? 'isComplete' : '']"
              >
                {{ isOffSellOperating ? 'Operating...' : 'Confirm' }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="isOffsaleSuccess" class="offsale-success">
          <div class="success-message">
            <img src="../assets/image/pop_icon_suc.png" alt="" />
            <div class="message-text">Offsell Successful</div>
          </div>
          <div class="button-area">
            <div class="done-button" @click="jumpToNfts()">Done</div>
          </div>
        </div>
        <div v-if="isOffsaleFault" class="offsale-fault">
          <div class="fault-message">
            <img src="../assets/image/pop_icon_fai.png" alt="" />
            <div class="message-text">Offsell Failed</div>
            <div class="fault-text">{{ offsellFaultMessage }}</div>
          </div>
          <div class="button-area">
            <div class="done-button" @click="closeModal">Done</div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
          
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'
import {
  getMetaIdByAddress,
  getAllInfoByMetaId,
  getTestMetaIdByAddress,
  getTestAllInfoByMetaId,
  hdWalletFromMnemonic,
  HdWallet,
} from '@/lib/api'
import { useStore } from '@/store/index'
import { metafile } from '@/utils/filters'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import localImage from '@/assets/image/avatar_defualt.png'
const store = useStore()

const userInfo = reactive({ data: { avatar: null, name: null, metaId: null } })
const userMetaId = ref('')
const baseAvator = localImage
const isUserNameModalVisible = ref(false)
const isConfirmArea = ref(true)
const newUserName = ref('')
const getMetaIdLoading = ref(false)
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    const truncatedStart = str.substring(0, maxLength / 2 - 2)
    const truncatedEnd = str.substring(str.length - maxLength / 2 + 2)
    return truncatedStart + '...' + truncatedEnd
  }
  return str
}
function copyMetaId(tx: string) {
  toClipboard(tx).then(() => {
    ElMessage.success('Copy Success!')
  })
}
async function getMetaId(address) {
  if (store.currentNet == 'Mainnet') {
    const res = await getMetaIdByAddress(address)
    if (res.code == 0) {
      // userMetaId.value = res.data
      userInfo.data.metaId = res.data
      const result = await getAllInfoByMetaId(userInfo.data.metaId)
      if (result.code == 0) {
        // userInfo.data.name = res.data.name
        userInfo.data.name = result.data.name
        return result.data.avatarImage
      }
    }
  } else {
    const res = await getTestMetaIdByAddress(address)
    if (res.code == 0) {
      // userMetaId.value = res.data
      userInfo.data.metaId = res.data
      if (userInfo.data.metaId != '') {
        const result = await getTestAllInfoByMetaId(userInfo.data.metaId)
        if (result.code == 0) {
          // userInfo.data.name = res.data.name
          userInfo.data.name = result.data.name
          return result.data.avatarImage
        }
      } else {
        return
      }
    }
  }
}

const avatarSource = async (id) => {
  const result = await getAllInfoByMetaId(id)
  if (result.code == 0) {
    return result.data.avatarImage
  }
}
function editUserNameModal() {
  isUserNameModalVisible.value = true
}
function closeModal() {
  isUserNameModalVisible.value = false
}
async function generateMetaId() {
  if(getMetaIdLoading.value) return
  getMetaIdLoading.value = true
  const hdWalletMnemonic = await hdWalletFromMnemonic(
    store.mnemonicWord,
    'Mainnet',
    store.mainnetUserInfo.path
  )
  const hdWallet = new HdWallet(hdWalletMnemonic)
  let baseInfo = {
    ...store.mainnetUserInfo,
    role: 'BASIC',
  }
  let metaIdInfo = await hdWallet.initMetaIdNode(baseInfo)
  store.getId(metaIdInfo.metaId)
  userInfo.data.metaId = metaIdInfo.metaId
  getMetaIdLoading.value = false
}
onMounted(async () => {
  if (store.currentNet == 'Mainnet') {
    userInfo.data.name = store.mainnetUserInfo.name
    userInfo.data.metaId = store.mainnetUserInfo.metaId
    if (store.mainnetUserInfo.metaId) {
      userInfo.data.avatar = `https://api.show3.io/metafile/avatar/${store.mainnetUserInfo.metaId}`
    } else {
      userInfo.data.avatar = null
    }
  } else {
    // getMetaId()
    const testAvatorSource = await getMetaId(store.currentWalletAddress)
    if (testAvatorSource) {
      const finalAvatar = metafile(testAvatorSource)
      userInfo.data.avatar = finalAvatar
    } else {
      userInfo.data.avatar = null
    }
  }
})
</script>
          
<style lang="scss" scoped>
.profile-container {
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

  .info-text {
    box-sizing: border-box;
    border-top: 1px solid #303133;
    border-bottom: 1px solid #303133;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #303133;

    .arrow-style {
      width: 16px;
      height: 16px;
      margin-left: 5px;
      cursor: pointer;
    }

    .avatar {
      box-sizing: border-box;
      border-bottom: 1px solid #303133;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;

      .left {
      }

      .right {
        display: flex;
        align-items: center;

        .avatar-style {
          width: 44px;
          height: 44px;
        }
      }
    }

    .name {
      box-sizing: border-box;
      border-bottom: 1px solid #303133;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;

      .left {
      }

      .right {
        display: flex;
        align-items: center;
      }
    }

    .meta {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;

      .left {
      }

      .right {
        display: flex;
        align-items: center;

        .copy-style {
          width: 16px;
          height: 16px;
          margin-left: 5px;
          cursor: pointer;
        }
        .get-id {
          box-sizing: border-box;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          background-color: #0f7bff;
          border: 2px solid #303133;
          padding: 5px 20px;
          border-radius: 8px;
          cursor: pointer;
        }
        &:deep(.el-loading-mask) {
          border-radius: 6px;
        }
        &:deep(.circular) {
          width: 15px !important;
        }
      }
    }
  }

  .offsale-overlay {
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
        width: 35vw;
      }
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

      .confirm-area {
        font-family: PingFang SC, PingFang SC;
        .title-line {
          font-size: 18px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #303133;
          border-bottom: 2px solid #303133;
          padding: 15px 0;
        }

        .offsale-content {
          box-sizing: border-box;
          padding-top: 20px;
          padding: 36px 0;

          .info-area {
            display: flex;
            padding: 0 20px;
            flex-direction: column;
            .title {
              text-align: left;
            }

            .bottom-input {
            }
            .text-line {
              text-align: left;
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: red;
              margin-top: 10px;
            }
            .el-input {
              box-shadow: none !important;
              --el-input-hover-border: transparent;
              --el-input-focus-border: transparent;
              --el-input-transparent-border: 0 0 0 1px transparent inset;
              --el-input-hover-border-color: transparent;
              --el-input-clear-hover-color: transparent;
              --el-input-focus-border-color: transparent;
            }

            &:deep(.el-input__wrapper) {
              box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
              resize: none;
              cursor: default;
              border: 2px solid #303133;
            }
          }

          .button-area {
            box-sizing: border-box;
            display: flex;
            padding: 0 20px;
            margin-top: 20px;

            // .cancel-button {
            //   box-sizing: border-box;
            //   background: #ffffff;
            //   border-radius: 12px;
            //   border: 2px solid #303133;
            //   font-size: 16px;
            //   font-family: PingFang SC, PingFang SC;
            //   font-weight: 500;
            //   color: #0f7bff;
            //   padding: 15px;
            //   cursor: pointer;
            //   width: 45%;
            //   margin-right: 10%;
            //   text-align: center;
            //   box-shadow: 3px 3px 0px #303133;
            // }

            .confirm-button {
              box-sizing: border-box;
              background: #0f7bff;
              border-radius: 12px;
              border: 2px solid #303133;
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              padding: 15px;
              cursor: pointer;
              width: 100%;
              text-align: center;
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

      .offsale-success {
        box-sizing: border-box;
        padding: 40px 36px 36px;
        font-family: PingFang SC, PingFang SC;
        .success-message {
          img {
            width: 60px;
            height: 60px;
          }

          .message-text {
            margin: 10px 0;
          }
        }

        .button-area {
          padding: 0;

          .done-button {
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
            margin-top: 20px;
            box-shadow: 3px 3px 0px #303133;
          }
        }
      }

      .offsale-fault {
        box-sizing: border-box;
        padding: 40px 36px 36px;
        font-family: PingFang SC, PingFang SC;
        .fault-message {
          img {
            width: 60px;
            height: 60px;
          }

          .message-text {
            margin: 10px 0;
          }
        }

        .button-area {
          padding: 0;

          .done-button {
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
            margin-top: 20px;
            box-shadow: 3px 3px 0px #303133;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .profile-container {
    .info-text {
      .arrow-style {
        width: 16px;
        height: 16px;
        margin-left: 5px;
      }

      .avatar {
        box-sizing: border-box;
        border-bottom: 1px solid #303133;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        .left {
        }

        .right {
          display: flex;
          align-items: center;

          .avatar-style {
            // width: 59px;
            // height: 59px;
          }
        }
      }

      .name {
        box-sizing: border-box;
        border-bottom: 1px solid #303133;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        .left {
        }

        .right {
          display: flex;
          align-items: center;
        }
      }

      .meta {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        .left {
        }

        .right {
          display: flex;
          align-items: center;

          .copy-style {
            width: 16px;
            height: 16px;
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
          