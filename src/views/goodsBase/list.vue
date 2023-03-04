<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.id" placeholder="商品基本信息编号"></el-input>
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
            <el-input v-model.trim="queryParam.actNo" placeholder="货号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.name" placeholder="商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.brand" placeholder="品牌"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.remark" placeholder="备注"></el-input>
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
                   v-permission:[buttonPermissionArr.searchBtn]="['新增']" @click="detailNew(null,3)">
          智能新增
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

    <el-table height="600" style="margin-top: 20px" border :data="tableData"
              @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>

      <el-table-column align="center" prop="actNo" label="货号"/>
      <el-table-column align="center" label="图片" width="120">
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img" class="userPic" @click="avatarShow(scope.row.img)">
          <img v-if="!scope.row.img && scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic" @click="avatarShow(fileUrl+scope.row.imgUrl)">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(20221108) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="id"/>
      <el-table-column align="center" width="150" prop="name" label="商品名称"/>
      <el-table-column align="center" prop="brand" label="品牌"/>
      <el-table-column align="center" prop="sellDate" label="发售日期"/>
      <el-table-column align="center" prop="sellPrice" label="发售价格"/>
      <el-table-column align="center" prop="syncTime" label="同步时间" width="100" sortable>
        <template slot-scope="scope">{{scope.row.syncTime | formateTime() }}</template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="130"
                       v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <div>

            <el-button type="text" @click="goDetail(scope.row.id , 2)"
                       v-permission:[buttonPermissionArr.listBtn]="['编辑']">编辑
            </el-button>
            <el-button type="text" @click="detailNew(scope.row.id , 2)"
                       v-permission:[buttonPermissionArr.listBtn]="['编辑']">智能修改
            </el-button>
          </div>
          <el-button type="text" @click="detailNew(scope.row.id , 1)"
                     v-permission:[buttonPermissionArr.listBtn]="['查看']">查看
          </el-button>
          <!--	          <el-button type="text" @click="goDel(scope.row.id)" v-permission:[buttonPermissionArr.listBtn]="['删除']">删除</el-button>-->
          <el-button type="text" @click="jumpactNo(scope.row)">查看库存</el-button>
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
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { goodsBaseApi } from '@/api/goodsBase'
  import { permissionMixin } from '@/mixins/permissionMixin'
  import { getExport } from '@/api/exportFile'

  export default {
    mixins: [permissionMixin],
    components: {
      ThreeLevelRoute
    },
    data() {
      return {
        syncTime: '',
        queryParam: {
          id: '',
          type: '',
          actNo: '',
          name: '',
          brand: '',
          remark: '',
          syncTimeFrom: '',
          syncTimeTo: '',
          pageSize: 10,
          pageNum: 1
        },
        pictureZoomShow: false,
        fileUrl: fileUrl,
        typeList: [],
        dataStatusList: [],
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
      syncTimeChange() {
        if (this.syncTime) {
          this.queryParam.syncTimeFrom = this.syncTime[0]
          this.queryParam.syncTimeTo = this.syncTime[1]
        } else {
          this.queryParam.syncTimeFrom = null
          this.queryParam.syncTimeTo = null
        }
      },
      getPage() {
        goodsBaseApi.page(this.queryParam).then(res => {
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
        this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
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
        this.$router.push({ path: '/goodsBase/list/detail', query: { id, type } })
      },
      detailNew(id, type) {
        // *** 根据真实路径配置地址
        this.$router.push({ path: '/goodsBase/list/detailNew', query: { id, type } })
      },
      goDel(id) {
        goodsBaseApi.delById(id).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.getPage()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      jumpactNo(row) {
        let actNo = row.actNo
        if (!actNo) {
          this.$alert('没有选中数据')
          return
        }
        this.$router.push({ path: '/goodsBase/goodsInventory', query: { actNo } })
        //
        // this.$router.push({ path: '/goodsOrder/list', query: { actNo }})
      },
      changeStatus(id, dataStatus) {
        goodsBaseApi.changeStatus({ id, dataStatus }).then(res => {
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
          goodsBaseApi.batchdelete(this.ids).then(res => {
            if (res.subCode === 1000) {
              this.$message.success(res.subMsg)
              this.getPage()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      },
      avatarShow(e) {
        this.imageZoom = e
        this.pictureZoomShow = true
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
        getExport('/gw/op/v1/goodsBase/export', data, 'post', '商品基本信息列表').then(() => {
          this.$emit('refresh')
        })
      },
      resetHandle() {
        this.queryParam = {
          syncTimeFrom: '',
          syncTimeTo: '',
          id: '',
          type: '',
          actNo: '',
          name: '',
          brand: '',
          remark: '',
          pageSize: 10,
          pageNum: 1
        }
        this.syncTime = ''
        this.getPage()
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
