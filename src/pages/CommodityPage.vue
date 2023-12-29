<template>
  <van-floating-bubble
      v-model:offset="offset"
      axis="xy"
      icon="plus"
      magnetic="x"
      @click="addCommodity" />
  <van-search
      v-model="value"
      shape="round"
      background="#4fc08d"
      placeholder="请输入搜索关键词"
      @search="onSearch"
  />
  <div id="commodity">
    <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
    >
      <div v-for="commodity in commodities"
           style="margin-bottom: 0.5rem"
      >
        <van-card
            style="background-color: white"
            :price="commodity.price"
            desc="描述信息"
            :thumb="commodity.mainImage"
            @click="toProductDetails(commodity.id)"
        >
          <template #price>
            <span>价格：
              <strong style="color: red">
                {{commodity.price}}
              </strong>
            </span>
          </template>
          <template #desc>
            <h2>{{commodity.name}}</h2>
          </template>
          <template #tags>
            <van-tag v-if="commodity.saleState" plain type="primary">已上架</van-tag>
            <van-tag v-else plain type="danger">未上架</van-tag>
          </template>
          <template #bottom>
            <div>
              <p v-if="commodity.allDaySale">售卖时间：营业时一直售卖</p>
              <p v-else >售卖时间：{{commodity.saleTime}}</p>
            </div>
            <div>
              <van-row gutter="16">
                <van-col><p>销量：{{commodity.sale}}</p></van-col>
                <van-col><p>评分：{{commodity.score}}</p></van-col>
              </van-row>

            </div>
          </template>

        </van-card>
        <van-space
            class="footer"
            size="1rem"
        >
            <van-button v-if="commodity.saleState" size="small" @click="updateSaleStatus(commodity)">下架</van-button>
            <van-button v-else size="small" @click="updateSaleStatus(commodity)">上架</van-button>
            <van-button
                size="small"
                @click="editCommodity(commodity)"
            >
              修改</van-button>

        </van-space>
      </div>

    </van-pull-refresh>


  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {showToast} from "vant";
import {useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import ResponseCode from "../../common/ResponseCode";
import request from "../../util/request";
const router = useRouter()
const value = ref('');

const commodities = ref([])
const fetchData = async ()=>{
  const shopId = JSON.parse(localStorage.getItem('shopId'))
  if(!shopId) {
    showToast('请登录')
    return
  }
  const dataResp = await request.post(netApi.getGoods.path, {id: shopId})

  if(dataResp.code === ResponseCode.success.code){
    commodities.value = dataResp.data
  }
}
onMounted(()=>{
  fetchData()
})
const offset = ref({y: document.documentElement.clientHeight*2/3 });
const addCommodity = () => {
  router.push(api.addProduct.path)
};



const isLoading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    isLoading.value = false;
  }, 1000);
};

const updateSaleStatus = async (goods) =>{
  const updateResp = await request.post(netApi.updateGoodsSaleStatus.path,
      {id: goods.id, saleState: goods.saleState === 0 ? 1:0})

  if(updateResp.code === ResponseCode.success.code)
    showToast('操作成功')
  else if(updateResp.code === ResponseCode.unAuthorized.code)
    showToast('未登录或无权限')
  else showToast('操作失败, 请查看是否营业')
}
const editCommodity = (commodity) => {
  router.push({
    path: api.updateGoods.path,
    query: {
      goodsId: commodity.id
    }
  })
}
const onSearch = async (val) => {
  // showToast(val);
  const searchResp = await request.get(netApi.searchGoods.path+val)

  if(searchResp.code === ResponseCode.success.code)
    commodities.value = searchResp.data
  else if(searchResp.code === ResponseCode.unAuthorized)
    showToast('未登录或无权限')
}

const toProductDetails = (goodsId)=>{
  router.push({
    path: api.productDetails.path,
    query: {goodsId: goodsId}
  })
}
</script>
<style scoped>
.footer{
  display: flex;
  justify-content: right;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: white;
}
#commodity{
  margin: 0.5rem;
}
</style>