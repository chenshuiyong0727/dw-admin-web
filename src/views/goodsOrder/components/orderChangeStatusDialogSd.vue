<template>
  <el-dialog
    title="出售"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>图片：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <img v-if="orderData.img" :src="orderData.img" class="userPic"-->
<!--             @click="avatarShow(orderData.img)">-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>货号：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <span>{{orderData.actNo}}</span>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>尺码：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <span>{{orderData.size}}</span>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>入库价：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <el-input v-model="orderData.price" size="small"></el-input>-->
<!--      </el-col>-->
<!--    </el-row>-->
        <el-row class="form-flex">
          <el-col :span="8" style="text-align: right"><span>选择数：</span></el-col>
            <el-col :span="8" :offset="1">
              <span>{{ids.length}}</span>
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
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>销售类型：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-select v-model="requestParam.saleType">
          <el-option
            v-for="item in saleTypeList"
            :key="item.fieldValue"
            :label="item.fieldName"
            :value="+item.fieldValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>状态：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-select v-model="requestParam.status">
          <el-option
            v-for="item in statusList"
            :key="item.fieldValue"
            :label="item.fieldName"
            :value="+item.fieldValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>免仓储费天数：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-model="requestParam.inStoreFreeDay" size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>闪电直发入仓时间：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-date-picker type="datetime" placeholder="闪电直发入仓时间" v-model="requestParam.inStoreTime" value-format="yyyy-MM-dd HH:mm:ss">></el-date-picker>
      </el-col>
    </el-row>
    <!--    <el-row class="form-flex">-->
    <!--      <el-col :span="8" style="text-align: right"><span>补贴价格：</span></el-col>-->
    <!--      <el-col :span="8" :offset="1">-->
    <!--        <el-input v-model="requestParam.subsidiesPrice" size="small" ></el-input>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>手续费：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <span>{{(requestParam.shelvesPrice * 0.075 + 38 + 8.5) | numFilter}}</span>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>预估到手价：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <span>{{( requestParam.subsidiesPrice * 1 +  requestParam.shelvesPrice - (requestParam.shelvesPrice * 0.075 + 38 + 8.5)) | numFilter}}</span>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>预估利润：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <span>{{(requestParam.subsidiesPrice * 1 + requestParam.shelvesPrice- (requestParam.shelvesPrice * 0.075 + 38 + 8.5) - orderData.price - 10) | numFilter}}</span>-->
<!--      </el-col>-->
<!--    </el-row>-->
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
    ids: {
      type: Array
    },
    status: {
      type: Number
    }
  },
  data() {
    return {
      dialogVisible: true,
      saleTypeList: [],
      addressList: [],
      statusList: [],
      requestParam: {
        ids: '',
        status: '',
        saleType: 2,
        addressId: '',
        deliveryDeadlineTime: '',
        inStoreFreeDay: '',
        inStoreTime: ''
      }
    }
  },
  mounted() {
    this.listSysDict()
    this.requestParam.ids = this.ids
    this.requestParam.status = this.status
  },
  methods: {
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.addressList = sysDictList.filter(item => item.typeValue == 38)
      this.saleTypeList = sysDictList.filter(item => item.typeValue == 46)
      this.statusList = sysDictList.filter(item => item.typeValue == 37)
    },
    closDialog() {
      this.$emit('closDialog')
    },
    confirmHandle() {
      if (!this.requestParam.deliveryDeadlineTime) {
        this.$message.error('发货截止时间为空')
        return
      }
      if (!this.requestParam.addressId) {
        this.$message.error('发货地址为空')
        return
      }
      if (this.requestParam.status == 11 && !this.requestParam.inStoreTime) {
        this.$message.error('闪电直发入仓 ，入仓时间不能为空')
        return
      }
      if (this.requestParam.status == 11 && !this.requestParam.inStoreFreeDay) {
        this.$message.error('闪电直发入仓 ，免仓储费天数不能为空')
        return
      }
      // 闪电直发
      goodsOrderApi.updateSaleType(this.requestParam).then(res => {
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
