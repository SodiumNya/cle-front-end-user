

<template>
  <div id="comments">
    <a-comment v-for="user in comments"
               style="padding:1rem; margin: 0.5rem; border-bottom: 1px solid #e5e3e3"
               align="right"
               :author="user.nickname"
               :avatar="user.avatar"
               :datetime="user.createdLocal"
    >
      <template #content>
        <van-text-ellipsis
            expand-text="展开"
            collapse-text="收起"
            :content="user.content" />
        <van-rate v-model="user.score" readonly allow-half size="14px"/>

      </template>
    </a-comment>
  </div>

</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {netApi} from "../../common/API";
import ResponseCode from "../../common/ResponseCode";
import request from "../../util/request";
const route = useRoute()
const comments= ref([])
const DataFetch = async (productId)=>{
  try {
    const commentsResp = await request.get(netApi.productComments.path+productId)

    if(commentsResp.code === ResponseCode.success.code){
      comments.value = commentsResp.data
    }
  }catch (e){
    console.log('一个错误', e)
  }
}
onMounted(()=> {
  DataFetch(route.query.productId)
})

</script>
<style scoped>
#comments{
  background-color: white;
}
</style>