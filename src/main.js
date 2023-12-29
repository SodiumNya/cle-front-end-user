import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import * as VueRouter from "vue-router";
import routes from "/config/routes";
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes // `config: config` 的缩写
})
const app = createApp(App)
import { Lazyload } from 'vant';
app.use(Vant)
    .use(router)
    .use(Lazyload)
    .use(ArcoVue)
    .mount('#app')

