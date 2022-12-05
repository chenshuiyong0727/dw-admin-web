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
      <el-col :span="8" style="text-align: right"><span>运费：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input
          v-model="requestParam.freight"
          @keyup.native="keyup1($event)"
          size="small" ></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>地址：</span></el-col>
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
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>运单号：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.waybillNo" size="small" ></el-input>
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
      addressList: [],
      requestParam: {
        id: '',
        waybillNo: '',
        freight: '',
        addressId: ''
      }
    }
  },
  mounted() {
    this.listSysDict()
    this.requestParam.id = this.orderData.id
    this.requestParam.freight = this.orderData.freight
    this.requestParam.waybillNo = this.orderData.waybillNo
    this.requestParam.addressId = this.orderData.addressId
  },
  methods: {
    avatarShow(e) {
      if (!e) {
        return
      }
      window.open(this.fileUrl + e)
    },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.addressList = sysDictList.filter(item => item.typeValue == 38)
    },
    closDialog() {
      this.$emit('closDialog')
    },
    confirmHandle() {
      goodsOrderApi.update(this.requestParam).then(res => {
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
