<template>
  <div class="page-container">
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>岗位名称：</span></el-col>
      <el-col :span="18" :offset="1"><el-input maxlength="15" v-model="queryParam.name" placeholder="岗位名称" size="small"></el-input></el-col>
    </el-row>
    <el-row>
      <el-col :span="5"><i class="red">*</i><span>岗位说明：</span></el-col>
      <el-col :span="18" :offset="1"><el-input maxlength="255" v-model="queryParam.description" type="textarea" :rows="3"></el-input></el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>岗位分类：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-select v-model="queryParam.type" style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in typeList"
            :key="item.fieldValue"
            :label="item.fieldName"
            :value="+item.fieldValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>关联部门：</span></el-col>
      <el-col :span="18" :offset="1" class="cus-select">
        <div class="show-tree" @click="showDialogHandle"></div>
        <el-select multiple v-model="departmentId" style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in departmentIdList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId">
          </el-option>
        </el-select>
        <!-- <el-select v-model="queryParam.departmentId" style="width:100%; display:inline-block" size="small">
          <el-option
            v-for="item in departmentIdList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId">
          </el-option>
        </el-select> -->
      </el-col>
    </el-row>
    <el-row class="button" type="flex" justify="center">
      <el-button type="primary" @click="confirmHandle">确认</el-button>
      <el-button type="text" @click="goBack">返回</el-button>
    </el-row>
    <department-tree-dialog v-if="isShowDialog" :departmentTreeData="departmentTreeData" :departmentId="departmentId" :pageType="pageType" @getDepartmentMsg="getDepartmentMsg" @closDialog="closeDialog" />
  </div>
</template>
<script>
import { systemContainerApi } from '@/api/systemManage'
import { getCookieByName } from '@/utils/auth'
import departmentTreeDialog from '../components/departmentTreeDalog2'
import DICT_KEYS from '@/utils/staticEnum'
export default {
  components: {
    departmentTreeDialog
  },
  data() {
    return {
      modifyId: '',
      typeList: [],
      departmentIdList: [],
      queryParam: {
        name: '',
        description: '',
        type: '',
        departmentId: '',
        dataStatus: 1
      },
      departmentId: [],
      isShowDialog: false,
      departmentTreeData: []
    }
  },
  mounted() {
    let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(localStorage.getItem('sysDictList')) : []
    this.typeList = sysDictList.filter(item => item.typeValue == DICT_KEYS.JOB)
    this.listDropDownDepartments()
    this.listTreeDepartments()
  },
  methods: {
    listDropDownDepartments() {
      systemContainerApi.listDropDownDepartments().then(res => {
        if (res.subCode === 1000) {
          this.departmentIdList = res.data
          if (this.$route.query.id) {
            this.modifyId = this.$route.query.id
            this.getOpPostById(this.$route.query.id)
          }
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getOpPostById(id) {
      systemContainerApi.getOpPostById({ id }).then(res => {
        if (res.subCode === 1000) {
          console.log(res.data)
          this.queryParam = res.data
          this.departmentId = res.data.departmentId.split(';')
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    confirmHandle() {
      this.queryParam.userId = localStorage.getItem('user_id')
      if (!this.queryParam.name) {
        return this.$message.error('请填写岗位名称')
      } else if (!this.queryParam.description) {
        return this.$message.error('请填写岗位说明')
      } else if (!this.queryParam.type) {
        return this.$message.error('请选择岗位分类')
      } else if (!this.queryParam.departmentId) {
        return this.$message.error('请选择关联部门')
      }
      if (this.modifyId) {
        // 修改
        this.queryParam.id = this.modifyId
        systemContainerApi.updatePost(this.queryParam).then(res => {
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
        systemContainerApi.savePost(this.queryParam).then(res => {
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
    goBack() {
      this.$router.go(-1)
    },
    getDepartmentMsg(curDepValue) {
      this.queryParam.departmentId = curDepValue
      this.departmentId = curDepValue.split(';')
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
          this.departmentTreeData = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
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
    }
    .cus-select {
      position: relative;
      .show-tree {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        cursor: pointer;
        opacity: 0;
      }
    }
  }
</style>

