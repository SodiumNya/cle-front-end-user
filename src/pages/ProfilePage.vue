<template>
  <div id="profile">
    <div style="margin-bottom: 1rem">
      <van-cell title="我的店铺"/>
      <van-cell
          is-link class="avatar"
          @click="showLogo = true"
      >
        <van-image
            round
            width="4rem"
            height="4rem"
            lazy-load
            :src="shop.shopLogo"
        />
      </van-cell>
      <van-action-sheet v-model:show="showLogo" :actions="actions" @select="onSelectShop" />
      <van-cell
          title="店铺名"
          is-link :value="shop.name"
          @click="DoEdit(shop.name, '', '店铺名', 'shopName')"
      />
      <van-cell
          title="手机号"
          is-link :value="shop.phone"
          @click="DoEdit(shop.phone, '', '手机号', 'shopPhone')"
      />
      <van-cell
          title="所在位置"
          is-link :value="shop.canteenName"
          @click="DoEdit(shop.canteenName, '', '所在位置', 'location')"
      />
    </div>

    <div>
      <van-cell title="我的个人信息"/>

      <van-cell
          is-link class="avatar"
          @click="show = true"
      >
        <van-image
            round
            width="4rem"
            height="4rem"
            lazy-load
            :src="user.avatar"
        />
      </van-cell>
      <van-action-sheet v-model:show="show" :actions="actions" @select="onSelect" />
      <van-cell
          title="用户名"
          is-link :value="user.account"
          @click="DoEdit(user.account, '', '用户名', 'account')"
      />
      <van-cell
          title="昵称"
          is-link :value="user.nickname"
          @click="DoEdit(user.nickname, '', '昵称', 'nickname')"
      />
      <van-cell
          title="手机号"
          is-link :value="user.phone"
          @click="DoEdit(user.phone, '', '手机号', 'userPhone')"
      />
      <van-cell
          title="邮箱"
          is-link :value="user.email"
          @click="DoEdit(user.email, '', '邮箱', 'email')"
      />
      <van-cell
          title="重置密码"
          is-link
          @click="reSetPwd()"
      />
    </div>
    <div style="margin-top: 0.5rem; padding: 0.5rem;" >
      <van-button v-if="user.account" round block type="primary" native-type="submit" @click="logOut">
        退出登录
      </van-button>
      <van-button v-else round block type="primary" native-type="submit" @click="login">
        登录
      </van-button>
    </div>

  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showImagePreview, showToast} from "vant";
import request from "../../util/request";
import api, {netApi} from "../../common/API";
import ResponseCode from "../../common/ResponseCode";


const user = ref({
  account: '',
  avatar: '',
  phone: '',
  email: '',
  password: '',
  nickname: '',
})
const shop = ref({
  id: '',
  name: '',
  shopLogo: '',
  phone: '',
  created: '',
  canteen_name: '',

})
const fetchData = async ()=>{
  const token = JSON.parse(localStorage.getItem('token') || 'null')
  if(token === null) return
  const userInfoResp = await request.get(netApi.info.path)

  const shopId = JSON.parse(localStorage.getItem('shopId') || 'null')
  if(shopId === null) return
  console.log('执行')
  const shopInfoResp = await request.get(netApi.shopInfo.path+shopId)

  if(userInfoResp.code === ResponseCode.success.code){
    user.value = userInfoResp.data
    console.log(user.value)
  }
  if(shopInfoResp.code === ResponseCode.success.code){
    shop.value = shopInfoResp.data
  }

}
onMounted(()=>{
  fetchData()
})

const router = useRouter()
const DoEdit = (editKey, editValue, editLabel, editIndex)=>{
  router.push({
    path:api.profileEdit.path,
    query: {
      editKey: editKey,
      editValue: editValue,
      editLabel: editLabel,
      editIndex: editIndex,
    }
  });
}

const reSetPwd = ()=>{
  router.push(api.reSetPassword.path)
}



const show = ref(false);
const showLogo = ref(false);
const actions = [
  { name: '查看头像', value: 0 },
  { name: '修改头像', value: 1 },

];
const onSelect = (item) => {
  // 默认情况下点击选项时不会自动收起
  // 可以通过 close-on-click-action 属性开启自动收起
  show.value = false;
  if(item.value === 1){
    DoEdit('avatar', user.value.avatar, '头像', 'avatar')
  }else {
    showImagePreview([user.value.avatar])
  }

};

const onSelectShop = (item) => {
  // 默认情况下点击选项时不会自动收起
  // 可以通过 close-on-click-action 属性开启自动收起
  show.value = false;
  if(item.value === 1){
    DoEdit('shopLogo', shop.value.shopLogo, '店铺logo', 'shopLogo')
  }else {
    showImagePreview([shop.value.shopLogo])
  }

};



const login = ()=>{
  router.push(api.login.path)
}
const logOut = ()=>{
  const businessStatus =  JSON.parse(localStorage.getItem('businessStatus') || '{}')

  if(businessStatus) {
    showToast('请先关店再退出登录')
    return
  }
  localStorage.removeItem('token')
  localStorage.removeItem('avatar')
  localStorage.removeItem('shopId')
  localStorage.removeItem('businessStatus')
  router.push(api.login.path)
}
</script>
<style scoped>
.avatar{
  display: flex;
  align-items: center
}
#profile{
  margin: 0.5rem;
}
</style>