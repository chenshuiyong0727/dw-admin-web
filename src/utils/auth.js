import Cookies from 'js-cookie'

// const TokenKey = 'token_auth'
// const RefreshTokenKey = 'refresh_token_auth'
// const UserId = 'user_id'

export function getCookieByName(cookieName) {
  return Cookies.get(cookieName)
}

// export function getToken() {
//   return Cookies.get(TokenKey)
// }
// export function getRefreshToken() {
//   return Cookies.get(RefreshTokenKey)
// }
// export function getUserId() {
//   return Cookies.get(UserId)
// }

export function setCookieByName(cookieName, cookieValue) {
  return Cookies.set(cookieName, cookieValue)
}

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }
// export function setRefreshToken(refreshToken) {
//   return Cookies.set(RefreshTokenKey, refreshToken)
// }
// export function setUserId(userId) {
//   return Cookies.set(UserId, userId)
// }

export function removeCookieByName(cookieName) {
  return Cookies.remove(cookieName)
}

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }
// export function removeRefreshToken() {
//   return Cookies.remove(RefreshTokenKey)
// }
// export function removeUserId() {
//   return Cookies.remove(UserId)
// }
