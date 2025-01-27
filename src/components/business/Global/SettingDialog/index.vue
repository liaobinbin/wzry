<script setup lang="ts">
import { ref } from "vue";

import DescSet from "./childComps/DescSet/index.vue"; //悬浮问号显示tip

import { TOOL } from "@/utils";
import { setLanguage } from "@/language";
import { configDefault } from "@/default";
import { audioStore, musicStore, settingStore, cssVarStore, switchStore } from "@/store";

interface Props {
  modelValue: boolean;
}
defineProps<Props>();

const $audioStore = audioStore();
const $musicStore = musicStore();
const $settingStore = settingStore();
const $cssVarStore = cssVarStore();
const $switchStore = switchStore();

//默认配置
const default_config: SettingConfig = { ...configDefault };

const show_confirm_reset = ref(false); //显示/隐藏确认重置弹窗
const config = ref<SettingConfig>({ ...$settingStore.config });

/* 语言 */
const EmitLanguage = (v: number) => {
  setLanguage(v as 0 | 1 | 2);
  EmitSaveConfig();
};

/* 动画速率 */
const EmitSpeed = (v: number) => {
  $cssVarStore.setSpeed(v as 0 | 1 | 2);
  EmitSaveConfig();
};

/* 开启音乐 */
const EmitMusic = (v: boolean) => {
  EmitSaveConfig();
  if (v) {
    $musicStore.play(false);
  } else {
    $musicStore.pause();
  }
};

/* 音乐音量调节 */
const EmitMusicVolume = (v: number) => {
  $musicStore.setVolume(v);
  TOOL.debounce(() => {
    EmitSaveConfig();
  }, 1000);
};

/* 支持控制音乐进度 */
const EmitMusicProgress = () => {
  EmitSaveConfig();
};

/* 开启音效 */
const EmitAudio = (v: boolean) => {
  $audioStore.setAudio(v);
  EmitSaveConfig();
};

/* 音效音量调节 */
const EmitAudioVolume = (v: number) => {
  $audioStore.setVolume(v);
  TOOL.debounce(() => {
    EmitSaveConfig();
  }, 1000);
};

/* 线条 */
const EmitBorder = (v: boolean) => {
  $cssVarStore.setBorder(v);
  EmitSaveConfig();
};

/* 阴影 */
const EmitShadow = (v: boolean) => {
  $cssVarStore.setShadow(v);
  EmitSaveConfig();
};

/* 柔光 */
const EmitShine = (v: boolean) => {
  $cssVarStore.setShine(v);
  EmitSaveConfig();
};

/* 粒子特效 */
const EmitParticle = () => {
  EmitSaveConfig();
};

/* 启用/禁用Tip */
const EmitTip = (v: boolean) => {
  EmitSaveConfig();
  v && $switchStore.$tip({ text: "2rb7" });
};

/* 恢复所有小贴士 */
const handleResetTip = () => {
  $settingStore.restoreTip();
  $switchStore.$msg("已恢复所有小贴士");
};

/* 保存配置 */
const EmitSaveConfig = () => {
  $settingStore.saveConfig(config.value);
};

/* 重置配置 */
const EmitResetConfig = () => {
  $settingStore.saveConfig(default_config);
  config.value = { ...default_config };
  $audioStore.setAudio(config.value.audio);
  $audioStore.setVolume(config.value.audioVolume);
  $musicStore.setVolume(config.value.musicVolume);
  $cssVarStore.setSpeed(config.value.speed);
  $cssVarStore.setShine(config.value.shine);
  $cssVarStore.setShadow(config.value.shadow);
  $cssVarStore.setBorder(config.value.border);
  $switchStore.$msg("已重置所有配置项");
};
</script>

<template>
  <div class="setting-dialog">
    <K-Dialog v-bind="$attrs" title="设置" width="57.5rem" ctx-width="90%" up>
      <div class="options">
        <!-- 语言 -->
        <div class="option">
          <div class="label">{{ $t("语言") }}</div>
          <K-Select
            v-model="config.language"
            width="7rem"
            :option="['中文', '繁体', 'English']"
            @update:model-value="EmitLanguage"
          />
        </div>

        <!-- 动画速率 -->
        <div class="option">
          <div class="label">{{ $t("动画") }}</div>
          <K-Select
            v-model="config.speed"
            width="7rem"
            :option="[$t('迅速'), $t('均衡'), $t('优雅')]"
            @update:model-value="EmitSpeed"
          />
        </div>

        <!-- 音效 -->
        <div class="option">
          <div class="label">{{ $t("音效") }}</div>
          <K-Range
            v-model="config.audioVolume"
            :text="config.audioVolume + '%'"
            :disabled="!config.audio"
            @update:model-value="EmitAudioVolume"
          />
          <K-Check v-model="config.audio" @update:model-value="EmitAudio" />
        </div>

        <!-- 音乐 -->
        <div class="option">
          <div class="label">{{ $t("音乐") }}</div>
          <K-Range
            v-model="config.musicVolume"
            :text="config.musicVolume + '%'"
            :disabled="!config.music"
            @update:model-value="EmitMusicVolume"
          />
          <K-Check v-model="config.music" @update:model-value="EmitMusic" />
        </div>

        <!-- 音乐进度控制 -->
        <div class="option">
          <div class="label">
            {{ $t("音乐进度控制") }}
            <DescSet desc="音乐进度控制描述" />
          </div>
          <K-Check v-model="config.musicProgress" @update:model-value="EmitMusicProgress" />
        </div>

        <!-- 线条 -->
        <div class="option">
          <div class="label">{{ $t("元素线条") }}</div>
          <K-Check v-model="config.border" @update:model-value="EmitBorder" />
        </div>

        <!-- 阴影 -->
        <div class="option">
          <div class="label">{{ $t("元素阴影") }}</div>
          <K-Check v-model="config.shadow" @update:model-value="EmitShadow" />
        </div>

        <!-- 柔光 -->
        <div class="option">
          <div class="label">
            {{ $t("元素发光") }}
            <DescSet desc="元素发光描述" />
          </div>
          <K-Check v-model="config.shine" @update:model-value="EmitShine" />
        </div>

        <!-- 粒子特效 -->
        <div class="option">
          <div class="label">
            {{ $t("粒子特效") }}
            <DescSet desc="粒子特效描述" />
          </div>
          <K-Check v-model="config.particle" @update:model-value="EmitParticle" />
        </div>

        <!-- 视频背景 -->
        <div class="option">
          <div class="label">
            {{ $t("视频背景") }}
            <DescSet desc="视频背景描述" />
          </div>
          <K-Check v-model="config.videoBg" @update:model-value="EmitSaveConfig" />
        </div>

        <!-- 小贴士 -->
        <div class="option">
          <div class="label">
            {{ $t("小贴士") }}
            <DescSet desc="小贴士描述" />
          </div>
          <K-Check v-model="config.tip" @update:model-value="EmitTip" />
        </div>

        <!-- 恢复所有不再提示 -->
        <div class="option">
          <div class="label">{{ $t("恢复所有小贴士") }}</div>
          <K-Button width="6.5rem" height="2.1875rem" font-size="1.25rem" @click="handleResetTip">{{
            $t("恢复")
          }}</K-Button>
        </div>
      </div>

      <!-- 重置配置 -->
      <K-Button type="error" @click="show_confirm_reset = true">{{ $t("重置配置") }}</K-Button>
    </K-Dialog>

    <!-- 确认重置 -->
    <transition name="fade">
      <ConfirmClose
        v-if="show_confirm_reset"
        v-model="show_confirm_reset"
        text="确定重置所有配置项？"
        @confirm="EmitResetConfig"
      />
    </transition>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
