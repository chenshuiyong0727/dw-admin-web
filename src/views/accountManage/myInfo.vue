<template>
  <div class="page-container">
    <h5 class="cancel-top">个人信息</h5>

    <el-row class="form-flex">
      <el-col :span="2">姓名：</el-col>
      <el-col :span="22">{{userInfo.userRealName || '--'}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">性别：</el-col>
      <el-col :span="22">{{userInfo.gender | dictToDesc('SEX')}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">部门：</el-col>
      <el-col :span="22">{{userInfo.departmentName || '--'}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">岗位：</el-col>
      <el-col :span="22">{{userInfo.postName || '--'}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">类型：</el-col>
      <el-col :span="22">{{userInfo.staffType == 1 ? '正式' : userInfo.staffType == 0 ? '试用' : '--'}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">电话：</el-col>
      <el-col :span="22">{{userInfo.userMobile || '--'}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">邮箱：</el-col>
      <el-col :span="22">{{userInfo.userEmail + '@hj-health.cn' || '--'}}</el-col>
    </el-row>

    <h5>账号信息</h5>
    <el-row class="form-flex">
      <el-col :span="2">账号：</el-col>
      <el-col :span="22">{{userInfo.userAccount || '--'}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">状态：</el-col>
      <el-col :span="22">{{userInfo.dataStatus == 1 ? '正常' : userInfo.dataStatus == 0 ? '停用' : userInfo.dataStatus == -1 ? '删除' : '--'}}</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="2">权限：</el-col>
      <el-col :span="22">{{userInfo.roleNames || '--'}}</el-col>
    </el-row>
    <h5>登录信息</h5>
    <div class="login-ip-sty">
      <el-table border :data="tableData" class="table" :header-cell-style="{background: 'rgb(64, 158, 255)', color: '#fff'}">
        <el-table-column fixed align="center" prop="updateTime" label="时间">
          <template slot-scope="scope">{{scope.row.updateTime | formateTime}}</template>
        </el-table-column>
        <el-table-column align="center" prop="ip" label="IP" />
      </el-table>
      <el-row class="top-15">
        <el-pagination
          @size-change="reSearchHandle"
          @current-change="pageChangeHandle"
          :current-page="queryParam.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          :pager-count="5">
        </el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import { systemContainerApi } from '@/api/systemManage'
import { getCookieByName } from '@/utils/auth'
export default {
  data() {
    return {
      userInfo: {},
      queryParam: {
        pageSize: 10,
        pageNum: 1,
        id: localStorage.getItem('user_id')
      },
      tableData: [],
      totalCount: 0
    }
  },
  mounted() {
    this.getOpSysUserAccountInfoById()
    this.queryOpSysUserLoginLogById()
  },
  methods: {
    getOpSysUserAccountInfoById() {
      systemContainerApi.getOpSysUserAccountInfoById({id: localStorage.getItem('user_id')}).then(res => {
        if (res.subCode === 1000) {
          this.userInfo = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    queryOpSysUserLoginLogById() {
      systemContainerApi.queryOpSysUserLoginLogById(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data ? res.data.list : []
          this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    reSearchHandle(size) {
      this.queryParam.pageSize = size
      this.queryParam.pageNum = 1
      this.queryOpSysUserLoginLogById()
    },
    pageChangeHandle(currentPage) {
      this.queryParam.pageNum = currentPage
      this.queryOpSysUserLoginLogById()
    },
  }
}
</script>


<style lang="scss" scoped>
  .page-container {
    width: 600px;
    margin-left: 30px;
    .el-row {
      margin-bottom: 15px;
    }
    h5 {
      font-size: 16px;
      margin: 60px 0 15px 0;
      padding-bottom: 10px;
      &.cancel-top {
        margin: 0px 0 15px 0;
      }
    }
    .login-ip-sty {
      width: 600px;
    }
  }
</style>

