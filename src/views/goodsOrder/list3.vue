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
           <el-table-column align="center" width="110" prop="orderNo" label="订单号">
       <template slot-scope="scope">
         <a style="color: #20a0ff" @click="jumpactOrder(scope.row.orderNo)"> {{ scope.row.orderNo }}</a>
       </template>
     </el-table-column>
      <el-table-column align="center" label="图片" width="120">
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
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">{{ scope.row.status | dictToDescTypeValue(37) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="saleType" label="销售类型">
        <template slot-scope="scope">{{ scope.row.saleType | dictToDescTypeValue(46) }}</template>
      </el-table-column>
     <el-table-column align="center" prop="sellTime" label="发货截止时间">
       <template slot-scope="scope">
          <span class="color-danger">
              {{scope.row.deliveryDeadlineTime | formateTime }}
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
      <el-table-column align="center" prop="" label="预估利润">
        <template v-if="scope.row.theirPrice && scope.row.price " slot-scope="scope">
          {{(scope.row.theirPrice - scope.row.price - 10 ) | numFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="地址"/>
      <el-table-column align="center" prop="waybillNo" label="运单编号"/>
      <el-table-column align="center" prop="sellTime" label="出售时间">
        <template slot-scope="scope">{{scope.row.sellTime | formateTime }}</template>
      </el-table-column>
      <el-table-column align="center" prop="successTime" label="交易成功时间">
        <template slot-scope="scope">{{scope.row.successTime | formateTime() }}</template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | formateTime()
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间">
        <template slot-scope="scope">{{scope.row.updateTime | formateTime()
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="130"
                       v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="changeStatusDialog(scope.row)">发货</el-button>
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
    <order-change-status-dialog3
      v-if="isShowDialog "
      :orderData="orderData"
      @refreshPage="refreshPage"
      @closDialog="closDialog"/>
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
import orderChangeStatusDialogSd from './components/orderChangeStatusDialogSd'
  import buttomButton from '@/components/buttomButton'
  import { permissionMixin } from '@/mixins/permissionMixin'
  import { getExport } from '@/api/exportFile'
  import orderChangeStatusDialog3 from './components/orderChangeStatusDialog3'

  export default {
    mixins: [permissionMixin],
    components: {
      buttomButton,
      orderChangeStatusDialog3,
      orderChangeStatusDialogSd,
      ThreeLevelRoute
    },
    data() {
      return {
        orderData: '',
        isShowDialog: false,
        pictureZoomShow: false,
        imageZoom: '',
        fileUrl: fileUrl,
        queryParam: {
          id: '',
          orderNo: '',
          keyword: '',
          size: '',
          inventoryId: '',
          status: 3,
          shelvesPriceFrom: '',
          shelvesPriceTo: '',
          freightFrom: '',
          freightTo: '',
          saleType: '',
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
        addressList: [],
        saleTypeList: [],
        statusList: [],
        dataStatusList: [],
        isShowDialog3: false,
        sellTime: '',
        successTime: '',
        createTime: '',
        updateTime: '',
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
    updated () {
      this.$nextTick(() => {
        this.$refs['queryTable'].doLayout();
      })
    },
    methods: {
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
      jumpactOrder(orderNo) {
      this.$router.push({ path: '/goodsOrder/list', query: { orderNo } })
    },
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
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });
        return sums;
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
          } else {
            this.$message.error(res.subMsg)
          }
        })
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
      listSysDict() {
        let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
          localStorage.getItem('sysDictList')) : []
        this.addressList = sysDictList.filter(item => item.typeValue == 38)
        this.statusList = sysDictList.filter(item => item.typeValue == 37)
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
        this.saleTypeList = sysDictList.filter(item => item.typeValue == 46)
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
      goDel(id) {
        goodsOrderApi.delById(id).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.getPage()
          } else {
            this.$message.error(res.subMsg)
          }
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
          orderNo: '',
          keyword: '',
          size: '',
          inventoryId: '',
          status: 3,
          shelvesPriceFrom: '',
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
          saleType: '',
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
        this.getPage()
      }
    }
  }
</script>
