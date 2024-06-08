<template>
  <div class="page-container">
    <el-row class="top-flex" justify="space-between" type="flex">
      <h5 v-if="type == 1">详情</h5>
      <h5 v-if="type == 2">编辑</h5>
      <h5 v-if="type == 3">新增</h5>
      <el-button size="small" style="margin-right: 10px ; margin-bottom: 10px" @click="goBack()">
        返回列表
      </el-button>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="指数类型"
                        prop="type">
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
        <el-col :span="10">
          <el-form-item class="is-required" label="赛程编号" prop="scheduleId">
            <el-input v-model="form.scheduleId" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item label="赛程名称" prop="scheduleName">
            <el-input v-model="form.scheduleName" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item class="is-required" label="指数" prop="odds">
            <el-input v-model="form.odds" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item class="is-required" label="指数类型编号" prop="oddsTypeId">
            <el-input v-model="form.oddsTypeId" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item label="基数" prop="baseInfo">
            <el-input v-model="form.baseInfo" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" :disabled="type == 1 " :rows="4" maxlength="140"
                      size="small" type="textarea"></el-input>
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
import { baseOddsApi } from '@/api/sport/baseOdds'

export default {
  data() {
    return {
      form: {
        type: '',
        scheduleId: '',
        scheduleName: '',
        odds: '',
        oddsTypeId: '',
        baseInfo: '',
        remark: ''
      },
      typeList: [],
      dataStatusList: [],
      type: '',
      id: '',
      rules: {
        type: [
          {
            required: true,
            trigger: 'blur',
            message: '指数类型非空'
          }
        ],
        scheduleId: [
          { required: true, trigger: 'blur', message: '赛程编号非空' }
        ],
        odds: [
          { required: true, trigger: 'blur', message: '指数非空' }
        ],
        oddsTypeId: [
          { required: true, trigger: 'blur', message: '指数类型编号非空' }
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
        baseOddsApi.getDetailById(id).then(res => {
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
      this.typeList = sysDictList.filter(item => item.typeValue == 63)
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
    },
    goBack() {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/sport/baseOdds' })
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
          baseOddsApi.update(this.form).then(res => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              this.goBack()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        } else {
          baseOddsApi.add(this.form).then(res => {
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
