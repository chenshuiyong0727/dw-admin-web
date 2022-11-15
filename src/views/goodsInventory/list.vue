<template>
  <three-level-route>
    <div class="page-container container-flex">
      <div class="container-left">
        <h5>商品列表</h5>
        <el-form ref="form">
          <el-row class="query-form">
            <el-col>
              <el-form-item size="small">
                <el-input v-model.trim="queryParam1.keyword" placeholder="关键词 （货号、尺码）"></el-input>
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
            <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-plus"
                       v-permission:[buttonPermissionArr.searchBtn]="['新增']"
                       @click="showInventoryDrawer()">新增库存
            </el-button>
          </el-row>
        </el-form>

        <el-table style="margin-top: 20px" border :data="tableData1" @row-click="rowClick">

          <el-table-column align="center" prop="actNo" label="货号" />
          <el-table-column align="center" label="图片"  width="120">
            <template slot-scope="scope">
              <img  v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"  @click="avatarShow(scope.row.imgUrl)" >
            </template>
          </el-table-column>
        </el-table>
        <el-row class="top-15">
          <el-pagination
            @size-change="reSearchHandle"
            @current-change="pageChangeHandle"
            :current-page="queryParam1.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryParam1.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalCount1">
          </el-pagination>
        </el-row>
      </div>
      <div class="container-right">
        <el-row class="clearfix btm-distance">
          <div class="overview">
<!--            <h5>{{form.actNo}}</h5>-->
            <!--            <img-->
            <!--              v-if="form.imgUrl"-->
            <!--              :src="fileUrl + form.imgUrl"-->
            <!--              style="width: 100px;height: 100px;"-->
            <!--              @click="avatarShow(form.imgUrl)"-->
            <!--            />-->
          </div>
        </el-row>

        <el-table style="margin-top: 20px" border :data="tableData" @selection-change="selected">

          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <!--        <el-table-column align="center" prop="id" label="库存编号" />-->
          <el-table-column align="center" prop="size" label="尺码"/>
          <el-table-column align="center" prop="inventory" label="库存"/>
          <el-table-column align="center" prop="price" label="入库价"/>
          <el-table-column align="center" prop="dwPrice" label="得物价"/>
          <el-table-column fixed="right" align="center" label="操作" width="80">
            <template slot-scope="scope">
<!--              <el-button type="text" @click="goDel(scope.row.id)"-->
<!--                         v-permission:[buttonPermissionArr.listBtn]="['删除']">删除-->
<!--              </el-button>-->
              <el-button type="text" @click="changeStatus(scope.row.id, 0)">卖出
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
      <inventoryDetail ref="inventory-detail-edit"  />
    </div>
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
import { goodsInventoryApi } from '@/api/goodsInventory'
import { permissionMixin } from '@/mixins/permissionMixin'
import { getExport } from '@/api/exportFile'
import InventoryDetail from './components/inventoryDetail'

export default {
  mixins: [permissionMixin],
  components: {
    ThreeLevelRoute,
    InventoryDetail
  },
  data() {
    return {
      queryParam1: {
        keyword: '',
        pageSize: 10,
        pageNum: 1
      },
      queryParam: {
        id: '',
        goodsId: '',
        sizeId: '',
        inventoryFrom: '',
        inventoryTo: '',
        createTimeFrom: '',
        createTimeTo: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        pageSize: 10,
        pageNum: 1
      },
      pictureZoomShow: false,
      fileUrl: fileUrl,
      dataStatusList: [],
      createTime: '',
      updateTime: '',
      selectedId: [],
      ids: [],
      tableData: [],
      tableData1: [],
      totalCount1: 1,
      totalCount: 1
    }
  },
  mounted() {
    this.page()
    this.listSysDict()
  },
  methods: {
    avatarShow(e) {
      this.imageZoom = e
      this.pictureZoomShow = true
    },
    rowClick(row) {
      this.pageGoods(row.goodsId)
    },
    showInventoryDrawer() {
      this.$refs['inventory-detail-edit'].show()
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
    page() {
      goodsInventoryApi.page(this.queryParam1).then(res => {
        if (res.subCode === 1000) {
          this.tableData1 = res.data ? res.data.list : []
          this.totalCount1 = res.data ? res.data.pageInfo.totalCount : 0
          this.pageGoods(this.tableData1[0].id)
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
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    listSysDict() {
      let sysDictList = sessionStorage.getItem('sysDictList') ? JSON.parse(
        sessionStorage.getItem('sysDictList')) : []
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
    goDetail() {
      // *** 根据真实路径配置地址
      let goodsId = this.queryParam.goodsId
      this.$router.push({ path: '/goodsBase/goodsInventory/detail', query: { goodsId }})
    },
    goDel(id) {
      goodsInventoryApi.delById(id).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
          this.getPage()
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    changeStatus(id, dataStatus) {
      goodsInventoryApi.changeStatus({ id, dataStatus }).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
        } else {
          this.$message.error(res.subMsg)
        }
        this.getPage()
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
        goodsInventoryApi.batchdelete(this.ids).then(res => {
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
      getExport('/gw/op/v1/goodsInventory/export', data, 'post', '商品库存列表').then(() => {
        this.$emit('refresh')
      })
    },
    resetHandle() {
      this.queryParam = {
        id: '',
        goodsId: '',
        sizeId: '',
        inventoryFrom: '',
        inventoryTo: '',
        createTimeFrom: '',
        createTimeTo: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        pageSize: 10,
        pageNum: 1
      }
      this.createTime = ''
      this.updateTime = ''
      this.getPage()
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

