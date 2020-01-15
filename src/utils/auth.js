import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const ShopToken = 'shop'

export function getToken() {
  return Cookies.get(ShopToken)
}

export function setToken(token) {
  return Cookies.set(ShopToken, token)
}

export function removeToken() {
  return Cookies.remove(ShopToken)
}
