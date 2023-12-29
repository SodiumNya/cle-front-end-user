

<template>
  <div id="Receipt" >
    <van-field
        v-model="currentDate"
        is-link
        readonly
        name="datePicker"
        label="时间"
        placeholder="点击选择日期"
        @click="showPicker = true"

    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-date-picker
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onConfirm"
          @cancel="showPicker = false" />
    </van-popup>


    <van-grid column-num="2">
      <van-grid-item icon="photo-o" text="文字" >
        <a-space size="large">
          <a-statistic title="今日卖出" :value="125670" show-group-separator />
        </a-space>
      </van-grid-item>
      <van-grid-item icon="photo-o" text="文字" >
        <a-space size="large">
          <a-statistic title="今日收入" :value="125670" show-group-separator />
        </a-space>
      </van-grid-item>
    </van-grid>
    <van-grid :column-num="3">
      <van-grid-item icon="photo-o" text="文字" >
        <a-space size="large">
          <a-statistic title="本周收入" :value="125670" show-group-separator />
        </a-space>
      </van-grid-item>
      <van-grid-item icon="photo-o" text="文字" >
        <a-space size="large">
          <a-statistic title="本月" :value="125670" show-group-separator />
        </a-space>
      </van-grid-item>
      <van-grid-item icon="photo-o" text="文字" >
        <a-space size="large">
          <a-statistic title="本年" :value="125670" show-group-separator />
        </a-space>
      </van-grid-item>

    </van-grid>


  </div>
</template>
<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {showToast} from "vant";
const currentDate = ref('');
const showPicker = ref(false);

const minDate = new Date(2019, 11, 8)
const maxDate = new Date()
const onConfirm = ({ selectedValues }) => {
  currentDate.value = selectedValues.join('/');
  showPicker.value = false;
  showToast(currentDate.value);
}



const router = useRouter()

</script>
<style scoped>

</style>