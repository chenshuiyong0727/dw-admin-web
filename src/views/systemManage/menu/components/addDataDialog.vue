<template>
  <el-dialog
    :title="requestParam.id ? '修改数据' : '填写数据'"
    :visible.sync="dialogVisible"
    width="60%"
    center
    @close="closDialog">
    <el-form ref="form" :model="requestParam"  label-width="105px" :rules="rules"
             class="menuManagement-edit-container">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="上级菜单" prop="pname">
            <el-input v-model="requestParam.pname" :readonly="true"  @click.native="showParentMenu"
            >
              <el-button type="primary"  slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="菜单名称" prop="functionName">
            <el-input
              v-model="requestParam.functionName">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="排序" prop="sort">
            <el-input  v-input-validation
              v-model="requestParam.sort"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="路由" prop="route">
            <el-input
              v-model="requestParam.route"
            ></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">-->
<!--          <el-form-item label="权限描述" prop="functionName" >-->
<!--            <el-input :disabled="true"-->
<!--              v-model="requestParam.functionName"-->
<!--            ></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">-->
<!--          <el-form-item label="权限标签" prop="functionName">-->
<!--            <el-input :disabled="true"-->
<!--              v-model="requestParam.functionName"-->
<!--            ></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="权限类型" prop="functionType">
            <el-select v-model="requestParam.functionType" style="width:100%; display:inline-block" size="small">
              <el-option
                v-for="item in authList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="操作类型" prop="operationType">
            <el-select v-model="requestParam.operationType" style="width:100%; display:inline-block" size="small">
              <el-option
                v-for="item in opList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="菜单键值" prop="functionKey">
            <el-input
              v-model="requestParam.functionKey"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="本地路径" prop="locationPath">
            <el-input
              v-model="requestParam.locationPath"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmHandle" size="small">确 定</el-button>
    </span>
    <menu-management-choose
      ref="menu-management-choose"
      @menuChoose="menuChoose"
    ></menu-management-choose>
  </el-dialog>
</template>
<script>
import { systemContainerApi } from '@/api/systemManage'
import MenuManagementChoose from './MenuManagementChoose'

import DICT_KEYS from '@/utils/staticEnum'
export default {
  components: {MenuManagementChoose },
  props: {
    isRoot: {
      type: Number
    },
    systemId: {
      type: Number
    },
    modifyId: {
      type: String,
      default: ''
    },
    pData: {
      type: Object
    }
  },
  data() {
    return {
      parentMenu: {},
      dialogVisible: true,
      requestParam: {
        id: '',
        pid: 0,
        oldpid: 0,
        newpid: '',
        systemId: '',
        pname: '',
        functionName: '',
        functionKey: '',
        sort: '',
        route: '',
        functionType: '',
        operationType: '',
        functionDesc: '',
        functionLabel: '',
        locationPath: ''
      },
      authList: [],
      opList: [],
      rules: {
        pname: [{ required: true, trigger: 'blur', message: '请选择上级菜单' }],
        functionName: [{ required: true, trigger: 'blur', message: '请输入菜单名称' }],
        functionKey: [{ required: true, trigger: 'blur', message: '请输入菜单键值' }],
        sort: [{ required: true, trigger: 'blur', message: '请输入排序' }],
        locationPath: [{ required: true, trigger: 'blur', message: '请输入本地路径' }],
        // functionDesc: [{ required: true, trigger: 'blur', message: '请输入权限描述' }],
        // functionLabel: [{ required: true, trigger: 'blur', message: '请输入权限标签' }],
        functionType: [{ required: true, trigger: 'blur', message: '请选择权限类型' }],
        operationType: [{ required: true, trigger: 'blur', message: '请选择操作类型' }]
      }
    }
  },
  mounted() {
    let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(localStorage.getItem('sysDictList')) : []
    this.authList = sysDictList.filter(item => item.typeValue == DICT_KEYS.AUTHTYPE)
    this.opList = sysDictList.filter(item => item.typeValue == DICT_KEYS.OPTYPE)
    if (this.systemId) {
      this.requestParam.systemId = this.systemId
    }
    if (this.modifyId) {
      let id = this.modifyId
      systemContainerApi.getMenuDetail({ id }).then(res => {
        if (res.subCode === 1000) {
          this.requestParam = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    }
    if (this.pData && this.pData.id) {
      this.requestParam.pid = this.pData.id
      this.requestParam.oldpid = this.pData.id
      this.requestParam.pname = this.pData.functionName
    }
    if (this.isRoot === 1) {
      this.requestParam.pname = '根菜单'
      this.requestParam.pid = 0
    }
  },
  methods: {
    menuChoose(node){
      this.parentMenu = node
      this.requestParam.newpid = this.parentMenu.id
      this.requestParam.pid = this.parentMenu.id
      this.requestParam.pname = this.parentMenu.functionLabel
    },
    showParentMenu() {
      this.$refs['menu-management-choose'].showMenuChoose(this.requestParam.id, this.requestParam.systemId)
    },
    closDialog() {
      this.$emit('closDialog')
      this.dialogVisible = false
      this.requestParam.id = ''
      this.requestParam.pid = 0
      this.requestParam.oldpid = 0
      this.requestParam.pname = ''
    },
    confirmHandle() {
      this.$refs['form'].validate(async(valid) => {
        if (!valid) {
          return false
        }
        this.requestParam.functionDesc = this.requestParam.functionName
        this.requestParam.functionLabel = this.requestParam.functionName
        if (this.requestParam.id) {
          systemContainerApi.update(this.requestParam).then((res) => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              if (this.requestParam.newpid && this.requestParam.oldpid != this.requestParam.newpid) {
                this.$emit('refreshPage', this.requestParam.pid, true)
              } else {
                this.$emit('refreshPage', this.requestParam.pid)
              }
            } else {
              this.$message.error(res.subMsg)
            }
          })
        } else {
          systemContainerApi.add(this.requestParam).then((res) => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              if (this.requestParam.oldpid) {
                this.$emit('refreshPage',this.requestParam.pid)
              } else {
                this.$emit('refreshPage', this.requestParam.pid, true)
              }
            } else {
              this.$message.error(res.subMsg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog__header,::v-deep .el-dialog__body {
    border-bottom: 1px solid #ddd;
  }
  .el-row {
    margin-bottom: 20px
  }
</style>
