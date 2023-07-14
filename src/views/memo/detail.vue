<template>
  <div class="page-container">
    <el-row type="flex" justify="space-between" class="top-flex">
      <h5 v-if="type == 1">详情</h5>
      <h5 v-if="type == 2">编辑</h5>
      <h5 v-if="type == 3">新增</h5>
      <el-button size="small" style="margin-right: 10px ; margin-bottom: 10px" @click="goBack()">
        返回列表
      </el-button>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="name" label="事项名称">
            <el-input v-model="form.name" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item prop="type" label="类型" class="is-required">
            <el-select v-model="form.type" :disabled="type == 1 ">
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
          <el-form-item prop="dateType" label="日历类型" class="is-required">
            <el-select v-model="form.dateType" :disabled="type == 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in dateTypeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.type == 2 || form.dateType == 2"  class="flex" type="flex" align="middle">
          <el-form-item prop="happenTime" label="时间" class="is-required">
            <el-input  v-model="form.happenTime" :disabled="type == 1 "></el-input>
          </el-form-item>
        <span style="margin: 0 0 22px 12px;" > 请输入 MM-dd (07-27) 或者 yyyy-MM-dd (2018-09-19）</span>
      </el-row>
      <el-row  v-else class="flex" type="flex" align="middle">
        <el-form-item prop="happenTime" label="时间" class="is-required">
          <!--            <el-input  v-model="form.happenTime" :disabled="type == 1 "></el-input>-->
          <el-input  v-model="form.happenTime" :disabled="type == 1 "></el-input>
        </el-form-item>
        <span style="margin: 0 0 22px 12px;" > 请输入 1到31 数字</span>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="title" label="提醒标题" class="is-required">
            <el-input type="textarea" :rows="4" maxlength="140" size="small"
                      :disabled="type == 1 " v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="content" label="提醒内容" class="is-required">
            <el-input type="textarea" :rows="4" maxlength="140" size="small"
                      :disabled="type == 1 " v-model="form.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button-group v-if="type != 1">
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="goBack()">取消</el-button>
        </el-button-group>
        <el-button-group v-else>
          <el-button type="primary" @click="goEdit">编辑</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { memoApi } from '@/api/memo'

  export default {
    data() {
      return {
        form: {
          name: '',
          happenTime: '',
          type: 1,
          dateType: 1,
          title: '',
          content: ''
        },
        typeList: [],
        dateTypeList: [],
        dataStatusList: [],
        type: '',
        id: '',
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '时间非空' }
          ],
          happenTime: [
            { required: true, trigger: 'blur', message: '时间非空' }
          ],
          type: [
            { required: true, trigger: 'blur', message: '类型非空' }
          ],
          dateType: [
            { required: true, trigger: 'blur', message: '日历类型非空' }
          ],
          title: [
            { required: true, trigger: 'blur', message: '提醒标题非空' }
          ],
          content: [
            { required: true, trigger: 'blur', message: '提醒内容非空' }
          ]
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
          memoApi.getDetailById(id).then(res => {
            if (res.subCode === 1000) {
              this.form = res.data ? res.data : {}
            } else {
              this.$message.error(res.subMsg)
            }
          })
        }
      },
      listSysDict() {
        let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
          localStorage.getItem('sysDictList')) : []
        this.typeList = sysDictList.filter(item => item.typeValue == 49)
        this.dateTypeList = sysDictList.filter(item => item.typeValue == 50)
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
      },
      goBack() {
        // *** 根据真实路径配置地址
        this.$router.push({ path: '/more/memo' })
      },
      goEdit() {
        this.type = 2
      },
      submit() {
        this.$refs['form'].validate(async(valid) => {
          if (!valid) {
            return false
          }
          if(this.form.type == 1){
            let happenTime = this.form.happenTime
            if(happenTime.startsWith('0')){
              this.form.happenTime = happenTime.substring(1,happenTime.length)
            }
            const reg = /^([1-9]|[1-2][0-9]|3[0-1])$/
            if(!reg.test(this.form.happenTime)){
              this.$message.error('请输入 1到31 数字')
              return false
            }
            if(this.form.happenTime > 31 || this.form.happenTime < 1){
              this.$message.error('请输入 1到31 数字')
              return false
            }
            if (this.form.happenTime < 9){
              this.form.happenTime = '0'+this.form.happenTime
            }
          }else{
            let happenTime = this.form.happenTime
            const reg1 = /^(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/;
            let reg2 = /^(\d{4})-(\d{2})-(\d{2})$/
            if(!reg1.test(happenTime) && !reg2.test(happenTime)){
              this.$message.error('请输入 MM-dd (07-27) 或者 yyyy-MM-dd (2018-09-19')
              return false
            }
          }

          if (this.type == 2) {
            memoApi.update(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          } else {
            memoApi.add(this.form).then(res => {
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
