<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-input v-model.trim="queryParam.name" maxlength="10" placeholder="查询岗位名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-cascader ref="owner" placeholder="查询归属部门" v-model="departmentIdVal" :options="options" :props="props" size="small" :show-all-levels="false"></el-cascader>
          <!-- <el-form-item label="" size="small">
            <el-select v-model="queryParam.departmentId">
              <el-option label="查询归属部门" value=""></el-option>
              <el-option
                v-for="item in departmentIdList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId">
              </el-option>
            </el-select>
          </el-form-item> -->
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="queryParam.type">
              <el-option label="查询岗位分类" value=""></el-option>
              <el-option
                v-for="item in postsList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="item.fieldValue">
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
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['查询']" type="primary" size="small" style="margin-right: 10px" @click="pageListOpPost">查询</el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['重置']" type="primary" size="small" @click="resetHandle">重置</el-button>
      </el-row>
    </el-form>
    <el-row v-if="buttonPermissionArr.upBtn && buttonPermissionArr.upBtn.length" class="btm-distance">
      <el-button v-permission:[buttonPermissionArr.upBtn]="['新增']" type="primary" size="small" @click="addHandle">新增</el-button>
    </el-row>
    <el-table border :data="tableData">
      <el-table-column align="center" prop="name" label="岗位名称" />
      <el-table-column align="center" prop="description" label="岗位说明" show-overflow-tooltip />
      <el-table-column align="center" prop="type" label="岗位分类">
        <template slot-scope="scope">{{scope.row.type | dictToDesc('JOB')}}</template>
      </el-table-column>
      <el-table-column align="center" prop="departmentName" label="关联部门" />
      <el-table-column align="center" prop="dataStatus" :formatter="dataFormat" label="状态" />
      <el-table-column align="center" prop="updateUserName" label="最新更新人" />
      <el-table-column align="center" prop="updateTime" label="更新时间" />
      <el-table-column align="center" label="操作" width="150" v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.dataStatus == 1" v-permission:[buttonPermissionArr.listBtn]="['修改']" @click="modifyHandle(scope.row.id)">修改</el-button>
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
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { systemContainerApi } from '@/api/systemManage'
import { permissionMixin } from '@/mixins/permissionMixin'
import { getCookieByName } from '@/utils/auth'
import DICT_KEYS from '@/utils/staticEnum'
export default {
  components: { ThreeLevelRoute },
  mixins: [permissionMixin],
  data() {
    return {
      queryParam: {
        name: '',
        departmentId: '',
        type: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        updateUserName: '',
        leveal: '',
        pageSize: 10,
        pageNum: 1
      },
      departmentIdVal: [],
      totalCount: 1,
      updateTime: null,
      departmentIdList: [],
      postsList: [],
      // typeList: [
      //   {key: '管理', value: 1},
      //   {key: '专业', value: 2}
      // ],
      tableData: [],
      props: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        children: 'child'
      },
      options: []
    }
  },
  mounted() {
    if (!this.$route.meta.routerId) {
      let sysDictList = sessionStorage.getItem('sysDictList') ? JSON.parse(sessionStorage.getItem('sysDictList')) : []
      this.postsList = sysDictList.filter(item => item.typeValue == DICT_KEYS.JOB)
      this.listDropDownDepartments()
      // this.listDropDownPosts()
      this.pageListOpPost()
    }
  },
  methods: {
    resetHandle() {
      this.queryParam = {
        name: '',
        departmentId: '',
        type: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        updateUserName: '',
        leveal: '',
        pageSize: 10,
        pageNum: 1
      }
      this.departmentIdVal = []
      this.updateTime = null
      this.pageListOpPost()
    },
    listDropDownDepartments() {
      systemContainerApi.listTreeDepartments().then(res => {
        if (res.subCode === 1000) {
          console.log(res.data)
          let formateData = function (arr) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].child && !arr[i].child.length) {
                delete arr[i].child
              } else {
                formateData(arr[i].child)
              }
            }
          }
          formateData(res.data)
          this.options = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    // listDropDownPosts() {
    //   systemContainerApi.listDropDownPosts().then(res => {
    //     if (res.subCode === 1000) {
    //       this.postsList = res.data
    //     } else {
    //       this.$message.error(res.subMsg)
    //     }
    //   })
    // },
    addHandle() {
      this.$router.push({ path: '/organization/job/add' })
    },
    pageListOpPost() {
      this.queryParam.departmentId = this.departmentIdVal.length ? this.departmentIdVal[this.departmentIdVal.length - 1] : ''
      systemContainerApi.pageListOpPost(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data.records
          this.totalCount = res.data.total
        } else {
          this.$message.error(res.subMsg)
        }
      })
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
        let userId = getCookieByName('user_id')
        systemContainerApi.updatePostStatus({id, dataStatus: dataStatus == 0 ? 1 : 0, userId}).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
            this.pageListOpPost()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    modifyHandle(id) {
      this.$router.push({ path: '/organization/job/add', query: { id } })
    },
    dataFormat(row) {
      switch (row.dataStatus) {
        case 0:
          return '禁用'
        case 1:
          return '正常'
      }
    },
    reSearchHandle(size) {
      this.queryParam.pageSize = size
      this.queryParam.pageNum = 1
      this.pageListOpPost()
    },
    pageChangeHandle(currentPage) {
      this.queryParam.pageNum = currentPage
      this.pageListOpPost()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
