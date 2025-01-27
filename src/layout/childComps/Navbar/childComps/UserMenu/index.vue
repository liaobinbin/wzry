<script setup lang="ts">
import { ref, computed } from "vue";

import { switchStore, authStore } from "@/store";

const $authStore = authStore();
const $switchStore = switchStore();

const IMGBED = window.IMGBED; //全局图床链接

const show_menu = ref(false); //显示用户菜单
const show_edit = ref(false); //显示编辑个人信息弹窗
const show_close = ref(false); //显示确认保存弹窗
const show_logoff = ref(false); //显示确认注销弹窗
const edit_status = ref(false); //信息是否修改

const userInfo = computed(() => $authStore.userInfo); //用户本地信息
const role = computed(() => {
  return user_info.value.role === 0 ? "管理员" : "普通用户";
}); //用户权限

const user_info = ref<Partial<User>>({ ...userInfo.value }); //编辑的用户信息

/* 编辑个人信息 */
const handleEditInfo = () => {
  show_edit.value = true;
};

/* 退出登录 */
const handleLogout = () => {
  $switchStore.$audioStore("36jn");
  $authStore.logout();
};

/* 注销账号 */
const handleLogoff = async () => {
  $authStore.logoff();
};

/* 显示确认关闭弹窗 */
const EmitClose = () => {
  if (edit_status.value) {
    show_close.value = true;
  } else {
    show_edit.value = false;
  }
};

/* 问候语 */
</script>

<template>
  <div class="user-menu" :class="{ hover: show_menu }" @mouseenter="show_menu = true" @mouseleave="show_menu = false">
    <img
      class="head-img"
      :src="userInfo.headImg || IMGBED + '/image/unknown.png'"
      :alt="$t('头像')"
      @touchend="show_menu = !show_menu"
      @dragstart.prevent
    />
    <div class="user-card">
      <div class="name lib-one-line">{{ userInfo.nickname }}</div>
      <div class="role">{{ $t("身份") }}：{{ $t(role) }}</div>

      <div class="btns">
        <div class="edit">
          <K-Button font-size="1.25rem" auto-size @click="handleEditInfo">{{ $t("编辑个人信息") }}</K-Button>
        </div>
        <div class="logout" @click="handleLogout">
          <K-Button type="warning" font-size="1.25rem" auto-size>{{ $t("退出登录") }}</K-Button>
        </div>
        <div class="logoff" @click="show_logoff = true">
          <K-Button type="error" font-size="1.25rem" auto-size>{{ $t("注销帐号") }}</K-Button>
        </div>
      </div>
    </div>
  </div>
  <transition name="fade">
    <K-Dialog v-if="show_edit" title="编辑个人信息" width="57.5rem" up @close="EmitClose">
      <EditUserInfo :id="$authStore.userInfo.id" v-model:status="edit_status" @close="show_edit = false" />
    </K-Dialog>
  </transition>

  <!-- 注销确认 -->
  <transition name="fade">
    <ConfirmClose v-if="show_logoff" v-model="show_logoff" text="注销提醒" @confirm="handleLogoff" />
  </transition>

  <!-- 关闭设置弹窗确认 -->
  <transition name="fade">
    <ConfirmClose v-if="show_close" v-model="show_close" text="资料保存关闭" @confirm="show_edit = false" />
  </transition>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
