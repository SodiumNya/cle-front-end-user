

<template>
  <div id="orderDetails">
    <van-cell-group inset>
      <van-cell
      >
        <template #title>
          <a-comment
              align="right"
              :author="order.shopName"
              :avatar="order.shopLogo"
              :datetime="order.createTime"
          >
          </a-comment>
        </template>
      </van-cell>
      <van-cell
          title="详细">
        <template #label>
          <van-cell v-for="goods in order.goodList"
                    style="display: flex; align-items: end"
          >
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <h3><strong>{{goods.goodName}}</strong></h3>
            </template>
            <template #label>
              <van-space align="end">
                <van-image
                    width="3rem"
                    height="3rem"
                    :src="goods.mainImage"
                />
                <div style="color: #181818">
                  <div>单价：<strong>{{goods.price}} 元</strong></div>
                  <div>数量：<strong>{{goods.quantity}}</strong></div>
                </div>
              </van-space>

            </template>
            <template #value>
              <div style="color: #181818">总计：<strong>{{goods.totalPrice}} 元</strong></div>
            </template>

          </van-cell>
        </template>
      </van-cell>
      <van-cell title="备注">
        <template #label>
          <van-text-ellipsis
              style="font-size: larger; color: #181818;text-indent:1em"
              :content="order.note"
              expand-text="展开"
              collapse-text="收起" />
        </template>
      </van-cell>
      <div style="display: flex; justify-content: end">
        <van-cell>
          总计：<strong style="color: #181818">{{order.payPrice}} 元</strong>
        </van-cell>
      </div>
    </van-cell-group>
  </div>





</template>
<script setup>
import {onMounted, ref} from "vue";

import ResponseCode from "../../common/ResponseCode";
import {useRoute, useRouter} from "vue-router";
import request from "../../util/request";
import {netApi} from "../../common/API";
const route = useRoute()
const router = useRouter()
const order = ref({
  nickname: '马猴烧酒',
  avatarUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  dateTime: new Date().toLocaleDateString(),
  productList: [
    {
      pictureUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      name: '好果汁',
      quantity: 3,
      unitPrice: 17.5,
      price: 70.00,
    },
    {
      pictureUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      name: '好果汁',
      quantity: 3,
      unitPrice: 17.5,
      price: 52.5,
    }
  ],
  price: 233.25,
  remark: '你好',
  orderStatus: '未接单'
})

const fetchData = async (orderSn)=>{
  const detailOrderResp = await request.get(netApi.getOrderDetail.path+orderSn)

  if(detailOrderResp.code === ResponseCode.success.code){
    order.value = detailOrderResp.data
  }
}

onMounted(()=>{
  const orderSn = route.query.orderSn
  fetchData(orderSn)
})

</script>
<style scoped>
#orderDetails{
  background-color: white;
  border-radius: 10px;
  margin-top: 0.5rem;
}
.footer{
  display: flex;
  justify-content: right;
  padding: 0.5rem;
  background-color: white;
}
</style>