import api from "../common/API";

const routes = [
    {
        path: api.home.path,
        name: api.home.name,
        component: () => import('@/pages/HomePage.vue')
    },
    {
        path: api.receipt.path,
        name: api.receipt.name,
        component: () => import('@/pages/ReceiptPage.vue')
    },
    {
        path: api.product.path,
        name: api.product.name,
        component: ()=>import('@/pages/CommodityPage.vue')
    },
    {
        path: api.order.path,
        name: api.order.name,
        component: () => import('@/pages/OrdersPage.vue')
    },
    {
        path: api.orderDetail.path,
        name: api.orderDetail.name,
        component: () => import('@/pages/OrderDetails.vue')
    },
    {
        path: api.addProduct.path,
        name: api.addProduct.name,
        component: ()=> import('@/pages/AddCommodityPage.vue')
    },
    {
        path: api.updateGoods.path,
        name: api.updateGoods.name,
        component: ()=> import('@/pages/UpdateGoodsPage.vue')
    },
    {
        path: api.productComments.path,
        name: api.productComments.name,
        component: () => import('@/pages/CommentsPage.vue')
    },

    {
        path: api.profile.path,
        name: api.profile.name,
        component: () => import('@/pages/ProfilePage.vue')
    },
    {
        path: api.profileEdit.path,
        name: api.profileEdit.name,
        component: () => import('@/pages/ProfileEditPage.vue')
    },
    {
        path: api.blacklist.path,
        name: api.blacklist.name,
        component: () => import('@/pages/BlackListPage.vue')
    },
    {
        path: api.productDetails.path,
        name: api.productDetails.name,
        component: ()=> import('@/pages/ProductDetails.vue')
    },
    {
        path: api.login.path,
        name: api.login.name,
        component: ()=> import('@/pages/LoginPage.vue')
    },
    {
        path: api.register.path,
        name: api.register.name,
        component: ()=> import('@/pages/Register.vue')
    },
    {
        path: api.reSetPassword.path,
        name: api.reSetPassword.name,
        component: ()=> import('@/pages/ResetPassword.vue')
    },

]

export default routes