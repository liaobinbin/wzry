<script setup lang="ts">
import { switchStore, collapseStore } from "@/store";

const $collapseStore = collapseStore();
const $switchStore = switchStore();

/* 点击折叠按钮 */
const handleToggle = () => {
  $switchStore.$audioStore("d5e2");
  $collapseStore.toggleCollapse();
};
</script>

<template>
  <i
    class="iconfont wzry-packup cursor-pointer"
    :class="{ 'is-active': !$collapseStore.collapse }"
    @click="handleToggle"
  />
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
