<template>
  <el-dialog
    title="出售"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>图片：</span></el-col>
      <el-col :span="8" :offset="1">
        <img v-if="orderData.img" :src="orderData.img" class="userPic"
             @click="avatarShow(orderData.img)">
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>货号：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{orderData.actNo}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>尺码：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{orderData.size}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>入库价：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="orderData.price" size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>出售价格：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.shelvesPrice" size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>发货截止时间：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-date-picker type="datetime" placeholder="发货截止时间" v-model="requestParam.deliveryDeadlineTime" value-format="yyyy-MM-dd HH:mm:ss">></el-date-picker>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>地址：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-select v-model="requestParam.addressId">
          <el-option
            v-for="item in addressList"
            :key="item.fieldValue"
            :label="item.fieldName"
            :value="+item.fieldValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <!--    <el-row class="form-flex">-->
    <!--      <el-col :span="8" style="text-align: right"><span>补贴价格：</span></el-col>-->
    <!--      <el-col :span="8" :offset="1">-->
    <!--        <el-input v-model="requestParam.subsidiesPrice" size="small" ></el-input>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>手续费：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{(requestParam.shelvesPrice * 0.075 + 38 + 8.5) | numFilter}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>预估到手价：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{( requestParam.subsidiesPrice * 1 +  requestParam.shelvesPrice - (requestParam.shelvesPrice * 0.075 + 38 + 8.5)) | numFilter}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>预估利润：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{(requestParam.subsidiesPrice * 1 + requestParam.shelvesPrice- (requestParam.shelvesPrice * 0.075 + 38 + 8.5) - orderData.price - 10) | numFilter}}</span>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmHandle" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { goodsOrderApi } from '@/api/goodsOrder'
import { parseTime } from '@/utils/index'

export default {
  props: {
    orderData: {
      type: Object
    }
  },
  data() {
    return {
      pictureZoomShow: false,
      imageZoom: '',
      dialogVisible: true,
      addressList: [],
      requestParam: {
        id: '',
        status: 3,
        addressId: '',
        deliveryDeadlineTime: '',
        shelvesPrice: '',
        theirPrice: '',
        subsidiesPrice: ''
      }
    }
  },
  mounted() {
    this.listSysDict()
    this.requestParam.id = this.orderData.id
    this.requestParam.deliveryDeadlineTime =  parseTime(this.orderData.deliveryDeadlineTime)
    this.requestParam.shelvesPrice = this.orderData.shelvesPrice
    this.requestParam.subsidiesPrice = this.orderData.subsidiesPrice
  },
  methods: {
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.addressList = sysDictList.filter(item => item.typeValue == 38)
    },
    avatarShow(e) {
      this.imageZoom = e
      this.pictureZoomShow = true
    },
    closDialog() {
      this.$emit('closDialog')
    },
    confirmHandle() {
      if (!this.requestParam.shelvesPrice) {
        this.$message.error('出售价格为空')
        return
      }
      if (!this.requestParam.deliveryDeadlineTime) {
        this.$message.error('发货截止时间为空')
        return
      }
      if (!this.requestParam.addressId) {
        this.$message.error('发货地址为空')
        return
      }
      let realVal = this.requestParam.subsidiesPrice * 1 + this.requestParam.shelvesPrice
      - (this.requestParam.shelvesPrice * 0.075 + 38 + 8.5)
      this.requestParam.theirPrice = parseFloat(realVal).toFixed(2)
      // 出售
      goodsOrderApi.sellGoods(this.requestParam).then(res => {
        if (res.subCode === 1000) {
          this.$store.dispatch('apply/orderInfo')
          this.$message({
            message: '操作成功，即将返回',
            type: 'success'
          })
          this.$emit('refreshPage')
        } else {
          this.$message.error(res.subMsg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog__header, ::v-deep .el-dialog__body {
    border-bottom: 1px solid #ddd;
  }

  .el-row {
    margin-bottom: 20px
  }
</style>
