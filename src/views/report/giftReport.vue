<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
<!--        <el-col :span="6">-->
<!--          <el-form-item size="small">-->
<!--            <el-date-picker-->
<!--              v-model="createTime"-->
<!--              type="monthrange"-->
<!--              range-separator="至"-->
<!--              start-placeholder="时间开始"-->
<!--              end-placeholder="时间结束"-->
<!--              @change="createTimeChange"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="6">
<!--          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-search"-->
<!--                     @click="search">查询-->
<!--          </el-button>-->
<!--          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-refresh"-->
<!--                     @click="resetHandle">重置-->
<!--          </el-button>-->
          <el-button type="primary" size="small" style="margin-right: 10px;background-color: #0fbe8f" icon="el-icon-download" @click="exportHandle">导出
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :row-style="{height:'30px'}"
              :cell-style="{padding:'0px'}" height="600" style="margin-top: 20px" border :data="tableData">

      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <!--      <el-table-column align="center" prop="months" label="月份"/>-->
      <!--      <el-table-column align="center" prop="successNum" label="订单数"/>-->
      <!--      <el-table-column align="center" prop="orderAmount" label="订单金额"/>-->
      <!--      <el-table-column align="center" prop="profitsAmount" label="利润"/>-->
      <!--      -->
      <el-table-column align="center" width="100" label="关系">
        <template slot-scope="scope">
          <span v-if="scope.row.months == '合计' || scope.row.months == '非亲小计'"
             style="font-weight: bold;"> {{ scope.row.months}}</span>
          <a v-else
            @click="jumpDetail(scope.row.months)"
             style="color: #20a0ff;'"> {{ scope.row.months | dictToDescTypeValue(42)  }}</a>

        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="数量">
        <template slot-scope="scope">
          <span
            :style="scope.row.months == '合计' ? 'font-weight: bold' : ''"> {{ scope.row.successNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="总额">
        <template slot-scope="scope">
          <span
            :style="scope.row.months == '合计' ? 'font-weight: bold' : ''"> {{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
    </el-table>
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
        // queryParam: {
        //   createTimeFrom: '',
        //   createTimeTo: '',
        //   pageSize: 10,
        //   pageNum: 1
        // },
        // createTime: '',
        tableData: []
      }
    },
    mounted() {
      this.getPage()
    },
    methods: {
      jumpDetail(months) {
        this.$router.push({path: '/goodsOrder/gift' , query: { months }})
        //
        // this.$router.push({ path: '/report/putInStorage/detail', query: { months }})
      },
      getPage() {
        reportApi.giftReport().then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data ? res.data : []
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      exportHandle() {
        getExport('/gw/op/v1/report/exportGiftReport', this.queryParam, 'post', '红包报表').then(() => {
          this.$emit('refresh')
        })
      },
      // resetHandle() {
      //   this.queryParam = {
      //     createTimeFrom: '',
      //     createTimeTo: '',
      //     pageSize: 10,
      //     pageNum: 1
      //   }
      //   this.createTime = ''
      //   this.getPage()
      // }
    }
  }
</script>
