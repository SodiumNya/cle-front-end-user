
<template>
  <van-form @submit="onSubmit" >

    <van-cell-group inset class="van-hairline--bottom">

      <van-field
          v-model="oldPassword"
          name="oldPassword"
          label="旧密码"
          placeholder="请输入旧密码"
          :rules="[{ required: true, message: '请输入'}]"
      />
      <van-field
          v-model="newPassword"
          name="newPassword"
          label="新密码"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请输入'}]"
      />

    </van-cell-group>

    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        保存
      </van-button>
    </div>
  </van-form>



</template>
<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import {showToast} from "vant";
import ResponseCode from "../../common/ResponseCode";
import request from "../../util/request";

const router = useRouter()

const oldPassword = ref('')
const newPassword = ref('')
const code = ref('')
const onSubmit = ()=>{
  const account = JSON.parse(localStorage.getItem('account' || '{}'))
  request.put(netApi.reSetPassword.path, {
    account: account,
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    code: code.value
  }).then(res=>{
    if(res === ResponseCode.success.code){
      showToast(res.message)
      router.push(api.profile.path)
    }else {
      showToast(res.message)
    }
  })
}
</script>

<style scoped>
.custom-field {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 将内容放到右边 */
}
</style>