<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="paramsObj.levelOneDepartment">
              <el-option label="一级部门" value=""></el-option>
              <el-option
                v-for="item in levelOneDepartmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="paramsObj.levelTwoDepartment">
              <el-option label="二级部门" value=""></el-option>
              <el-option
                v-for="item in levelTwoDepartmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="paramsObj.levelThreeDepartment">
              <el-option label="三级部门" value=""></el-option>
              <el-option
                v-for="item in levelThreeDepartmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="paramsObj.levelFourDepartment">
              <el-option label="四级部门" value=""></el-option>
              <el-option
                v-for="item in levelFourDepartmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="paramsObj.name" maxlength="15" placeholder="查询更多层级"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="paramsObj.dataStatus">
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
            <el-input v-model.trim="paramsObj.updateUserName" maxlength="15" placeholder="查询最新更新人"></el-input>
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
        <el-button type="primary" size="small" style="margin-right: 10px" v-permission:[buttonPermissionArr.searchBtn]="['查询']" @click="search">查询</el-button>
        <el-button type="primary" size="small" v-permission:[buttonPermissionArr.searchBtn]="['重置']" @click="resetSearchList">重置</el-button>
      </el-row>
    </el-form>
    <el-row v-if="buttonPermissionArr.upBtn && buttonPermissionArr.upBtn.length" class="btm-distance">
      <el-button type="primary" size="small" @click="addHandle" v-permission:[buttonPermissionArr.upBtn]="['新增']">新增</el-button>
    </el-row>
    <el-table border :data="tableData" v-loading="loading">
      <el-table-column align="center" prop="levelOneDepartmentName" label="一级部门" />
      <el-table-column align="center" prop="levelTwoDepartmentName" label="二级部门" />
      <el-table-column align="center" prop="levelThreeDepartmentName" label="三级部门" />
      <el-table-column align="center" prop="levelFourDepartmentName" label="四级部门" />
      <el-table-column align="center" prop="otherSuperiorDepartmentName" label="更多层级" show-overflow-tooltip />
      <el-table-column align="center" prop="description" label="部门说明" show-overflow-tooltip />
      <el-table-column align="center" prop="dataStatus" :formatter="stateFormat" label="状态" />
      <el-table-column align="center" prop="updateUserName" label="最新更新人" />
      <el-table-column align="center" prop="updateTime" label="更新时间" />
      <el-table-column align="center" label="操作" width="150" v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.dataStatus == 1" v-permission:[buttonPermissionArr.listBtn]="['修改']" @click="modifyHandle(scope.row.id)">修改</el-button>
          <el-button type="text" v-permission:[buttonPermissionArr.listBtn]="['启用', '停用']" @click="modifyStatusHandle(scope.row.id, scope.row.dataStatus)">{{ scope.row.dataStatus == 0 ? '启用' : '停用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        @size-change="reSearchHandle"
        @current-change="pageChangeHandle"
        :current-page="paramsObj.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="paramsObj.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-row>
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { permissionMixin } from '@/mixins/permissionMixin'
import { systemContainerApi } from '@/api/systemManage'
import { getCookieByName } from '@/utils/auth'
import DICT_KEYS from '@/utils/staticEnum'
export default {
  components: { ThreeLevelRoute },
  mixins: [permissionMixin],
  data() {
    return {
      paramsObj: {
        levelOneDepartment: '',
        levelTwoDepartment: '',
        levelThreeDepartment: '',
        levelFourDepartment: '',
        name: '',
        dataStatus: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        updateUserName: '',
        pageSize: 10,
        pageNum: 1
      },
      updateTime: null,
      totalCount: 0,
      statusList: DICT_KEYS.statusList,
      levelOneDepartmentList: [],
      levelTwoDepartmentList: [],
      levelThreeDepartmentList: [],
      levelFourDepartmentList: [],
      tableData: [],
      loading: false
      // 页面所有按钮的权限
      // buttonPermissionArr: []
    }
  },
  mounted() {
    // 判断按钮权限
    // this.buttonPermissionArr = getButtonPermission(this.$route.path)
    if (!this.$route.meta.routerId) {
      // 加个判断解决跳转三级路由时，出触发父级路由的生命周期函数
      systemContainerApi.listLevelDepartments().then(res => {
        if (res.subCode === 1000) {
          this.levelOneDepartmentList = res.data.filter(item => item.level == 1)
          this.levelTwoDepartmentList = res.data.filter(item => item.level == 2)
          this.levelThreeDepartmentList = res.data.filter(item => item.level == 3)
          this.levelFourDepartmentList = res.data.filter(item => item.level == 4)
          this.getSearchList()
        } else {
          this.$message.error(res.subMsg)
        }
      })
    }
  },
  methods: {
    search() {
      this.paramsObj.pageNum = 1
      this.getSearchList()
    },
    getSearchList() {
      systemContainerApi.pageDepartmentsList(this.paramsObj).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data.records
          this.totalCount = res.data.total
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    resetSearchList() {
      this.paramsObj = {
        levelOneDepartment: '',
        levelTwoDepartment: '',
        levelThreeDepartment: '',
        levelFourDepartment: '',
        name: '',
        dataStatus: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        updateUserName: '',
        pageSize: 10,
        pageNum: 1
      }
      this.updateTime = null
      this.getSearchList()
    },
    addHandle() {
      this.$router.push({ path: '/organization/structure/add' })
    },
    modifyHandle(id) {
      this.$router.push({
        path: '/organization/structure/add',
        query: { id }
      })
    },
    modifyStatusHandle(id, dataStatus) {
      this.$confirm('是否确认进行此状态修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        systemContainerApi.updateDeptStatus({ id, dataStatus: dataStatus == 0 ? 1 : 0, userId: localStorage.getItem('user_id') }).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
            this.getSearchList()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    updateTimeChange() {
      if (this.updateTime) {
        this.paramsObj.updateTimeFrom = this.updateTime[0]
        this.paramsObj.updateTimeTo = this.updateTime[1]
      } else {
        this.paramsObj.updateTimeFrom = null
        this.paramsObj.updateTimeTo = null
      }
    },
    reSearchHandle(size) {
      this.paramsObj.pageNum = 1
      this.paramsObj.pageSize = size
      this.getSearchList()
    },
    pageChangeHandle(currentPage) {
      this.paramsObj.pageNum = currentPage
      this.getSearchList()
    },
    stateFormat(row) {
      switch (row.dataStatus) {
        case -1:
          return '删除'
        case 0:
          return '停用'
        case 1:
          return '启用'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
