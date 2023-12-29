
<template>
  <div id="profileEdit">
    <van-form @submit="onSubmit">

      <van-cell-group inset class="van-hairline--bottom">

        <van-field v-if="editUser.editKey !== 'avatar' && editUser.editKey !== 'shopLogo'"
                   v-model="editUser.editValue"
                   :name="editUser.editKey"
                   :label='editUser.editLabel'
                   :placeholder="editUser.editKey"
                   :rules="[{ required: true, message: '请输入'}]"
        />
        <van-field v-if="editUser.editKey === 'avatar'" class="custom-field"
                   name="uploader"
                   :label="editUser.editLabel"
        >
          <template #input>
            <van-uploader
                v-model="uploader"
                reupload max-count="1"
                :after-read="afterRead"
            />
          </template>
        </van-field>

        <van-field v-if="editUser.editKey === 'shopLogo'" class="custom-field"
                   name="uploader"
                   :label="editUser.editLabel"
        >
          <template #input>
            <van-uploader
                v-model="uploader"
                reupload max-count="1"
                :after-read="afterRead"
            />
          </template>
        </van-field>
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>

  </div>



</template>
<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showToast} from "vant";
import api, {netApi} from "../../common/API";
import ResponseCode from "../../common/ResponseCode";
import request from "../../util/request";

const route = useRoute()
const router = useRouter()
const editUser = ref({
  editKey: '',
  editValue: '',
  editLabel: '',
  editIndex: '',
})
editUser.value.editKey = route.query.editKey
editUser.value.editValue = route.query.editValue
editUser.value.editLabel = route.query.editLabel
editUser.value.editIndex = route.query.editIndex
const password = ref('');

const uploader = ref([
  { url: editUser.value.editValue },
]);
let upload = ref(null);
const afterRead = (file, e)=>{
  upload = file
  console.log(upload)
}
const onSubmit = (values) => {

  console.log(editUser.value.editIndex)
  const item = netApi.update.find((item)=>{
    if(item.name === editUser.value.editIndex)
      return item
  })
  if(editUser.value.editIndex === 'avatar' || editUser.value.editIndex === 'shopLogo'){
    if(upload.value === null) return
    const sendData = new FormData;
    sendData.append('file', upload.file)
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    request.put(item.path ,sendData, config)
        .then(res => {
          if(res.code === ResponseCode.success.code){
            showToast(res.message)
            router.push(api.profile.path)
          }else {
            showToast(res.message)
          }
        })
  }else {
    request.put(item.path, editUser.value.editValue)
        .then(res => {
          if(res.code === ResponseCode.success.code){
            showToast(res.message)
            router.push(api.profile.path)
          }else {
            showToast(res.message)
          }
        })
  }
};



</script>

<style scoped>
.custom-field {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 将内容放到右边 */
}
#profileEdit{
  padding-top: 0.5rem;
}
</style>