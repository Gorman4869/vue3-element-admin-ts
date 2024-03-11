<template>
  <div class="wh-full">
    <!-- 公用侧边栏 -->
    <Sidebar class="sidebar-container">侧边栏</Sidebar>
    <div class="main-container">右侧内容</div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useSettingsStore, usePermissionStore } from "@/store";
import defaultSettings from "@/settings";

const appStore = useAppStore();
const width = useWindowSize().width;
const WIDTH = 992; // 响应式布局容器固定宽度  大屏（>=1200px） 中屏（>=992px） 小屏（>=768px）

watchEffect(() => {
  if (width.value < WIDTH) {
    appStore.toggleDevice("mobile");
    appStore.closeSideBar();
  } else {
    appStore.toggleDevice("desktop");

    if (width.value >= 1200) {
      appStore.openSideBar();
    } else {
      appStore.closeSideBar();
    }
  }
});
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: $sidebar-width;
  height: 100%;
  overflow: hidden;
  background-color: $menu-background;
  transition: width 0.2s;

  :deep(.el-menu) {
    border: none;
  }
}

.main-container {
  position: relative;
  min-height: 100%;
  margin-left: $sidebar-width;
  transition: margin-left 0.2s;
}
</style>
