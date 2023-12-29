<template>


  <div id="BasicLayout" >
    <van-popup
        v-model:show="show"
        position="left"
        :style="{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center'}"
    >

      <div style="display: flex; flex-direction: column; align-items: center; margin: 4rem;">
        <van-image
            is-link @click="showPopup"
            round
            width="5rem"
            height="5rem"
            lazy-load
            :src="avatar"
        />
        <van-space v-if="token === null" fill style="margin-top: 1rem;" align="center">
          <van-button @click="toLogin" type="primary">去登陆</van-button>
        </van-space>
        <van-space v-else fill style="margin-top: 1rem; width: 100px" align="center">
          {{businessStatus}}
          <van-switch
              :model-value="switchStatus"
              @update:model-value="onUpdateValue" />
        </van-space>

      </div>

    </van-popup>
    <van-sticky>
      <van-nav-bar
          v-if="isActiveTab"
          :title="pageTitle"
          left-text=""
          right-text=""
          left-arrow
          @click-right="onClickRight"
      >
        <template #left>
          <van-image
              is-link @click="showPopup"
              round
              width="2rem"
              height="2rem"
              lazy-load
              :src="avatar"
          />


        </template>

        <template #right>
          <van-popover

              placement="bottom-end"
              v-model:show="showPopover"
              :actions="actions"
              @select="onSelect">
            <template #reference>
              <van-icon name="add-o" size="1.5rem" color="#323233" />
            </template>
          </van-popover>

        </template>
      </van-nav-bar>
      <van-nav-bar
          v-if="!isActiveTab"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
      />
    </van-sticky>

    <div id="content">
      <router-view />
    </div >
    <van-tabbar v-show="isActiveTab"
                placeholder
                route v-model="active"
                @change="onChange">
      <van-tabbar-item name="首页" :to="api.home.path" icon="home-o" >首页</van-tabbar-item>
      <van-tabbar-item name="订单" :to="api.order.path" icon="orders-o">订单</van-tabbar-item>
      <van-tabbar-item name="商品" :to="api.product.path" icon="goods-collect-o">商品管理</van-tabbar-item>
      <van-tabbar-item name="我的信息" :to="api.profile.path" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>

</template>

<style scoped>
#BasicLayout{
  background-color: #edf0f3;
  min-height: 100vh;
}
</style>

<script setup>
import {computed, onMounted, ref} from "vue";
import {showConfirmDialog, showToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import request from "../../util/request";
import ResponseCode from "../../common/ResponseCode";
const avatar = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')
let token = null
const toLogin = ()=>{
  show.value = false
  router.push(api.login.path)
}
const fetchData = async ()=>{
  const shopId = JSON.parse(localStorage.getItem('shopId'))
  if(!shopId) return
  const statusResp = await request.post(netApi.shopStatus.path, {id: shopId})

  const url = JSON.parse(localStorage.getItem('avatar'))
  if(url) avatar.value = url

  if(statusResp.code === ResponseCode.success.code){
    switchStatus.value = !(statusResp.data.businessStatus === 0);
    updateBusinessStatus()
    localStorage.setItem('businessStatus', JSON.stringify(switchStatus.value))
  }
}
onMounted(()=>{
  token = JSON.parse(localStorage.getItem('token') || 'null')
  fetchData()
})

const route = useRoute()
const pageTitle = ref('')

const showTab = [api.home.name, api.order.name, api.shoppingCart.name, api.profile.name]
const isActiveTab = computed(()=>{
  return showTab.includes(route.name)
})

const onChange = (index)=>{
  active.value=index
  pageTitle.value = index
  if(index === '首页'){
    pageTitle.value = ''
  }
}
const router = useRouter()
const active = ref('首页');

const onClickLeft = () => history.back();
const onClickRight = () => {}
const show = ref(false);
const showPopup = () => {
  show.value = true;
};
const switchStatus = ref(false);
const businessStatus = ref('休息')



const updateBusinessStatus = ()=>{
  businessStatus.value = (!switchStatus.value) ? '休息': '营业'
}
const onUpdateValue = (newValue) => {
  showConfirmDialog({
    title: '提醒',
    message: (newValue) ? '确定开始营业吗？': '确定要休息了吗？',
  }).then(async () => {
    const shopId = JSON.parse(localStorage.getItem('shopId'))
    if(!shopId) return
    const updateStatus = await request.put(netApi.updateState.path, {id: shopId, state: newValue ? 1:0})
    if(updateStatus.code === ResponseCode.success.code){
      switchStatus.value = !switchStatus.value;
      localStorage.setItem('businessStatus', JSON.stringify(switchStatus.value))
      updateBusinessStatus()
    }else showToast('操作失败')


  });
}

const showPopover = ref(false);

// 通过 actions 属性来定义菜单选项
const actions = [
  { text: '订单',  path: api.order.path},
  { text: '我的商品', path: api.product.path},
  { text: '小黑屋', path: api.blacklist.path },
];
const onSelect = (action) => {
  router.push(action.path)
}
</script>
