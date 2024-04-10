<template>
  <div class="home-container">
    <div class="home-specific">
      <div class="left-menu">
        <div class="menu-container">
          <div v-for="(section, sectionIndex) in menuSections" :key="sectionIndex" class="sections">
            <div class="section-title">{{ section.title }}</div>
            <div class="section-children">
              <div
                v-for="(item, itemIndex) in section.items"
                :key="`${sectionIndex}-${itemIndex}`"
                @click="selectMenuItem(`${sectionIndex}-${itemIndex}`, item.component)"
                class="children-style"
                :class="{ highlighted: selectedItem === `${sectionIndex}-${itemIndex}` }"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-content">
        <component :is="selectedComponent"></component>
      </div>
    </div>
  </div>
</template>
          
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed, shallowRef } from 'vue'
import Profile from '@/components/Profile.vue'
import Account from '@/components/Account.vue'
import WalletBackup from '@/components/WalletBackup.vue'
import LockPassword from '@/components/LockPassword.vue'
import Language from '@/components/Language.vue'


const selectedComponent = shallowRef(Profile)
const menuSections = reactive([
  {
    title: 'Information',
    items: [
      { label: 'Profile', component: Profile },
      { label: 'Account', component: Account },
    ],
  },
  {
    title: 'Safety',
    items: [
      { label: 'Wallet Backup', component: WalletBackup },
      { label: 'Lock Password', component: LockPassword },
    ],
  },
  {
    title: 'Other',
    items: [{ label: 'Language', component: Language }],
  },
])
const selectedItem = ref('0-0')

function selectMenuItem(itemIndex, component) {
  selectedItem.value = itemIndex
  selectedComponent.value = component
}


onMounted(() => {

})
</script>
          
<style lang="scss" scoped>
.home-container {
  width: 35%;
  margin: 0 auto;
  height: 90vh;
  box-sizing: border-box;

  .home-specific {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;

    .left-menu {
      width: 28%;
      border-radius: 16px;
      border: 2px solid #303133;
      box-sizing: border-box;
      height: 100%;
      padding: 32px 21px;

      .menu-container {
        .sections {
          .section-title {
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #909399;
            margin-bottom: 10px;
          }

          .section-children {
            margin-bottom: 25px;

            .children-style {
              font-size: 17px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #303133;
              margin-bottom: 10px;
              cursor: pointer;
            }

            .highlighted {
              color: #0f7bff;
            }
          }
        }
      }
    }

    .right-content {
      width: 70%;
      border-radius: 16px;
      border: 2px solid #303133;
      box-sizing: border-box;
      height: 100%;
      padding: 32px;
    }
  }
}

@media screen and (max-width: 1440px) {
  .home-container {
    width: 45%;
    margin: 0 auto;
    height: 720px;
    box-sizing: border-box;

    .home-specific {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 100%;

      .left-menu {
        width: 32%;
        border-radius: 16px;
        border: 2px solid #303133;
        box-sizing: border-box;
        height: 100%;
        padding: 32px 21px;

        .menu-container {
          .sections {
            .section-title {
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #909399;
              margin-bottom: 10px;
            }

            .section-children {
              margin-bottom: 25px;

              .children-style {
                font-size: 17px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                color: #303133;
                margin-bottom: 10px;
                cursor: pointer;
              }

              .highlighted {
                color: #0f7bff;
              }
            }
          }
        }
      }

      .right-content {
        width: 66%;
        border-radius: 16px;
        border: 2px solid #303133;
        box-sizing: border-box;
        height: 100%;
        padding: 32px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .home-container {
    width: 95%;
    margin: 0 auto;
    height: 90vh;
    box-sizing: border-box;

    .home-specific {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 100%;

      .left-menu {
        width: 30%;
        border-radius: 16px;
        border: 2px solid #303133;
        box-sizing: border-box;
        height: 100%;
        padding: 32px 16px;

        .menu-container {
          .sections {
            .section-title {
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #909399;
              margin-bottom: 10px;
            }

            .section-children {
              margin-bottom: 25px;

              .children-style {
                font-size: 16px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                color: #303133;
                margin-bottom: 10px;
                cursor: pointer;
              }

              .highlighted {
                color: #0f7bff;
              }
            }
          }
        }
      }

      .right-content {
        width: 68%;
        border-radius: 16px;
        border: 2px solid #303133;
        box-sizing: border-box;
        height: 100%;
        padding: 32px 16px;
      }
    }
  }
}
</style>
          