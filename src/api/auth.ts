import request from '@/utils/request';

// 获取登录验证码
export function fetchGetCaptcha() {
  return request.get<Api.Auth.Captcha>('/captcha');
}

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginToken>('/login', params);
}

/** Get user info */
export function fetchGetUserInfo() {
  return request.get<Api.Auth.UserInfo>('/userInfo');
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request.post<Api.Auth.LoginToken>('/refreshToken', { refresh_token: refreshToken });
}
