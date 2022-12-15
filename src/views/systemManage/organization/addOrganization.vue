<template>
  <div class="page-container">
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>部门级别：</span></el-col>
      <el-col :span="9" :offset="1">
        <el-radio v-model="paramsObj.levelOne" label="1">一级部门</el-radio>
      </el-col>
      <el-col :span="9">
        <el-radio v-model="paramsObj.levelOne" label="0">非一级部门</el-radio>
      </el-col>
    </el-row>
    <el-row class="form-flex" v-if="paramsObj.levelOne == '0'">
      <el-col :span="5"><i class="red">*</i><span>上级部门：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-input
          v-model="superiorDepartmentName"
          maxlength="25"
          placeholder="上级部门"
          size="small"
          :class="[validNullArray.includes('superiorDepartment') ? 'null-style' : '']"
          @focus="showDialogHandle">
        </el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>部门名称：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-input
          v-model="paramsObj.name"
          maxlength="15"
          placeholder="部门名称"
          size="small"
          :class="[validNullArray.includes('name') ? 'null-style' : '']">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">部门说明：</el-col>
      <el-col :span="18" :offset="1">
        <el-input maxlength="255" v-model="paramsObj.description" type="textarea"
                  :rows="3"></el-input>
      </el-col>
    </el-row>
    <el-row class="button" type="flex" justify="center">
      <el-button type="primary" @click="confirmHandle">确认</el-button>
      <el-button type="text" @click="returnHandle">返回</el-button>
    </el-row>
    <department-tree-dialog v-if="isShowDialog" :departmentId="paramsObj.superiorDepartment"
                            :departmentTreeData="departmentTreeData" :pageType="pageType"
                            @getDepartmentMsg="getDepartmentMsg" @closDialog="closeDialog"/>
  </div>
</template>
<script>
  import { validNull } from '@/utils/validate'
  import { systemContainerApi } from '@/api/systemManage'
  import departmentTreeDialog from '../components/departmentTreeDalog'

  export default {
    components: {
      departmentTreeDialog
    },
    data() {
      return {
        paramsObj: {
          // 是否一级部门
          levelOne: '0',
          // 上级编号
          superiorDepartment: '',
          // 部门名称
          name: '',
          // 部门说明
          description: ''
        },
        superiorDepartmentName: '',
        // 表单空值验证数组
        validNullArray: [],
        // 开始验证表单
        beginValid: false,
        // 修改id
        modifyId: false,
        isShowDialog: false,
        pageType: 1,
        departmentTreeData: []
      }
    },
    watch: {
      paramsObj: {
        handler() {
          if (this.beginValid) {
            this.validNullArray = validNull(this.paramsObj)
          }
        },
        deep: true
      }
    },
    mounted() {
      if (this.$route.query.id) {
        this.modifyId = this.$route.query.id
        this.getDepartmentsDetail(this.$route.query.id)
      }
      this.listTreeDepartments()
    },
    methods: {
      getDepartmentsDetail(id) {
        systemContainerApi.getDepartmentsDetail({ id }).then(res => {
          if (res.data) {
            this.paramsObj.levelOne = res.data.level == 1 ? '1' : '0'
            this.paramsObj.superiorDepartment = res.data.superiorDepartment
            this.paramsObj.name = res.data.name
            this.paramsObj.description = res.data.description
            this.paramsObj.dataStatus = res.data.dataStatus
            this.superiorDepartmentName = res.data.superiorDepartmentName
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      confirmHandle() {
        this.beginValid = true
        if (this.paramsObj.levelOne == '0') {
          this.validNullArray = validNull(this.paramsObj, ['description'])
        } else {
          this.validNullArray = validNull(this.paramsObj, ['description', 'superiorDepartment'])
        }
        this.paramsObj.userId = localStorage.getItem('user_id')
        if (!this.validNullArray.length) {
          if (this.modifyId) {
            // 修改接口
            systemContainerApi.updateDepartments({ ...this.paramsObj, id: this.modifyId }).then(
              res => {
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
            systemContainerApi.saveDepartments(this.paramsObj).then(res => {
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
        }
      },
      returnHandle() {
        this.$router.go(-1)
      },
      getDepartmentMsg(curDepValue) {
        this.paramsObj.superiorDepartment = curDepValue.id
        this.superiorDepartmentName = curDepValue.name
      },
      showDialogHandle() {
        if (this.$route.query.id) {
          this.pageType = 2
        } else {
          this.pageType = 1
        }
        this.isShowDialog = true
      },
      closeDialog() {
        this.isShowDialog = false
      },
      listTreeDepartments() {
        systemContainerApi.listTreeDepartments().then(res => {
          if (res.data) {
            // 浅拷贝，res.data改变则departmentTreeData也会改变
            this.departmentTreeData = res.data
            this.formateData(res.data)
            // console.log(this.departmentTreeData)
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      formateData(data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == this.modifyId) {
            data.splice(i, 1)
          } else {
            if (data[i].child && data[i].child.length) {
              this.formateData(data[i].child)
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    width: 450px;
    margin: 50px 0 0 90px;

    .el-row {
      margin-bottom: 15px;

      & > .el-col:first-child {
        text-align: right;
      }
    }
  }
</style>

