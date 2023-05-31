<template>
  <div class="app-container">
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(2)">
              <span class="font-medium">已上架订单</span>
              <span style="float: right">({{orderIofo.count2}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(3)">
              <span class="font-medium">待发货订单</span>
              <span
                style="float: right"
                :class="orderIofo.count3 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count3}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(4)">
              <span class="font-medium">已发货订单</span>
              <span
                style="float: right"
                :class="orderIofo.count4 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count4}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(5)">
              <span class="font-medium">已揽件订单</span>
              <span
                style="float: right"
                :class="orderIofo.count5 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count5}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(6)">
              <span class="font-medium">已收货订单</span>
              <span
                style="float: right"
                :class="orderIofo.count6 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count6}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(8)">
              <span class="font-medium">瑕疵订单</span>
              <span
                style="float: right"
                :class="orderIofo.count8 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count8}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
<!--          <el-col :span="8">-->
<!--            <div class="un-handle-item" @click="goDataDetailToday(1)">-->
<!--              <span class="font-medium">今日更新</span>-->
<!--              <span-->
<!--                style="float: right"-->
<!--                :class="storeData.successNum > 0 ? 'color-danger' : ''"-->
<!--              >({{storeData.successNum}})</span>-->
<!--            </div>-->
<!--          </el-col>-->
          <el-col :span="8">
            <div class="un-handle-item" @click="goDataDetailToday(7)">
              <span class="font-medium">变价商品</span>
              <span
                style="float: right"
                :class="storeData.upCout > 0 ? 'color-danger' : ''"
              >({{storeData.upCout}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="goDataDetailToday(2)">
              <span class="font-medium">待上架商品</span>
              <span
                style="float: right"
                :class="storeData.successNumLast > 0 ? 'color-danger' : ''"
              >({{storeData.successNumLast}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="goDataDetailToday(3)">
              <span class="font-medium">待移库商品</span>
              <span
                style="float: right"
                :class="storeData.waitMoveCout > 0 ? 'color-danger' : ''"
              >({{storeData.waitMoveCout}})</span>
            </div>
          </el-col>
        </el-row>
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="8">-->
<!--            <div class="un-handle-item" @click="goDataDetailToday(7)">-->
<!--              <span class="font-medium">变价商品</span>-->
<!--              <span-->
<!--                style="float: right"-->
<!--                :class="storeData.upCout > 0 ? 'color-danger' : ''"-->
<!--              >({{storeData.upCout}})</span>-->
<!--            </div>-->
<!--          </el-col>-->
<!--        </el-row>-->
      </div>
    </div>
    <div class="address-layout">
      <el-row :gutter="20">
<!--        <el-col :span="6">-->
<!--          <div class="out-border" @click="jumpactNo()">-->
<!--            <div class="layout-title">当前时间</div>-->
<!--            <div class="color-main address-content">-->
<!--              <span>{{nowDate}} {{nowTime}}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-col>-->
        <el-col :span="8">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">春节倒计时</div>
            <div class="color-main address-content">
              <span><strong class="color-danger"> {{countDay}}</strong> {{count}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">库存总数</div>
            <div class="color-main address-content">
              <span class="color-danger">{{form.inventoryNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">库存成本</div>
            <div class="color-main address-content">
              <span>{{form.inventoryCost}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">库存比例</div>
            <div class="color-main address-content">
              <span v-if="form.inventoryNum  && form.goodsPutInNum">{{form.inventoryRatio}}%</span>
              <span v-else> 0%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpGoods()">
            <div class="layout-title">商品款式总数</div>
            <div class="color-main address-content">
              <span>{{form.goodsNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpPutIn()">
            <div class="layout-title">入库商品总数</div>
            <div class="color-main address-content">
              <span>{{form.goodsPutInNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpPutIn()">
            <div class="layout-title">入库总额</div>
            <div class="color-main address-content">
              <span>{{form.inventoryAmount}}</span>
            </div>
          </div>
        </el-col>
        <!--        <el-col :span="4">-->
        <!--          <div class="out-border" @click="jumpactNo()">-->
        <!--            <div class="layout-title">市值总价</div>-->
        <!--            <div class="color-main address-content">-->
        <!--              <span >{{form.marketValue}}</span>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </el-col>-->
        <el-col :span="4">
          <div class="out-border" @click="jumpSellList()">
            <div class="layout-title">利润总额</div>
            <div class="color-main address-content">
              <span class="color-danger">{{form.profitsAmount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpSellList()">
            <div class="layout-title">交易成功数</div>
            <div class="color-main address-content">
              <span>{{form.successNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpSellList()">
            <div class="layout-title">成功总额</div>
            <div class="color-main address-content">
              <span>{{form.orderAmount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">总运费</div>
            <div class="color-main address-content">
              <span>{{form.freight}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">手续费</div>
            <div class="color-main address-content">
              <span>{{form.poundage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="goodsOther()">
            <div class="layout-title">其他收支</div>
            <div class="color-main address-content">
              <span>{{form.otherRevenue}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpSellList()">
            <div class="layout-title">平均利润</div>
            <div class="color-main address-content">
              <span class="color-danger">{{form.profitsAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpPutIn()">
            <div class="layout-title">库存均价</div>
            <div class="color-main address-content">
              <span>{{form.inboundAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpSellList()">
            <div class="layout-title">成功均价</div>
            <div class="color-main address-content">
              <span>{{form.orderAmountAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">运费均价</div>
            <div class="color-main address-content">
              <span>{{form.freightAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">成本均价</div>
            <div class="color-main address-content">
              <span>{{form.costAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">实际利润比例</div>
            <div class="color-main address-content">
              <span>{{form.profitsProportion}}%</span>
            </div>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="out-border" @click="goDataDetail(2)">
            <div class="layout-title">云头库存</div>
            <div class="color-main address-content">
              <span>{{form.ytInventory}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="goDataDetail(2)">
            <div class="layout-title">云头货值</div>
            <div class="color-main address-content">
              <span>{{form.ytAmount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="goDataDetail(1)">
            <div class="layout-title">前埔库存</div>
            <div class="color-main address-content">
              <span>{{form.qpInventory}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="goDataDetail(1)">
            <div class="layout-title">前埔货值</div>
            <div class="color-main address-content">
              <span>{{form.qpAmount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="goodsDefects()">
            <div class="layout-title">瑕疵数</div>
            <div class="color-main address-content">
              <span>{{form.defectsNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpSellList()">
            <div class="layout-title">通过比例</div>
            <div class="color-main address-content">
              <span>{{form.passRatio}} %</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-col :span="4">
        <div @click="jumpSellList()"  style="padding: 20px;z-index: 20000">
          <div>
            <div style="color: #909399;font-size: 14px">本月订单总数</div>
            <div style="color: #606266;font-size: 24px;padding: 10px 0">{{orderData.successNum}}
            </div>
            <div>
              <!--                (本期数-同期数)/同期数*100%-->
              <span
                :class="orderData.successNumRate<0 ? 'color-danger' : 'color-success'"
                style="font-size: 14px"> {{orderData.successNumRate}} %</span>
              <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
            </div>
          </div>
          <div style="margin-top: 50px;">
            <div style="color: #909399;font-size: 14px">本月利润</div>
            <div style="color: #606266;font-size: 24px;padding: 10px 0">
              {{orderData.profitsAmount}}
            </div>
            <div>
                <span
                  :class="orderData.profitsAmountRate<0 ? 'color-danger' : 'color-success'"
                  style="font-size: 14px">{{orderData.profitsAmountRate}} %</span>
              <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
            </div>
          </div>
          <div style="margin-top: 50px;">
            <div style="color: #909399;font-size: 14px">本月销售总额</div>
            <div style="color: #606266;font-size: 24px;padding: 10px 0">{{orderData.orderAmount}}
            </div>
            <div>
                <span
                  :class="orderData.orderAmountRate<0 ? 'color-danger' : 'color-success'"
                  style="font-size: 14px">{{orderData.orderAmountRate}} %</span>
              <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
            </div>
          </div>
          <!--            <div style="margin-top: 20px;">-->
          <!--              <div style="color: #909399;font-size: 14px">本周销售总额</div>-->
          <!--              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>-->
          <!--              <div>-->
          <!--                <span class="color-danger" style="font-size: 14px">-10%</span>-->
          <!--                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>-->
          <!--              </div>-->
          <!--            </div>-->
        </div>
      </el-col>
      <el-row style="position: static">
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-button :type="mouthLl" @click="profitData(1)"  round>月利润</el-button>
            <el-button :type="dayLl" @click="profitData(0)" round>日利润</el-button>

            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="createTime"
              :type="dateType"
              align="right"
              :value-format="valueFormat"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            >
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { goodsOrderApi } from '@/api/goodsOrder'
export default {
  name: 'homePage',
  data() {
    return {
      form: {},
      orderIofo: {},
      queryParam: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      dateType: 'monthrange',
      valueFormat: 'yyyy-MM',
      // valueFormat: 'yyyy-MM-dd',
      dayLl: 'default',
      mouthLl: 'primary',
      createTime: '',
      chartSettings: {
        xAxisType: 'time',
        area: false,
        axisSite: { right: ['profitsAmount'] },
        labelAlias: {
          'successNum': '订单数',
          'orderAmount': '订单金额',
          'profitsAmount': '利润'
        }
      },
      chartData: {
        columns: ['months', 'successNum', 'orderAmount', 'profitsAmount'],
        rows: []
      },
      countDay: '0', // 倒计时
      count: '', // 倒计时
      seconds: 0, // 10天的秒数
      nowDate: '',
      nowTime: '',
      nowWeek: '',
      orderData: {},
      storeData: {},
      loading: false,
      dataEmpty: false
    }
  },
  created() {
    this.getData()
    this.getData1()
    this.getData2()
    this.initTime()
    this.time()
  },
  // 销毁定时器
  beforeDestroy() {
    if (this.formatDate) {
      clearInterval(this.formatDate); // 在Vue实例销毁前，清除时间定时器
    }
  },
  methods: {
    profitData(dataType) {
      this.createTime = ''
      this.queryParam = {
        dataType: dataType,
        createTimeFrom: '',
        createTimeTo: ''
      }
      if (dataType == 1) {
        this.mouthLl = 'primary'
        this.dayLl = 'default'
        this.dateType = 'monthrange'
        this.valueFormat = 'yyyy-MM'
      } else {
        this.mouthLl = 'default'
        this.dayLl = 'primary'
        this.dateType = 'daterange'
        this.valueFormat = 'yyyy-MM-dd'
      }
      this.getData1()
    },
    countDown() {
      let d = parseInt(this.seconds / (24 * 60 * 60))
      if (d > 0) {
        // d = d < 10 ? '0' + d : d
        let h = parseInt(this.seconds / (60 * 60) % 24);
        h = h < 10 ? '0' + h : h
        let m = parseInt(this.seconds / 60 % 60);
        m = m < 10 ? '0' + m : m
        let s = parseInt(this.seconds % 60);
        s = s < 10 ? '0' + s : s
        this.count = '天 ' + h + '时' + m + '分' + s + '秒'
      }
      this.countDay = d
    },
    initTime() {
      let myDate = new Date().getTime()
      let endTime = '2024/02/10 00:00:00'
      let timestamp2 = Date.parse(new Date(endTime))
      this.seconds = (timestamp2 - myDate) / 1000
    },
    time() {
      setInterval(() => {
        this.seconds -= 1
        this.countDown()
      }, 1000)
    },
    currentTime() {
      setInterval(this.formatDate, 500);
    },
    handleDateChange() {
      if (this.createTime) {
        this.queryParam.createTimeFrom = this.createTime[0]
        this.queryParam.createTimeTo = this.createTime[1]
      } else {
        this.queryParam.createTimeFrom = null
        this.queryParam.createTimeTo = null
      }
      this.getData1()
    },
    formatDate() {
      // 获取当前时间并打印
      let myDate = new Date()
      let wk = myDate.getDay()
      let yy = String(myDate.getFullYear())
      let mm = myDate.getMonth() + 1
      let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
      let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
      let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
      let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
      let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      let week = weeks[wk]
      this.nowDate = yy + '-' + mm + '-' + dd + ' '
      this.nowTime = hou + ':' + min + ':' + sec
      this.nowWeek = week
    },
    getData1() {
      goodsOrderApi.indexOrderData(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.dataEmpty = false
          this.loading = false
          this.chartData.rows = res.data.rows
          this.orderData = res.data
          if (this.orderData) {
            this.orderData.successNumRate = parseFloat(
              (this.orderData.successNum - this.orderData.successNumLast)
              / this.orderData.successNumLast * 100).toFixed(2)
            this.orderData.profitsAmountRate = parseFloat(
              (this.orderData.profitsAmount - this.orderData.profitsAmountLast)
              / this.orderData.profitsAmountLast * 100).toFixed(2)
            this.orderData.orderAmountRate = parseFloat(
              (this.orderData.orderAmount - this.orderData.orderAmountLast)
              / this.orderData.orderAmountLast * 100).toFixed(2)
          }
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getData2() {
      goodsOrderApi.todaySync(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.storeData = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    // getData() {
    //   goodsOrderApi.indexData().then(res => {
    //     if (res.subCode === 1000) {
    //       this.form = res.data ? res.data.commonDto : {}
    //       this.orderIofo = res.data ? res.data.countDto : {}
    //       if (this.form.inventoryCost && this.form.inventoryNum) {
    //         this.form.inboundAverage = parseFloat(
    //           this.form.inventoryCost / this.form.inventoryNum).toFixed(2)
    //       }
    //       if (this.form.successNum) {
    //         this.form.orderAmountAverage = parseFloat(
    //           this.form.orderAmount / this.form.successNum).toFixed(2)
    //         this.form.freightAverage = parseFloat(
    //           this.form.freight / this.form.successNum).toFixed(2)
    //         this.form.profitsAverage = parseFloat(
    //           this.form.profitsAmount / this.form.successNum).toFixed(2)
    //       }
    //       this.form.costAverage = parseFloat(
    //         this.form.inboundAverage / 1 + this.form.freightAverage / 1).toFixed(2)
    //       this.form.inventoryRatio = parseFloat(
    //         this.form.inventoryNum / this.form.goodsPutInNum * 100).toFixed(2)
    //       this.form.profitsProportion = parseFloat(
    //         this.form.profitsAverage / this.form.costAverage * 100).toFixed(2)
    //     } else {
    //       this.$message.error(res.subMsg)
    //     }
    //   })
    // },
    getData() {
      this.$store.dispatch('apply/orderInfo').then((res) => {
        this.loading = false
        if (res.data) {
          this.form = res.data ? res.data.commonDto : {}
          this.orderIofo = res.data ? res.data.countDto : {}
          if (this.form.inventoryCost && this.form.inventoryNum) {
            this.form.inboundAverage = parseFloat(
              this.form.inventoryCost / this.form.inventoryNum).toFixed(2)
          }
          if (this.form.successNum) {
            this.form.orderAmountAverage = parseFloat(
              this.form.orderAmount / this.form.successNum).toFixed(2)
            this.form.freightAverage = parseFloat(
              this.form.freight / this.form.successNum).toFixed(2)
            this.form.profitsAverage = parseFloat(
              this.form.profitsAmount / this.form.successNum).toFixed(2)
          }
          this.form.costAverage = parseFloat(
            this.form.inboundAverage / 1 + this.form.freightAverage / 1).toFixed(2)
          this.form.inventoryRatio = parseFloat(
            this.form.inventoryNum / this.form.goodsPutInNum * 100).toFixed(2)
          this.form.profitsProportion = parseFloat(
            this.form.profitsAverage / this.form.costAverage * 100).toFixed(2)
        } else {
          this.$message.error(res.subMsg)
        }
      }).catch(() => {
        this.$message.error('系统错误')
      })
      // goodsOrderApi.indexData().then(res => {
      //   if (res.subCode === 1000) {
      //     this.form = res.data ? res.data.commonDto : {}
      //     this.orderIofo = res.data ? res.data.countDto : {}
      //     if (this.form.inventoryCost && this.form.inventoryNum) {
      //       this.form.inboundAverage = parseFloat(
      //         this.form.inventoryCost / this.form.inventoryNum).toFixed(2)
      //     }
      //     if (this.form.successNum) {
      //       this.form.orderAmountAverage = parseFloat(
      //         this.form.orderAmount / this.form.successNum).toFixed(2)
      //       this.form.freightAverage = parseFloat(
      //         this.form.freight / this.form.successNum).toFixed(2)
      //       this.form.profitsAverage = parseFloat(
      //         this.form.profitsAmount / this.form.successNum).toFixed(2)
      //     }
      //     this.form.costAverage = parseFloat(
      //       this.form.inboundAverage / 1 + this.form.freightAverage / 1).toFixed(2)
      //     this.form.inventoryRatio = parseFloat(
      //       this.form.inventoryNum / this.form.goodsPutInNum * 100).toFixed(2)
      //     this.form.profitsProportion = parseFloat(
      //       this.form.profitsAverage / this.form.costAverage * 100).toFixed(2)
      //   } else {
      //     this.$message.error(res.subMsg)
      //   }
      // })
    },
    jumpactOrder(type) {
      let path = '/goodsOrder/list' + type
      this.$router.push({ path: path })
    },
    goDataDetail(warehouseId) {
      // // *** 根据真实路径配置地址
      // if (!this.queryParam.goodsId) {
      //   this.$message.error('没有选中数据')
      //   return
      // }
      // let goodsId = this.queryParam.goodsId
      this.$router.push({ path: '/goodsBase/dataDetail', query: { warehouseId }})
    },
    goDataDetailToday(today) {
      this.$router.push({ path: '/goodsBase/dataDetail', query: { today }})
    },
    jumpactNo() {
      this.$router.push({ path: '/goodsBase/goodsInventory' })
    },
    jumpPutIn() {
      this.$router.push({ path: '/report/putInStorage' })
    },
    jumpSellList() {
      this.$router.push({ path: '/report/sellList' })
    },
    goodsDefects() {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/goodsBase/goodsDefects' })
    },
    goodsOther() {
      this.$router.push({ path: '/goodsOrder/goodsOther' })
    },
    jumpGoods() {
      this.$router.push({ path: '/goodsBase/list' })
    }
  }
}
</script>

<style scoped>
  .app-container {
    margin-top: 0px;
    margin-left: 20px;
    margin-right: 150px;
  }

  .address-layout {
    margin-top: 20px;
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    cursor: pointer;
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    cursor: pointer;
    border: 1px solid #DCDFE6;
    margin-bottom: 30px;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }

  .address-content {
    padding: 20px;
    font-size: 18px
  }
</style>
