/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const goodsRouter = {
  path: '/pms/goods',
  component: Layout,
  redirect: 'noRedirect',
  name: 'goods',
  meta: {
    title: '商品管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/pms/goods/goods-list'),
      name: 'goodsList',
      meta: { title: '商品列表', noCache: true }
    },
    {
      path: 'goods-edit',
      component: () => import('@/views/pms/goods/goods-edit'),
      hidden: true,
      name: 'goodsEdit',
      meta: { title: '编辑商品', noCache: true }
    }

  ]
}

export default goodsRouter
