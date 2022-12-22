<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="createTime"
              type="monthrange"
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
          <el-button type="primary" size="small" style="margin-right: 10px;background-color: #0fbe8f" icon="el-icon-download" @click="exportHandle">导出
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
      <el-table-column align="center" width="100" label="月份">
        <template slot-scope="scope">
          <span
            :style="scope.row.months == '合计' ? 'font-weight: bold' : ''"> {{ scope.row.months }}</span>
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
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { reportApi } from '@/api/report'
  import { permissionMixin } from '@/mixins/permissionMixin'
  import { getExport } from '@/api/exportFile'

  export default {
    mixins: [permissionMixin],
    components: {
      ThreeLevelRoute
    },
    data() {
      return {
        queryParam: {
          createTimeFrom: '',
          createTimeTo: '',
          pageSize: 10,
          pageNum: 1
        },
        createTime: '',
        tableData: [],
        totalCount: 1
      }
    },
    mounted() {
      this.getPage()
    },
    methods: {
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
        reportApi.putInStorage(this.queryParam).then(res => {
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
        getExport('/gw/op/v1/report/exportPutInStorage', this.queryParam, 'post', '入库报表').then(() => {
          this.$emit('refresh')
        })
      },
      resetHandle() {
        this.queryParam = {
          createTimeFrom: '',
          createTimeTo: '',
          pageSize: 10,
          pageNum: 1
        }
        this.createTime = ''
        this.getPage()
      }
    }
  }
</script>
