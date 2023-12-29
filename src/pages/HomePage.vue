

<template>
  <van-grid :column-num="3" clickable
  >
    <van-grid-item icon="shop-collect-o" text="上新" @click="showPopup"/>
    <van-grid-item icon="orders-o" text="订单" :to="api.order.path"/>
    <van-grid-item icon="balance-o" text="今日流水" @click="showToast('敬请期待')"/>
  </van-grid>
  <van-pull-refresh v-model="isLoading" :head-height="80" @refresh="onRefresh">
    <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
    <template #pulling="props">
      <img
          class="doge"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/doge.png"
          :style="{ transform: `scale(${props.distance / 80})` }"
          alt="修狗"
      />
    </template>

    <!-- 释放提示 -->
    <template #loosing>
      <img
          class="doge"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/doge.png"
          alt="修狗"/>
    </template>

    <!-- 加载提示 -->
    <template #loading>
      <img
          class="doge"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/doge-fire.jpeg"
          alt="修狗"
      />
    </template>
    <div id="home">
      <van-swipe-cell
          v-for="commodity in commodities"
          :name="commodity.name"
          :before-close="beforeClose">

        <van-card
            style="background-color: white; margin-top: 0.5rem"
            :desc="commodity.detail"
            price="2.00"
            :thumb=commodity.mainImage
            @click="toProDuctDetails(commodity.id)"
        >
          <template #title>
            <h2>{{commodity.name}}</h2>
          </template>

          <template #price-top>
            <div>
              <van-space>
                <div>销量：{{commodity.sale}}</div>
                <div>评分：{{commodity.score}}</div>
              </van-space>
            </div>
          </template>
        </van-card>
        <van-space
            class="footer"
            size="1rem"
        >
          <van-button size="small" @click="updateSaleStatus(commodity)">下架</van-button>
        </van-space>
      </van-swipe-cell>
    </div>


  </van-pull-refresh>


  <van-popup
      v-model:show="showBottom"
      round
      position="bottom"
      closeable
      :style="{ height: '45%', background: '#f0f3f6'}"
  >

    <div class="addCommodity-button">
      <van-button size="small" @click="allChecked">{{ allCheckedText }}</van-button>
      <h3>添加商品</h3>
      <van-button size="small" plain type="primary" @click="DoAddCommodity">确认</van-button>
    </div>

    <div v-for="commodity in AddCommodities"
         style="padding: 0.5rem"
    >

        <van-card
            desc="描述信息"
            price="2.00"
            :thumb="commodity.mainImage"
            style="margin-bottom: 0.5rem; background-color: white"
        >
          <template #thumb>
            <van-image
                height="4rem"
                lazy-load
                :src="commodity.mainImage"
            />
            <van-checkbox v-model="commodity.checked"/>
          </template>
          <template #title>
            <h2>{{commodity.name}}</h2>
          </template>

          <template #price-top>
            <div>
              <van-space>
                <div>销量：{{commodity.sale}}</div>
                <div>评分：{{commodity.score}}</div>
              </van-space>
            </div>
          </template>
        </van-card>

    </div>

  </van-popup>


</template>
<script setup>
import {onMounted, ref} from "vue";
import {showConfirmDialog, showImagePreview, showToast} from "vant";
import {useRouter} from "vue-router";
import request from "../../util/request";
import api, {netApi} from "../../common/API";
import ResponseCode from "../../common/ResponseCode";
const router = useRouter()


const count = ref(0);
const isLoading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    isLoading.value = false;
    count.value++;
  }, 1000);
};

const showBottom = ref(false);


const AddCommodities = ref([])
const updateSaleStatus = async (goods) =>{
  const updateResp = await request.post(netApi.updateGoodsSaleStatus.path,
      {id: goods.id, saleState: 0})

  if(updateResp.code === ResponseCode.success.code)
    showToast('操作成功')
  else if(updateResp.code === ResponseCode.unAuthorized.code)
    showToast('未登录或无权限')
  else showToast('操作失败, 请查看是否营业')
}
const getUnSaleGoods = async ()=>{
  const shopId = JSON.parse(localStorage.getItem('shopId'))
  const businessStatus = JSON.parse(localStorage.getItem('businessStatus'))

  if(!shopId) {
    showToast('请登录')
    showBottom.value = false;
    return
  }
  if(!businessStatus) {
    showToast('未营业')
    showBottom.value = false;
    return
  }
  showBottom.value = true;
  const dataResp = await request.post(netApi.getUnSaleGoods.path, {id: shopId})

  if(dataResp.code === ResponseCode.success.code){
    AddCommodities.value = dataResp.data
    AddCommodities.value.forEach(goods=>{goods.checked = false})
  }
}
const showPopup = () => {
  getUnSaleGoods()
};

const allCheckedValue = ref(false)
const allCheckedText = ref('全选')
const allChecked = ()=>{
  allCheckedValue.value = !allCheckedValue.value
  allCheckedText.value = '取消全选'
  if(allCheckedValue.value){
    allCheckedText.value = '取消全选'
    AddCommodities.value.forEach(item =>{item.checked = true})
  }
  else{
    AddCommodities.value.forEach(item =>{item.checked = false})
    allCheckedText.value = '全选'
  }
}
const DoAddCommodity = ()=>{
  const data = []
  AddCommodities.value.forEach(goods=>{
    if(goods.checked === true ) {
      goods.saleState = 1;
      data.push(goods)
    }
  })
  request.post(netApi.updateSaleStatus.path, {shopGoodsList: data})
  showBottom.value = false;
  showToast('添加成功');
}

const toProDuctDetails = (goodsId)=>{
  router.push({
    path: api.productDetails.path,
    query: {goodsId: goodsId}
  })
}

const beforeClose = ({ name, position }) => {
  switch (position) {
    case 'right':
    case 'cell':
    case 'outside':
      return true;
    case 'left':
      return new Promise((resolve) => {
        console.log(name)
        showConfirmDialog({
          title: '确定删除吗？',
        })
            .then(() => {
              //下架商品
              commodities.value = commodities.value.filter(item => item.name !== name)
              resolve(true)
            })
            .catch(() => resolve(false));
      });
  }
};
let commodities = ref([])
const fetchData = async ()=>{
  const shopId = JSON.parse(localStorage.getItem('shopId'))
  const businessStatus = JSON.parse(localStorage.getItem('businessStatus'))
  if(!shopId) {
    showToast('请登录')
    return
  }
  if(!businessStatus) return
  const dataResp = await request.post(netApi.getSaleGoods.path, {id: shopId})

  if(dataResp.code === ResponseCode.success.code){
    commodities.value = dataResp.data
  }
}
onMounted(()=>{fetchData()})

</script>
<style scoped>
.doge {
  width: 140px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
#home{
  height: 100vh;
  margin: 0 0.5rem 0.5rem 0.5rem;
}
.addCommodity-button{
  display: flex;
  justify-content: space-between;
  margin: 0.7rem 3rem 1rem 10px;

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
