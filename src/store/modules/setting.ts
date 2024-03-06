import defaultSettings from "@/settings";

type SettingValue = boolean | string;
export const useSettingsStore = defineStore("setting", () => {
  //是否设置显示
  const settingsVisible = ref(false);
  //是否显示标签视图
  const tagsView = useStorage<boolean>("tagsView", defaultSettings.tagsView);
  //是否显示侧边栏logo
  const sidebarLogo = useStorage<boolean>(
    "sidebarLogo",
    defaultSettings.sidebarLogo
  );
  //是否固定头部
  const fixedHeader = useStorage<boolean>(
    "fixedHeader",
    defaultSettings.fixedHeader
  );
  //布局模式 left top mix
  const layout = useStorage<string>("layout", defaultSettings.layout);
  //主题颜色
  const themeColor = useStorage<string>("themeColor", defaultSettings.theme);
  //主题：light dark
  const theme = useStorage<string>("theme", defaultSettings.theme);
  //是否开启水印
  const watermarkEnabled = useStorage<boolean>(
    "watermarkEnabled",
    defaultSettings.watermarkEnabled
  );
  const settingsMap: Record<string, Ref<SettingValue>> = {
    fixedHeader,
    tagsView,
    sidebarLogo,
    layout,
    watermarkEnabled,
  };

  function changeSetting({ key, value }: { key: string; value: SettingValue }) {
    const setting = settingsMap[key];
    if (setting) {
      setting.value = value;
    }
  }

  /**
   * 切换主题
   */
  function changeTheme(val: string) {
    theme.value = val;
  }

  /**
   * 切换主题颜色
   */
  function changeThemeColor(val: string) {
    themeColor.value = val;
  }

  /**
   * 切换布局
   */
  function changeLayout(val: string) {
    layout.value = val;
  }
  return {
    settingsVisible,
    tagsView,
    fixedHeader,
    sidebarLogo,
    layout,
    themeColor,
    theme,
    watermarkEnabled,
    changeSetting,
    changeTheme,
    changeThemeColor,
    changeLayout,
  };
});
