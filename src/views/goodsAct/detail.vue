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
          <el-form-item  prop="actNo" label="尺码" >
            <el-input v-model="form.actNo" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row> 
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="price" label="当前价" >
            <el-input v-model="form.price" :disabled="type == 1 "></el-input>
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
  import { goodsActApi } from '@/api/goodsAct'
  import { validatorRule } from '@/utils/validateRlue'
  export default {
    data() {
      return {
        form: {
      actNo: '', 
      price: '', 
    },    
      dataStatusList: [],       
      type: '',
        id: '',
        rules: {
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
          goodsActApi.getDetailById(id).then(res => {
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
        this.$router.push({path: '/goodsAct/list'})
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
            goodsActApi.update(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          } else {
            goodsActApi.add(this.form).then(res => {
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
