

<template>
  <div id="profile">
    <van-cell v-for="user in userList">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <van-space>
          <van-image
              round
              width="3rem"
              height="3rem"
              lazy-load
              :src="user.avatarUrl"
          />
          <h3 type="primary">{{user.nickname}}</h3>
        </van-space>

      </template>
      <template #right-icon>
        <van-button type="danger" plain size="small" @click="removeTheBlacklistPrompt(user.nickname)">恢复</van-button>
      </template>
    </van-cell>




  </div>
</template>
<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {showConfirmDialog, showImagePreview, showToast} from "vant";

const fileList = ref([
  { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
  // Uploader 根据文件后缀来判断是否为图片文件
  // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
  // { url: 'https://cloud-image', isImage: true },
]);

const router = useRouter()
const userList = ref([
    {
      avatarUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      nickname: '好果汁',
    },
  {
    avatarUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    nickname: '好果汁111',
  },
])

const removeTheBlacklistPrompt = (key) => {
  showConfirmDialog({
    title: '提醒',
    message: '确定从黑名单移除该用户？'

  }).then(() => {
    removeFromBlackList(key)
  });
}
const removeFromBlackList = (key) => {
  userList.value = userList.value.filter(item => item.nickname !== key)
  showToast('移除成功');
}
</script>
<style scoped>

</style>