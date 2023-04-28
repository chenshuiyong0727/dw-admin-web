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
            <el-select v-model="queryParam.type">
              <el-option label="类型" value=""></el-option>
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
                v-model.trim="queryParam.priceFrom"
                placeholder="利润开始">
              </el-input>
              <span> - </span>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.priceTo"
                placeholder="利润结束">
              </el-input>
            </div>
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
                   v-permission:[buttonPermissionArr.searchBtn]="['新增']" @click="goDetail(null,3)">
          新增
        </el-button>
        <el-button type="danger" size="small" style="margin-right: 10px" icon="el-icon-delete"
                   v-permission:[buttonPermissionArr.searchBtn]="['批量删除']" @click="batchdelete">批量删除
        </el-button>
        <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-download"
                   v-permission:[buttonPermissionArr.searchBtn]="['导出']" @click="exportHandle">导出
        </el-button>
      </el-row>
    </el-form>

    <el-table :row-style="{height:'30px'}"
              :cell-style="{padding:'0px'}" height="600" style="margin-top: 20px" border :data="tableData"
              @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column align="center" width="100" prop="actNo" label="货号">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactNo(scope.row.actNo)"> {{ scope.row.actNo }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpGoods(scope.row.goodsId , 1)"> {{ scope.row.goodsName }}</a>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" prop="goodsId" label="商品编号" />-->
      <!--      <el-table-column align="center" prop="sizeId" label="尺码编号" />-->
      <el-table-column align="center" label="图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="userPic"
               @click="avatarShow(scope.row.img)">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="size" label="尺码"/>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(20221108) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="inPutPrice" label="入库价"/>
      <el-table-column align="center" prop="price" label="当前价"/>
      <el-table-column align="center" prop="thisTimeThePrice" label="到手价"/>
      <el-table-column align="center" prop="thisTimeProfits" label="利润" sortable/>
      <el-table-column fixed="right" align="center" label="操作" width="130"
                       v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="goDetail(scope.row.id , 1)"
                       v-permission:[buttonPermissionArr.listBtn]="['查看']">查看
            </el-button>
            <el-button type="text" @click="goDetail(scope.row.id , 2)"
                       v-permission:[buttonPermissionArr.listBtn]="['编辑']">编辑
            </el-button>
          </div>
<!--          <el-button type="text" @click="goDel(scope.row.id)"-->
<!--                     v-permission:[buttonPermissionArr.listBtn]="['删除']">删除-->
<!--          </el-button>-->
<!--          <el-button type="text" @click="changeStatus(scope.row.id, 0)"-->
<!--                     v-permission:[buttonPermissionArr.listBtn]="['更新状态']"-->
<!--                     v-if="scope.row.dataStatus == 1">停用-->
<!--          </el-button>-->
<!--          <el-button type="text" @click="changeStatus(scope.row.id, 1)"-->
<!--                     v-permission:[buttonPermissionArr.listBtn]="['更新状态']"-->
<!--                     v-if="scope.row.dataStatus == 0">启用-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        @size-change="reSearchHandle"
        @current-change="pageChangeHandle"
        :current-page="queryParam.pageNum"
        :page-sizes="[10, 20, 50, 100,200,500,1000,2000,3000,5000,10000]"
        :page-size="queryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-row>
    <!-- </three-level-route> -->
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="imageZoom" alt="" width="100%">
      </div>
    </div>
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { goodsBusinessApi } from '@/api/goodsBusiness'
  import { permissionMixin } from '@/mixins/permissionMixin'
  import { getExport } from '@/api/exportFile'

  export default {
    mixins: [permissionMixin],
    components: {
      ThreeLevelRoute
    },
    data() {
      return {
        queryParam: {
          keyword: '',
          goodsId: '',
          type: '',
          sizeId: '',
          size: '',
          priceFrom: 50,
          priceTo: '',
          pageSize: 10,
          pageNum: 1
        },
        pictureZoomShow: false,
        imageZoom: '',
        fileUrl: fileUrl,
        dataStatusList: [],
        typeList: [],
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
      jumpactNo(actNo) {
        this.$router.push({ path: '/goodsBase/goodsInventory', query: { actNo } })
      },
      jumpGoods(id , type ) {
        // this.$router.push({ path: '/goodsBase/list/detailNew', query: { id, type }})
        let routeUrl = this.$router.resolve({
          path: '/goodsBase/list/detailNew',
          query: { id, type },
        })
        window.open(routeUrl.href, '_blank')
      },
      getPage() {
        goodsBusinessApi.page(this.queryParam).then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data ? res.data.list : []
            this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      avatarShow(e) {
        this.imageZoom = e
        this.pictureZoomShow = true
      },
      listSysDict() {
        let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
          localStorage.getItem('sysDictList')) : []
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
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
        this.$router.push({ path: '/goodsOrder/goodsBusiness/detail', query: { id, type } })
      },
      goDel(id) {
        goodsBusinessApi.delById(id).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.getPage()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      changeStatus(id, dataStatus) {
        goodsBusinessApi.changeStatus({ id, dataStatus }).then(res => {
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
          goodsBusinessApi.batchdelete(this.ids).then(res => {
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
        getExport('/gw/op/v1/goodsBusiness/export', data, 'post', '营销列表').then(() => {
          this.$emit('refresh')
        })
      },
      resetHandle() {
        this.queryParam = {
          keyword: '',
          goodsId: '',
          type: '',
          sizeId: '',
          size: '',
          priceFrom: '',
          priceTo: '',
          pageSize: 10,
          pageNum: 1
        }
        this.getPage()
      }
    }
  }
</script>
