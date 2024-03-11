import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import { listRoutes } from "@/api/menu";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");
/**
 *
 * @param roles 用户角色集合
 * @param route 路由
 * @returns
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles) {
        return route.meta.roles.includes(role);
      }
    });
  }
  return false;
};

/**
 *
 * @param routes 接口返回的异步路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmpRoute = { ...route };
    if (!route.name) {
      tmpRoute.name = route.path;
    }
    //判断用户(角色)是否该有路由的访问权限
    if (hasPermission(roles, tmpRoute)) {
      if (tmpRoute.component?.toString() == "Layout") {
        tmpRoute.component = Layout;
      } else {
        const component = modules[`../../views/${tmpRoute.component}.vue`];
        if (component) {
          tmpRoute.component = component;
        } else {
          tmpRoute.component = modules[`../../views/error-page/404.vue`];
        }
      }
      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);
      }
      asyncRoutes.push(tmpRoute);
    }
  });
  return asyncRoutes;
};

//setup
export const usePermissionStore = defineStore("permission", () => {
  //state
  const routes = ref<RouteRecordRaw[]>([]);
  //actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }
  /**
   *  生成动态路由
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      listRoutes()
        .then(({ data: asyncRoutes }) => {
          //根据角色获取有访问权限的路由
          const accessRoutes = filterAsyncRoutes(asyncRoutes, roles);
          setRoutes(accessRoutes);
          resolve(accessRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 获取与激活的顶部菜单项相关的混合模式左侧菜单集合
   */
  //   const mixLeftMenus = ref<RouteRecordRaw[]>([]);
  //   function setMixLeftMenus(topMenuPath: string) {
  //     const matchedItem = routes.value.find((item) => item.path === topMenuPath);
  //     if (matchedItem && matchedItem.value) {
  //       mixLeftMenus.value = matchedItem.children;
  //     }
  //   }
  return {
    routes,
    setRoutes,
    generateRoutes,
  };
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
