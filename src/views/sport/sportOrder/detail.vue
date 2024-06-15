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
          <el-form-item  prop="oddsId" label="指数编号"    class="is-required" >
            <el-input v-model="form.oddsId" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row> 
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="userId" label="用户编号"    class="is-required" >
            <el-input v-model="form.userId" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row> 
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="odds" label="指数"    class="is-required" >
            <el-input v-model="form.odds" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row> 
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="orderPrice" label="订单金额"    class="is-required" >
            <el-input v-model="form.orderPrice" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row> 
      <el-row class="form-flex">
        <el-col>
          <el-form-item   prop="status" label="体育订单状态：1已发起，2未生效，3已生效，4胜，5平，6负"    class="is-required" >
            <el-select v-model="form.status"  :disabled="type == 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in statusList"
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
          <el-form-item  prop="confirmTime" label="确认时间"    class="is-required" >
            <el-date-picker
              :disabled="type == 1 "
              v-model="form.confirmTime"
              type="datetime"
              placeholder="选择确认时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row> 
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item  prop="resPrice" label="结果金额" >
            <el-input v-model="form.resPrice" :disabled="type == 1 "></el-input>
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
  import { sportOrderApi } from '@/api/sportOrder'
  import { validatorRule } from '@/utils/validateRlue'
  export default {
    data() {
      return {
        form: {
      oddsId: '', 
      userId: '', 
      odds: '', 
      orderPrice: '', 
      status: '', 
      confirmTime: '', 
      resPrice: '', 
    },      
      statusList: [],    
      dataStatusList: [],       
      type: '',
        id: '',
        rules: {
        oddsId: [
        { required: true, trigger: 'blur', message: '指数编号非空' },
      ],
        userId: [
        { required: true, trigger: 'blur', message: '用户编号非空' },
      ],
        odds: [
        { required: true, trigger: 'blur', message: '指数非空' },
      ],
        orderPrice: [
        { required: true, trigger: 'blur', message: '订单金额非空' },
      ],
        status: [
        { required: true, trigger: 'blur', message: '体育订单状态：1已发起，2未生效，3已生效，4胜，5平，6负非空' },
      ],
        confirmTime: [
        { required: true, trigger: 'blur', message: '确认时间非空' },
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
          sportOrderApi.getDetailById(id).then(res => {
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
        this.statusList = sysDictList.filter(item => item.typeValue == 64)    
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)       
      },
      goBack() {
        // *** 根据真实路径配置地址
        this.$router.push({path: '/sportOrder/list'})
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
            sportOrderApi.update(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          } else {
            sportOrderApi.add(this.form).then(res => {
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
