<script setup lang="ts">
import { ref } from "vue";

import { Team } from "@/api/modules/data";
import { switchStore } from "@/store";
import { TOOL } from "@/utils";

const $switchStore = switchStore();

const active = ref(-1); //当前显示的图片的索引号
const imgs = ref<string[]>([]);

$switchStore.$audioStore("u4c5");

Team().then((res) => {
  imgs.value = res.data as unknown as string[];
});

/* 查看图片 */
const handleView = (v: string, i: number) => {
  new TOOL.ScaleImage(v);
  active.value = i;
};
</script>

<template>
  <K-Dialog v-bind="$attrs" width="56.25rem" header="辅助求带飞">
    <div class="team">
      <img
        v-for="(item, index) in imgs"
        class="cursor-pointer"
        :class="{
          active: index === active,
        }"
        :src="item"
        alt=""
        @click="handleView(item, index)"
        :key="index"
      />
    </div>
  </K-Dialog>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
