<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <el-button type="primary" icon="el-icon-plus" @click="openDictModal">添加</el-button>
      <el-form
        style="margin-top: 10px"
        :inline="true"
        :model="queryForm"
        @submit.native.prevent
      >
        <el-form-item>
          <el-input
            v-model.trim="queryForm.typeValue"
            placeholder="请输入字典类型编号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="queryForm.typeName"
            placeholder="请输入字典类型名称"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table height="600" ref="dictTable" :data="list" :highlight-current-row="true">
      <el-table-column
        width="400"
        align="center"
        show-overflow-tooltip
        prop="typeValue"
        label="字典类型编号"
        min-width="210"
      ></el-table-column>

      <el-table-column
        width="420"
        align="center"
        show-overflow-tooltip
        prop="typeName"
        label="字典类型名称"
        min-width="110"
      ></el-table-column>

      <el-table-column

        align="center"
        fixed="right"
        show-overflow-tooltip
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="showDictEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="text" @click="showDictDrawer(scope.row)">
            设置字典
          </el-button>
          <el-button type="text" @click="handleDelete(scope.row)">
            删除
          </el-button>

          <!--          <el-divider direction="vertical"></el-divider>-->

          <!--          <el-dropdown trigger="click">-->
          <!--            <span class="el-dropdown-link">-->
          <!--              下拉菜单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
          <!--            </span>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              <el-dropdown-item @click.native="showDictDrawer(scope.row)"-->
          <!--                >设置字典</el-dropdown-item-->
          <!--              >-->
          <!--              <el-dropdown-item @click.native="handleDelete(scope.row)"-->
          <!--                >删除</el-dropdown-item-->
          <!--              >-->
          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 30px"
      background
      :current-page="queryForm.pageNum"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <dictModal @updateData="update" ref="edit"/>
    <dictDetail @updateData="update" ref="dict-detail-edit"/>
  </div>
</template>

<script>
  import { dictListApi } from '@/api/dictManage'
  import DictModal from './components/dictModal'
  import DictDetail from './components/dictDetail'

  export default {
    name: 'DictList',
    components: {
      DictModal,
      DictDetail
    },
    data() {
      return {
        list: [],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        queryForm: {
          pageNum: 1,
          pageSize: 10,
          typeName: '',
          typeValue: ''
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      update() {
        this.fetchData()
      },
      handleDelete(row) {
        const { id } = row
        this.$confirm('是否确认删除该项', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dictListApi.deleteDictById(id).then((res) => {
            if (res.subCode === 1000) {
              this.fetchData()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      },
      showDictDrawer(row) {
        this.$refs['dict-detail-edit'].show(row)
      },
      showDictEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      openDictModal() {
        this.$refs['edit'].showEdit()
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNum = val
        this.fetchData()
      },
      queryData() {
        console.log(this.queryForm.dictId)
        console.log(this.queryForm.dictName)
        this.queryForm.pageNum = 1
        this.fetchData()
      },
      fetchData() {
        dictListApi.getCodeList({ ...this.queryForm }).then((res) => {
          if (res.subCode === 1000) {
            this.list = res.data ? res.data.list : []
            this.total = res.data.pageInfo.totalCount
          } else {
            this.$message.error(res.subMsg)
          }
        })
      }
    }
  }
</script>


<style scoped>
  .el-dropdown {
    color: #409eff !important;
  }

  ::v-deep .el-table th {
    background-color: #f5f7fa;
  }

  ::v-deep.el-table thead {
    color: #606266;
    font-weight: 400;
    font-size: 14px;
  }

  ::v-deep .el-table td,
  .el-table th {
    text-align: center;
  }
</style>
