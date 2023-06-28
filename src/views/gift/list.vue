<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.name" placeholder="姓名"></el-input>
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
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.label">
              <el-option label="关系" value=""></el-option>
              <el-option
                v-for="item in labelList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
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
                placeholder="金额开始">
              </el-input>
              <span> - </span>
              <el-input
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.priceTo"
                placeholder="金额结束">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="6">-->
        <!--          <el-form-item  size="small">-->
        <!--            <el-date-picker-->
        <!--              v-model="updateTime"-->
        <!--              type="daterange"-->
        <!--              range-separator="至"-->
        <!--              start-placeholder="更新时间开始"-->
        <!--              end-placeholder="更新时间结束"-->
        <!--              @change="updateTimeChange"-->
        <!--              value-format="yyyy-MM-dd">-->
        <!--            </el-date-picker>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
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

    <el-table
      :row-style="{height:'30px'}"
      :cell-style="{padding:'0px'}" height="600" style="margin-top: 20px" border :data="tableData"
      @selection-change="selected">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名"/>
      <el-table-column align="center" prop="price" label="金额" sortable/>
      <el-table-column align="center" prop="label" label="关系">
        <template slot-scope="scope">{{ scope.row.label | dictToDescTypeValue(42) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(41) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间" sortable>
        <template slot-scope="scope">{{scope.row.updateTime | formateTime('{y}-{m}-{d} {h}:{i}')
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="180"
                       v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="goDetail(scope.row.id , 1)"
                       v-permission:[buttonPermissionArr.listBtn]="['查看']">查看
            </el-button>
            <el-button type="text" @click="goDetail(scope.row.id , 2)"
                       v-permission:[buttonPermissionArr.listBtn]="['编辑']">编辑
            </el-button>
            <el-button type="text" @click="goDel(scope.row.id)"
                       v-permission:[buttonPermissionArr.listBtn]="['删除']">删除
            </el-button>
          </div>
          <!--          <el-button type="text" @click="changeStatus(scope.row.id, 0)" v-permission:[buttonPermissionArr.listBtn]="['更新状态']"  v-if="scope.row.dataStatus == 1">停用</el-button>-->
          <!--          <el-button type="text" @click="changeStatus(scope.row.id, 1)" v-permission:[buttonPermissionArr.listBtn]="['更新状态']" v-if="scope.row.dataStatus == 0">启用</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        @size-change="reSearchHandle"
        @current-change="pageChangeHandle"
        :current-page="queryParam.pageNum"
        :page-sizes="[100,10, 20, 50, 200]"
        :page-size="queryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-row>
  </three-level-route>
</template>

<script>
  import ThreeLevelRoute from '@/components/ThreeLevelRoute'
  import { giftApi } from '@/api/gift'
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
          name: '',
          type: '',
          label: '',
          priceFrom: '',
          priceTo: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          pageSize: 100,
          pageNum: 1
        },
        typeList: [],
        labelList: [],
        dataStatusList: [],
        updateTime: '',
        selectedId: [],
        ids: [],
        tableData: [],
        totalCount: 1
      }
    },
    created() {
      const { months } = this.$route.query
      if (months) {
        this.queryParam.label = +months
        this.getPage()
      }
    },
    mounted() {
      this.getPage()
      this.listSysDict()
    },
    methods: {
      updateTimeChange() {
        if (this.updateTime) {
          this.queryParam.updateTimeFrom = this.updateTime[0]
          this.queryParam.updateTimeTo = this.updateTime[1]
        } else {
          this.queryParam.updateTimeFrom = null
          this.queryParam.updateTimeTo = null
        }
      },
      getPage() {
        giftApi.page(this.queryParam).then(res => {
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
        this.typeList = sysDictList.filter(item => item.typeValue == 41)
        this.labelList = sysDictList.filter(item => item.typeValue == 42)
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
        this.$router.push({ path: '/more/gift/detail', query: { id, type } })
      },
      goDel(id) {
        giftApi.delById(id).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.getPage()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      changeStatus(id, dataStatus) {
        giftApi.changeStatus({ id, dataStatus }).then(res => {
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
          giftApi.batchdelete(this.ids).then(res => {
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
        getExport('/gw/op/v1/gift/export', data, 'post', '红包列表').then(() => {
          this.$emit('refresh')
        })
      },
      resetHandle() {
        this.queryParam = {
          name: '',
          type: '',
          label: '',
          priceFrom: '',
          priceTo: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          pageSize: 10,
          pageNum: 1
        }
        this.updateTime = ''
        this.getPage()
      }
    }
  }
</script>
