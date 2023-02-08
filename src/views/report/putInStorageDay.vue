<template>
  <div class="page-container">

    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="时间开始"
              end-placeholder="时间结束"
              @change="createTimeChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-search"
                     @click="search">查询
          </el-button>
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-refresh"
                     @click="resetHandle">重置
          </el-button>
          <el-button type="primary" size="small"
                     style="margin-right: 10px;background-color: #0fbe8f" icon="el-icon-download"
                     @click="exportHandle">导出
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table height="600" style="margin-top: 20px" border :data="tableData">

      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <!--      <el-table-column align="center" prop="months" label="月份"/>-->
      <!--      <el-table-column align="center" prop="successNum" label="订单数"/>-->
      <!--      <el-table-column align="center" prop="orderAmount" label="订单金额"/>-->
      <!--      <el-table-column align="center" prop="profitsAmount" label="利润"/>-->
      <!--      -->
      <el-table-column align="center" width="100" label="日期">
        <template slot-scope="scope">
          <a
            @click="viewAll(scope.row.months)"
            :style="scope.row.months == '合计' ? 'font-weight: bold;' : 'color: #20a0ff;'"> {{ scope.row.months }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="入库数">
        <template slot-scope="scope">
          <span
            :style="scope.row.months == '合计' ? 'font-weight: bold' : ''"> {{ scope.row.successNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="入库总额">
        <template slot-scope="scope">
          <span
            :style="scope.row.months == '合计' ? 'font-weight: bold' : ''"> {{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="市价总额">
        <template slot-scope="scope">
          <span
            :style="scope.row.months == '合计' ? 'font-weight: bold' : ''"> {{ scope.row.profitsAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="入库均价">
        <template slot-scope="scope">
          <span v-if="scope.row.successNum"
                :style="scope.row.months == '合计' ? 'font-weight: bold' : ''">
              {{scope.row.orderAmount / scope.row.successNum  | numFilter}}
          </span>
          <span v-else
                :style="scope.row.months == '合计' ? 'font-weight: bold' : ''">
             0
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="市价均价">
        <template slot-scope="scope">
          <span v-if="scope.row.successNum"
                :style="scope.row.months == '合计' ? 'font-weight: bold' : ''">
              {{scope.row.profitsAmount / scope.row.successNum  | numFilter}}
          </span>
          <span v-else
                :style="scope.row.months == '合计' ? 'font-weight: bold' : ''">
             0
          </span>
        </template>
      </el-table-column>
      <!--      <el-table-column  align="center"  width="100" label="市价均价"  >-->
      <!--        <template slot-scope="scope">-->
      <!--          <span-->
      <!--            :style="scope.row.months == '合计' ? 'font-weight: bold' : ''">  {{scope.row.profitsAmount / scope.row.successNum  | numFilter}}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

    </el-table>
    <!--    <el-row class="top-15">-->
    <!--      <el-pagination-->
    <!--        @size-change="reSearchHandle"-->
    <!--        @current-change="pageChangeHandle"-->
    <!--        :current-page="queryParam.pageNum"-->
    <!--        :page-sizes="[10, 20, 50, 100]"-->
    <!--        :page-size="queryParam.pageSize"-->
    <!--        layout="total, sizes, prev, pager, next, jumper"-->
    <!--        :total="totalCount">-->
    <!--      </el-pagination>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
import { reportApi } from '@/api/report'
import { permissionMixin } from '@/mixins/permissionMixin'
import { getExport } from '@/api/exportFile'

export default {
  mixins: [permissionMixin],
  components: {},
  data() {
    return {
      queryParam: {
        createTimeFrom: '',
        createTimeTo: '',
        pageSize: 10,
        pageNum: 1
      },
      months: '',
      createTime: [],
      tableData: [],
      totalCount: 1
    }
  },
  created() {
    const { months } = this.$route.query
    this.months = months
    if (this.months) {
      this.months = this.months + '-01'
      let to = this.getNextMonth(this.months)
      this.createTime[0] = this.months
      this.createTime[1] = to
      this.queryParam.createTimeFrom = this.months
      this.queryParam.createTimeTo = to
      this.getPage()
    }
  },
  methods: {
    viewAll(months) {
      this.$router.push({ path: '/goodsBase/goodsInventory/dataDetail', query: { months }})
    },
    getNextMonth(date) {
      let arr = date.split('-')
      let year = arr[0] // 获取当前日期的年份
      let month = arr[1] // 获取当前日期的月份
      let day = arr[2] // 获取当前日期的日
      let year2 = year
      let month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      let day2 = day
      let days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      let m = year2 + '-' + month2 + '-' + day2
      return m
    },
    createTimeChange() {
      if (this.createTime) {
        this.queryParam.createTimeFrom = this.createTime[0]
        this.queryParam.createTimeTo = this.createTime[1]
      } else {
        this.queryParam.createTimeFrom = null
        this.queryParam.createTimeTo = null
      }
    },
    getPage() {
      reportApi.putInStorageDay(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data ? res.data : []
        } else {
          this.$message.error(res.subMsg)
        }
      })
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
    search() {
      this.queryParam.pageNum = 1
      this.getPage()
    },
    exportHandle() {
      // let data = {}
      // if (this.ids.length > 0) {
      //   data.ids = this.ids
      // } else {
      //   this.$message.success('未勾选数据，导出符合条件的所有数据')
      //   data = {
      //     ...this.queryParam
      //   }
      // }
      getExport('/gw/op/v1/report/exportPutInStorageDay', this.queryParam, 'post', this.months +'入库报表').then(
        () => {
          this.$emit('refresh')
        })
    },
    resetHandle() {
      this.queryParam = {
        pageSize: 10,
        pageNum: 1
      }
      this.months = this.months + '-01'
      let to = this.getNextMonth(this.months)
      this.createTime[0] = this.months
      this.createTime[1] = to
      this.queryParam.createTimeFrom = this.months
      this.queryParam.createTimeTo = to
      this.getPage()
    }
  }
}
</script>
