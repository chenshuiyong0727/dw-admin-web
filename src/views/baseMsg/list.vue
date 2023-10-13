<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item  size="small">
            <el-select v-model="queryParam.type">
              <el-option label="类型" value=""></el-option>
              <el-option
                v-for="item in typeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  size="small">
            <el-select v-model="queryParam.waitType">
              <el-option label="是否待办 ：是1否-1" value=""></el-option>
              <el-option
                v-for="item in waitTypeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  size="small">
            <el-input v-model.trim="queryParam.userId" placeholder="用户编号，统一用户表的用户编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  size="small">
            <el-input v-model.trim="queryParam.title" placeholder="标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  size="small">
            <el-input v-model.trim="queryParam.content" placeholder="内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  size="small">
            <el-input v-model.trim="queryParam.uniPushCid" placeholder="推送cid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  size="small">
            <el-input v-model.trim="queryParam.requestId" placeholder="推送request_id"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center" v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length">
        <el-button type="primary" size="small" style="margin-right: 10px"  icon="el-icon-search"
                   v-permission:[buttonPermissionArr.searchBtn]="['查询']" @click="search">查询</el-button>
        <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-refresh"
                   v-permission:[buttonPermissionArr.searchBtn]="['查询']" @click="resetHandle">重置</el-button>
        <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-plus"
                   v-permission:[buttonPermissionArr.searchBtn]="['新增']" @click="goDetail(null,3)">新增</el-button>
        <el-button type="danger" size="small" style="margin-right: 10px" icon="el-icon-delete"
                   v-permission:[buttonPermissionArr.searchBtn]="['批量删除']" @click="batchdelete">批量删除</el-button>
        <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-download"
                   v-permission:[buttonPermissionArr.searchBtn]="['导出']" @click="exportHandle">导出</el-button>
      </el-row>
    </el-form>

    <el-table height="600" style="margin-top: 20px" border :data="tableData" @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(52) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="waitType" label="是否待办 ：是1否-1">
        <template slot-scope="scope">{{ scope.row.waitType | dictToDescTypeValue(53) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="userId" label="用户编号，统一用户表的用户编号" />
      <el-table-column align="center" prop="title" label="标题" />
      <el-table-column align="center" prop="content" label="内容" />
      <el-table-column align="center" prop="uniPushCid" label="推送cid" />
      <el-table-column align="center" prop="requestId" label="推送request_id" />
      <el-table-column fixed="right" align="center" label="操作" width="130" v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="goDetail(scope.row.id , 1)" v-permission:[buttonPermissionArr.listBtn]="['查看']">查看</el-button>
            <el-button type="text" @click="goDetail(scope.row.id , 2)" v-permission:[buttonPermissionArr.listBtn]="['编辑']">编辑</el-button>
          </div>
          <el-button type="text" @click="goDel(scope.row.id)" v-permission:[buttonPermissionArr.listBtn]="['删除']">删除</el-button>
          <el-button type="text" @click="changeStatus(scope.row.id, 0)" v-permission:[buttonPermissionArr.listBtn]="['更新状态']"  v-if="scope.row.dataStatus == 1">停用</el-button>
          <el-button type="text" @click="changeStatus(scope.row.id, 1)" v-permission:[buttonPermissionArr.listBtn]="['更新状态']" v-if="scope.row.dataStatus == 0">启用</el-button>
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
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { baseMsgApi } from '@/api/baseMsg'
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
      type: '',
      waitType: '',
      userId: '',
      title: '',
      content: '',
      uniPushCid: '',
      requestId: '',
      pageSize: 10,
        pageNum: 1
    },
      typeList: [],
      waitTypeList: [],
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
  getPage() {
    baseMsgApi.page(this.queryParam).then(res => {
      if (res.subCode === 1000) {
        this.tableData = res.data ? res.data.list : []
        this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
      } else {
        this.$message.error(res.subMsg)
      }
    })
  },
  listSysDict() {
    let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(localStorage.getItem('sysDictList')) : []
    this.typeList = sysDictList.filter(item => item.typeValue == 52)
    this.waitTypeList = sysDictList.filter(item => item.typeValue == 53)
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
    this.$router.push({ path: '/more/baseMsg/detail', query: { id, type }})
  },
  goDel(id) {
    baseMsgApi.delById(id).then(res => {
      if (res.subCode === 1000) {
        this.$message.success(res.subMsg)
        this.getPage()
      } else {
        this.$message.error(res.subMsg)
      }
    })
  },
  changeStatus(id, dataStatus ) {
    baseMsgApi.changeStatus({ id, dataStatus}).then(res => {
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
      baseMsgApi.batchdelete(this.ids).then(res => {
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
    getExport('/gw/op/v1/baseMsg/export', data, 'post', '待办消息列表').then(() => {
      this.$emit('refresh')
    })
  },
  resetHandle() {
    this.queryParam = {
    type: '',
    waitType: '',
    userId: '',
    title: '',
    content: '',
    uniPushCid: '',
    requestId: '',
    pageSize: 10,
      pageNum: 1
  }
    this.getPage()
  }
  }
  }
</script>
