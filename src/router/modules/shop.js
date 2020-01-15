/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const shopRouter = {
  path: '/pms/shop',
  component: Layout,
  redirect: 'noRedirect',
  name: 'shop',
  meta: {
    title: '店铺管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/pms/shop/shop-list'),
      name: 'shopList',
      meta: { title: '店铺管理', noCache: true }
    }
  ]
}

export default shopRouter
