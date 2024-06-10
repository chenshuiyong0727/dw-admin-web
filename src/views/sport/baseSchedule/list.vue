<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="time"
              end-placeholder="时间结束"
              range-separator="至"
              start-placeholder="时间开始"
              type="daterange"
              value-format="yyyy-MM-dd"
              @change="timeChange">
            </el-date-picker>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6">-->
<!--          <el-form-item size="small">-->
<!--            <el-input v-model.trim="queryParam.homeTeamId" placeholder="主队编号"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.homeTeamName" placeholder="主队"></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6">-->
<!--          <el-form-item size="small">-->
<!--            <el-input v-model.trim="queryParam.guestTeamId" placeholder="客队编号"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.guestTeamName" placeholder="客队"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.events" placeholder="赛事"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.title" placeholder="标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length" justify="center"
              type="flex">
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['查询']" icon="el-icon-search" size="small" style="margin-right: 10px"
                   type="primary" @click="search">查询
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['查询']" icon="el-icon-refresh" size="small" style="margin-right: 10px"
                   type="primary" @click="resetHandle">重置
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['新增']" icon="el-icon-plus" size="small" style="margin-right: 10px"
                   type="primary"
                   @click="goDetail(null,3)">新增
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['批量删除']" icon="el-icon-delete" size="small" style="margin-right: 10px"
                   type="danger" @click="batchdelete">
          批量删除
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['导出']" icon="el-icon-download" size="small" style="margin-right: 10px"
                   type="primary" @click="exportHandle">导出
        </el-button>
      </el-row>
    </el-form>

    <el-table :data="tableData" border height="600" style="margin-top: 20px"
              @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="赛程编号" prop="id"/>
      <el-table-column align="center" label="时间" prop="time">
        <template slot-scope="scope">{{
            scope.row.time | formateTime()
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主队" prop="homeTeamName"/>
      <el-table-column align="center" label="主队图片" width="80">
        <template slot-scope="scope">
          <img v-if="scope.row.homeTeamImg" :src="scope.row.homeTeamImg" alt=""
               class="userPic" @click="avatarShow(scope.row.homeTeamImg)">
          <img v-if="!scope.row.homeTeamImg && scope.row.homeTeamImgUrl" :src="fileUrl+scope.row.homeTeamImgUrl"
               alt="" class="userPic" @click="avatarShow(fileUrl+scope.row.homeTeamImgUrl)">
        </template>
      </el-table-column>
      <el-table-column align="center" label="客队" prop="guestTeamName"/>
      <el-table-column align="center" label="主队图片" width="80">
        <template slot-scope="scope">
            <img v-if="scope.row.guestTeamImg" :src="scope.row.guestTeamImg" alt=""
                 class="userPic" @click="avatarShow(scope.row.guestTeamImg)">
            <img v-if="!scope.row.guestTeamImg && scope.row.guestTeamImgUrl" :src="fileUrl+scope.row.guestTeamImgUrl"
                 alt="" class="userPic" @click="avatarShow(fileUrl+scope.row.guestTeamImgUrl)">
        </template>
      </el-table-column>
      <el-table-column align="center" label="赛事" prop="events"/>
      <el-table-column align="center" label="标题" prop="title"/>
      <el-table-column align="center" label="赛程状态" prop="type">
        <template slot-scope="scope">{{ scope.row.status | dictToDescTypeValue(66) }}</template>
      </el-table-column>
<!--      <el-table-column align="center" label="结局"  width="200" prop="finale"/>-->
      <el-table-column align="center" label="结局" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.homeTeamFinale > scope.row.guestTeamFinale"> <strong class="color-danger"> {{scope.row.homeTeamName}}{{scope.row.homeTeamFinale}}  </strong> : {{scope.row.guestTeamFinale}} {{scope.row.guestTeamName}}</span>
          <span v-if="scope.row.homeTeamFinale == scope.row.guestTeamFinale">{{scope.row.homeTeamName}} {{scope.row.homeTeamFinale}} : {{scope.row.guestTeamFinale}} {{scope.row.guestTeamName}}</span>
          <span v-if="scope.row.homeTeamFinale < scope.row.guestTeamFinale">{{scope.row.homeTeamName}} {{scope.row.homeTeamFinale}} : <strong class="color-danger">  {{scope.row.guestTeamFinale}} {{scope.row.guestTeamName}}  </strong></span>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" label="链接" prop="backLinks"/>-->
      <el-table-column align="center" width="100" prop="backLinks" label="链接">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="openLink(scope.row.backLinks)"> {{ scope.row.backLinks }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark"/>
      <el-table-column v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length" align="center" fixed="right" label="操作"
                       width="130">
        <template slot-scope="scope">
          <div>
            <el-button v-permission:[buttonPermissionArr.listBtn]="['查看']" type="text"
                       @click="goDetail(scope.row.id , 1)">查看
            </el-button>
            <el-button v-permission:[buttonPermissionArr.listBtn]="['编辑']" type="text"
                       @click="goDetail(scope.row.id , 2)">编辑
            </el-button>
          </div>
          <el-button v-permission:[buttonPermissionArr.listBtn]="['删除']" type="text"
                     @click="goDel(scope.row.id)">删除
          </el-button>
          <el-button v-if="scope.row.dataStatus == 1" v-permission:[buttonPermissionArr.listBtn]="['更新状态']"
                     type="text"
                     @click="changeStatus(scope.row.id, 0)">停用
          </el-button>
          <el-button v-if="scope.row.dataStatus == 0" v-permission:[buttonPermissionArr.listBtn]="['更新状态']"
                     type="text"
                     @click="changeStatus(scope.row.id, 1)">启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        :current-page="queryParam.pageNum"
        :page-size="queryParam.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="reSearchHandle"
        @current-change="pageChangeHandle">
      </el-pagination>
    </el-row>
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { baseScheduleApi } from '@/api/sport/baseSchedule'
import { permissionMixin } from '@/mixins/permissionMixin'
import { getExport } from '@/api/exportFile'
import { systemContainerApi } from '@/api/systemManage'

export default {
  mixins: [permissionMixin],
  components: {
    ThreeLevelRoute
  },
  data() {
    return {
      queryParam: {
        timeFrom: '',
        timeTo: '',
        homeTeamId: '',
        homeTeamName: '',
        guestTeamId: '',
        guestTeamName: '',
        events: '',
        title: '',
        remark: '',
        pageSize: 10,
        pageNum: 1
      },
      dataStatusList: [],
      time: '',
      selectedId: [],
      ids: [],
      tableData: [],
      totalCount: 1
    }
  },
  mounted() {
    this.getPage()
    this.listSysDict()
  },
  methods: {
    openLink(e) {
      if (!e) {
        return
      }
      window.open(e)
    },
    timeChange() {
      if (this.time) {
        this.queryParam.timeFrom = this.time[0]
        this.queryParam.timeTo = this.time[1]
      } else {
        this.queryParam.timeFrom = null
        this.queryParam.timeTo = null
      }
    },
    getPage() {
      baseScheduleApi.page(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data ? res.data.list : []
          this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
    },
    pageChangeHandle(currentPage) {
      this.queryParam.pageNum = currentPage
      this.getPage()
    },
    reSearchHandle(size) {
      this.queryParam.pageSize = size
      this.queryParam.pageNum = 1
      this.getPage()
    },
    goDetail(id, type) {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/sport/baseSchedule/detail', query: { id, type } })
    },
    goDel(id) {
      baseScheduleApi.delById(id).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
          this.getPage()
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    changeStatus(id, dataStatus) {
      baseScheduleApi.changeStatus({ id, dataStatus }).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
        } else {
          this.$message.error(res.subMsg)
        }
        this.getPage()
      })
    },
    search() {
      this.queryParam.pageNum = 1
      this.getPage()
    },
    selected(val) {
      this.selectedId = val
      let temp = []
      for (let i = 0; i < this.selectedId.length; i++) {
        temp.push(this.selectedId[i].id)
      }
      this.ids = temp
    },
    batchdelete() {
      if (this.ids.length == 0) {
        this.$alert('没有选中数据')
        return
      }
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseScheduleApi.batchdelete(this.ids).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.getPage()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    exportHandle() {
      let data = {}
      if (this.ids.length > 0) {
        data.ids = this.ids
      } else {
        this.$message.success('未勾选数据，导出符合条件的所有数据')
        data = {
          ...this.queryParam
        }
      }
      getExport('/gw/op/v1/baseSchedule/export', data, 'post', '赛程表列表').then(() => {
        this.$emit('refresh')
      })
    },
    resetHandle() {
      this.queryParam = {
        timeFrom: '',
        timeTo: '',
        homeTeamId: '',
        homeTeamName: '',
        guestTeamId: '',
        guestTeamName: '',
        events: '',
        title: '',
        remark: '',
        pageSize: 10,
        pageNum: 1
      }
      this.time = ''
      this.getPage()
    }
  }
}
</script>
