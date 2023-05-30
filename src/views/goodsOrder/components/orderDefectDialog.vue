<template>
  <el-dialog
    title="瑕疵商品"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog1">
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>图片：</span></el-col>
      <el-col :span="8" :offset="1">
        <img v-if="orderData1.img" :src="orderData1.img" class="userPic"
             @click="avatarShow(orderData1.img)">
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>货号：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{orderData1.actNo}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>尺码：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{orderData1.size}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>瑕疵原因：</span></el-col>
      <el-col :span="12" :offset="1">
        <el-input type="textarea" :rows="4" maxlength="140" size="small" v-model="requestParam.reason"></el-input>
      </el-col>
    </el-row>
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>出售价格：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <el-input-->
<!--          @keyup.native="keyup1($event)"-->
<!--          v-model="requestParam.shelvesPrice"-->
<!--          size="small"></el-input>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>补贴价格：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <el-input-->
<!--          @keyup.native="keyup1($event)"-->
<!--          v-model="requestParam.subsidiesPrice"-->
<!--          size="small"></el-input>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>手续费：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <el-input-->
<!--          @keyup.native="keyup1($event)"-->
<!--          v-model="requestParam.poundage"-->
<!--          size="small"></el-input>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>运费：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <el-input-->
<!--          v-model="requestParam.freight"-->
<!--          @keyup.native="keyup1($event)"-->
<!--          size="small"></el-input>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>到手价：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <el-input-->
<!--          v-model="requestParam.theirPrice"-->
<!--          @keyup.native="keyup1($event)"-->
<!--          size="small"></el-input>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row class="form-flex">-->
<!--      <el-col :span="8" style="text-align: right"><span>利润：</span></el-col>-->
<!--      <el-col :span="8" :offset="1">-->
<!--        <el-input-->
<!--          @keyup.native="keyup1($event)"-->
<!--          v-model="requestParam.profits" size="small"></el-input>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmHandle" size="small">确 定</el-button>
    </span>
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="imageZoom" alt="" width="100%" >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { goodsOrderApi } from '@/api/goodsOrder'

export default {
  props: {
    orderData1: {
      type: Object
    }
  },
  data() {
    return {
      pictureZoomShow: false,
      imageZoom: '',
      dialogVisible: true,
      requestParam: {
        id: '',
        status: 8,
        reason: ''
      }
    }
  },
  mounted() {
    this.requestParam.id = this.orderData1.id
    this.requestParam.reason = this.orderData1.reason
  },
  methods: {
    avatarShow(e) {
      this.imageZoom = e
      this.pictureZoomShow = true
    },
    closDialog1() {
      this.$emit('closDialog1')
    },
    confirmHandle() {
        if (!this.requestParam.reason) {
        this.$message.error('请输入瑕疵原因')
        return
      }
      // 出售
      goodsOrderApi.sellGoods(this.requestParam).then(res => {
        if (res.subCode === 1000) {
          this.$store.dispatch('apply/orderInfo')
          this.$message({
            message: '操作成功，即将返回',
            type: 'success'
          })
          this.closDialog1()
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
