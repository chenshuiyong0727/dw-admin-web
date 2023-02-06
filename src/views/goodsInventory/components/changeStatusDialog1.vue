<template>
  <el-dialog
    title="选择尺码"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">
    <el-row class="form-flex">
      <el-col :span="6" style="text-align: right"><span>尺码：</span></el-col>
      <el-col :span="12" :offset="1">
        <el-select v-model="requestParam.sizeId">
<!--        <el-select v-model="requestParam.sizeId" @change="change">-->
          <el-option
            v-for="item in sizeList"
            :key="item.id"
            :label="item.size"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="6" style="text-align: right"><span>入库时间：</span></el-col>
      <el-col :span="12" :offset="1">
        <el-date-picker
          v-model="requestParam.createTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="入库时间">
        </el-date-picker>
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
    sizeData: {
      type: Object
    },
    sizeList: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: true,
      requestParam: {
        id: '',
        createTime: '',
        sizeId: 1
      }
    }
  },
  mounted() {
    this.requestParam.createTime = this.sizeData.createTime
    this.requestParam.id = this.sizeData.id
    this.requestParam.sizeId = this.sizeData.sizeId
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
      console.info(this.requestParam)
      this.$confirm('是否修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodsInventoryApi.update(this.requestParam).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.$emit('refreshPage')
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
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
