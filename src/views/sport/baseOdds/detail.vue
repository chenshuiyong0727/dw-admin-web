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
          <el-form-item class="is-required" label="比赛" prop="scheduleId">
            <el-select   style="width: 400px;"  @change="homeSelect(form.scheduleId)" v-model="form.scheduleId" :disabled="type === 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in scheduleList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="胜平负" prop="odds">
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px" type="" placeholder="胜" v-model="oddsDetailsList[0].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px;margin-left: 5px;"  placeholder="平"  v-model="oddsDetailsList[1].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')" style="width: 100px;margin-left: 5px;"  placeholder="负"  v-model="oddsDetailsList[2].odds" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="让球胜负" prop="odds">
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px" type="" placeholder="让球胜" v-model="oddsDetailsList[3].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px;margin-left: 5px;"  placeholder="让球基数"  v-model="oddsDetailsList[4].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')" style="width: 100px;margin-left: 5px;"  placeholder="让球负"  v-model="oddsDetailsList[5].odds" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="大小球" prop="odds">
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px" type="" placeholder="大" v-model="oddsDetailsList[6].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px;margin-left: 5px;"  placeholder="大小球基数"  v-model="oddsDetailsList[7].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')" style="width: 100px;margin-left: 5px;"  placeholder="小"  v-model="oddsDetailsList[8].odds" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="form-flex">
        <el-col>
          <el-form-item class="is-required" label="大小角球" prop="odds">
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px" type="" placeholder="大角球" v-model="oddsDetailsList[9].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')"  style="width: 100px;margin-left: 5px;"  placeholder="大小角球基数"  v-model="oddsDetailsList[10].odds" :disabled="type === 1 "></el-input>
            <el-input oninput="value=value.replace(/[^0-9.]/g,'')" style="width: 100px;margin-left: 5px;"  placeholder="小角球"  v-model="oddsDetailsList[11].odds" :disabled="type === 1 "></el-input>
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
import { baseOddsApi } from '@/api/sport/baseOdds'
import { baseScheduleApi } from '@/api/sport/baseSchedule'
import { baseOddsTypeApi } from '@/api/sport/baseOddsType'

export default {
  data() {
    return {
      form: {
        type: 1,
        scheduleId: '',
        scheduleName: '',
        odds: '',
        oddsTypeId: '',
        baseInfo: '',
        oddsDetailsList: '',
        remark: ''
      },
      queryParam: {
        status: 3
      },
      queryParamOddsType: {
      },
      oddsDetailsList: [
        { code: 'generalWin', odds: '1'},
        { code: 'generalDraw', odds: '2'},
        { code: 'generalLose', odds: '3'},
        { code: 'letWin', odds: '4'},
        { code: 'letBase', odds: '5'},
        { code: 'letWin', odds: '6'},
        { code: 'sizeBig', odds: '7'},
        { code: 'sizeBase', odds: '8'},
        { code: 'sizeSmall', odds: '9'},
        { code: 'cornerSizeBig', odds: '10'},
        { code: 'cornerSizeBase', odds: '11'},
        { code: 'cornerSizeSmall', odds: '12'}
      ],
      oddsDetailsList1: [],
      scheduleList: [],
      typeList: [],
      dataStatusList: [],
      type: '',
      id: '',
      rules: {
        scheduleId: [
          { required: true, trigger: 'blur', message: '请选择比赛' }
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
    this.getList()
    // this.getOddsList()
  },
  methods: {
    homeSelect(a) {
      let team = this.scheduleList.filter(item => item.id === a)
      this.form.scheduleName = team[0].title + ' - ' + team[0].name
    },
    getOddsList() {
      baseOddsTypeApi.getList(this.queryParamOddsType).then(res => {
        if (res.subCode === 1000) {
          this.oddsDetailsList1 = res.data
          console.info("oddsDetail", this.oddsDetailsList1)
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getList() {
      baseScheduleApi.getList(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.scheduleList = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
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
        this.form.oddsDetailsList = this.oddsDetailsList
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
