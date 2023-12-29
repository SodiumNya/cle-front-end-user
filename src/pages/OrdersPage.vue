

<template>
  <div id="orders">
    <van-dropdown-menu swipe-threshold="3">
      <van-dropdown-item v-model="orderStatue" :options="option1" @closed="upDateOrders" />
      <van-dropdown-item v-model="asc" :options="option2" @closed="upDateOrders"/>
    </van-dropdown-menu>
    <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
    >
      <van-swipe-cell v-for="order in orders"
          :before-close="beforeClose"
          :name="order.uid"
      >
        <van-card
            style="background-color: white"
            :price="order.payPrice"
            origin-price="2.5"
            @click="toOrderDetails(order.orderSn)"
        >
          <template #thumb>
            <van-image
                width="4rem"
                height="4rem"
                lazy-load
                :src="order.shopLogo"
            />
            <van-tag v-if="order.statue === 1" type="primary">未接单</van-tag>
            <van-tag v-if="order.statue === 2" type="success" plain>制作中</van-tag>
            <van-tag v-if="order.statue === 3" color="#7232dd" plain>待取货</van-tag>
            <van-tag v-if="order.statue === 4" color="#7232dd">已完成</van-tag>
            <van-tag v-if="order.statue === 5" color="#ffe1e1" text-color="#ad0000">已取消</van-tag>

          </template>
          <template #title>
            <span>订单编号：{{order.orderSn}}</span>
          </template>

          <template #desc>
            <h4>{{order.createTime}}</h4>
          </template>

          <template #price-top>
            <div style="margin-top: 0.5rem">
              <van-space class="van-hairline--bottom">
                <van-image v-for="good in order.goodList"
                           width="2rem"
                           height="2rem"
                           lazy-load
                           :src="good.mainImage"
                />
                <van-icon name="arrow"/>
              </van-space>
              <van-divider />
            </div>
          </template>

<!--          <template #footer>-->
<!--            <van-space size="1rem" v-if="order.orderStatus === '未接单'" >-->
<!--              <van-button type="default" size="small" @click="f">拒绝</van-button>-->
<!--              <van-button type="primary" size="small" @click="takeOrders(order)">接单</van-button>-->
<!--            </van-space>-->
<!--            <van-button v-if="order.orderStatus === '制作中'" size="small" @click="finish(order)">通知取货</van-button>-->
<!--          </template>-->
        </van-card>
        <template #left>
          <van-button square text="拉黑" type="danger" class="delete-button" />
        </template>
        <van-space
            class="footer"
            size="1rem"
            v-if="order.statue !== 6 && order.statue !== 4"
        >
          <van-button
              v-if="order.statue === 2"
              size="small" @click="finish(order)"
          >通知取货
          </van-button>
          <van-button
              v-if="order.statue !== 3 && order.statue != 5"
              type="default"
              size="small"
              @click="refuseOrder(order)"
          >
            拒绝
          </van-button>
          <van-button
              v-if="order.statue === 1"
              type="primary"
              size="small"
              @click="takeOrders(order)"
          >接单</van-button>
        </van-space>
      </van-swipe-cell>

    </van-pull-refresh>
  </div>




</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {showConfirmDialog, showToast} from "vant";
import {useRouter} from "vue-router";
import request from "../../util/request";
import api, {netApi} from "../../common/API";
import responseCode from "../../common/ResponseCode";
import ResponseCode from "../../common/ResponseCode";
const count = ref(0);
const isLoading = ref(true);
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    isLoading.value = false;
    count.value++;
  }, 1000);
};

let orders = ref([])
const refuseOrder = (order)=>{
  showConfirmDialog({
    title: '提醒',
    message: '确定拒绝该订单？',

  }).then(async () => {
    const resp = await request.put(netApi.orderCancel.path, {orderSn: order.orderSn})
    if(resp.code === ResponseCode.success.code ){
      showToast('已取消！')
      await fetchData()
    }else showToast('取消失败')
  }).catch(()=>{});
}
const takeOrders = async (order) => {
  const resp = await request.put('order/receive', {orderSn: order.orderSn})

  if(resp.code === ResponseCode.success.code ){
    showToast('已接单')
    await fetchData()
  }else showToast('操作失败')
}
const finish = (order)=>{
  showConfirmDialog({
    title: '提醒',
    message: '确定通知该用户取货？',

  }).then(async () => {
    const resp = await request.put('order/waiting_for_pickup', {orderSn: order.orderSn})
    if(resp.code === ResponseCode.success.code ){
      showToast('已通知用户取货！')
      await fetchData()
    }else showToast('取消失败')
  }).catch(()=>{});
}

const orderStatue = ref(6);
const asc = ref(0);

const option1 = [
  { text: '未接单', value: 1 },
  { text: '制作中', value: 2 },
  { text: '待取货', value: 3 },
  { text: '已完成', value: 4 },
  { text: '已取消', value: 5 },
  { text: '全部', value: 6 },
];

const option2 = [
  { text: '时间升序', value: 0 },
  { text: '时间降序', value: 1 },
];

const fetchData = async ()=>{
  const shopId = JSON.parse(localStorage.getItem('shopId'))
  if(!shopId) return
  const orderResp = await request.get(netApi.orderInfo.path+shopId+'/'+orderStatue.value+'/'+asc.value)

  if(orderResp.code === responseCode.success.code){
    orders.value = orderResp.data
  }
}
onMounted(()=>{
  fetchData()
})
const upDateOrders = ()=>{
  fetchData()

}

// position 为关闭时点击的位置
const beforeClose = ({ name, position }) => {
  switch (position) {
    case 'right':
    case 'cell':
    case 'outside':
      return true;
    case 'left':
      return new Promise((resolve) => {
        showConfirmDialog({
          title: '确定拉黑该用户？',
        })
            .then(() => {
              AddToBlackList(name)
              resolve(true)
            })
            .catch(() => resolve(false));
      });
  }
};
const AddToBlackList = (name)=> {
  orders.value = orders.value.filter(item => item.id !== name)
}

const router = useRouter()
const toOrderDetails = (orderSn)=>{
  router.push({
    path: api.orderDetail.path,
    query: {orderSn: orderSn}
  })
}
</script>
<style scoped>
#orders{

}
.delete-button {
  height: 100%;
}
.footer{
  display: flex;
  justify-content: right;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: white;
}
</style>