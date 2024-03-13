<template>
  <div class="wh-full" :class="classObj">
    <!-- 公用侧边栏 -->
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <div>
        <NavBar v-if="layout === 'left'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useSettingsStore, usePermissionStore } from "@/store";
import defaultSettings from "@/settings";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const layout = computed(() => settingsStore.layout); // 布局模式 left top mix
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
const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  mobile: appStore.device === "mobile",
  "layout-left": layout.value === "left",
  "layout-top": layout.value === "top",
  "layout-mix": layout.value === "mix",
}));
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

.layout-left.hideSidebar {
  .sidebar-container {
    width: $sidebar-width-collapsed !important;
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.mobile {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-210px, 0, 0);
    }

    .main-container {
      margin-left: 0;
    }
  }
}

.hideSidebar {
  .fixed-header {
    left: $sidebar-width-collapsed;
    width: calc(100% - $sidebar-width-collapsed);
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.layout-top {
    .fixed-header {
      left: 0;
      width: 100%;
    }

    .main-container {
      margin-left: 0;
    }
  }

  &.layout-mix {
    .fixed-header {
      left: $sidebar-width-collapsed;
      width: calc(100% - $sidebar-width-collapsed);
    }

    .sidebar-container {
      width: 100% !important;
    }

    .mix-container {
      .mix-container__left {
        width: $sidebar-width-collapsed;
      }
    }
  }
}
</style>
