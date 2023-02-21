<template>
  <el-dialog
    title="选择尺码"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>选择数：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{ids.length}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>请选择仓库：</span></el-col>
      <el-col :span="8" :offset="1">
        <el-select v-model="requestParam.warehouseId">
          <el-option
            v-for="item in warehouseList"
            :key="item.fieldValue"
            :label="item.fieldName"
            :value="+item.fieldValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="update" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { goodsInventoryApi } from '@/api/goodsInventory'

export default {
  props: {
    ids: {
      type: Array
    },
    warehouseList: {
      type: Array
    }
  },
  data() {
    return {
      dialogVisible: true,
      requestParam: {
        warehouseId: 2,
        ids: []
      }
    }
  },
  mounted() {
    this.requestParam.ids = this.ids
  },
  methods: {
    closDialog() {
      this.$emit('closDialog')
    },
    // change() {
    //   console.info(this.requestParam.size)
    //   for (let i = 0; i < this.sizeList.length; i++) {
    //     let sizeObject = this.sizeList[i]
    //     if (sizeObject.id == this.requestParam.sizeId) {
    //       console.info(sizeObject)
    //     }
    //   }
    // },
    update() {
      goodsInventoryApi.batchupdateStatus(this.requestParam).then((res) => {
        this.$message.success(res.subMsg)
        if (res.subCode === 1000) {
          this.$emit('refreshPage')
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
