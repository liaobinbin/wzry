<script setup lang="ts">
import { computed, ref } from "vue";

import { switchStore, settingStore } from "@/store";

interface Props {
  notice?: boolean; //显示公告按钮
}
withDefaults(defineProps<Props>(), {
  notice: true,
});

interface Emits {
  (e: "clicks", v: string): void;
}
const emit = defineEmits<Emits>();

const $settingStore = settingStore();
const $switchStore = switchStore();

const toolbar = ref();

//静音
const muted = computed(() => $settingStore.config.muted);

//视频背景
const video_bg = computed(() => $settingStore.config.videoBg);

//静音图标
const icon = computed(() => {
  return muted.value ? "wzry-jingyin-mianxing" : "wzry-laba-mianxing";
});

/**
 * 点击某个按钮
 * @param v 点击静音或公告的标识符
 */
const handleTool = (v: string) => {
  if (v === "sound") {
    $switchStore.$audioStore("n4r4");
    $settingStore.saveConfig({ muted: !muted.value });
    return;
  }
  if (v === "readme") {
    $switchStore.$audioStore("n4r4");
  }
  emit("clicks", v);
};

defineExpose({
  el: toolbar,
});
</script>

<template>
  <div class="tool-bar" ref="toolbar">
    <!-- 静音 -->
    <div v-if="video_bg" class="tool" title="静音">
      <div class="line"></div>
      <div
        class="box cursor-pointer jingyin"
        :class="{ active: muted }"
        :style="{ opacity: muted ? 0.75 : 1 }"
        @click="handleTool('sound')"
      >
        <i class="iconfont" :class="icon" />
        <span class="text">{{ $t("静音") }}</span>
      </div>
      <div class="base"></div>
    </div>

    <!-- README -->
    <div v-if="notice" class="tool" title="README">
      <div class="line"></div>
      <div class="box cursor-pointer elastic" @click="handleTool('readme')">
        <i class="iconfont wzry-readme" />
        <span class="text">{{ $t("介绍") }}</span>
      </div>
      <div class="base"></div>
    </div>

    <!-- 公告 -->
    <div v-if="notice" class="tool" title="公告">
      <div class="line"></div>
      <div class="box cursor-pointer elastic" @click="handleTool('notice')">
        <i class="iconfont wzry-gonggao" />
        <span class="text">{{ $t("公告") }}</span>
      </div>
      <div class="base"></div>
    </div>

    <!--计划 -->
    <div v-if="notice" class="tool" title="计划">
      <div class="line"></div>
      <div class="box cursor-pointer elastic" @click="handleTool('todo')">
        <i class="iconfont wzry-todo" />
        <span class="text">{{ $t("计划") }}</span>
      </div>
      <div class="base"></div>
    </div>

    <!-- 开黑 -->
    <div v-if="notice" class="tool" title="开黑">
      <div class="line"></div>
      <div class="box cursor-pointer elastic" @click="handleTool('team')">
        <i class="iconfont wzry-youxi" />
        <span class="text">{{ $t("开黑") }}</span>
      </div>
      <div class="base"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
