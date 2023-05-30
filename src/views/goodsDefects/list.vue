<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-input placeholder="原因" v-model.trim="queryParam.reason"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              @change="createTimeChange"
              end-placeholder="创建时间结束"
              range-separator="至"
              start-placeholder="创建时间开始"
              type="daterange"
              v-model="createTime"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.type">
              <el-option label="类型" value=""></el-option>
              <el-option
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue"
                v-for="item in typeList">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input placeholder="货号" v-model.trim="queryParam.actNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input placeholder="商品名称" v-model.trim="queryParam.goodsName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                placeholder="入库价开始"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.priceFrom">
              </el-input>
              <span> - </span>
              <el-input
                placeholder="入库价结束"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.priceTo">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input placeholder="订单号" v-model.trim="queryParam.orderNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                placeholder="原售价开始"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.shelvesPriceFrom">
              </el-input>
              <span> - </span>
              <el-input
                placeholder="原售价结束"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.shelvesPriceTo">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input placeholder="状态" v-model.trim="queryParam.status"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row justify="center" type="flex"
              v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length">
        <el-button @click="search" icon="el-icon-search" size="small" style="margin-right: 10px"
                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['查询']">查询
        </el-button>
        <el-button @click="resetHandle" icon="el-icon-refresh" size="small"
                   style="margin-right: 10px"
                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['查询']">重置
        </el-button>
        <el-button @click="goDetail(null,3)" icon="el-icon-plus" size="small"
                   style="margin-right: 10px"
                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['新增']">新增
        </el-button>
        <el-button @click="batchdelete" icon="el-icon-delete" size="small"
                   style="margin-right: 10px"
                   type="danger" v-permission:[buttonPermissionArr.searchBtn]="['批量删除']">批量删除
        </el-button>
        <el-button @click="exportHandle" icon="el-icon-download" size="small"
                   style="margin-right: 10px"
                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['导出']">导出
        </el-button>
      </el-row>
    </el-form>

    <el-table :data="tableData" @selection-change="selected" border height="600"
              style="margin-top: 20px">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="原因" prop="reason"/>
      <el-table-column align="center" label="创建时间" prop="createTime">
        <template slot-scope="scope">{{scope.row.createTime | formateTime('{y}-{m}-{d} {h}:{i}')
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" prop="type">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(20221108) }}</template>
      </el-table-column>
      <el-table-column align="center" label="货号" prop="actNo"/>
      <el-table-column align="center" label="商品名称" prop="goodsName"/>
      <el-table-column align="center" label="图片地址-得物" prop="img"/>
      <el-table-column align="center" label="入库价" prop="price"/>
      <el-table-column align="center" label="订单号" prop="orderNo"/>
      <el-table-column align="center" label="原售价" prop="shelvesPrice"/>
      <el-table-column align="center" label="状态" prop="status"/>
      <el-table-column align="center" fixed="right" label="操作"
                       v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length"
                       width="130">
        <template slot-scope="scope">
          <div>
            <el-button @click="goDetail(scope.row.id , 1)" type="text"
                       v-permission:[buttonPermissionArr.listBtn]="['查看']">查看
            </el-button>
            <el-button @click="goDetail(scope.row.id , 2)" type="text"
                       v-permission:[buttonPermissionArr.listBtn]="['编辑']">编辑
            </el-button>
          </div>
          <el-button @click="goDel(scope.row.id)" type="text"
                     v-permission:[buttonPermissionArr.listBtn]="['删除']">删除
          </el-button>
          <el-button @click="changeStatus(scope.row.id, 0)" type="text"
                     v-if="scope.row.dataStatus == 1"
                     v-permission:[buttonPermissionArr.listBtn]="['更新状态']">停用
          </el-button>
          <el-button @click="changeStatus(scope.row.id, 1)" type="text"
                     v-if="scope.row.dataStatus == 0"
                     v-permission:[buttonPermissionArr.listBtn]="['更新状态']">启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        :current-page="queryParam.pageNum"
        :page-size="queryParam.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        @current-change="pageChangeHandle"
        @size-change="reSearchHandle"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-row>
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { goodsDefectsApi } from '@/api/goodsDefects'
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
        reason: '',
        createTimeFrom: '',
        createTimeTo: '',
        type: '',
        actNo: '',
        goodsName: '',
        priceFrom: '',
        priceTo: '',
        orderNo: '',
        shelvesPriceFrom: '',
        shelvesPriceTo: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      },
      dataStatusList: [],
      typeList: [],
      statusList: [],
      createTime: '',
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
    createTimeChange() {
      if (this.createTime) {
        this.queryParam.createTimeFrom = this.createTime[0]
        this.queryParam.createTimeTo = this.createTime[1]
      } else {
        this.queryParam.createTimeFrom = null
        this.queryParam.createTimeTo = null
      }
    },
    getPage() {
      goodsDefectsApi.page(this.queryParam).then(res => {
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
      this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
      this.statusList = sysDictList.filter(item => item.typeValue == 45)
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
      this.$router.push({ path: '/goodsDefects/list/detail', query: { id, type } })
    },
    goDel(id) {
      goodsDefectsApi.delById(id).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
          this.getPage()
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    changeStatus(id, dataStatus) {
      goodsDefectsApi.changeStatus({ id, dataStatus }).then(res => {
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
        goodsDefectsApi.batchdelete(this.ids).then(res => {
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
      getExport('/gw/op/v1/goodsDefects/export', data, 'post', '瑕疵商品列表').then(() => {
        this.$emit('refresh')
      })
    },
    resetHandle() {
      this.queryParam = {
        reason: '',
        createTimeFrom: '',
        createTimeTo: '',
        type: '',
        actNo: '',
        goodsName: '',
        priceFrom: '',
        priceTo: '',
        orderNo: '',
        shelvesPriceFrom: '',
        shelvesPriceTo: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      }
      this.createTime = ''
      this.getPage()
    }
  }
}
</script>
