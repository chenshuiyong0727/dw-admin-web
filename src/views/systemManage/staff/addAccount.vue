<template>
  <div class="page-container">
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>员工账号：</span></el-col>
      <el-col :span="18" :offset="1"><el-input maxlength="10" v-model="param.userAccount" placeholder="员工名称" size="small"></el-input></el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>员工名称：</span></el-col>
      <el-col :span="18" :offset="1"><el-input maxlength="5" v-model="param.userRealName" placeholder="员工名称" size="small"></el-input></el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>性别：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-select v-model="param.gender" style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in genderList"
            :key="item.fieldValue"
            :label="item.fieldName"
            :value="+item.fieldValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>部门：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-select @focus="showDialogHandle" v-model="param.departmentId" style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in departmentList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>岗位名称：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-select v-model="param.postId" style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in postList"
            :key="item.postId"
            :label="item.postName"
            :value="item.postId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>员工类型：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-select v-model="param.staffType" style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in employeeTypeList"
            :key="item.fieldValue"
            :label="item.fieldName"
            :value="+item.fieldValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>联系邮箱：</span></el-col>
      <el-col :span="10" :offset="1"><el-input maxlength="10" v-model="param.userEmail" placeholder="邮箱前缀" size="small"></el-input></el-col>
      <el-col :span="7" :offset="1">@hj-health.cn</el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>联系电话：</span></el-col>
      <el-col :span="18" :offset="1"><el-input v-input-validation v-model="param.userMobile" maxlength="11" placeholder="联系电话" size="small"></el-input></el-col>
    </el-row>
    <!-- <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>角色：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-select v-model="param.roleIds" multiple style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select>
      </el-col>
    </el-row> -->
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>角色：</span></el-col>
      <el-col :span="18" :offset="1"><el-cascader ref="owner" v-model="roleIds" :options="options" @change="getOwner" :show-all-levels="true" :props="props" size="small"  style="width:100%; display:inline-block"></el-cascader></el-col>
    </el-row>
    <el-row class="button" type="flex" justify="center">
      <el-button type="primary" @click="confirmHandle">确认</el-button>
      <el-button type="text" @click="returnPage">返回</el-button>
    </el-row>
    <department-tree-dialog v-if="isShowDialog" :departmentId="param.departmentId" :departmentTreeData="departmentTreeData" :pageType="pageType" @getDepartmentMsg="getDepartmentMsg" @closDialog="closeDialog" />
  </div>
</template>
<script>
// import DICT_KEYS from '@/utils/staticEnum'
import { systemContainerApi } from '@/api/systemManage'
import { getCookieByName } from '@/utils/auth'
import { commonApi } from '@/api/common'
import DICT_KEYS from '@/utils/staticEnum'
import departmentTreeDialog from '../components/departmentTreeDalog'
export default {
  components: {
    departmentTreeDialog
  },
  data() {
    return {
      roleList: [],
      departmentList: [],
      postList:[],
      genderList: [],
      // employeeTypeList: DICT_KEYS.employeeTypeList,
      employeeTypeList: [],
      param: {
        level: '',
        userAccount: '',
        userRealName: '',
        gender: '',
        departmentId: '',
        postId: '',
        staffType: '',
        userEmail: '',
        userMobile: '',
        // customerCare: '',
        roleIds: []
      },
      roleIds: [],
      systemId: 1,
      modifyId: '',
      isShowDialog: false,
      departmentTreeData: [],
      pageType: 1,
      props: {
        lazy: false,
        multiple: true
      },
      options: []
    }
  },
  mounted() {
    this.init()
    if (this.$route.query.id) {
      this.modifyId = this.$route.query.id
      this.getOpSysUserById(this.$route.query.id)
    }
  },
  methods: {
   
    getOwner() {
      // let tempObj = this.$refs.owner.getCheckedNodes()[0]
      // console.log(this.roleIds)
      // if (tempObj) {
      //   this.param.roleIds.push(tempObj.value)
      // }
      this.param.roleIds = []
      for (let i = 0; i < this.roleIds.length; i++) {
        this.param.roleIds.push(this.roleIds[i][1])
      }
    },
    returnPage(){
      this.$router.go(-1)
    },
    init() {
      systemContainerApi.listDropDownDepartments().then(res => {
        if (res.subCode === 1000) {
          this.departmentList = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
      systemContainerApi.listTreeDepartments().then(res => {
        if (res.data) {
          this.departmentTreeData = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
      let systemList = sessionStorage.getItem('systemList') ? JSON.parse(sessionStorage.getItem('systemList')) : []
      let options = []
      for (let i = 0; i < systemList.length; i++) {
        systemContainerApi.listDropDownRoles({ systemId: systemList[i].systemId }, false).then (res => {
          if (res.subCode === 1000) {
            options.push({
              label: systemList[i].systemName,
              value: systemList[i].systemId,
              children: res.data.map(item => {
                return {
                  value: item.roleId,
                  label: item.roleName
                }
              })
            })
          }
        })
      }
      this.options = options
      // 根据系统id得到角色列表
      // systemContainerApi.listDropDownRoles({
      //   systemId: this.systemId
      // }).then(res => {
      //   if (res.subCode === 1000) {
      //     this.roleList = res.data
      //   } else {
      //     this.$message.error(res.subMsg)
      //   }
      // })
      let sysDictList = sessionStorage.getItem('sysDictList') ? JSON.parse(sessionStorage.getItem('sysDictList')) : []
      this.genderList = sysDictList.filter(item => item.typeValue == DICT_KEYS.SEX)
      this.employeeTypeList = sysDictList.filter(item => item.typeValue == DICT_KEYS.EMPLOYEE)
    },
    getOpSysUserById(id) {
      systemContainerApi.getOpSysUserById({ id }).then(res => {
        if (res.subCode === 1000) {
          console.log(res.data)
          this.param = res.data
          this.param.roleIds = []
          this.roleIds = res.data.systemAndRoleIds
          for (let i = 0; i < res.data.systemAndRoleIds.length; i++) {
            this.param.roleIds.push(res.data.systemAndRoleIds[i][1])
          }
          this.changeVauleHandle(res.data.departmentId, false)
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    confirmHandle() {
      if (!this.param.userAccount) {
        return this.$message.error('请填写员工账号')
      } else if (!this.param.userRealName) {
        return this.$message.error('请填写员工名称')
      } else if (this.param.gender === null || this.param.gender === '') {
        return this.$message.error('请选择性别')
      } else if (!this.param.departmentId) {
        return this.$message.error('请选择部门')
      } else if (!this.param.postId) {
        return this.$message.error('请选择岗位名称')
      } else if (this.param.staffType === null || this.param.staffType === '') {
        return this.$message.error('请选择员工类型')
      } else if (!this.param.userEmail) {
        return this.$message.error('请填写联系邮箱')
      } else if (!this.param.userMobile) {
        return this.$message.error('请填写联系电话')
      } else if (!this.param.roleIds.length) {
        return this.$message.error('请选择角色')
      }
      this.param.sysUserId = getCookieByName('user_id')
      // this.param.customerCare = this.param.customerCare ? 1 : 0
      if (this.modifyId) {
        // 修改接口
        systemContainerApi.updateOpSysUser({ ...this.param, id: this.modifyId }).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              message: '修改成功，即将返回',
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            this.$message.error(res.subMsg)
          }
        })

      } else {
        // 新增接口
        systemContainerApi.saveOpSysUser(this.param).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              message: '新增成功，即将返回',
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            this.$message.error(res.subMsg)
          }
        })
      }
    },
    changeVauleHandle(value, resetVal = true) {
      systemContainerApi.listDropDownPosts({departmentId: value}).then(res => {
        if (res.subCode === 1000) {
          if (resetVal) {
            this.param.postId = ''
          }
          this.postList = res.data ? res.data : []
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getDepartmentMsg(curDepValue) {
      this.param.departmentId = curDepValue.id
      this.changeVauleHandle(curDepValue.id)
    },
    closeDialog() {
      this.isShowDialog = false
    },
    showDialogHandle() {
      if (this.$route.query.id) {
        this.pageType = 2
      } else {
        this.pageType = 1
      }
      this.isShowDialog = true
    },
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    width: 450px;
    margin: 50px 0 0 90px;
    .el-row {
      margin-bottom: 15px;
      &>:first-child {
        text-align: right;
      }
    }
    .tips {
      font-size: 12px;
      color: rgb(39, 35, 235);
    }
  }
</style>

