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
            <el-input v-model.trim="queryParam.actNo" placeholder="货号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.size" placeholder="尺码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-search"
                     @click="search">查询
          </el-button>
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-refresh"
                     @click="resetHandle">重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table height="600" style="margin-top: 20px" border :data="tableData">
      <el-table-column align="center" prop="actNo" width="100" fixed="left" label="货号"/>
      <el-table-column align="center" label="图片" fixed="left">
        <template slot-scope="scope">
          <img v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"
               @click="avatarShow(scope.row.imgUrl)">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="size" width="50" label="尺码" sortable/>
      <el-table-column align="center" prop="price" label="入库价" sortable>
        <template scope="scope">
          <div class="input-box">
            <el-input size="small" v-model="scope.row.price"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="dwPrice" label="得物价" sortable>
        <template scope="scope">
          <div class="input-box">
            <el-input size="small" v-model="scope.row.dwPrice"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="" label="预计利润" sortable>
        <template v-if="scope.row.dwPrice" slot-scope="scope">
          <!--              style="color: red"-->
          <span
            :style="(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) > 50 ? 'color: red' : ''"
          >
                {{(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) | numFilter}}
              </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="oldInventory" width="50" label="原始库存" sortable/>
      <el-table-column align="center" prop="inventory" width="50" label="剩余库存" sortable/>
      <el-table-column align="center" prop="successCount" width="80" label="成功数" sortable/>
      <el-table-column align="center" prop="" label="总数(库存+成功数)" sortable>
        <template slot-scope="scope">{{scope.row.oldInventory}}
        </template>
      </el-table-column>
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
      <el-table-column align="center" prop="" label="到手单价" sortable sortable>
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
        <img :src="fileUrl + imageZoom" alt="" width="100%" >
      </div>
    </div>
    <change-status-dialog
      v-if="isShowDialog "
      :sizeData="sizeData"
      @refreshPage="refreshPage"
      @closDialog="closDialog"/>
  </div>
</template>

<script>
  import { goodsInventoryApi } from '@/api/goodsInventory'
  import changeStatusDialog from './components/changeStatusDialog'

  export default {
    components: {
      changeStatusDialog
    },
    data() {
      return {
        sizeData: '',
        imageZoom: '',
        isShowDialog: false,
        queryParam: {
          id: '',
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
        dataStatusList: [],
        imgUrl: '',
        actNo: '',
        tableData: [],
        tableData1: [],
        totalCount1: 1,
        totalCount: 1
      }
    },
    created() {
      const { actNo } = this.$route.query
      this.queryParam.actNo = actNo
      if (this.queryParam.actNo) {
        this.pageGoods()
      }
    },
    mounted() {
      this.pageGoods()
      this.listSysDict()
    },
    methods: {
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
      jumpactNo() {
        if (!this.actNo) {
          this.$alert('没有选中数据')
          return
        }
        let actNo = this.actNo
        this.$router.push({ path: '/goodsOrder/list', query: { actNo } })
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
          id: '',
          inventory: 1,
          inventoryFrom: '',
          inventoryTo: '',
          size: '',
          actNo: '',
          goodsId: '',
          pageSize: 10,
          pageNum: 1
        }
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

