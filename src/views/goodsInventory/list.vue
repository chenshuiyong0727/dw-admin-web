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

          <el-table-column align="center" prop="goodsId" label="商品编号"/>
          <el-table-column align="center" prop="sizeId" label="尺码编号"/>
          <el-table-column align="center" prop="inventory" label="库存"/>
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
        <el-form ref="form">
          <el-row class="query-form">
            <el-col :span="6">
              <el-form-item size="small">
                <el-input v-model.trim="queryParam.id" placeholder="库存编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small">
                <el-input v-model.trim="queryParam.goodsId" placeholder="商品编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small">
                <div>
                  <el-input
                    style="width: 45%"
                    v-input-validation
                    v-model.trim="queryParam.inventoryFrom"
                    placeholder="库存开始">
                  </el-input>
                  <span> - </span>
                  <el-input
                    style="width: 45%"
                    v-input-validation
                    v-model.trim="queryParam.inventoryTo"
                    placeholder="库存结束">
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small">
                <el-input v-model.trim="queryParam.sizeId" placeholder="尺码编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small">
                <el-date-picker
                  v-model="createTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="创建时间"
                  end-placeholder="创建时间"
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
                  start-placeholder="更新时间"
                  end-placeholder="更新时间"
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
            <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-plus"
                       v-permission:[buttonPermissionArr.searchBtn]="['新增']"
                       @click="goDetail()">新增尺码
            </el-button>
            <el-button type="danger" size="small" style="margin-right: 10px" icon="el-icon-delete"
                       v-permission:[buttonPermissionArr.searchBtn]="['批量删除']" @click="batchdelete">
              批量删除
            </el-button>
          </el-row>
        </el-form>

        <el-table style="margin-top: 20px" border :data="tableData" @selection-change="selected">

          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <!--        <el-table-column align="center" prop="id" label="库存编号" />-->
          <el-table-column align="center" prop="goodsId" label="商品编号"/>
          <el-table-column align="center" prop="sizeId" label="尺码编号"/>
          <el-table-column align="center" prop="inventory" label="库存"/>
          <el-table-column align="center" prop="createTime" label="创建时间">
            <template slot-scope="scope">{{scope.row.createTime | formateTime('{y}-{m}-{d} {h}:{i}')
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="updateTime" label="更新时间">
            <template slot-scope="scope">{{scope.row.updateTime | formateTime('{y}-{m}-{d} {h}:{i}')
              }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="130"
                           v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
            <template slot-scope="scope">
              <el-button type="text" @click="goDel(scope.row.id)"
                         v-permission:[buttonPermissionArr.listBtn]="['删除']">删除
              </el-button>
              <el-button type="text" @click="changeStatus(scope.row.id, 0)"
                         v-permission:[buttonPermissionArr.listBtn]="['更新状态']">卖出
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
    rowClick(row) {
      // this.queryParam.id = row.id
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
          this.pageGoods(this.tableData1[0].goodsId)
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    pageGoods(goodsId) {
      if (goodsId) {
        this.queryParam.goodsId = goodsId
      }
      goodsInventoryApi.page(this.queryParam).then(res => {
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

