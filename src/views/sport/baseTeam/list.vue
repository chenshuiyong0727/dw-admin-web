<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.type">
              <el-option label="球队类型" value=""></el-option>
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
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.name" placeholder="名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length" justify="center"
              type="flex">
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['查询']" icon="el-icon-search" size="small" style="margin-right: 10px"
                   type="primary" @click="search">查询
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['查询']" icon="el-icon-refresh" size="small" style="margin-right: 10px"
                   type="primary" @click="resetHandle">重置
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['新增']" icon="el-icon-plus" size="small" style="margin-right: 10px"
                   type="primary"
                   @click="goDetail(null,3)">新增
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['批量删除']" icon="el-icon-delete" size="small" style="margin-right: 10px"
                   type="danger" @click="batchdelete">
          批量删除
        </el-button>
        <el-button v-permission:[buttonPermissionArr.searchBtn]="['导出']" icon="el-icon-download" size="small" style="margin-right: 10px"
                   type="primary" @click="exportHandle">导出
        </el-button>
      </el-row>
    </el-form>

    <el-table :data="tableData" border height="600" style="margin-top: 20px"
              @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="球队编号" prop="id"/>
      <el-table-column align="center" label="球队类型" prop="type">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(62) }}</template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name"/>
      <!--      <el-table-column align="center" label="本地图片" width="120">-->
      <!--        <template slot-scope="scope">-->
      <!--          <img v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"-->
      <!--               @click="avatarShow(scope.row.imgUrl)">-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column align="center" label="图片" width="120">
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img" alt=""
               class="userPic" @click="avatarShow(scope.row.img)">
          <img v-if="!scope.row.img && scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl"
               alt="" class="userPic" @click="avatarShow(fileUrl+scope.row.imgUrl)">
        </template>
      </el-table-column>
<!--      <el-table-column align="center" label="图片地址-外链" prop="img"/>-->
      <el-table-column align="center" label="备注" prop="remark"/>
      <el-table-column v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length" align="center" fixed="right" label="操作"
                       width="130">
        <template slot-scope="scope">
          <div>
            <el-button v-permission:[buttonPermissionArr.listBtn]="['查看']" type="text"
                       @click="goDetail(scope.row.id , 1)">查看
            </el-button>
            <el-button v-permission:[buttonPermissionArr.listBtn]="['编辑']" type="text"
                       @click="goDetail(scope.row.id , 2)">编辑
            </el-button>
          </div>
          <el-button v-permission:[buttonPermissionArr.listBtn]="['删除']" type="text"
                     @click="goDel(scope.row.id)">删除
          </el-button>
          <el-button v-if="scope.row.dataStatus == 1" v-permission:[buttonPermissionArr.listBtn]="['更新状态']"
                     type="text"
                     @click="changeStatus(scope.row.id, 0)">停用
          </el-button>
          <el-button v-if="scope.row.dataStatus == 0" v-permission:[buttonPermissionArr.listBtn]="['更新状态']"
                     type="text"
                     @click="changeStatus(scope.row.id, 1)">启用
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
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="reSearchHandle"
        @current-change="pageChangeHandle">
      </el-pagination>
    </el-row>
    <div v-if="pictureZoomShow" class="popContainer" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="imageZoom" alt="" width="100%">
      </div>
    </div>
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { baseTeamApi } from '@/api/sport/baseTeam'
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
        name: '',
        remark: '',
        pageSize: 10,
        pageNum: 1
      },
      pictureZoomShow: false,
      imageZoom: '',
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
    avatarShow(e) {
      this.imageZoom = e
      this.pictureZoomShow = true
    },
    getPage() {
      baseTeamApi.page(this.queryParam).then(res => {
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
      this.typeList = sysDictList.filter(item => item.typeValue == 62)
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
      this.$router.push({ path: '/sport/baseTeam/detail', query: { id, type } })
    },
    goDel(id) {
      baseTeamApi.delById(id).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
          this.getPage()
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    changeStatus(id, dataStatus) {
      baseTeamApi.changeStatus({ id, dataStatus }).then(res => {
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
        baseTeamApi.batchdelete(this.ids).then(res => {
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
      getExport('/gw/op/v1/baseTeam/export', data, 'post', '球队表列表').then(() => {
        this.$emit('refresh')
      })
    },
    resetHandle() {
      this.queryParam = {
        type: '',
        name: '',
        remark: '',
        pageSize: 10,
        pageNum: 1
      }
      this.getPage()
    }
  }
}
</script>
