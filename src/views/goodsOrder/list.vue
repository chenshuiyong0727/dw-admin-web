<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.keyword" placeholder="关键词（货号、商品名）"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.size" placeholder="尺码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.orderNo" placeholder="订单号"></el-input>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="6">-->
        <!--          <el-form-item size="small">-->
        <!--            <el-input v-model.trim="queryParam.inventoryId" placeholder="库存编号"></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.status">
              <el-option label="状态" value=""></el-option>
              <el-option
                v-for="item in statusList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.saleType">
              <el-option label="销售类型" value=""></el-option>
              <el-option
                v-for="item in saleTypeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.goodType">
              <el-option label="商品类型" value=""></el-option>
              <el-option
                v-for="item in typeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.shelvesPriceFrom"
                placeholder="原售价开始">
              </el-input>
              <span> - </span>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.shelvesPriceTo"
                placeholder="原售价结束">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.freightFrom"
                placeholder="运费开始">
              </el-input>
              <span> - </span>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.freightTo"
                placeholder="运费结束">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.poundageFrom"
                placeholder="手续费开始">
              </el-input>
              <span> - </span>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.poundageTo"
                placeholder="手续费结束">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.theirPriceFrom"
                placeholder="到手价开始">
              </el-input>
              <span> - </span>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.theirPriceTo"
                placeholder="到手价结束">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.addressId">
              <el-option label="地址" value=""></el-option>
              <el-option
                v-for="item in addressList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.waybillNo" placeholder="运单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="sellTime"
              type="daterange"
              range-separator="至"
              start-placeholder="出售时间"
              end-placeholder="出售时间"
              @change="sellTimeChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="successTime"
              type="daterange"
              range-separator="至"
              start-placeholder="交易成功时间"
              end-placeholder="交易成功时间"
              @change="successTimeChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="创建时间开始"
              end-placeholder="创建时间结束"
              @change="createTimeChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="updateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="更新时间开始"
              end-placeholder="更新时间结束"
              @change="updateTimeChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center"
              v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length">
        <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-search"
                   v-permission:[buttonPermissionArr.searchBtn]="['查询']" @click="search">查询
        </el-button>
        <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-refresh"
                   v-permission:[buttonPermissionArr.searchBtn]="['查询']" @click="resetHandle">重置
        </el-button>
        <el-button type="danger" size="small" style="margin-right: 10px" icon="el-icon-sell"
                   v-permission:[buttonPermissionArr.searchBtn]="['导出']" @click="changeStatusDialog3">闪电直发
        </el-button>
      </el-row>
    </el-form>
    <buttomButton style="z-index: 9999" :tableRef="this.$refs['queryTable']"></buttomButton>
    <el-table
      show-summary     :summary-method="getSummaries"
      ref="queryTable" height="600" style="margin-top: 20px" border :data="tableData"
              @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <!--      <el-table-column align="center" prop="id" label="订单主键"/>-->
      <el-table-column align="center" prop="orderNo" label="订单号"/>
      <el-table-column align="center" label="图片" width="120">
<!--        <template slot-scope="scope">-->
<!--          <img v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"-->
<!--               @click="avatarShow(scope.row.imgUrl)">-->
<!--        </template>-->
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img" class="userPic"
               @click="avatarShow(scope.row.img)">
          <img v-if="!scope.row.img && scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl"
               class="userPic" @click="avatarShow(fileUrl+scope.row.imgUrl)">
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" prop="actNo" label="货号">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactNo(scope.row.actNo)"> {{ scope.row.actNo }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactNo(scope.row.actNo)"> {{ scope.row.goodsName }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="size" label="尺码"/>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(20221108) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">{{ scope.row.status | dictToDescTypeValue(37) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="sellTime" label="发货截止时间">
        <template slot-scope="scope">
          <span class="color-danger">
              {{scope.row.deliveryDeadlineTime | formateTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="saleType" label="销售类型">
        <template slot-scope="scope">{{ scope.row.saleType | dictToDescTypeValue(46) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="inStoreTime" label="闪电入库时间">
        <template slot-scope="scope">
          <span class="color-danger">
              {{scope.row.inStoreTime | formateTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="inStoreFreeDay" label="免仓储费天数"/>
      <el-table-column align="center" prop="surplusDay" label="剩余免费天数" sortable/>
      <el-table-column align="center" prop="inStoreTimeEnd" label="仓库免费截止时间">
        <template slot-scope="scope">
          <span class="color-danger">
              {{scope.row.inStoreTimeEnd | formateTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="入库价"/>
      <el-table-column align="center" prop="shelvesPrice" label="原售价"/>
      <el-table-column align="center" prop="freight" label="运费"/>
      <el-table-column align="center" prop="poundage" label="手续费"/>
      <el-table-column align="center" prop="subsidiesPrice" label="补贴价"/>
      <el-table-column align="center" prop="theirPrice" label="到手价"/>
      <el-table-column align="center" prop="profits" label="实际利润"/>
      <el-table-column align="center" prop="" label="利润比">
        <template
          v-if="scope.row.profits && scope.row.price "
          slot-scope="scope">{{(scope.row.profits / scope.row.price ) * 100 | numFilter}} %
        </template>
      </el-table-column>
      <el-table-column align="center" prop="forecastProfits" label="预估利润"/>
      <!--      <el-table-column align="center" prop="" label="预估利润">-->
<!--        <template v-if="scope.row.theirPrice && scope.row.price " slot-scope="scope">-->
<!--          {{(scope.row.theirPrice - scope.row.price - 10 ) | numFilter}}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <!--      <el-table-column align="center" prop="address" label="地址"/>-->
      <el-table-column align="center" prop="addressId" label="地址">
        <template v-if="scope.row.addressId" slot-scope="scope">{{ scope.row.addressId |
          dictToDescTypeValue(38) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="waybillNo" label="运单编号"/>
      <el-table-column align="center" prop="sellTime" label="出售时间">
        <template slot-scope="scope">{{scope.row.sellTime | formateTime }}</template>
      </el-table-column>
      <el-table-column align="center" prop="successTime" label="交易成功时间">
        <template slot-scope="scope">{{scope.row.successTime | formateTime() }}</template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | formateTime() }}</template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间">
        <template slot-scope="scope">{{scope.row.updateTime | formateTime()
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="130">
        <template slot-scope="scope">
          <div>
<!--            <el-button type="text" @click="changeStatusDialog3">闪电直发</el-button>-->
            <div>
              <el-button type="text" v-if="scope.row.status == 2" @click="changeStatusDialog2(scope.row)">出售</el-button>
              <el-button type="text" v-else @click="changeStatusDialog1(scope.row)">修改</el-button>
              <el-button type="text" @click="changeStatusDialog(scope.row)">交易成功</el-button>
            </div>
            <el-button type="text" class="color-danger" @click="goDel(scope.row.id)">删除</el-button>
            <el-button type="text"  @click="gotoWl(scope.row)">物流</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        @size-change="reSearchHandle"
        @current-change="pageChangeHandle"
        :current-page="queryParam.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-row>
    <!-- </three-level-route> -->
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="imageZoom" alt="" width="100%" >
      </div>
    </div>
    <order-change-status-dialog
      v-if="isShowDialog "
      :orderData="orderData"
      @refreshPage="refreshPage"
      @closDialog="closDialog"/>
    <order-change-status-dialog-add
      v-if="isShowDialog1 "
      :orderData="orderData1"
      @refreshPage="refreshPage1"
      @closDialog="closDialog1"/>
    <order-change-status-dialog-wl
      v-if="isShowDialogWl "
      :requestParamWl="requestParamWl"
      :wlData="wlData"
      :wlDataSize="wlDataSize"
      @refreshPage="refreshPage1"
      @closDialog="closDialogwl"/>
    <order-change-status-dialog2
      v-if="isShowDialog2 "
      :orderData="orderData2"
      @refreshPage="refreshPage2"
      @closDialog="closDialog2"/>
    <order-change-status-dialog-sd
      v-if="isShowDialog3 "
      :ids="ids"
      :status="3"
      @refreshPage="refreshPage3"
      @closDialog="closDialog3"/>
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { goodsOrderApi } from '@/api/goodsOrder'
  import { permissionMixin } from '@/mixins/permissionMixin'
  import { getExport } from '@/api/exportFile'
  import orderChangeStatusDialog from './components/orderChangeStatusDialog'
  import orderChangeStatusDialog2 from './components/orderChangeStatusDialog2'
  import orderChangeStatusDialogSd from './components/orderChangeStatusDialogSd'
  import orderChangeStatusDialogWl from './components/orderChangeStatusDialogWl'
  import orderChangeStatusDialogAdd from './components/orderChangeStatusDialogAdd'
  import buttomButton from '@/components/buttomButton'

  export default {
    mixins: [permissionMixin],
    components: {
      buttomButton,
      orderChangeStatusDialogAdd,
      orderChangeStatusDialogWl,
      orderChangeStatusDialog,
      orderChangeStatusDialog2,
      orderChangeStatusDialogSd,
      ThreeLevelRoute
    },
    data() {
      return {
        requestParamWl: {
          receiverAddress: '',
          addressId: '',
          waybillNo: '',
          freight: '',
        },
        wlData: [],
        wlDataSize: '',
        orderData: '',
        isShowDialog: false,
        orderDataWl: '',
        isShowDialogWl: false,
        orderData1: '',
        isShowDialog1: false,
        orderData2: '',
        isShowDialog2: false,
        isShowDialog3: false,
        pictureZoomShow: false,
        saleType: '',
        imageZoom: '',
        fileUrl: fileUrl,
        queryParam: {
          id: '',
          keyword: '',
          size: '',
          orderNo: '',
          inventoryId: '',
          status: '',
          saleType: '',
          shelvesPriceFrom: '',
          goodType: '',
          shelvesPriceTo: '',
          freightFrom: '',
          freightTo: '',
          poundageFrom: '',
          poundageTo: '',
          theirPriceFrom: '',
          theirPriceTo: '',
          addressId: '',
          waybillNo: '',
          createTimeFrom: '',
          createTimeTo: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          sellTimeFrom: '',
          sellTimeTo: '',
          successTimeFrom: '',
          successTimeTo: '',
          pageSize: 10,
          pageNum: 1
        },
        typeList: [],
        addressList: [],
        saleTypeList: [],
        statusList: [],
        dataStatusList: [],
        sellTime: '',
        successTime: [],
        createTime: '',
        updateTime: '',
        selectedId: [],
        ids: [],
        tableData: [],
        totalCount: 1
      }
    },
    created() {
      const { actNo , months , orderNo,saleType } = this.$route.query
      if (saleType ) {
        this.saleType = saleType
        this.queryParam.saleType = saleType
      }
      this.queryParam.keyword = actNo
      this.queryParam.orderNo = orderNo
      if (this.queryParam.keyword || this.queryParam.orderNo || this.queryParam.saleType) {
        this.getPage()
      }
      this.months = months
      if (this.months) {
        this.successTime[0] = this.months
        this.successTime[1] = this.months
        this.queryParam.successTimeFrom = this.months
        this.queryParam.successTimeTo = this.months
        this.getPage()
      }
    },
    mounted() {
      this.getPage()
      this.listSysDict()
    },
    updated () {
      this.$nextTick(() => {
        this.$refs['queryTable'].doLayout();
      })
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property == 'id'
            || column.property == 'size'
            || column.property == 'status'
            || column.property == 'saleType'
            || column.property == 'addressId'
            || column.property == 'waybillNo'
            || column.property == 'successTime'
            || column.property == 'sellTime'
          ){
            return
          }
          const values = data.map(item=>Number(item[column.property]))
          const flag = values.every(item=>isNaN(item))
          if(flag){
            return sums[index] = ""
          }else{
            sums[index] = values.reduce((total,item)=>total+item);
            sums[index] = Math.round(sums[index]*100)/100;
            sums[index] += ""
          }
          // const values = data.map(item => Number(item[column.property]));
          // if (!values.every(value => isNaN(value))) {
          //   sums[index] = values.reduce((prev, curr) => {
          //     const value = Number(curr);
          //     if (!isNaN(value)) {
          //       let res = prev + curr;
          //       return res
          //     } else {
          //       return prev;
          //     }
          //   }, 0);
          //   sums[index] += '';
          // } else {
          //   sums[index] = '';
          // }
        });
        return sums;
      },
      gotoWl(orderData) {
        this.requestParamWl.addressId = orderData.addressId
        this.requestParamWl.waybillNo = orderData.waybillNo
        if (!this.requestParamWl.waybillNo) {
          this.$message.error('没有物流单号')
          return
        }
        goodsOrderApi.waybillNoList(this.requestParamWl).then(res => {
          if (res.subCode === 1000) {
            if (res.data.list.length) {
              this.wlDataSize = res.data.list.length
              this.requestParamWl.receiverAddress = res.data.receiverAddress
              this.requestParamWl.freight = res.data.realAmount
              this.wlData = []
              for (let i = 0; i < res.data.list.length; i++) {
                let dataInfo = res.data.list[i]
                let status = '运输中'
                if (dataInfo.message.indexOf("已收取快件") >= 0) {
                  status = '已揽件'
                } else if (dataInfo.message.indexOf("可查看签收人信息") >= 0) {
                  status = '已签收'
                }
                dataInfo.status = status
                this.wlData.push(dataInfo)
              }
              this.isShowDialogWl = true
            } else {
              this.$message.error("暂无物流信息，请核对物流单号")
            }
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      changeStatusDialog1(row) {
        this.orderData1 = row
        this.isShowDialog1 = true
      },
      closDialog1() {
        this.isShowDialog1 = false
      },
      closDialogwl() {
        this.isShowDialogWl = false
      },
      refreshPage1() {
        this.isShowDialog1 = false
        this.getPage()
      },
      changeStatusDialog(row) {
        this.orderData = row
        this.isShowDialog = true
      },
      closDialog() {
        this.isShowDialog = false
      },
      refreshPage() {
        this.isShowDialog = false
        this.getPage()
      },
      changeStatusDialog2(row) {
        this.orderData2 = row
        // this.orderData2.status = 3
        this.isShowDialog2 = true
      },
      closDialog2() {
        this.isShowDialog2 = false
      },
      refreshPage2() {
        this.isShowDialog2 = false
        this.getPage()
      },
      changeStatusDialog3() {
        if (this.ids.length == 0) {
          this.$alert('没有选中数据')
          return
        }
        this.isShowDialog3 = true
      },
      closDialog3() {
        this.isShowDialog3 = false
      },
      refreshPage3() {
        this.isShowDialog3 = false
        this.getPage()
      },
      changeStatus(row) {
        goodsOrderApi.changeStatus(row).then(res => {
          if (res.subCode === 1000) {
            this.$store.dispatch('apply/orderInfo')
            this.$message.success(res.subMsg)
          } else {
            this.$message.error(res.subMsg)
          }
          this.getPage()
        })
      },
      avatarShow(e) {
        this.imageZoom = e
        this.pictureZoomShow = true
      },
      successTimeChange() {
        if (this.successTime) {
          this.queryParam.successTimeFrom = this.successTime[0]
          this.queryParam.successTimeTo = this.successTime[1]
        } else {
          this.queryParam.successTimeFrom = null
          this.queryParam.successTimeTo = null
        }
      },
      sellTimeChange() {
        if (this.sellTime) {
          this.queryParam.sellTimeFrom = this.sellTime[0]
          this.queryParam.sellTimeTo = this.sellTime[1]
        } else {
          this.queryParam.sellTimeFrom = null
          this.queryParam.sellTimeTo = null
        }
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
      updateTimeChange() {
        if (this.updateTime) {
          this.queryParam.updateTimeFrom = this.updateTime[0]
          this.queryParam.updateTimeTo = this.updateTime[1]
        } else {
          this.queryParam.updateTimeFrom = null
          this.queryParam.updateTimeTo = null
        }
      },
      getPage() {
        goodsOrderApi.page(this.queryParam).then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data ? res.data.list : []
            this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
            if (this.totalCount >0) {
              for (let i = 0; i <this.tableData.length ; i++) {
                let data1 = this.tableData[i]
                let forecastProfits = data1.theirPrice - data1.price - 10
                forecastProfits = parseFloat(forecastProfits).toFixed(2)
                this.tableData[i].forecastProfits = forecastProfits
              }
            }
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      listSysDict() {
        let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
          localStorage.getItem('sysDictList')) : []
        this.addressList = sysDictList.filter(item => item.typeValue == 38)
        this.statusList = sysDictList.filter(item => item.typeValue == 37)
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
        this.saleTypeList = sysDictList.filter(item => item.typeValue == 46)
        this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
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
        this.$router.push({ path: '/goodsOrder/list/detail', query: { id, type } })
      },
      jumpactNo(actNo) {
        this.$router.push({ path: '/goodsBase/goodsInventory', query: { actNo } })
      },
      // goDel(id) {
      //   goodsOrderApi.delById(id).then(res => {
      //     if (res.subCode === 1000) {
      //       this.$message.success(res.subMsg)
      //       this.getPage()
      //     } else {
      //       this.$message.error(res.subMsg)
      //     }
      //   })
      // },
      goDel(id) {
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          goodsOrderApi.delById(id).then(res => {
            if (res.subCode === 1000) {
              this.$store.dispatch('apply/orderInfo')
              this.$message.success(res.subMsg)
              this.getPage()
            } else {
              this.$message.error(res.subMsg)
            }
          })
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
          goodsOrderApi.batchdelete(this.ids).then(res => {
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
        getExport('/gw/op/v1/goodsOrder/export', data, 'post', '商品订单信息列表').then(() => {
          this.$emit('refresh')
        })
      },
      resetHandle() {
        this.queryParam = {
          id: '',
          size: '',
          keyword: '',
          orderNo: '',
          inventoryId: '',
          status: '',
          saleType: '',
          shelvesPriceFrom: '',
          shelvesPriceTo: '',
          goodType: '',
          freightFrom: '',
          freightTo: '',
          poundageFrom: '',
          poundageTo: '',
          theirPriceFrom: '',
          theirPriceTo: '',
          addressId: '',
          waybillNo: '',
          createTimeFrom: '',
          createTimeTo: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          sellTimeFrom: '',
          sellTimeTo: '',
          successTimeFrom: '',
          successTimeTo: '',
          pageSize: 10,
          pageNum: 1
        }
        this.createTime = ''
        this.updateTime = ''
        this.sellTime = ''
        this.successTime = ''
        if(this.saleType) {
          this.queryParam.saleType = this.saleType
        }
        this.getPage()
      }
    }
  }
</script>
