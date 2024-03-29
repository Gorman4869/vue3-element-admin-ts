<template>
  <div class="login-container">
    <!-- 切换主题 -->
    <div class="absolute-lt flex-x-end p-3 w-full">
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        active-color="var(--el-fill-color-dark)"
        inactive-color="var(--el-fill-color-primary)"
        @change="handleThemeChange"
      />
    </div>
    <!-- 登录表单 -->
    <el-card class="!border-none !bg-transparent !rounded-4% w-100 <sm:w-85">
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
        <el-tag class="ml-1 absolute-rt">
          {{ defaultSettings.version }}
        </el-tag>
      </div>
      <el-form
        ref="loginFormRef"
        class="login-form"
        :model="loginData"
        :rules="loginRules"
      >
        <el-form-item prop="username">
          <div class="flex-y-center w-full">
            <svg-icon icon-class="user" class="mx-2" />
            <el-input
              ref="username"
              :placeholder="$t('login.username')"
              name="username"
              size="large"
              class="h-[48px]"
              v-model="loginData.username"
            />
          </div>
        </el-form-item>
        <el-tooltip
          content="Caps lock is On"
          placement="right"
          :visible="isCapslock"
        >
          <el-form-item prop="password">
            <div class="flex-y-center w-full">
              <el-icon class="mx-2"><Lock /></el-icon>
              <el-input
                v-model="loginData.password"
                :placeholder="$t('login.password')"
                type="password"
                name="password"
                size="large"
                class="h-[48px] pr-2"
                @keyup="checkCapslock"
                @keyup.enter="handleLogin"
                show-password
              />
            </div>
          </el-form-item>
        </el-tooltip>
        <el-form-item prop="captchaCode">
          <div class="flex-y-center w-full">
            <svg-icon icon-class="captcha" class="mx-2" />
            <el-input
              auto-complete="off"
              size="large"
              class="flex-1"
              placeholder="请输入验证码"
              v-model="loginData.captchaCode"
              @keyup.enter="handleLogin"
            />
            <el-image
              @click="getCaptcha"
              :src="captchaBase64"
              class="rounded-tr-md rounded-br-md cursor-pointer h-[48px]"
            />
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-button
          :loading="loading"
          @click.prevent="handleLogin"
          type="primary"
          size="large"
          class="w-full"
          >登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import defaultSettings from "@/settings";
import { useAppStore, useSettingsStore, useUserStore } from "@/store";
import { getCaptchaApi } from "@/api/auth";
import { LoginData } from "@/api/auth/types";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { ThemeEnum } from "@/enums/ThemeEnum";
import router from "@/router";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const loading = ref(false);
const isCapslock = ref(false);
const captchaBase64 = ref();
const loginFormRef = ref(ElForm);
const loginData = ref<LoginData>({
  username: "admin",
  password: "123456",
});
const { t } = useI18n();
const loginRules = computed(() => {
  const prefix = appStore.language === "en" ? "Please enter " : "请输入";
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: `${prefix}${t("login.username")}`,
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        validator: (rule: any, value: any, callback: any) => {
          if (value.length < 6) {
            callback(new Error("The password can not be less than 6 digits"));
          } else {
            callback();
          }
        },
        message: `${prefix}${t("login.password")}`,
      },
    ],
    captchaCode: [
      {
        required: true,
        trigger: "blur",
        message: `${prefix}${t("login.captchaCode")}`,
      },
    ],
  };
});

function checkCapslock(e: any) {
  isCapslock.value = e.getModifierState("CapsLock");
}

function getCaptcha() {
  getCaptchaApi().then(({ data }) => {
    loginData.value.captchaKey = data.captchaKey;
    captchaBase64.value = data.captchaBase64;
  });
}

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          const query: LocationQuery = route.query;
          const redirect = (query.redirect as LocationQueryValue) ?? "/";
          const otherQueryParams = Object.keys(query).reduce(
            (acc: any, cur: string) => {
              if (cur !== "redirect") {
                acc[cur] = query[cur];
              }
              return acc;
            },
            {}
          );
          router.push({ path: redirect, query: otherQueryParams });
        })
        .catch(() => {
          // 验证失败，重新生成验证码
          getCaptcha();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

//系统主题
const isDark = ref<boolean>(settingsStore.theme === ThemeEnum.DARK);
const handleThemeChange = (isDark: any) => {
  const theme = isDark ? ThemeEnum.DARK : ThemeEnum.LIGHT;
  settingsStore.changeTheme(theme);
  document.documentElement.classList.toggle("dark", theme === ThemeEnum.DARK);
};

onMounted(() => {
  getCaptcha();

  // 主题初始化
  const theme = useSettingsStore().theme;
  if (theme == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});
</script>

<style lang="scss" scoped>
html.dark .login-container {
  background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;
}

.login-container {
  @apply wh-full flex-center;

  overflow-y: auto;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;

  .login-form {
    padding: 30px 10px;
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}
</style>
