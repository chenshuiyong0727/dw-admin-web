<template>
  <div class="page-container">
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.inventory" @change="change1">
              <el-option
                v-for="item in inventoryToList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.today">
              <el-option label="特殊条件" value=""></el-option>
              <el-option
                v-for="item in todayList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.warehouseId">
              <el-option label="仓库" value=""></el-option>
              <el-option
                v-for="item in warehouseList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.actNo" placeholder="关键词（货号、商品名）"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.size" placeholder="尺码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="syncTime"
              type="daterange"
              range-separator="至"
              start-placeholder="同步时间"
              end-placeholder="同步时间"
              @change="syncTimeChange"
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
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-search"
                     @click="search">查询
          </el-button>
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-refresh"
                     @click="resetHandle">重置
          </el-button>
          <el-button type="primary" size="small" style="margin-right: 10px"
                     @click="handleClick">移动仓库
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <buttomButton style="z-index: 9999" :tableRef="this.$refs['queryTable']"></buttomButton>
    <el-table show-summary     :summary-method="getSummaries"  ref="queryTable" height="600" style="margin-top: 20px" border :data="tableData" @selection-change="selected">
      <el-table-column type="selection" width="55"></el-table-column>
<!--      <el-table-column align="center" prop="actNo" width="100" fixed="left" label="货号"/>-->
<!--      <el-table-column align="center" prop="goodsName" width="150" fixed="left" label="商品名"/>-->
<!--      -->
      <el-table-column align="center" width="100" prop="actNo" label="货号">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactNo(scope.row.goodsId, 1)"> {{ scope.row.actNo }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactNo(scope.row.goodsId , 1)"> {{ scope.row.goodsName }}</a>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img" class="userPic"
               @click="avatarShow(scope.row.img)">
          <img v-if="!scope.row.img && scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl"
               class="userPic" @click="avatarShow(fileUrl+scope.row.imgUrl)">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="size" width="50" label="尺码" sortable/>
      <el-table-column align="center" prop="warehouseId" label="仓库">
        <template v-if="scope.row.warehouseId" slot-scope="scope">{{ scope.row.warehouseId |
          dictToDescTypeValue(40) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="syncTime" label="同步时间" width="100" sortable>
        <template slot-scope="scope">{{scope.row.syncTime | formateTime() }}</template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="入库价" sortable>
        <template scope="scope">
          <div class="input-box">
            <el-input size="small" v-model="scope.row.price"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="difference" label="加入后差额" sortable>
        <template  slot-scope="scope">
          <strong v-if="scope.row.thisTimePrice" :class="scope.row.difference > 0 ? 'color-danger' : 'color-success'">{{ scope.row.difference}}</strong>
          <STRONG class="color-danger" v-else>售空</STRONG>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" prop="thisTimePrice" width="80" label="球鞋仓库价" sortable/>-->
      <el-table-column align="center" prop="thisTimePrice"  width="80"  label="球鞋仓库价" sortable>
        <template  slot-scope="scope">
          <span v-if="scope.row.thisTimePrice">{{ scope.row.thisTimePrice}}</span>
          <STRONG class="color-danger" v-else>售空</STRONG>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="thisTimeThePrice" width="80" label="球鞋仓库到手价" sortable/>
      <el-table-column align="center" prop="thisTimeProfits" label="球鞋仓库利润价" sortable>
        <template  slot-scope="scope">
          <span
            :style="scope.row.thisTimeProfits > 50 ? 'color: red' : ''"
          >
                {{ scope.row.thisTimeProfits}}
              </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="dwPrice"  label="入库售价"  sortable/>
<!--      <el-table-column align="center" prop="dwPrice" label="入库售价" sortable>-->
<!--        <template scope="scope">-->
<!--          <div class="input-box">-->
<!--            <el-input size="small" v-model="scope.row.dwPrice"></el-input>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" prop="" label="入库售价预计利润" sortable>
        <template v-if="scope.row.dwPrice" slot-scope="scope">
          <!--              style="color: red"-->
          <span
            :style="(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) > 50 ? 'color: red' : ''"
          >
                {{(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) | numFilter}}
              </span>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" prop="" label="预计利润" sortable>-->
<!--        <template v-if="scope.row.dwPrice" slot-scope="scope">-->
<!--          &lt;!&ndash;              style="color: red"&ndash;&gt;-->
<!--          <span-->
<!--            :style="(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) > 50 ? 'color: red' : ''"-->
<!--          >-->
<!--                {{(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) | numFilter}}-->
<!--              </span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" prop="oldInventory" width="50" label="原始库存" sortable/>
      <el-table-column align="center" prop="inventory" width="50" label="剩余库存" sortable/>
      <el-table-column align="center" prop="successCount" width="80" label="成功数" sortable/>
      <el-table-column align="center" prop="galleryCount" width="80" label="上架数" sortable/>
      <el-table-column align="center" prop="" label="总入库价">
        <template slot-scope="scope">{{scope.row.price * scope.row.oldInventory }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="" label="手续费" sortable>
        <template v-if="scope.row.dwPrice" slot-scope="scope">{{(scope.row.dwPrice * 0.075 + 38 +
          8.5) | numFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="" label="到手单价"  sortable>
        <template v-if="scope.row.dwPrice" slot-scope="scope">{{(scope.row.dwPrice -
          (scope.row.dwPrice * 0.075 + 38 + 8.5)) | numFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="入库时间" sortable>
        <template slot-scope="scope">{{scope.row.createTime | formateTime() }}</template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="编号"/>
      <el-table-column fixed="right" align="center" label="操作" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="update(scope.row)">修改</el-button>
          <el-button type="text" @click="goDel(scope.row.id)">删除</el-button>
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
        :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
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
    <change-status-dialog
      v-if="isShowDialog "
      :sizeData="sizeData"
      @refreshPage="refreshPage"
      @closDialog="closDialog"/>
    <change-status-dialog-2
      v-if="isShowDialog2 "
      :ids="ids"
      :warehouseList="warehouseList"
      @refreshPage="refreshPage2"
      @closDialog="closDialog2"/>
  </div>
</template>

<script>
  import { goodsInventoryApi } from '@/api/goodsInventory'
  import changeStatusDialog from './components/changeStatusDialog'
  import changeStatusDialog2 from './components/changeStatusDialog2'
  import buttomButton from '@/components/buttomButton'

  export default {
    components: {
      buttomButton,
      changeStatusDialog2,
      changeStatusDialog
    },
    data() {
      return {
        syncTime: '',
        sizeData: '',
        imageZoom: '',
        isShowDialog: false,
        createTime: [],
        queryParam: {
          syncTimeFrom: '',
          syncTimeTo: '',
          id: '',
          warehouseId: '',
          today: '',
          createTimeFrom: '',
          createTimeTo: '',
          inventory: 1,
          inventoryFrom: '',
          inventoryTo: '',
          size: '',
          actNo: '',
          goodsId: '',
          pageSize: 10,
          pageNum: 1
        },
        pictureZoomShow: false,
        fileUrl: fileUrl,
        // inventory: 1,
        inventoryToList: [
          { fieldValue: 1, fieldName: '现货' }, { fieldValue: 0, fieldName: '售空' },
          { fieldValue: 2, fieldName: '未上架' }
        ],
        todayList: [
          { fieldValue: 1, fieldName: '今日更新' },
          { fieldValue: 2, fieldName: '待上架商品' },
          { fieldValue: 3, fieldName: '待移库商品' },
          { fieldValue: 4, fieldName: '涨价商品' },
          { fieldValue: 5, fieldName: '降价商品' },
          { fieldValue: 6, fieldName: '售空商品' }
        ],
        requestParam: {
          ids: [],
          warehouseId: 2
        },
        selectedId: [],
        ids: [],
        isShowDialog2: false,
        warehouseList: '',
        dataStatusList: [],
        imgUrl: '',
        actNo: '',
        months: '',
        tableData: [],
        tableData1: [],
        totalCount1: 1,
        totalCount: 1
      }
    },
    created() {
      const { actNo, months, warehouseId,today } = this.$route.query
      this.queryParam.actNo = actNo
      this.queryParam.warehouseId = warehouseId
      this.queryParam.today = today
      if (this.queryParam.actNo || this.queryParam.warehouseId || this.queryParam.today) {
        this.pageGoods()
      }
      this.months = months
      if (this.months) {
        this.createTime[0] = this.months
        this.createTime[1] = this.months
        this.queryParam.createTimeFrom = this.months
        this.queryParam.createTimeTo = this.months
        this.pageGoods()
      }
    },
    updated () {
      this.$nextTick(() => {
        this.$refs['queryTable'].doLayout();
      })
    },
    mounted() {
      this.pageGoods()
      this.listSysDict()
    },
    methods: {
      syncTimeChange() {
        if (this.syncTime) {
          this.queryParam.syncTimeFrom = this.syncTime[0]
          this.queryParam.syncTimeTo = this.syncTime[1]
        } else {
          this.queryParam.syncTimeFrom = null
          this.queryParam.syncTimeTo = null
        }
      },
      changeStatusDialog2() {
        this.isShowDialog2 = true
      },
      closDialog2() {
        this.isShowDialog2 = false
      },
      refreshPage2() {
        this.isShowDialog2 = false
        this.pageGoods()
      },
      selected(val) {
        this.selectedId = val
        let temp = []
        for (let i = 0; i < this.selectedId.length; i++) {
          temp.push(this.selectedId[i].id)
        }
        this.ids = temp
      },
      handleClick() {
        this.requestParam.ids = this.ids
        if (!this.ids.length) {
          this.$message.error('请选择尺码')
          return
        }
        this.isShowDialog2 = true
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
      changeStatusDialog(row) {
        this.sizeData = row
        this.isShowDialog = true
      },
      closDialog() {
        this.isShowDialog = false
      },
      refreshPage() {
        this.isShowDialog = false
        this.pageGoods()
      },
      avatarShow(e) {
        this.imageZoom = e
        this.pictureZoomShow = true
      },
      jumpactNo(id , type ) {
          // this.$router.push({ path: '/goodsBase/list/detailNew', query: { id, type }})
         let routeUrl = this.$router.resolve({
          path: '/goodsBase/list/detailNew',
          query: { id, type },
        })
        window.open(routeUrl.href, '_blank')
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
              || column.property == 'warehouseId'
            ){
            return
          }
          // const values = data.map(item => Number(item[column.property]));
          // if (!values.every(value => isNaN(value))) {
          //   sums[index] = values.reduce((prev, curr) => {
          //     const value = Number(curr);
          //     if (!isNaN(value)) {
          //       return prev + curr;
          //     } else {
          //       return prev;
          //     }
          //   }, 0);
          //   sums[index] += '';
          // } else {
          //   sums[index] = '';
          // }
          const values = data.map(item=>Number(item[column.property]))
          const flag = values.every(item=>isNaN(item))
          if(flag){
            return sums[index] = ""
          }else{
            sums[index] = values.reduce((total,item)=>total+item);
            sums[index] = Math.round(sums[index]*100)/100;
            sums[index] += ""
          }
        });
        return sums;
      },
      pageGoods() {
        if (this.queryParam.inventory == 1) {
          this.queryParam.inventoryFrom = 1
          this.queryParam.inventoryTo = ''
        } else if (this.queryParam.inventory == 0) {
          this.queryParam.inventoryFrom = ''
          this.queryParam.inventoryTo = 0
        } else {
          this.queryParam.inventoryFrom = ''
          this.queryParam.inventoryTo = ''
        }
        goodsInventoryApi.pageGoods(this.queryParam).then(res => {
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
        this.warehouseList = sysDictList.filter(item => item.typeValue == 40)
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
        console.info(row)
        this.$confirm('是否修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
      change1() {
        if (this.queryParam.inventory == 1) {
          this.queryParam.inventoryFrom = 1
          this.queryParam.inventoryTo = ''
        } else if (this.queryParam.inventory == 0) {
          this.queryParam.inventoryFrom = ''
          this.queryParam.inventoryTo = 0
        } else {
          this.queryParam.inventoryFrom = ''
          this.queryParam.inventoryTo = ''
        }
        this.pageGoods()
      },
      search() {
        this.queryParam.pageNum = 1
        this.pageGoods()
      },
      resetHandle() {
        this.queryParam = {
          syncTimeFrom: '',
          syncTimeTo: '',
          id: '',
          today: '',
          warehouseId: '',
          inventory: 1,
          inventoryFrom: '',
          inventoryTo: '',
          size: '',
          actNo: '',
          goodsId: '',
          pageSize: 10,
          pageNum: 1
        }
        this.syncTime = ''
        this.search()
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
</style>

