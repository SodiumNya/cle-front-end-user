<template>
  <div id="AddCommodity">
    <van-form @failed="onFailed">
      <van-cell-group inset>
        <van-field v-model="sendGoods.name"
                   :rules="[{required: true, message: '食物名称不能为空'}]"
                   input-align="right"
                   label="食物名称"
                   name="name"
                   placeholder="输入名称"
        />
        <van-field input-align="right" label="上传主图片" name="uploader"
                   :rules="[{required: true, message: '主图不能为空'}]">
          <template #input>
            <van-uploader
                v-model="mainImage"
                :after-read="(files, e) =>{sendGoods.mainImage = files.file}" max-count="1"
                @delete="(file)=>{sendGoods.mainImage = null}"
                reupload/>
          </template>
        </van-field>
        <van-field input-align="right" label="上传食物图片" name="uploader"
                   :rules="[{required: true, message: '图片列表不能为空'}]">

          <template #input>
            <van-uploader
                v-model="pictureList"
                :after-read="pictureAfterRead" max-count="3"
                @delete="picDelete"
                reupload/>
          </template>
        </van-field>

        <van-field input-align="right" label="营业时间售卖" name="switch">
          <template #input>
            <van-switch v-model="isSale"/>
          </template>
        </van-field>


        <van-field
            v-model="sendGoods.startTime"
            :disabled="isSale"
            is-link
            label="时间选择"
            name="timePicker"
            placeholder="点击选择时间"
            readonly
            @click="startSaleShowPicker = !isSale"
        />
        <van-popup v-model:show="startSaleShowPicker" position="bottom">
          <van-time-picker
              v-model="currentTime"
              :formatter="formatter"
              title="选择时间"
              @cancel="startSaleShowPicker = false"
              @confirm="onStartSaleConfirm"
          />

        </van-popup>

        <van-field
            v-model="sendGoods.endTime"
            :disabled="isSale"
            is-link
            label="时间选择"
            name="datePicker"
            placeholder="点击选择时间"
            readonly
            @click="endSaleShowPicker = !isSale"
        />
        <van-popup v-model:show="endSaleShowPicker" position="bottom">
          <van-time-picker
              v-model="currentTime"
              :formatter="formatter"
              :min-time="sendGoods.startTime"
              title="选择时间"
              @cancel="endSaleShowPicker = false"
              @confirm="onEndSaleConfirm"

          />
        </van-popup>

        <van-cell title="商品所属类别">

          <template #value>
            <a-select v-model="sendGoods.categoryName" @change="()=>handleChange()">
              <a-option v-for="option in categoryOptions">{{ option.name }}</a-option>
            </a-select>
          </template>
        </van-cell>

        <div style="">
          <a-table :columns="columns" :data="specsList" :pagination="false">
            <template #specs="{ rowIndex }">
              <a-input v-model="specsList[rowIndex].specs"/>
            </template>
            <template #value="{ rowIndex }">
              <a-input v-model="specsList[rowIndex].value"/>
            </template>
            <template #price="{ rowIndex }">
              <a-input v-model="specsList[rowIndex].price"/>
            </template>

          </a-table>
          <van-row justify="end">
            <van-button size="small" style="margin: 0.5rem" type="primary" @click="addSpecs">添加参数</van-button>
          </van-row>
        </div>

      </van-cell-group>
      <div style="margin: 16px;">
        <van-button block native-type="submit" round type="danger" @click="deleteGoods()">
          删除
        </van-button>
      </div>
      <div style="margin: 16px;">
        <van-button block native-type="submit" round type="primary" @click="addGoods()">
          提交
        </van-button>
      </div>
    </van-form>


  </div>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import request from "../../util/request";
import ResponseCode from "../../common/ResponseCode";
import {netApi} from "../../common/API";
import {showConfirmDialog, showToast} from "vant";

const route = useRoute()
const router = useRouter()
const name = ref('');
const price = ref('');
const columns = [
  {
    title: '参数名',
    dataIndex: 'specs',
    slotName: 'specs'
  },
  {
    title: '值',
    dataIndex: 'value',
    slotName: 'value'

  },
  {
    title: '售价',
    dataIndex: 'price',
    slotName: 'price'
  },
];
const specsList = reactive([]);
let categoryOptions = []


const getCategory = async () => {
  const categoryResp = await request.get(netApi.getCategory.path)

  if (categoryResp.code === ResponseCode.success.code) {
    categoryOptions = categoryResp.data
  }
}

const goodsId = route.query.goodsId

const gos = new FormData()

const sendGoods = ref({
  categoryId: '',
  categoryName: '',
  name: '',
  mainImage: null,
  detail: '',
  shopId: '',
  attributeList: '',
  startTime: '',
  endTime: '',
  allDaySale: 1,
  specsList: [{specs: '', price: 0}],
  pictureList: [],
  deletePicture: []
})

const getGoodsDetail = async () => {
  if (!goodsId) return
  console.log(goodsId)
  const goodsResp = await request.get(netApi.getAnyProduct.path + goodsId)
  const pictureListResp = await request.get(netApi.productPicture.path + goodsId)
  const specsResp = await request.get(netApi.productSpecs.path + goodsId)

  if (goodsResp.code === ResponseCode.success.code) {
    sendGoods.value.categoryId = goodsResp.data.categoryId
    sendGoods.value.name = goodsResp.data.name
    sendGoods.value.detail = goodsResp.data.detail
    sendGoods.value.shopId = goodsResp.data.shopId
    sendGoods.value.startTime = goodsResp.data.startSale
    sendGoods.value.endTime = goodsResp.data.endSale
    sendGoods.value.allDaySale = goodsResp.data.allDaySale

    mainImage.value.push({url: goodsResp.data.mainImage})
    isSale.value = sendGoods.value.allDaySale === 1

    categoryOptions.forEach(item => {
      console.log('打雷:',sendGoods.value.categoryId)
      if (sendGoods.value.categoryId === item.id){
        sendGoods.value.categoryName = item.name
      }
    })
  }

  if (pictureListResp.code === ResponseCode.success.code) {
      sendGoods.value.pictureList = pictureListResp.data
      sendGoods.value.pictureList.forEach(item => {
        pictureList.value.push({url: item.url, id: item.id})
      })
    }

  if(specsResp.code === ResponseCode.success.code){
    const data = specsResp.data
    console.log(data)
    data.forEach(item=>{
      let specs = JSON.parse(item.specs);
      let newObject = {};
      for (let key in specs) {
        newObject['specs'] = key
        newObject['value'] = specs[key]
      }
      newObject['id'] = item.id
      newObject['price'] = item.price;
      sendGoods.value.specsList.push(newObject)
      specsList.push(newObject)
      console.log(newObject)
    })
  }
}

  onMounted(() => {
    getCategory()
    getGoodsDetail()
  })
  const addSpecs = () => {
    specsList.push({
      id: null,
      specs: '',
      value: '',
      price: 0.00
    })
  }
  const currentTime = ref(['12', '00']);
  const mainImage = ref([])
  const pictureList = ref([])

let picTempList = []
const pictureAfterRead = (file, e)=>{
    const pic = {index: e.index, file: file.file}

    if(typeof(file.id) !=="undefined") {
      pic.id = file.id
    }

    picTempList.push(pic)
}
const picDelete = (file, e)=>{
  console.log(file)
    if(typeof(file.id) !=="undefined") sendGoods.value.deletePicture.push(file.id)
    picTempList = picTempList.filter(o=> o.index !== e.index)
}
  const handleChange = () => {
    categoryOptions.forEach(item => {
      if (item.name === sendGoods.value.categoryName) {
        sendGoods.value.categoryId = item.id
      }
    })
  }

const deleteGoods = () => {
  showConfirmDialog({
    title: '提醒',
    message: '确定删除该商品？',
  }).then(async () => {
    const deleteResp = await request.put(netApi.deleteGoods.path, {id: goodsId})
    if(deleteResp.code === ResponseCode.success.code){
      showToast('删除成功')
      router.back();
    }else if(deleteResp.code === ResponseCode.unAuthorized.code)
      showToast('无权或未登录');
    else showToast('操作失败')
  });
}
  const addGoods = async () => {
    console.log(gos)
    console.log(pictureList)
    const token = JSON.parse(localStorage.getItem('token') || 'null')
    if (token === null) {
      showToast('未登录')
      return
    }


    sendGoods.value.allDaySale = isSale.value ? 1 : 0
    sendGoods.value.specsList = specsList


    sendGoods.value.shopId = JSON.parse(localStorage.getItem('shopId') || 'null')

    gos.append('id', goodsId)
    gos.append('categoryId', sendGoods.value.categoryId)
    gos.append('categoryName', sendGoods.value.categoryName)
    gos.append('name', sendGoods.value.name)
    gos.append('mainImage', sendGoods.value.mainImage)
    gos.append('detail', sendGoods.value.detail)
    gos.append('shopId', sendGoods.value.shopId)
    gos.append('attributeList', sendGoods.value.attributeList)
    gos.append('startTime', sendGoods.value.startTime)
    gos.append('endTime', sendGoods.value.endTime)
    gos.append('allDaySale', sendGoods.value.allDaySale)
    gos.append('specsListJson', JSON.stringify(sendGoods.value.specsList),)
    gos.append('deletePicture', sendGoods.value.deletePicture,)
    picTempList.forEach(i=>{gos.append('pictureList', i.file)})
    const updateResp = await request.post(netApi.updateGoods.path, gos, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if(updateResp.code === ResponseCode.success.code){
      showToast('修改成功')
    }else {
      showToast('修改失败')
    }

  }
  const pattern = /\d{6}/;

  const isSale = ref(true);

  const onFailed = (errorInfo) => {
    console.log('failed', errorInfo);
  };


  const formatter = (type, option) => {
    if (type === 'hour') {
      option.text += '时';
    }
    if (type === 'minute') {
      option.text += '分';
    }
    return option;
  };

  const startSaleShowPicker = ref(false);
  const endSaleShowPicker = ref(false);
  const onStartSaleConfirm = ({selectedValues}) => {
    // startSaleTime.value = selectedValues.join(':');
    sendGoods.value.startTime = selectedValues.join(':');
    startSaleShowPicker.value = false;
  };

  const onEndSaleConfirm = ({selectedValues}) => {
    // endSaleTime.value = selectedValues.join(':');
    sendGoods.value.endTime = selectedValues.join(':');
    endSaleShowPicker.value = false;
  };
</script>
<style scoped>

</style>