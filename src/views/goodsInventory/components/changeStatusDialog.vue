<template>
  <el-dialog
    title="上架"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>尺码：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{sizeData.size}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>当前库存：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{sizeData.inventory}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>已上架数量：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{sizeData.galleryCount}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>入库价：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{sizeData.price}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>上架数量：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input-number
          :max="sizeData.inventory - sizeData.galleryCount"
          v-input-validation v-model="requestParam.num" size="small"></el-input-number>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><i class="red">*</i><span>上架价格：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-input v-input-validation v-model="requestParam.shelvesPrice" size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>手续费：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{(requestParam.shelvesPrice * 0.075 + 38 + 8.5) | numFilter}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>预估到手价：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{(requestParam.shelvesPrice - (requestParam.shelvesPrice * 0.075 + 38 + 8.5)) | numFilter}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>预估利润：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{(requestParam.shelvesPrice- (requestParam.shelvesPrice * 0.075 + 38 + 8.5) - sizeData.price - 10) | numFilter}}</span>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmHandle" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { goodsInventoryApi } from '@/api/goodsInventory'

  export default {
    props: {
      sizeData: {
        type: Object
      }
    },
    data() {
      return {
        dialogVisible: true,
        requestParam: {
          inventoryId: '',
          type: 1,
          num: '',
          shelvesPrice: ''
        }
      }
    },
    mounted() {
      this.requestParam.inventoryId = this.sizeData.id
      this.requestParam.num = this.sizeData.inventory - this.sizeData.galleryCount
      this.requestParam.shelvesPrice = this.sizeData.dwPrice
    },
    methods: {
      closDialog() {
        this.$emit('closDialog')
      },
      confirmHandle() {
        if (this.requestParam.num > this.sizeData.inventory) {
          this.$message.error('上架数量大于当前库存')
          return
        }
        goodsInventoryApi.shelvesGoods(this.requestParam).then(res => {
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
  ::v-deep .el-dialog__header, ::v-deep .el-dialog__body {
    border-bottom: 1px solid #ddd;
  }

  .el-row {
    margin-bottom: 20px
  }
</style>
