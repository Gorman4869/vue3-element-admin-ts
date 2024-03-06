//登录请求参数
export interface LoginData {
  username: string;
  password: string;
  captchaKey?: string;
  captchaCode?: string;
}

//登录响应
export interface LoginResult {
  accessToken?: string;
  expires?: number;
  refreshToken?: string;
  tokenType?: string;
}

//验证码响应
export interface CaptchaResult {
  captchaKey: string;
  captchaBase64: string;
}
