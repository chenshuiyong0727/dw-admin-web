<template>
  <div class="page-container">
    <el-row type="flex"  justify="space-between" class="top-flex" >
      <h5  v-if="type == 1">详情</h5>
      <h5  v-if="type == 2">编辑</h5>
      <h5  v-if="type == 3">新增</h5>
      <el-button size="small" style="margin-right: 10px ; margin-bottom: 10px" @click="goBack()">返回列表</el-button>
    </el-row>
    <el-form ref="form" :model="form"  :rules="rules" label-width="150px">
      <el-row class="form-flex">
        <el-col>
          <el-form-item   prop="type" label="类型"    class="is-required" >
            <el-select v-model="form.type"  :disabled="type == 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in typeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item   prop="waitType" label="是否待办 ：是1否-1"    class="is-required" >
            <el-select v-model="form.waitType"  :disabled="type == 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in waitTypeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="userId" label="用户编号，统一用户表的用户编号"    class="is-required" >
            <el-input v-model="form.userId" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="title" label="标题"    class="is-required" >
            <el-input v-model="form.title" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item   prop="content" label="内容"    class="is-required" >
            <el-input type="textarea" :rows="4"  maxlength="140"  size="small"
                      :disabled="type == 1 " v-model="form.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="uniPushCid" label="推送cid"    class="is-required" >
            <el-input v-model="form.uniPushCid" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="requestId" label="推送request_id"    class="is-required" >
            <el-input v-model="form.requestId" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button-group v-if="type != 1">
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button  @click="goBack()">取消</el-button>
        </el-button-group>
        <el-button-group v-else>
          <el-button  type="primary"  @click="goEdit">编辑</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { baseMsgApi } from '@/api/baseMsg'
  import { validatorRule } from '@/utils/validateRlue'
  export default {
    data() {
      return {
        form: {
      type: '',
      waitType: '',
      userId: '',
      title: '',
      content: '',
      uniPushCid: '',
      requestId: '',
    },
      typeList: [],
      waitTypeList: [],
      type: '',
        id: '',
        rules: {
        type: [
        { required: true, trigger: 'blur', message: '类型非空' },
      ],
        waitType: [
        { required: true, trigger: 'blur', message: '是否待办 ：是1否-1非空' },
      ],
        userId: [
        { required: true, trigger: 'blur', message: '用户编号，统一用户表的用户编号非空' },
      ],
        title: [
        { required: true, trigger: 'blur', message: '标题非空' },
      ],
        content: [
        { required: true, trigger: 'blur', message: '内容非空' },
      ],
        uniPushCid: [
        { required: true, trigger: 'blur', message: '推送cid非空' },
      ],
        requestId: [
        { required: true, trigger: 'blur', message: '推送request_id非空' },
      ],
      }
    }
    },
    created() {
      const { id, type } = this.$route.query
      this.id = id
      this.type = type
      this.form.id = id
      if (this.id) {
        this.getDetailById(this.id)
      }
    },
    mounted() {
      this.listSysDict()
    },
    methods: {
      getDetailById(id) {
        if (id) {
          baseMsgApi.getDetailById(id).then(res => {
            if (res.subCode === 1000) {
              this.form = res.data ? res.data : {}
            } else {
              this.$message.error(res.subMsg)
            }
          })
        }
      },
      listSysDict() {
        let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(localStorage.getItem('sysDictList')) : []
        this.typeList = sysDictList.filter(item => item.typeValue == 52)
        this.waitTypeList = sysDictList.filter(item => item.typeValue == 53)
      },
      goBack() {
        // *** 根据真实路径配置地址
        this.$router.push({path: '/more/baseMsg'})
      },
      goEdit() {
        this.type = 2
      },
      submit() {
        this.$refs['form'].validate(async(valid) => {
          if (!valid) {
            return false
          }
          if (this.type == 2) {
            baseMsgApi.update(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          } else {
            baseMsgApi.add(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
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
<style>
  h5 {
    font-size: 16px;
    padding-bottom: 10px;
  }
</style>
