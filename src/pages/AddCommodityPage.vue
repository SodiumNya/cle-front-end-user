<template>
  <div id="AddCommodity">
    <van-form @failed="onFailed" @submit="addGoods">
      <van-cell-group inset>
        <van-field v-model="sendGoods.name"
                   :rules="[{required: true, message: '食物名称不能为空'}]"
                   input-align="right"
                   label="食物名称"
                   name="name"
                   placeholder="输入名称"
        />
        <van-field input-align="right" label="上传主图片" name="uploader"
                   :rules="[{required: true, message: '主图不能为空'}]"
        >
          <template #input>
            <van-uploader
                v-model="mainImage"
                :after-read="(files, e) =>{sendGoods.mainImage = files.file}" max-count="1"
                reupload/>
          </template>
        </van-field>
        <van-field
            input-align="right"
            label="上传食物图片"
            name="uploader"
            :rules="[{required: true, message: '图片列表不能为空'}]">
          <template #input>
            <van-uploader
                v-model="pictureList"
                :after-read="(files, e) =>{gos.append('pictureList', files.file)}" max-count="3"
                reupload/>
          </template>
        </van-field>

        <van-field input-align="right" label="营业时间售卖" name="switch">
          <template #input>
            <van-switch disabled v-model="isSale"/>
          </template>
        </van-field>


        <van-field
            v-model="sendGoods.startTime"
            :disabled="true"
            is-link
            label="时间选择"
            name="timePicker"
            placeholder="点击选择时间(此功能未完善)"
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
            :disabled="true"
            is-link
            label="时间选择"
            name="datePicker"
            placeholder="点击选择时间(此功能未完善)"
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
            <!--            <template #category="{ rowIndex }">-->
            <!--              <a-select v-model="specsList[rowIndex].category" @change="()=>handleChange(rowIndex)">-->
            <!--                <a-option v-for="option in categoryOptions">{{option.name}}</a-option>-->
            <!--              </a-select>-->
            <!--            </template>-->
          </a-table>
          <van-row justify="end">
            <van-button size="small" style="margin: 0.5rem" type="primary" @click="addSpecs">添加参数</van-button>
          </van-row>
        </div>

      </van-cell-group>
      <div style="margin: 16px;">
        <van-button block native-type="submit" round type="primary">
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
import {showToast} from "vant";

const route = useRoute()
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
  // {
  //   title: '类别',
  //   dataIndex: 'category',
  //   slotName: 'category'
  // },
  // {
  //   title: '所属类别',
  //   dataIndex: 'category',
  //   slotName: 'category'
  // },
];
const specsList = reactive([]);
let categoryOptions = []


const getCategory = async () => {
  const categoryResp = await request.get(netApi.getCategory.path)

  if (categoryResp.code === ResponseCode.success.code) {
    categoryOptions = categoryResp.data
  }
}
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
  pictureList: []
})
onMounted(() => {
  getCategory()

})
const addSpecs = () => {
  specsList.push({
    specs: '',
    value: '',
    price: 0.00
  })
}
const currentTime = ref(['12', '00']);
const mainImage = ref([])
const pictureList = ref([])
let test = null
const router = useRouter()
const handleChange = () => {
  categoryOptions.forEach(item => {
    if (item.name === sendGoods.value.categoryName) {
      sendGoods.value.categoryId = item.id
    }
  })
}


const addGoods = async () => {
  console.log(gos)
  const token = JSON.parse(localStorage.getItem('token') || 'null')
  if (token === null) {
    showToast('未登录')
    return
  }


  sendGoods.value.allDaySale = isSale.value ? 1 : 0
  // alert(isSale.value)
  // alert(sendGoods.value.allDaySale)
  sendGoods.value.specsList = specsList


  sendGoods.value.shopId = JSON.parse(localStorage.getItem('shopId') || 'null')

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
  const addResp = await request.post(netApi.addGoods.path, gos, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  if(addResp.code === ResponseCode.success.code){
    showToast('添加成功')
    router.back()
  }

}
const pattern = /\d{6}/;


const rules = {
  value: [
    {required: true, message: '输入不能为空', trigger: 'blur'},
    {type: 'number', message: '输入必须是数字', trigger: 'blur'}
  ],
  file: [
    {required: true, message: '文件不能为空', trigger: 'change'}
  ]
}


const isSale = ref(true);

const onFailed = (errorInfo) => {
  alert(errorInfo)
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