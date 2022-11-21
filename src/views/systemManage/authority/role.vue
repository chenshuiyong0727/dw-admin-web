<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="queryParam.systemId">
              <el-option label="所属系统" value=""></el-option>
              <el-option
                v-for="item in systemList"
                :key="item.systemName"
                :label="item.systemName"
                :value="item.systemId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="queryParam.roleName" maxlength="15" placeholder="查询权限角色"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="queryParam.dataStatus">
              <el-option label="状态" value=""></el-option>
              <el-option
                v-for="item in statusList"
                :key="item.key"
                :label="item.key"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="queryParam.updateUserName" maxlength="15" placeholder="查询最新更新人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <!-- <el-input v-model="paramsObj.updateTime" placeholder="查询最新更新时间"></el-input> -->
            <el-date-picker
              v-model="updateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="updateTimeChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length" type="flex" justify="center">
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['查询']" type="primary" size="small" style="margin-right: 10px" @click="getRolesList">查询</el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['重置']" type="primary" size="small" @click="resetHandle">重置</el-button>
      </el-row>
    </el-form>
    <el-row v-if="buttonPermissionArr.upBtn && buttonPermissionArr.upBtn.length" class="btm-distance">
      <el-button v-permission:[buttonPermissionArr.upBtn]="['新增']" type="primary" size="small" @click="addHandle">新增</el-button>
    </el-row>
    <el-table border :data="tableData">
      <el-table-column align="center" prop="systemName" label="所属系统" show-overflow-tooltip />
      <el-table-column align="center" prop="roleName" label="权限角色" show-overflow-tooltip />
      <!-- <el-table-column align="center" prop="description" label="角色说明" /> -->
      <el-table-column align="center" prop="dataStatus" :formatter="statusFormat" label="状态" />
      <el-table-column align="center" prop="updateUserName" label="最新更新人" />
      <el-table-column align="center" prop="updateTime" label="更新时间" />
      <el-table-column align="center" label="操作" width="200" v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.dataStatus == 1" v-permission:[buttonPermissionArr.listBtn]="['修改']" @click="modifyHandle(scope.row.id, scope.row.systemId)">修改</el-button>
          <el-button type="text" v-permission:[buttonPermissionArr.listBtn]="['查看关联']" @click="showDialog(scope.row.id)">查看关联</el-button>
          <el-button type="text" v-permission:[buttonPermissionArr.listBtn]="['启用', '停用']" @click="updateStatus(scope.row.id, scope.row.dataStatus)">{{ scope.row.dataStatus == 0 ? '启用' : '停用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        @size-change="reSearchHandle"
        @current-change="pageChangeHandle"
        :current-page="queryParam.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-row>
    <linked-account-dialog v-if="isShowDialog" @closDialog="closDialog" :roleId="roleId"></linked-account-dialog>
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import linkedAccountDialog from './components/linkedAccountDialog'
import { systemContainerApi } from '@/api/systemManage'
import { getCookieByName } from '@/utils/auth'
import { permissionMixin } from '@/mixins/permissionMixin'
export default {
  components: { ThreeLevelRoute, linkedAccountDialog },
  mixins: [permissionMixin],
  data() {
    return {
      queryParam: {
        dataStatus: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        roleName: '',
        systemId: '',
        pageSize: 10,
        pageNum: 1
      },
      totalCount: 1,
      roleId: '',
      updateTime: null,
      isShowDialog: false,
      systemList: [],
      statusList: [{ key: '删除', value: -1 }, { key: '禁用', value: 0 }, { key: '正常', value: 1 }],
      tableData: []
    }
  },
  mounted() {
    if (!this.$route.meta.routerId) {
      this.getRolesList()
      this.getOpSystemList()
    }
  },
  methods: {
    resetHandle() {
      this.queryParam = {
        dataStatus: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        roleName: '',
        pageSize: 10,
        pageNum: 1
      }
      this.updateTime = null
      this.getRolesList()
      this.getOpSystemList()
    },
    closDialog() {
      this.isShowDialog = !this.isShowDialog
    },
    showDialog(id) {
      this.roleId = id
      this.isShowDialog = true
    },
    getRolesList() {
      systemContainerApi.pageListOpRole(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data.records
          this.totalCount = res.data.total
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getOpSystemList() {
      systemContainerApi.getOpSystemList().then(res => {
        if (res.subCode === 1000) {
          this.systemList = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    addHandle() {
      this.$router.push({ path: '/authority/role/add' })
    },
    updateTimeChange() {
      if (this.updateTime) {
        this.queryParam.updateTimeFrom = this.updateTime[0]
        this.queryParam.updateTimeTo = this.updateTime[1]
      } else {
        this.queryParam.updateTimeFrom = null
        this.queryParam.updateTimeTo = null
      }
    },
    updateStatus(id, dataStatus) {
      this.$confirm('是否确认进行此状态修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userId = localStorage.getItem('user_id')
        systemContainerApi.updateRoleStatus({id, dataStatus: dataStatus == 0 ? 1 : 0, userId}).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
            this.getRolesList()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    modifyHandle(id, systemId) {
      this.$router.push({ path: '/authority/role/add', query: { id, systemId } })
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
    },
    reSearchHandle(size) {
      this.queryParam.pageSize = size
      this.queryParam.pageNum = 1
      this.getRolesList()
    },
    pageChangeHandle(currentPage) {
      this.queryParam.pageNum = currentPage
      this.getRolesList()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
