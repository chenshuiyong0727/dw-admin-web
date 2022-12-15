<template>
  <el-dialog
    title="关联账号"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">

    <el-table height="600" border :data="tableData">
      <el-table-column align="center" prop="userAccount" label="账号" show-overflow-tooltip/>
      <el-table-column align="center" prop="userRealName" label="员工姓名"/>
      <el-table-column align="center" prop="dataStatus" :formatter="statusFormat" label="状态"/>
      <el-table-column align="center" prop="createTime" label="关联时间"/>
      <el-table-column align="center" prop="createUserName" label="配置人"/>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { systemContainerApi } from '@/api/systemManage'

  export default {
    props: ['roleId'],
    data() {
      return {
        dialogVisible: true,
        tableData: []
      }
    },
    mounted() {
      systemContainerApi.pageListOpRoleRelationUser({
        roleId: this.roleId,
        pageSize: 10,
        pageNum: 1
      }).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data.records
        }
      })
    },
    methods: {
      closDialog() {
        this.$emit('closDialog')
      },
      statusFormat(row) {
        switch (row.dataStatus) {
          case -1:
            return '删除'
          case 0:
            return '禁用'
          case 1:
            return '正常'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog__header, ::v-deep .el-dialog__body {
    border-bottom: 1px solid #ddd;
  }
</style>


