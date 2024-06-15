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
          <el-form-item class="is-required" label="赛程类型" prop="type">
            <el-select v-model="form.type" :disabled="type === 1 ">
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
          <el-form-item class="is-required" label="时间" prop="time">
            <el-date-picker
              v-model="form.time"
              :disabled="type === 1 "
              placeholder="选择时间"
              style="width: 100%"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="主队" prop="type">
            <el-select @change="homeSelect(form.homeTeamId)" v-model="form.homeTeamId" :disabled="type === 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in teamList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input v-if="form.status == 3" @input="homeResult"  style="width: 300px; margin-left: 10px" placeholder="请输入主队结果" v-model="form.homeTeamFinale" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="客队" prop="type">
            <el-select @change="guestSelect(form.guestTeamId)"  v-model="form.guestTeamId" :disabled="type === 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in teamList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input  v-if="form.status == 3"  @input="homeResult"  style="width: 300px; margin-left: 10px" placeholder="请输入客队结果" v-model="form.guestTeamFinale" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-row class="form-flex">-->
<!--        <el-col :span="10">-->
<!--          <el-form-item class="is-required" label="客队编号" prop="guestTeamId">-->
<!--            <el-input v-model="form.guestTeamId" :disabled="type === 1 "></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row class="form-flex">-->
<!--        <el-col :span="10">-->
<!--          <el-form-item label="客队名称" prop="guestTeamName">-->
<!--            <el-input v-model="form.guestTeamName" :disabled="type === 1 "></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item label="赛事" prop="events">
            <el-input v-model="form.events" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item label="链接" prop="backLinks">
            <el-input v-model="form.backLinks" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="赛程状态" prop="status">
            <el-select v-model="form.status" :disabled="type === 1 ">
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
          <el-form-item label="结局" prop="finale">
            <el-input v-model="form.finale" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" :disabled="type === 1 " :rows="4" maxlength="140"
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
import { baseScheduleApi } from '@/api/sport/baseSchedule'
import { baseTeamApi } from '@/api/sport/baseTeam'

export default {
  data() {
    return {
      form: {
        type: 1,
        time: '',
        homeTeamId: '',
        homeTeamName: '',
        guestTeamId: '',
        homeTeamFinale: '',
        guestTeamFinale: '',
        backLinks: '',
        finale: '',
        status: 1,
        guestTeamName: '',
        events: '欧洲杯',
        title: '小组赛',
        remark: ''
      },
      typeList: [],
      statusList: [],
      teamList: [],
      dataStatusList: [],
      type: '',
      id: '',
      rules: {
        time: [
          { required: true, trigger: 'blur', message: '时间非空' }
        ],
        type: [
          { required: true, trigger: 'blur', message: '赛程类型非空' }
        ],
        homeTeamId: [
          { required: true, trigger: 'blur', message: '主队编号非空' }
        ],
        guestTeamId: [
          { required: true, trigger: 'blur', message: '客队编号非空' }
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
    this.getTeamList()
  },
  methods: {
    homeSelect(a) {
      let team = this.teamList.filter(item => item.id == a)
      this.form.homeTeamName = team[0].name
    },
    homeResult() {
      this.form.finale = this.form.homeTeamName + ' ' + this.form.homeTeamFinale + ' : '
        + this.form.guestTeamFinale + ' ' + this.form.guestTeamName
    },
    guestSelect(a) {
     let team = this.teamList.filter(item => item.id == a)
      this.form.guestTeamName = team[0].name
    },
    getTeamList() {
      baseTeamApi.getList().then(res => {
        if (res.subCode === 1000) {
          this.teamList = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getDetailById(id) {
      if (id) {
        baseScheduleApi.getDetailById(id).then(res => {
          if (res.subCode === 1000) {
            this.form = res.data ? res.data : {}
            if (this.form.status == 3) {
              this.form.finale = this.form.homeTeamName + ' ' + this.form.homeTeamFinale + ' : ' + this.form.guestTeamFinale + ' ' + this.form.guestTeamName
            }
          } else {
            this.$message.error(res.subMsg)
          }
        })
      }
    },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
      this.statusList = sysDictList.filter(item => item.typeValue == 66)
      this.typeList = sysDictList.filter(item => item.typeValue == 62)
    },
    goBack() {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/sport/baseSchedule' })
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
          baseScheduleApi.update(this.form).then(res => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              this.goBack()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        } else {
          baseScheduleApi.add(this.form).then(res => {
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
