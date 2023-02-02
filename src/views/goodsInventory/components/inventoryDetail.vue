<template>
  <three-level-route>
    <el-drawer
      size="45%"
      :visible.sync="inventoryDetailVisible"
      :close-on-click-modal="false"
      :before-close="close"
      class="inventoryDetail-container"
    >
      <el-col slot="title" class="container-title">
        商品基本信息列表
      </el-col>

      <el-row class="container">
        <el-col>
          <div
            style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
          >
            <el-button icon="el-icon-plus" type="primary" @click="goDetail(null,3)">
              添加商品
            </el-button>

            <el-form
              style="margin-top: 25px"
              :inline="true"
              :model="queryForm"
              @submit.native.prevent
            >
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.actNo"
                  placeholder="货号"
                  clearable
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="queryData"
                >
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table style="width:100%" height="500" ref="inventoryTable" :data="tableData">
            <el-table-column align="center" prop="actNo" label="货号"/>
            <el-table-column align="center" label="图片">
              <template slot-scope="scope">
                <img v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"
                     @click="avatarShow(scope.row.imgUrl)">
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              fixed="right"
              show-overflow-tooltip
              label="操作"
            >
              <template v-slot="scope">
                <el-button icon="el-icon-plus" type="text" @click="goDetail(scope.row.id)">
                  新增尺码
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            style="margin-top: 25px"
            background
            :current-page="queryForm.pageNum"
            :page-size="queryForm.pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-drawer>
    <!-- </three-level-route> -->
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="fileUrl + imageZoom" alt="" width="100%" >
      </div>
    </div>
  </three-level-route>
</template>

<script>
  import { goodsBaseApi } from '@/api/goodsBase'

  export default {
    name: 'InventoryManagement',
    data() {
      return {
        pictureZoomShow: false,
        fileUrl: fileUrl,
        fieldName: '',
        fieldValue: '',
        id: '',
        title: '',
        inventoryDetailVisible: false,
        userInfo: null,
        tableData: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          pageNum: 1,
          pageSize: 10,
          actNo: ''
        }
      }
    },
    methods: {
      // goDetail(id, type) {
      //   this.$router.push({ path: '/goodsBase/list/detail', query: { id, type }})
      // },
      goDetail(goodsId) {
        // *** 根据真实路径配置地址
        // let goodsId = this.queryParam.goodsId
        this.$router.push({ path: '/goodsBase/goodsInventory/detail', query: { goodsId } })
      },
      show() {
        this.inventoryDetailVisible = true
        this.getPage()
      },
      getPage() {
        goodsBaseApi.page(this.queryForm).then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data ? res.data.list : []
            this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      close() {
        this.tableData = null
        this.inventoryDetailVisible = false
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.getPage()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNum = val
        this.getPage()
      },
      queryData() {
        this.queryForm.pageNum = 1
        this.getPage(this.queryForm)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .inventoryDetail-container {
    .container {
      padding-left: 15px;
    }

    .container-title {
      font-size: 16px;
      font-weight: bold;
    }

    .container-title-tag {
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
<style lang="scss" scoped>
  .age-sty {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .userPic {
    width: 80px;
  }

  .popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    display: grid;
    align-items: center;
  }

  .imageShow {
    margin: auto;
    width: 520px;
    height: 520px;
  }
</style>
