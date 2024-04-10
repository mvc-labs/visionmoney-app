<template>
  <div>
    <Header></Header>
    <RouterView />
    <Footer v-if="router.currentRoute.value.path === '/'"></Footer>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer.vue'
import { router } from '@/router'
</script>
<style lang="scss">
#app {
  overflow-x: hidden;
  box-sizing: border-box;
  font-family: 'Montserrat';
  padding: 0;
  height: auto;
  padding-bottom: 10px;
}
.vue-country-list-wrap {
  width: 20% !important;
  @media screen and (max-width: 750px) {
    width: 75vw!important;
  }
}
</style>
