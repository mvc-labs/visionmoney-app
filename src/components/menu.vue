<template>
    <!-- <div class="top-menu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
            <el-menu-item index="balance">Balance</el-menu-item>
            <el-menu-item index="token">Token</el-menu-item>
            <el-menu-item index="nfts">NFT</el-menu-item>
            <el-menu-item index="app">APP</el-menu-item>
        </el-menu>
    </div> -->
    <div class="menu" :class="{ 'scrollable-menu': isMobile }">
        <router-link v-for="item in menuItems" :key="item.route" :to="item.route" class="menu-item"
            :class="{ active: activeRoute === item.route }" @click="setActiveRoute(item.route)">
            {{ item.name }}
        </router-link>
    </div>
</template>
  
<script setup lang="ts">
import Header from '@/components/Header/Header.vue'
import { onMounted, onUnmounted, reactive, ref, toRaw, computed, shallowRef } from 'vue'
const menuItems = [
    { name: 'Balance', route: '/balance' },
    { name: 'Token', route: '/token' },
    { name: 'NFT', route: '/nfts' },
    { name: 'APP', route: '/app' },
];
const isMobile = ref(false);
const activeRoute = ref('');
function setActiveRoute(route) {
    activeRoute.value = route;
}
// const props = defineProps<{
//     activeIndex: {
//         type: String,
//         required: true,
//         default: 'balance'
//     }
// }>()
// const handleSelect = (key: string, keyPath: string[]) => {
//     // activeIndex.value = key
//     // if()
// }
onMounted(() => {
    // isMobile.value = window.innerWidth < 768;

    // window.addEventListener('resize', () => {
    //     isMobile.value = window.innerWidth < 768;
    // });

    setActiveRoute(window.location.pathname);
});
onUnmounted(() => {
    // window.removeEventListener('resize', () => { });
})
</script>
<style lang="scss" scoped>
// .top-menu {
//     box-sizing: border-box;

//     .el-menu {
//         padding: 0 50px;
//         display: flex;
//         flex-direction: row;
//         justify-content: space-between;
//         box-sizing: border-box;
//         background-color: transparent !important;
//         border-bottom: 1px solid rgba(48, 49, 51, 0.05);

//         .el-menu-item {
//             // flex: 1;
//             font-size: 18px;
//             font-family: PingFang SC, PingFang SC;
//             font-weight: 500;
//             color: #303133;
//         }

//         &:deep(.el-menu-item.is-active) {
//             background: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%);
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//             color: transparent !important;
//             border-bottom: 2px solid;
//             border-image: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%) 2 2 2 2;
//         }
//     }
// }

// @media screen and (max-width: 1440px) {
//     .el-menu {
//         .el-menu-item {
//             // flex: 1;
//             // font-size: 16px!important;
//             // font-family: PingFang SC, PingFang SC;
//             // font-weight: 500;
//             // color: #303133;
//         }
//     }
// }

// @media screen and (max-width: 750px) {
//     .top-menu {
//         box-sizing: border-box;

//         .el-menu {
//             padding: 0;


//             .el-menu-item {
//                 font-size: 16px;
//                 font-family: PingFang SC, PingFang SC;
//                 font-weight: 500;
//                 color: #303133;
//             }

//             &:deep(.el-menu-item.is-active) {
//                 background: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%);
//                 -webkit-background-clip: text;
//                 -webkit-text-fill-color: transparent;
//                 color: transparent !important;
//                 border-bottom: 2px solid;
//                 border-image: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%) 2 2 2 2;
//             }
//         }
//     }
// }
// .scrollable-menu {
//     overflow-x: auto;
//     white-space: nowrap;
// }

.menu {
    padding: 0 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    display: flex;
    border-bottom: 1px solid rgba(48, 49, 51, 0.05);
    height: 52px;
    line-height: 52px;
}

.menu-item {
    // padding: 10px;
    text-decoration: none;
    font-size: 18px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #303133;
}

.menu-item.active {
    // border-bottom: 2px solid red;
    // color: red;
    background: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent !important;
    border-bottom: 2px solid;
    border-image: linear-gradient(270deg, #72F5F6 0%, #171AFF 100%) 2 2 2 2;
}

@media screen and (max-width: 750px) {
    .menu {
        padding: 0 20px;
    }
    .menu-item {
    // padding: 10px;
    text-decoration: none;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #303133;
}
}
</style>
