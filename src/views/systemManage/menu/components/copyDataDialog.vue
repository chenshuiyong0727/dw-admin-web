<template>
  <el-dialog
    title="设置密码"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closeDialog1">
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>原健值：</span></el-col>
      <el-col :span="12" :offset="1">
        <el-input v-model="requestParam.oldKey" size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>替换健值：</span></el-col>
      <el-col :span="12" :offset="1">
        <el-input v-model="requestParam.newKey" size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>原名称：</span></el-col>
      <el-col :span="12" :offset="1">
        <el-input v-model="requestParam.oldName" size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>替换名称：</span></el-col>
      <el-col :span="12" :offset="1">
        <el-input v-model="requestParam.newName" size="small"></el-input>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmHandle" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { systemContainerApi } from '@/api/systemManage'

  export default {
    props: {
      ids: {
        type: Array
      },
      keyword: {
        type: String
      },
      oldName: {
        type: String
      }
    },
    data() {
      return {
        dialogVisible: true,
        requestParam: {
          oldKey: '',
          newKey: '',
          oldName: '',
          newName: '',
          ids: ''
        }
      }
    },
    mounted() {
      if (this.keyword) {
        this.requestParam.oldKey = this.keyword
      }
      if (this.oldName) {
        this.requestParam.oldName = this.oldName
      }
      this.requestParam.ids = this.ids
    },
    methods: {
      closeDialog1() {
        this.$emit('reload2')
        this.dialogVisible = false
      },
      confirmHandle() {
        if (!this.requestParam.oldKey && this.requestParam.newKey) {
          return this.$message.error('请填写 原健值')
        }
        if (this.requestParam.oldKey && !this.requestParam.newKey) {
          return this.$message.error('请填写 替换健值')
        }
        if (!this.requestParam.oldName && this.requestParam.newName) {
          return this.$message.error('请填写 原名称')
        }
        if (this.requestParam.oldName && !this.requestParam.newName) {
          return this.$message.error('请填写 替换名称')
        }
        systemContainerApi.updateKeyList(this.requestParam).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              message: '操作成功，即将返回',
              type: 'success'
            })
            this.$emit('reload1')
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
