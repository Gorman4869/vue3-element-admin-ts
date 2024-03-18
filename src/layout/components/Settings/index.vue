<template>
  <el-drawer v-model="settingsVisible" size="300" title="项目配置">
    <el-divider>主题设置</el-divider>
    <div class="flex-center">
      <el-switch
        v-model="isDark"
        :active-icon="Moon"
        :inactive-icon="Sunny"
        @change="changeTheme"
      />
    </div>
    <el-divider>界面设置</el-divider>
    <div class="settings-option">
      <el-text>主题颜色</el-text>
      <ThemeColorPicker
        v-model="settingsStore.themeColor"
        @update:model-value="changeThemeColor"
      />
    </div>
    <div class="settings-option">
      <el-text>开启 Tags-View</el-text>
      <el-switch v-model="settingsStore.tagsView" />
    </div>
    <div class="settings-option">
      <span class="text-xs">固定 Header</span>
      <el-switch v-model="settingsStore.fixedHeader" />
    </div>

    <div class="settings-option">
      <span class="text-xs">侧边栏 Logo</span>
      <el-switch v-model="settingsStore.sidebarLogo" />
    </div>
    <div class="settings-option">
      <span class="text-xs">侧边栏 Logo</span>
      <el-switch v-model="settingsStore.sidebarLogo" />
    </div>
    <div class="settings-option">
      <span class="text-xs">开启水印</span>
      <el-switch v-model="settingsStore.watermarkEnabled" />
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { useSettingsStore } from "@/store";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { ThemeEnum } from "@/enums/ThemeEnum";
import { genMixColor } from "@/utils/color";
const settingsStore = useSettingsStore();

const settingsVisible = computed({
  get: () => settingsStore.settingsVisible,
  set: () => {
    settingsStore.settingsVisible = false;
  },
});

function changeThemeColor(color: string) {
  settingsStore.changeThemeColor(color);
  const { DEFAULT, dark, light } = genMixColor(color);
  setStyleProperty(`--el-color-primary`, DEFAULT);
  setStyleProperty(`--el-color-primary-dark-2`, dark[2]);
  setStyleProperty(`--el-color-primary-light-3`, light[3]);
  setStyleProperty(`--el-color-primary-light-5`, light[5]);
  setStyleProperty(`--el-color-primary-light-7`, light[7]);
  setStyleProperty(`--el-color-primary-light-8`, light[8]);
  setStyleProperty(`--el-color-primary-light-9`, light[9]);
}
function setStyleProperty(propName: string, value: string) {
  document.documentElement.style.setProperty(propName, value);
}

/**
 * 切换主题
 */
const isDark = ref<boolean>(settingsStore.theme === ThemeEnum.DARK);
const changeTheme = (isDark: any) => {
  useToggle(isDark);
  const theme = isDark ? ThemeEnum.DARK : ThemeEnum.LIGHT;
  settingsStore.changeTheme(theme);
  document.documentElement.classList.toggle("dark", theme === ThemeEnum.DARK);
};

onMounted(() => {
  changeTheme(settingsStore.theme == ThemeEnum.DARK); // 初始化主题
  changeThemeColor(settingsStore.themeColor); // 初始化主题颜色
});
</script>
<style scoped lang="scss">
.settings-option {
  @apply py-1 flex-x-between;
}
</style>
