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
        <el-col :span="10">
          <el-form-item  prop="keyName" label="键"    class="is-required" >
            <el-input v-model="form.keyName" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-row class="form-flex">-->
<!--        <el-col :span="10">-->
<!--          <el-form-item  prop="keyValue" label="值"    class="is-required" >-->
<!--            <el-input v-model="form.keyValue" :disabled="type == 1 "></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row class="form-flex">-->
<!--        <el-col :span="10">-->
<!--          <el-form-item  prop="remark" label="备注"  >-->
<!--            <el-input v-model="form.remark" :disabled="type == 1 "></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="keyValue" label="值">
            <el-input type="textarea" :rows="10" maxlength="4000" size="small"
                      :disabled="type == 1 " v-model="form.keyValue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="remark" label="备注">
            <el-input type="textarea" :rows="4" maxlength="200" size="small"
                      :disabled="type == 1 " v-model="form.remark"></el-input>
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
  import { keyValueApi } from '@/api/keyValue'
  import { validatorRule } from '@/utils/validateRlue'
  export default {
    data() {
      return {
        form: {
      keyName: '',
      keyValue: '',
          remark: '',
    },
      dataStatusList: [],
      type: '',
        id: '',
        rules: {
        keyName: [
        { required: true, trigger: 'blur', message: '键非空' },
      ],
        keyValue: [
        { required: true, trigger: 'blur', message: '值非空' },
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
          keyValueApi.getDetailById(id).then(res => {
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
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
      },
      goBack() {
        // *** 根据真实路径配置地址
        this.$router.push({path: '/keyValue/list'})
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
            keyValueApi.update(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          } else {
            keyValueApi.add(this.form).then(res => {
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
