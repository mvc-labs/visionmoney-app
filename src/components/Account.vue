<template>
  <div class="account-container">
    <div class="title">Account</div>
    <div class="desc">
      After binding your social account information, you can use them to log into different MetaID
      apps.
    </div>
    <div class="info-text">
      <div class="email">
        <div class="left">
          <img src="@/assets/image/login_icon_email.png" alt="" class="icon-email" />
          <span>Email</span>
        </div>
        <div class="right">
          <div>{{ emailAddress }}</div>
          <!-- <img src="@/assets/image/icon_ins.png" alt="" class="arrow-style" /> -->
        </div>
      </div>
      <div class="phone">
        <div class="left">
          <img src="@/assets/image/login_icon_phone.png" alt="" class="icon-phone" />
          <span>Phone</span>
        </div>
        <div class="right">
          <div>{{ phoneNumber }}</div>
          <!-- <img src="@/assets/image/icon_ins.png" alt="" class="arrow-style" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
          
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'
import { getMetaIdByAddress, getAllInfoByMetaId,getTestMetaIdByAddress,getTestAllInfoByMetaId } from '@/lib/api'
import { useStore } from '@/store/index'
const store = useStore()

const userInfo = reactive({ data: { email: null, phone: null } })
const emailAddress = computed(() => {
  return userInfo.data.email ? userInfo.data.email : 'Unbound'
})
const phoneNumber = computed(() => {
  return userInfo.data.phone ? userInfo.data.phone : 'Unbound'
})
async function getMetaId(address) {
  if (store.currentNet == 'Mainnet') {
    const res = await getMetaIdByAddress(address)
    if (res.code == 0) {
      const userMetaId = res.data
      const result = await getAllInfoByMetaId(userMetaId)
      if (result.code == 0) {
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
        }
      } else {
        return
      }
    }
  }
}
onMounted(() => {
  // if (localStorage.getItem('userInfo')) {
  //   userInfo.data = JSON.parse(localStorage.getItem('userInfo'))
  // }
  // if (store.userInfo) {
  //   userInfo.data.email = store.userInfo.email
  //   userInfo.data.phone = store.userInfo.phone
  // } else {
  //   getMetaId(store.mvcMainWalletInfo.mvcAddress)
  // }

  if (store.currentNet == 'Mainnet') {
    if (store.mainnetUserInfo.register == 'email' || store.mainnetUserInfo.register == 'phone') {
      userInfo.data.email = store.mainnetUserInfo.email
      userInfo.data.phone = store.mainnetUserInfo.phone
    } else {
      // getMetaId(store.currentWalletAddress)
      userInfo.data.email = '-'
      userInfo.data.phone = '-'
    }
  } else {
    getMetaId(store.currentWalletAddress)
  }
})
</script>
          
<style lang="scss" scoped>
.account-container {
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
    font-size: 16px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #303133;
    box-sizing: border-box;
    border-top: 1px solid #303133;
    border-bottom: 1px solid #303133;

    .arrow-style {
      width: 16px;
      height: 16px;
      margin-left: 5px;
    }

    .email {
      box-sizing: border-box;
      border-bottom: 1px solid #303133;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;

      .left {
        display: flex;
        align-items: center;

        .icon-email {
          width: 27px;
          height: 27px;
          margin-right: 5px;
        }
      }

      .right {
        display: flex;
        align-items: center;
      }
    }

    .phone {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;

      .left {
        display: flex;
        align-items: center;

        .icon-phone {
          width: 27px;
          height: 27px;
          margin-right: 5px;
        }
      }

      .right {
        display: flex;
        align-items: center;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .account-container {
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
      font-size: 16px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #303133;
      box-sizing: border-box;
      border-top: 1px solid #303133;
      border-bottom: 1px solid #303133;

      .arrow-style {
        width: 16px;
        height: 16px;
        margin-left: 5px;
      }

      .email {
        box-sizing: border-box;
        border-bottom: 1px solid #303133;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        .left {
          display: flex;
          align-items: center;

          .icon-email {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
        }

        .right {
          display: flex;
          align-items: center;
        }
      }

      .phone {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        .left {
          display: flex;
          align-items: center;

          .icon-phone {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
        }

        .right {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
          