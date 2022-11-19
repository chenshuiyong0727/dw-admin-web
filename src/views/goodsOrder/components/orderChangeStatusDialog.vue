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
        <img  v-if="orderData.imgUrl" :src="fileUrl+ orderData.imgUrl" class="userPic"  @click="avatarShow(orderData.imgUrl)" >
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
        <el-input v-model="requestParam.price" size="small" ></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>出售价格：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.shelvesPrice" size="small" ></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>补贴价格：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.subsidiesPrice" size="small" ></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>手续费：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.poundage" size="small" ></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>运费：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.freight" size="small" ></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>到手价：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input
          v-model="requestParam.theirPrice"
          @keyup.native="keyup1($event)"
          size="small" ></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>利润：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.profits" size="small" ></el-input>
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
export default {
  props: {
    orderData: {
      type: Object
    }
  },
  data() {
    return {
      fileUrl: fileUrl,
      dialogVisible: true,
      requestParam: {
        id: '',
        status: 7,
        price: '',
        shelvesPrice: '',
        subsidiesPrice: '',
        freight: '',
        poundage: '',
        theirPrice: '',
        profits: ''
      }
    }
  },
  mounted() {
    this.requestParam.id = this.orderData.id
    this.requestParam.price = this.orderData.price
    this.requestParam.shelvesPrice = this.orderData.shelvesPrice
    this.requestParam.subsidiesPrice = this.orderData.subsidiesPrice
    this.requestParam.freight = this.orderData.freight
    let poundage = this.requestParam.shelvesPrice * 0.075 + 38 + 8.5
    this.requestParam.poundage = parseFloat(poundage).toFixed(2)
    let realVal = this.requestParam.subsidiesPrice * 1 + this.requestParam.shelvesPrice - (this.requestParam.shelvesPrice * 0.075 + 38 + 8.5)
    this.requestParam.theirPrice = parseFloat(realVal).toFixed(2)
    let profits = this.requestParam.theirPrice - this.requestParam.freight - this.requestParam.price
    this.requestParam.profits = parseFloat(profits).toFixed(2)
    // this.requestParam.profits = this.requestParam.theirPrice - this.requestParam.freight - this.requestParam.price
  },
  methods: {
    avatarShow(e) {
      if (!e) {
        return
      }
      window.open(this.fileUrl + e)
    },
    closDialog() {
      this.$emit('closDialog')
    },
    keyup1() {
      console.info('keyup1 ' + this.requestParam.theirPrice)
      let profits = this.requestParam.theirPrice - this.requestParam.freight - this.requestParam.price
      this.requestParam.profits = parseFloat(profits).toFixed(2)
    },
    confirmHandle() {
      // 利润= 到手价-运费-原价
      let profits = this.requestParam.theirPrice - this.requestParam.freight - this.requestParam.price
      this.requestParam.profits = parseFloat(profits).toFixed(2)

      // 出售
      goodsOrderApi.sellGoods(this.requestParam).then(res => {
        if (res.subCode === 1000) {
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
  ::v-deep .el-dialog__header,::v-deep .el-dialog__body {
    border-bottom: 1px solid #ddd;
  }
  .el-row {
    margin-bottom: 20px
  }
</style>
