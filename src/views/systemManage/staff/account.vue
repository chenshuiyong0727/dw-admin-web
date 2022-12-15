<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="queryParam.userAccount" maxlength="20"
                      placeholder="查询账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="queryParam.userRealName" maxlength="5"
                      placeholder="查询员工姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="queryParam.departmentName" maxlength="15"
                      placeholder="查询部门"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="queryParam.postName" maxlength="15"
                      placeholder="查询岗位"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="queryParam.gender">
              <el-option label="性别" value=""></el-option>
              <el-option
                v-for="item in genderList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="item.fieldValue">
              </el-option>
            </el-select>
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
            <el-input v-model.trim="queryParam.updateUserName" maxlength="15"
                      placeholder="查询最新更新人"></el-input>
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
      <el-row v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length"
              type="flex" justify="center">
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['查询']" type="primary" size="small"
                   style="margin-right: 10px" @click="search">查询
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['重置']" type="primary" size="small"
                   @click="resetHandle">重置
        </el-button>
      </el-row>
    </el-form>
    <el-row v-if="buttonPermissionArr.upBtn && buttonPermissionArr.upBtn.length"
            class="btm-distance">
      <el-button v-permission:[buttonPermissionArr.upBtn]="['新增']" type="primary" size="small"
                 @click="addHandle">新增
      </el-button>
    </el-row>
    <el-table height="600" border :data="tableData">
      <el-table-column align="center" prop="userRealName" label="员工名称"/>
      <el-table-column align="center" prop="userAccount" label="账号"/>
      <el-table-column align="center" prop="gender" label="性别">
        <template slot-scope="scope">{{scope.row.gender | dictToDesc('SEX')}}</template>
      </el-table-column>
      <el-table-column align="center" prop="departmentName" label="部门"/>
      <el-table-column align="center" prop="postName" label="岗位"/>
      <el-table-column align="center" prop="roleNames" label="权限角色"/>
      <el-table-column align="center" prop="userMobile" label="联系电话"/>
      <el-table-column align="center" prop="userEmail" label="联系邮箱"/>
      <el-table-column align="center" prop="dataStatus" :formatter="dataFormat" label="状态"/>
      <el-table-column align="center" prop="updateUserName" label="最新更新人"/>
      <el-table-column align="center" prop="updateTime" label="更新时间"/>
      <el-table-column fixed="right" align="center" label="操作" width="180"
                       v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.dataStatus == 1"
                     v-permission:[buttonPermissionArr.listBtn]="['修改']"
                     @click="modifyHandle(scope.row.id)">修改
          </el-button>
          <el-button type="text" v-permission:[buttonPermissionArr.listBtn]="['重置密码']"
                     @click="resetPwd(scope.row.id)">重置密码
          </el-button>
          <el-button type="text" v-permission:[buttonPermissionArr.listBtn]="['启用', '停用']"
                     @click="updateStatus(scope.row.id, scope.row.dataStatus)">{{
            scope.row.dataStatus == 0 ? '启用' : '停用' }}
          </el-button>
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
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { permissionMixin } from '@/mixins/permissionMixin'
  import { systemContainerApi } from '@/api/systemManage'
  import DICT_KEYS from '@/utils/staticEnum'

  export default {
    components: { ThreeLevelRoute },
    mixins: [permissionMixin],
    data() {
      return {
        queryParam: {
          userAccount: '',
          userRealName: '',
          departmentName: '',
          postName: '',
          gender: '',
          dataStatus: '',
          updateUserName: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          pageSize: 10,
          pageNum: 1
        },
        totalCount: 1,
        updateTime: null,
        genderList: [],
        statusList: [
          { key: '删除', value: -1 },
          { key: '禁用', value: 0 },
          { key: '正常', value: 1 }
        ],
        tableData: []
      }
    },
    mounted() {
      if (!this.$route.meta.routerId) {
        this.pageListOpUser()
        this.listSysDict()
      }
    },
    methods: {
      search() {
        this.queryParam.pageNum = 1
        this.pageListOpUser()
      },
      resetHandle() {
        this.queryParam = {
          userAccount: '',
          userRealName: '',
          departmentName: '',
          postName: '',
          gender: '',
          dataStatus: '',
          updateUserName: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          pageSize: 10,
          pageNum: 1
        }
        this.updateTime = null
        this.pageListOpUser()
      },
      listSysDict() {
        // commonApi.listSysDict().then(res => {
        //   if (res.subCode === 1000) {
        //     this.genderList = res.data.filter(item => item.typeValue == DICT_KEYS.SEX)
        //   } else {
        //     this.$message.error(res.subMsg)
        //   }
        // })
        this.genderList = localStorage.getItem('sysDictList') ? JSON.parse(
          localStorage.getItem('sysDictList')).filter(item => item.typeValue == DICT_KEYS.SEX) : []
      },
      resetPwd(id) {
        systemContainerApi.resetUserPwd({ id }).then(res => {
          if (res.subCode === 1000) {
            this.$alert('<p>账号：' + res.data.userAccount + '</p><p>密码：' + res.data.passWord + '</p>',
              '重置密码', {
                dangerouslyUseHTMLString: true,
                showConfirmButton: false

              })
          }
        })
      },
      pageListOpUser() {
        systemContainerApi.pageListOpUser(this.queryParam).then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data.records
            this.totalCount = res.data.total
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      addHandle() {
        this.$router.push({ path: '/staff/account/add' })
      },
      modifyHandle(id) {
        this.$router.push({ path: '/staff/account/add', query: { id } })
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
          systemContainerApi.updateUserStatus(
            { id, dataStatus: dataStatus == 0 ? 1 : 0, sysUserId: userId }).then(res => {
            if (res.subCode === 1000) {
              this.$message({
                type: 'success',
                message: '状态修改成功'
              })
              this.pageListOpUser()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      },
      dataFormat(row) {
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
        this.pageListOpUser()
      },
      pageChangeHandle(currentPage) {
        this.queryParam.pageNum = currentPage
        this.pageListOpUser()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
