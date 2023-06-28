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
          <el-form-item prop="name" label="姓名"   class="is-required" >
            <el-input v-model="form.name" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="price" label="金额"    class="is-required"  >
            <el-input v-model="form.price" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
          <el-form-item   prop="label" label="关系"    class="is-required" >
            <el-select v-model="form.label"  :disabled="type == 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in labelList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
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
  import { giftApi } from '@/api/gift'
  import { validatorRule } from '@/utils/validateRlue'
  export default {
    data() {
      return {
        form: {
          name: '',
      type: 1,
      label: 1,
      price: '',
    },
      typeList: [],
      labelList: [],
      dataStatusList: [],
      type: '',
        id: '',
        rules: {
          name: [
        { required: true, trigger: 'blur', message: '姓名非空' },
      ],
        type: [
        { required: true, trigger: 'blur', message: '类型非空' },
      ],
        label: [
        { required: true, trigger: 'blur', message: '关系非空' },
      ],
        price: [
        { required: false, trigger: 'blur', validator: validatorRule.IS_MONEY },
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
          giftApi.getDetailById(id).then(res => {
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
        console.info(sysDictList)
        this.typeList = sysDictList.filter(item => item.typeValue == 41)
        this.labelList = sysDictList.filter(item => item.typeValue == 42)
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
      },
      goBack() {
        // *** 根据真实路径配置地址
        this.$router.push({path: '/more/gift'})
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
            giftApi.update(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          } else {
            giftApi.add(this.form).then(res => {
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
