import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Balance from '@/views/Balance.vue'
import Token from '@/views/Token.vue'
import Nfts from '@/views/Nfts.vue'
import Application from '@/views/Application.vue'
import AlbumDetail from '@/views/AlbumDetail.vue'
import NftDetail from '@/views/NftDetail.vue'
import OrdinalDetail from '@/views/OrdinalDetail.vue'
import Setting from '@/views/Setting.vue'
import Register from '@/views/Register.vue'
import Lock from '@/views/Lock.vue'
import { useStore } from '@/store/index'
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/balance',
      name: 'balance',
      component: Balance,
    },
    {
      path: '/token',
      name: 'token',
      component: Token,
    },
    {
      path: '/nfts',
      name: 'nfts',
      component: Nfts,
    },
    {
      path: '/AlbumDetail/:genesis/:codeHash',
      name: 'AlbumDetail',
      component: AlbumDetail,
    },
    {
      path: '/NftDetail/:metaTxid/:index/:genesis/:codeHash/:status/:price',
      name: 'NftDetail',
      component: NftDetail,
    },
    {
      path: '/OrdinalDetail/:inscriptionId',
      name: 'OrdinalDetail',
      component: OrdinalDetail,
    },
    {
      path: '/app',
      name: 'application',
      component: Application,
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/lock',
      name: 'lock',
      component: Lock,
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  let isLoginStatus = store.currentMvcWalletAddress
  if (!isLoginStatus) {
    if (to.path === '/') {
      next()
      return
    }
    if (to.path === '/register') {
      next()
    }
    next('/')
  } else {
    let isLock = localStorage.getItem('lockInfo')
    if (to.path === '/') {
      next('/balance')
      // return
    } else {
      if (isLock) {
        isLock = JSON.parse(isLock)
        let lockStatus = isLock.lockStatus
        if (to.path == "/lock") {
          next()
        } else {
          if (lockStatus) {
            next('/lock')
            return
          } else {
            next()
          }
        }
      } else {
        next()
      }
    }
  }

  // let isLock = localStorage.getItem('lockInfo')
  // if (isLock) {
  //   isLock = JSON.parse(isLock)
  //   let lockStatus = isLock.lockStatus
  //   if (to.path == "/lock") {
  //     next()
  //   } else {
  //     if (lockStatus) {
  //       next('/lock')
  //       return
  //     } else {
  //       next()
  //     }
  //   }
  // } else {
  //   next()
  // }
})

