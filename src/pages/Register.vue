

<template>
  <div id="business-register">
    <div style=" display: flex;justify-content: center; padding-bottom: 3rem">
      <van-image
          round
          height="10rem"
          width="10rem"
          fit="cover"
          position="center"
          src="https://blob.keylol.com/forum/201910/24/220905r5htv25lsd2qzs0c.jpg"
      />
    </div>
      <van-form style="width: 100%;" @failed="onFailed" @submit="DoRegister">
        <van-cell-group inset>
          <!-- 通过 pattern 进行正则校验 -->
          <van-field
              v-model="account"
              name="pattern"
              placeholder="账户"
              :rules="[{ pattern, message: '请输入正确内容' }]"
          />
          <!-- 通过 validator 进行函数校验 -->
          <van-field
              v-model="password"
              name="validator"
              placeholder="密码"
              :rules="[{ validator:passwordValidator, message: '请输入正确内容' }]"
          />
          <van-field
              v-model="verifyPassword"
              name="validator"
              placeholder="确认密码"
              :rules="[{ validator:passwordValidator, message: '请输入正确内容' }]"
          />
          <van-field
              v-model="invitationCode"
              name="validator"
              placeholder="邀请码"
              :rules="[{ validator:codeValidator, message: '请输入正确内容' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="success" native-type="submit">
            注册
          </van-button>
        </div>
      </van-form>

    <div  style=" display: flex;justify-content: center;" >
      已有账号？
      <a style="color: #1989fa" @click="toLogin">登录</a>
    </div>

  </div>


</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import request from "../../util/request";
import ResponseCode from "../../common/ResponseCode";
import {showToast} from "vant";

const router = useRouter()

const account = ref('');
const password = ref('');
const verifyPassword = ref('');
const invitationCode = ref('');
const pattern = /^[A-Za-z0-9\s]+$/;


// 校验函数返回 true 表示校验通过，false 表示不通过
const passwordValidator = (val) => /^[\w\s!@#$%^&*(),.?":{}|<>]+$/i.test(val);

const codeValidator = (val) => /^[a-zA-Z0-9]{8}$/.test(val);


const onFailed = (errorInfo) => {
  console.log('failed', errorInfo);
};

const DoRegister = async ()=>{
  const registerResp = await request.post(netApi.register.path, {
    account: account.value,
    password: password.value,
    verifyPassword: verifyPassword.value,
    invitationCode: invitationCode.value
  })

  if(registerResp.code === ResponseCode.success.code){
    showToast('注册成功!')
    await router.push(api.login.path)
  }else {
    showToast('注册失败:'+registerResp.message)
  }
}

const toLogin = ()=>{router.push(api.login.path)}
</script>

<style scoped>
#business-register{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>