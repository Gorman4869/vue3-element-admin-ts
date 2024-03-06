import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { UserForm, UserInfo, UserPageVO, UserQuery } from "./types";

//登录成功后获取用户信息
export function getUserInfoApi(): AxiosPromise<UserInfo> {
  return request({
    url: "/api/v1/users/me",
    method: "get",
  });
}
