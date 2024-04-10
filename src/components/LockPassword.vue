<template>
    <div class="account-container">
        <div class="title">Coming soon</div>
        <!-- <div class="desc">When the profile changes, the MetaID information of other applications is also updated.</div> -->

    </div>
</template>
          
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw, computed } from 'vue'
import Menu from '@/components/menu.vue'

onMounted(() => {

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
}
</style>
          