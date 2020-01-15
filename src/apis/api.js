import fetch from './fetch'

const goodList = params => {
  return fetch({
    url: '/controller/shopadmincontroller/getgoodsexaminelist',
    method: 'post',
    data: params
  })
}

const goodCategory = params => {
  return fetch({
    url: '/controller/shopcontroller/getgoodstype',
    method: 'post',
    data: params
  })
}

const saveGoods = params => {
  return fetch({
    url: '/controller/shopadmincontroller/addgoodsexamine',
    method: 'post',
    data: params
  })
}

const editGoods = params => {
  return fetch({
    url: '/controller/shopadmincontroller/updategoodsexamine',
    method: 'post',
    data: params
  })
}

const deleteGoods = params => {
  return fetch({
    url: '/controller/shopadmincontroller/delgoodsspecificationsexaminebyidlist',
    method: 'post',
    data: params
  })
}

const detailGoods = params => {
  return fetch({
    url: '/controller/shopadmincontroller/getgoodsexaminebyid',
    method: 'post',
    data: params
  })
}

const editGoodsReserve = params => {
  return fetch({
    url: '/controller/shopadmincontroller/updategoodsspecificationsexaminereserve',
    method: 'post',
    data: params
  })
}

const addShopAuthentication = params => {
  return fetch({
    url: '/controller/shopadmincontroller/addshopadminmxamine',
    method: 'post',
    data: params
  })
}

const auditShopAuthentication = params => {
  return fetch({
    url: '/controller/shopadmincontroller/getshopadminuser',
    method: 'post',
    data: params
  })
}

const editShopAuthentication = params => {
  return fetch({
    url: '/controller/shopadmincontroller/updateshopadminmxamine',
    method: 'post',
    data: params
  })
}

export const apiList = {
  goodList,
  goodCategory,
  saveGoods,
  editGoods,
  deleteGoods,
  detailGoods,
  addShopAuthentication,
  auditShopAuthentication,
  editShopAuthentication,
  editGoodsReserve
}
