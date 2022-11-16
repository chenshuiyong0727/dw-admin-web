<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.id" placeholder="订单主键"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.orderNo" placeholder="订单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.inventoryId" placeholder="库存编号"></el-input>
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
            <el-input v-model.trim="queryParam.addressId" placeholder="地址编号"></el-input>
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
      </el-row>
    </el-form>

    <el-table style="margin-top: 20px" border :data="tableData" @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="id" label="订单主键"/>
      <el-table-column align="center" prop="orderNo" label="订单号"/>
      <el-table-column align="center" label="图片" width="120" >
        <template slot-scope="scope">
          <img  v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"  @click="avatarShow(scope.row.imgUrl)" >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="actNo" label="货号"/>
      <el-table-column align="center" prop="size" label="尺码"/>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">{{ scope.row.status | dictToDescTypeValue(37) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="shelvesPrice" label="原售价"/>
      <el-table-column align="center" prop="freight" label="运费"/>
      <el-table-column align="center" prop="poundage" label="手续费"/>
      <el-table-column align="center" prop="subsidiesPrice" label="补贴价"/>
      <el-table-column align="center" prop="theirPrice" label="到手价"/>
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
<!--            //  下架	1-->
<!--            //  已上架	2-->
<!--            //  待发货	3-->
<!--            //  已发货	4-->
<!--            //  已揽件	5-->
<!--            //  已收货	6-->
<!--            //  成功	7-->
<!--            //  瑕疵	8-->
<!--            //  取消	9-->
<!--            //  发货后取消	10-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 0">上架</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="[1,9,10] .includes(scope.row.status)  ">上架</el-button>-->
            <el-button type="text" @click="changeStatus(scope.row)" >待发货</el-button>
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 3">已发货</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 4">已揽件</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 5">已收货</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 6">成功</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 6">瑕疵</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 1">瑕疵</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 1">取消</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 1">发货后取消</el-button>-->
<!--            <el-button type="text" @click="changeStatus(scope.row)" v-if="scope.row.status == 1">已上架</el-button>-->

<!--            <el-button type="text" @click="goDetail(scope.row.id , 1)">查看-->
<!--            </el-button>-->
<!--            <el-button type="text" @click="goDetail(scope.row.id , 2)">编辑-->
<!--            </el-button>-->
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
        <img :src="fileUrl + imageZoom" alt="" width="100%" height="100%">
      </div>
    </div>
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { goodsOrderApi } from '@/api/goodsOrder'
import { permissionMixin } from '@/mixins/permissionMixin'
import { getExport } from '@/api/exportFile'

export default {
  mixins: [permissionMixin],
  components: {
    ThreeLevelRoute
  },
  data() {
    return {
      pictureZoomShow: false,
      imageZoom: '',
      fileUrl: fileUrl,
      queryParam: {
        id: '',
        orderNo: '',
        inventoryId: '',
        status: 8,
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
      statusList: [],
      dataStatusList: [],
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
  methods: {
    changeStatus(row) {
      goodsOrderApi.changeStatus(row).then(res => {
        if (res.subCode === 1000) {
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
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    listSysDict() {
      let sysDictList = sessionStorage.getItem('sysDictList') ? JSON.parse(
        sessionStorage.getItem('sysDictList')) : []
      this.statusList = sysDictList.filter(item => item.typeValue == 37)
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
      this.$router.push({ path: '/goodsOrder/list/detail', query: { id, type } })
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
        inventoryId: '',
        status:8,
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
