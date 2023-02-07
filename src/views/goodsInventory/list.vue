<template>
  <three-level-route>
    <div class="page-container container-flex">
      <div class="container-left" v-if="1==1">
        <el-form ref="form">
          <el-row class="query-form">
            <el-col :span="8">
              <el-form-item size="small">
                <el-select v-model="queryParam1.inventoryTo" @change="search">
                  <el-option
                    v-for="item in inventoryToList"
                    :key="item.fieldValue"
                    :label="item.fieldName"
                    :value="+item.fieldValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item size="small">
                <el-input v-model.trim="queryParam1.keyword" placeholder="货号">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="query-form">
            <el-col>
              <el-form-item size="small">
                <el-button type="primary" size="small" @click="search">查询
                </el-button>
                <el-button type="primary" size="small"
                           @click="showInventoryDrawer()">新增库存
                </el-button>
                <el-button type="primary" size="small"
                           @click="viewAll()">库存明细
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table style="margin-top: 00px" border :data="tableData1" @row-click="rowClick">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column align="center" prop="actNo" width="100" label="货号">
            <template slot-scope="scope">
              <a style="color: #20a0ff" @click="viewAll(scope.row.actNo)"> {{ scope.row.actNo }}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="图片">
            <template slot-scope="scope">
              <img v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"
                   @click="avatarShow(scope.row.imgUrl)">
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            @size-change="reSearchHandle1"
            @current-change="pageChangeHandle1"
            :current-page="queryParam1.pageNum"
            :pager-count="3"
            :page-sizes="[5,10, 20, 50, 100, 200]"
            :page-size="queryParam1.pageSize"
            layout="total, sizes, pager,jumper"
            :total="totalCount1">
          </el-pagination>
        </el-row>
      </div>
      <div class="container-right">
        <div
          style="display: flex; justify-content: space-between; align-items: center;height: 50px;"
        >
          <el-row class="clearfix btm-distance">
            <div>
              <img
                v-if="imgUrl"
                :src="fileUrl + imgUrl"
                style="width: 80px;height: 75px;border-radius: 10px;"
                @click="avatarShow(imgUrl)"
              />
            </div>
          </el-row>
          <el-row class="clearfix btm-distance" style="padding-left: 15px;">
            <div class="overview">
              <p><strong>库存数量</strong></p>
              <p>{{inventoryData.inventory}} / {{inventoryData.oldInventory}} </p>
            </div>
          </el-row>
          <el-row class="clearfix btm-distance">
            <div class="overview">
              <p><strong>库存成本</strong></p>
              <p>{{inventoryData.price}}</p>
            </div>
          </el-row>
          <el-row class="clearfix btm-distance">
            <div class="overview">
              <p><strong>市值总额</strong></p>
              <p>{{inventoryData.dwPrice}}</p>
            </div>
          </el-row>
          <el-row class="clearfix btm-distance">
            <div class="overview">
              <p><strong>入库金额</strong></p>
              <p>{{inventoryData.inputPrice}}</p>
            </div>
          </el-row>
          <el-row class="clearfix btm-distance">
            <div class="overview">
              <p><strong>实际利润</strong></p>
              <p>{{inventoryData.profits}}</p>
            </div>
          </el-row>
          <el-row class="clearfix btm-distance">
            <div class="overview">
              <p><strong>利润比例</strong></p>
              <p>{{(inventoryData.profits / inventoryData.inputPrice ) * 100 | numFilter}} %</p>
            </div>
          </el-row>
          <el-form ref="form">
            <el-row type="flex">
              <el-button type="primary" size="small" style="margin-right: 10px"
                         @click="goDetail()">新增尺码
              </el-button>
              <el-button type="primary" size="small" style="margin-right: 10px"
                         @click="jumpactNo()">查看订单
              </el-button>
            </el-row>
          </el-form>
        </div>
        <el-table style="margin-top: 20px" border :data="tableData">

<!--          <el-table-column align="center" prop="size" width="50" label="尺码"/>-->
          <el-table-column align="center" prop="size"  width="60" label="尺码">
            <template scope="scope">
              <el-button
                type="text"
                @click="changeStatusDialog1(scope.row)">{{scope.row.size}}
              </el-button>
            </template>
          </el-table-column>
<!--          <el-table-column align="center" prop="size" width="100" label="尺码">-->
<!--            <template slot-scope="scope">-->
<!--&lt;!&ndash;              <div class="input-box">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-input size="small" v-model="scope.row.price"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--              <el-select v-model="scope.row.size">-->
<!--&lt;!&ndash;              <el-select v-model="scope.row.size" @change="changeStatus(scope.row)">&ndash;&gt;-->
<!--                <el-option-->
<!--                  v-for="item in sizeList"-->
<!--                  :key="item.id"-->
<!--                  :label="item.size"-->
<!--                  :value="+item.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column align="center" prop="oldInventory" width="50" label="原始库存"/>-->
<!--          <el-table-column align="center" prop="" width="50" label="剩余库存">-->
          <el-table-column align="center" prop="oldInventory" label="原始库存">
            <template scope="scope">
              <div class="input-box">
                <el-input size="small" v-model="scope.row.oldInventory"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="inventory" label="剩余库存">
            <template scope="scope">
              <div class="input-box">
                <el-input size="small" v-model="scope.row.inventory"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="successCount" width="50" label="成功数"/>
          <el-table-column align="center" prop="galleryCount" width="50" label="上架数"/>
          <el-table-column align="center" prop="price" label="入库价">
            <template scope="scope">
              <div class="input-box">
                <el-input size="small" v-model="scope.row.price"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="dwPrice" label="得物价">
            <template scope="scope">
              <div class="input-box">
                <el-input size="small" v-model="scope.row.dwPrice"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="手续费">
            <template v-if="scope.row.dwPrice" slot-scope="scope">{{(scope.row.dwPrice * 0.075 + 38
              + 8.5) | numFilter}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="到手单价">
            <template v-if="scope.row.dwPrice" slot-scope="scope">{{(scope.row.dwPrice -
              (scope.row.dwPrice * 0.075 + 38 + 8.5)) | numFilter}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="预计利润">
            <template v-if="scope.row.dwPrice" slot-scope="scope">
              <span
                :style="(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) > 50 ? 'color: red' : ''"
              >
                {{(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) | numFilter}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="总入库价">
            <template slot-scope="scope">{{scope.row.price * scope.row.oldInventory}}</template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="入库时间">
            <template slot-scope="scope">{{scope.row.createTime | formateTime() }}</template>
          </el-table-column>
          <el-table-column align="center" prop="id" label="编号"/>
          <el-table-column fixed="right" align="center" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="update(scope.row)">修改</el-button>
              <el-button type="text" class="color-danger" @click="goDel(scope.row.id)">删除</el-button>
              <el-button
                type="text"
                v-if="scope.row.inventory > scope.row.galleryCount"
                @click="changeStatusDialog(scope.row)">上架
              </el-button>
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
      </div>
      <inventoryDetail ref="inventory-detail-edit"/>
    </div>
    <!-- </three-level-route> -->
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="fileUrl + imageZoom" alt="" width="100%" >
      </div>
    </div>
    <change-status-dialog
      v-if="isShowDialog "
      :sizeData="sizeData"
      @refreshPage="refreshPage"
      @closDialog="closDialog"/>
    <change-status-dialog1
      v-if="isShowDialog1 "
      :sizeData="sizeData1"
      :sizeList="sizeList"
      @refreshPage="refreshPage1"
      @closDialog="closDialog1"/>
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { goodsInventoryApi } from '@/api/goodsInventory'
  import { permissionMixin } from '@/mixins/permissionMixin'
  import InventoryDetail from './components/inventoryDetail'
  import changeStatusDialog from './components/changeStatusDialog'
  import changeStatusDialog1 from './components/changeStatusDialog1'
  import { goodsBaseApi } from '@/api/goodsBase'

  export default {
    mixins: [permissionMixin],
    components: {
      ThreeLevelRoute,
      changeStatusDialog,
      changeStatusDialog1,
      InventoryDetail
    },
    data() {
      return {
        sizeList: '',
        sizeData: '',
        sizeData1: '',
        imageZoom: '',
        isShowDialog: false,
        isShowDialog1: false,
        queryParam1: {
          keyword: '',
          pageSize: 5,
          inventoryTo: 1,
          pageNum: 1
        },
        queryParam: {
          id: '',
          goodsId: '',
          pageSize: 10,
          pageNum: 1
        },
        pictureZoomShow: false,
        fileUrl: fileUrl,
        inventoryToList: [
          { fieldValue: 1, fieldName: '现货' }, { fieldValue: 0, fieldName: '售空' },
          { fieldValue: 2, fieldName: '未上架' }
        ],
        dataStatusList: [],
        imgUrl: '',
        actNo: '',
        tableData: [],
        tableData1: [],
        totalCount1: 1,
        totalCount: 1,
        inventoryData: {
          profits: '',
          inventory: '',
          oldInventory: '',
          inventoryCost: '',
          dwPrice: ''
        }
      }
    },
    created() {
      const { actNo } = this.$route.query
      // this.goodsId = goodsId
      this.queryParam1.keyword = actNo
      if (this.queryParam1.keyword) {
        this.page()
        // this.getDetailById(this.goodsId)
      }
    },
    mounted() {
      this.page()
      this.listSysDict()
      this.handleChange()
    },
    methods: {
      handleChange() {
        goodsBaseApi.listDropDownSizes({ type: '' }, false).then(res => {
          console.info(res)
          if (res.subCode === 1000) {
            this.sizeList = res.data
          }
        })
      },
      changeStatusDialog(row) {
        this.sizeData = row
        this.isShowDialog = true
      },
      closDialog() {
        this.isShowDialog = false
      },
      changeStatusDialog1(row) {
        console.info(row)
        this.sizeData1 = row
        this.isShowDialog1 = true
      },
      closDialog1() {
        this.isShowDialog1 = false
      },
      refreshPage() {
        this.isShowDialog = false
        this.pageGoods()
      },
      refreshPage1() {
        this.isShowDialog1 = false
        this.pageGoods()
      },
      avatarShow(e) {
        this.imageZoom = e
        this.pictureZoomShow = true
      },
      goDetail() {
        // *** 根据真实路径配置地址
        if (!this.queryParam.goodsId) {
          this.$alert('没有选中数据')
          return
        }
        let goodsId = this.queryParam.goodsId
        this.$router.push({ path: '/goodsBase/goodsInventory/detail', query: { goodsId } })
      },
      jumpactNo() {
        if (!this.actNo) {
          this.$alert('没有选中数据')
          return
        }
        let actNo = this.actNo
        this.$router.push({ path: '/goodsOrder/list', query: { actNo } })
      },
      rowClick(row) {
        console.info(row)
        this.pageGoods(row.id)
        this.imgUrl = row.imgUrl
        this.actNo = row.actNo
      },
      showInventoryDrawer() {
        this.$refs['inventory-detail-edit'].show()
      },
      viewAll(actNo) {
        this.$router.push({ path: '/goodsBase/goodsInventory/dataDetail', query: { actNo } })
        //
        // this.$router.push({path: '/goodsBase/goodsInventory/dataDetail'})
      },
      page() {
        goodsInventoryApi.page(this.queryParam1).then(res => {
          if (res.subCode === 1000) {
            this.tableData1 = res.data ? res.data.list : []
            this.totalCount1 = res.data ? res.data.pageInfo.totalCount : 0
            if (this.totalCount1 == 0) {
              if (this.queryParam1.inventoryTo == 1) {
                this.queryParam1.inventoryTo = 0
                this.page()
              }
            } else {
              this.imgUrl = this.tableData1[0].imgUrl
              this.actNo = this.tableData1[0].actNo
              this.pageGoods(this.tableData1[0].id)
            }
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      pageGoods(goodsId) {
        if (goodsId) {
          this.queryParam.goodsId = goodsId
        }
        goodsInventoryApi.pageGoods(this.queryParam).then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data ? res.data.list : []
            this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
            this.inventoryData = res.data.goodsInventoryPageVo ? res.data.goodsInventoryPageVo
              : this.inventoryData
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
        this.pageGoods()
      },
      reSearchHandle(size) {
        this.queryParam.pageSize = size
        this.queryParam.pageNum = 1
        this.pageGoods()
      },
      pageChangeHandle1(currentPage) {
        this.queryParam1.pageNum = currentPage
        this.page()
      },
      reSearchHandle1(size) {
        this.queryParam1.pageSize = size
        this.queryParam1.pageNum = 1
        this.page()
      },
      goDel(id) {
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          goodsInventoryApi.delById(id).then(res => {
            if (res.subCode === 1000) {
              this.$message.success(res.subMsg)
              this.pageGoods()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      },
      update(row) {
        if (row.oldInventory < row.inventory) {
          this.$message.error('原始库存小于剩余库存')
          return
        }
        this.$confirm('是否修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.createTime = null
          goodsInventoryApi.update(row).then(res => {
            if (res.subCode === 1000) {
              this.$message.success(res.subMsg)
              this.pageGoods(row.goodsId)
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      },
      changeStatus(row) {
        console.info(row)
      },
      search() {
        this.queryParam1.pageNum = 1
        this.page()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    height: 100%;

    .container-left {
      h5 {
        font-size: 14px;
        font-weight: bold;
        /*border-bottom: 1px solid #ddd;*/
        margin: 0;
        padding: 0 0 10px 0;
      }

      .select {
        padding-top: 15px;
      }

      .project-list {
        li {
          padding: 10px 0;

          &.on {
            a {
              color: rgb(64, 158, 255);
              text-decoration: underline
            }
          }
        }
      }
    }

    .container-right {
      .list {
        border-top: 1px solid #ddd;
        padding-top: 15px;
        margin-top: 15px;

        .from-title {
          background: #eee;
          padding: 0 15px;
        }

        .form-flex {
          line-height: 40px;
        }
      }
    }
  }

  .no-data p {
    text-align: center;
    padding-top: 100px;
  }

  .overview {
    padding: 10px 10px;
    border-radius: 5px;
    background: #eee;
    /*    height: 135px;
        width: 195px;*/
    margin-right: 15px;
    float: left;

    strong {
      /*font-size: 16px;*/
      color: #111;
      padding-bottom: 5px;
      display: inline-block;
    }

    p {
      line-height: 25px;
    }
  }

  a {
    color: #409EFF;
  }
</style>

