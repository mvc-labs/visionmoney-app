<template>
  <div class="home-container" :class="[isMobileSafari?'safari-container':'']">
    <div class="home-specific">
      <Menu :activeIndex="activeIndex"></Menu>
      <div class="app-container">
        <div class="center-content">
          <div class="left">
            <div>MVC Applications</div>
            <div>3 items</div>
          </div>
          <div class="right">
            <img src="../assets/image/img_app.png" alt="" />
          </div>
        </div>
        <div class="app-list">
          <div class="app-data" @click="jumpToLink('show')">
            <div class="data-left">
              <img src="@/assets/image/app_icon_show3.png" class="avatar-style" />
              <div class="name">
                <div>Show3</div>
                <div>Web3.0 is NFT socialized life.</div>
              </div>
            </div>
            <div class="data-right">
              <img src="@/assets/image/icon_ins.png" alt=""  />
            </div>
          </div>
          <div class="app-data" @click="jumpToLink('mvc')">
            <div class="data-left">
              <img src="@/assets/image/app_icon_ms.png" class="avatar-style" />
              <div class="name">
                <div>MVC SWAP</div>
                <div>Exchange on MVC.</div>
              </div>
            </div>
            <div class="data-right">
              <img src="@/assets/image/icon_ins.png" alt=""  />
            </div>
          </div>
          <div class="app-data" @click="jumpToLink('meta')">
            <div class="data-left">
              <img src="@/assets/image/app_icon_mn.png" class="avatar-style" />
              <div class="name">
                <div>Meta Name</div>
                <div>Domain Name System on MVC.</div>
              </div>
            </div>
            <div class="data-right">
              <img src="@/assets/image/icon_ins.png" alt=""  />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
        
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'
import Menu from '@/components/menu.vue'
const activeIndex = ref('app')
const handleSelect = (key: string, keyPath: string[]) => {
}
const isMobileSafari = ref(false)
const checkDevice = () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (/Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent)) {
      isMobileSafari.value = true
    }
  }
}
function jumpToLink(link) {
  if (link === 'show') {
    window.open('https://show3.io')
  } else if (link === 'mvc') {
    window.open('https://mvcswap.com')
  } else if (link === 'meta') {
    window.open('https://www.show3.io/metaname')
  }
}
onMounted(() => {
  checkDevice()
})
</script>
        
<style lang="scss" scoped>
.home-container {
  width: 35%;
  margin: 0 auto;
  height: calc(100vh - 100px);
  border-radius: 12px;
  opacity: 1;
  border: 2px solid #303133;
  box-sizing: border-box;
  box-shadow: 10px 10px 0px -1px #0f7bff;

  .home-specific {
    display: flex;
    flex-direction: column;

    // align-items: center;
    // text-align: left;
    .app-container {
      padding: 0 16px;

      .center-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          div:nth-child(1) {
            font-size: 24px;
            font-family: Montserrat, Montserrat;
            font-weight: 700;
            color: #303133;
            margin-bottom: 10px;
          }

          div:nth-child(2) {
            font-size: 16px;
            font-family: Montserrat, Montserrat;
            font-weight: 500;
            color: #909399;
          }
        }

        .right {
          img {
            width: 289px;
            height: 156px;
          }
        }
      }

      .app-list {
        display: flex;
        flex-direction: column;

        .app-data {
          display: flex;
          justify-content: space-between;
          border-radius: 11px 11px 11px 11px;
          border: 2px solid #303133;
          box-sizing: border-box;
          padding: 16px;
          margin-bottom: 11px;
          align-items: center;
          cursor: pointer;


          .data-left {
            display: flex;
            align-items: center;

            .avatar-style {
              margin-right: 20px;
              width: 43px;
              height: 43px;
            }

            .name {
              box-sizing: border-box;

              div:nth-child(1) {
                font-size: 16px;
                font-family: Montserrat, Montserrat;
                font-weight: 600;
                color: #303133;
                margin-bottom: 5px;
              }

              div:nth-child(2) {
                font-size: 12px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                color: #606266;
              }
            }
          }

          .data-right {
            box-sizing: border-box;

            img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .home-container {
    width: 45%;
    margin: 0 auto;
    height: 720px;
    border-radius: 12px;
    opacity: 1;
    border: 2px solid #303133;
    box-sizing: border-box;
    box-shadow: 10px 10px 0px -1px #0f7bff;

    .home-specific {
      display: flex;
      flex-direction: column;

      // align-items: center;
      // text-align: left;
      .app-container {
        padding: 0 16px;

        .center-content {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .left {
            div:nth-child(1) {
              font-size: 24px;
              font-family: Montserrat, Montserrat;
              font-weight: 700;
              color: #303133;
              margin-bottom: 10px;
            }

            div:nth-child(2) {
              font-size: 16px;
              font-family: Montserrat, Montserrat;
              font-weight: 500;
              color: #909399;
            }
          }

          .right {
            img {
              width: 289px;
              height: 156px;
            }
          }
        }

        .app-list {
          display: flex;
          flex-direction: column;

          .app-data {
            display: flex;
            justify-content: space-between;
            border-radius: 11px 11px 11px 11px;
            border: 2px solid #303133;
            box-sizing: border-box;
            padding: 16px;
            margin-bottom: 11px;
            align-items: center;

            .data-left {
              display: flex;
              align-items: center;

              .avatar-style {
                margin-right: 20px;
                width: 43px;
                height: 43px;
              }

              .name {
                box-sizing: border-box;

                div:nth-child(1) {
                  font-size: 16px;
                  font-family: Montserrat, Montserrat;
                  font-weight: 600;
                  color: #303133;
                  margin-bottom: 5px;
                }

                div:nth-child(2) {
                  font-size: 12px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #606266;
                }
              }
            }

            .data-right {
              box-sizing: border-box;

              img {
                width: 16px;
                height: 16px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .home-container {
    width: 90%;
    margin: 0 auto;
    height: 90vh;
    border-radius: 12px;
    opacity: 1;
    border: 2px solid #303133;
    box-sizing: border-box;
    box-shadow: 10px 10px 0px -1px #0f7bff;

    .home-specific {
      display: flex;
      flex-direction: column;

      // align-items: center;
      // text-align: left;
      .app-container {
        padding: 0 16px;

        .center-content {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .left {
            padding: 20px 0;

            div:nth-child(1) {
              font-size: 24px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 700;
              color: #303133;
              margin-bottom: 10px;
            }

            div:nth-child(2) {
              font-size: 16px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #909399;
            }
          }

          .right {
            img {
              width: 100px;
              height: 100px;
              display: none;
            }
          }
        }

        .app-list {
          display: flex;
          flex-direction: column;

          .app-data {
            display: flex;
            justify-content: space-between;
            border-radius: 11px 11px 11px 11px;
            border: 2px solid #303133;
            box-sizing: border-box;
            padding: 12px 12px;
            margin-bottom: 11px;
            align-items: center;

            .data-left {
              display: flex;
              align-items: center;

              .avatar-style {
                margin-right: 10px;
                width: 30px;
                height: 30px;
              }

              .name {
                box-sizing: border-box;

                div:nth-child(1) {
                  font-size: 16px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 600;
                  color: #303133;
                  margin-bottom: 5px;
                }

                div:nth-child(2) {
                  font-size: 12px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #606266;
                }
              }
            }

            .data-right {
              box-sizing: border-box;

              img {
                width: 16px;
                height: 16px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .safari-container {
    height: calc(100vh - 175px);
  }
}
</style>
        