<template>
  <div class="hello">
    <div style="display: flex; justify-content: space-between">
      <div class="left">
        <el-button icon="el-icon-delete" type="danger" @click="deleteItems"> 批量删除</el-button>
        <el-button type="primary" @click="openDataBaseDialog">
          从数据库导入
        </el-button>
        <el-button
          :disabled="selectRows.length !== 1"
          type="primary"
          @click="showCode"
        >生成代码
        </el-button
        >
      </div>
      <div class="right">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.tableName"
              placeholder="请输入名称"
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
    </div>
    <el-table height="600" :data="list" @selection-change="setSelectRows">
      <el-table-column
        align="center"
        show-overflow-tooltip
        type="selection"
      ></el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="序号"
        width="95"
      >
        <template slot-scope="scope">
          {{ (queryForm.pageNum - 1) * queryForm.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="tableName"
        label="表名称"
        width="300"
      ></el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="tableType"
        label="表类型"
      >
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="comments"
        label="描述"
      ></el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="jdbcType"
        label="数据库类型"
      >
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="操作"
        width="200"
      >
        <template v-slot="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button type="text" @click="removeItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Edit ref="edit"/>
    <el-dialog
      title="导入数据库表"
      :visible.sync="dataBaseVisible"
      width="60%"
      @close="closeDataBase"
    >
      <el-table height="600" :data="dataBaseList" @selection-change="setSelectDataBaseRows">
        <el-table-column
          align="center"
          show-overflow-tooltip
          type="selection"
        ></el-table-column>

        <el-table-column
          align="center"
          show-overflow-tooltip
          label="序号"
          width="230"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="tableName"
          label="表名称"
          width="270"
        ></el-table-column>

        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="dbName"
          label="数据库"
        ></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        background
        :current-page="databaseForm.pageNum"
        :page-size="databaseForm.pageSize"
        :layout="layout"
        :total="dataBaseTotal"
        @size-change="handleDataBaseSizeChange"
        @current-change="handleDataBaseCurrentChange"
      ></el-pagination>
      <span slot="footer" style="height: 300px" class="dialog-footer">
        <el-button @click="dataBaseVisible = false">取 消</el-button>
        <el-button :disabled="!selectDataBaseRows" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <CodeGenerate
      :id="codeDetailId"
      @closeDialog="closeDialog"
      v-if="generateCodeDialog"
    />
    <el-pagination
      style="margin-top: 20px"
      background
      :current-page="queryForm.pageNum"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
  import { createCodeApi } from '@/api/createCode'
  import CodeGenerate from './components/codeGenerate.vue'
  import Edit from './components/tableEdit.vue'

  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    components: {
      Edit,
      CodeGenerate
    },
    data() {
      return {
        dataBaseTotal: 0,
        codeDetailId: '',
        tableNames: '',
        layout: 'total, sizes, prev, pager, next, jumper',
        generateCodeDialog: false,
        dataBaseVisible: false,
        total: 0,
        selectRows: '',
        selectDataBaseRows: '',
        list: [],
        queryForm: {
          pageNum: 1,
          pageSize: 10,
          tableName: ''
        },
        databaseForm: {
          pageNum: 1,
          pageSize: 10
        },
        dataBaseList: []
      }
    },
    created() {
      this.getCodeList(this.queryForm)
    },
    methods: {
      getCodeList(query) {
        createCodeApi
        .getCodeList({
          ...query
        })
        .then((res) => {
          if (res.subCode === 1000) {
            this.list = res.data ? res.data.list : []
            this.total = res.data ? res.data.pageInfo.totalCount : 0
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      queryData() {
        this.queryForm.pageNum = 1
        this.getCodeList(this.queryForm)
      },
      handleDataBaseSizeChange(val) {
        this.databaseForm.pageSize = val
        this.getDataBaseList(this.databaseForm)
      },
      handleDataBaseCurrentChange(val) {
        this.databaseForm.pageNum = val
        this.getDataBaseList(this.databaseForm)
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.getCodeList(this.queryForm)
      },
      handleCurrentChange(val) {
        this.queryForm.pageNum = val
        this.getCodeList(this.queryForm)
      },
      closeDialog() {
        this.generateCodeDialog = false
      },
      showCode() {
        this.generateCodeDialog = true
        this.codeDetailId = this.selectRows && this.selectRows[0].id
      },
      confirm() {
        createCodeApi
        .confirmInsert({ tableNames: this.tableNames })
        .then((res) => {
          if (res.subCode === 1000) {
            this.dataBaseVisible = false
            this.getCodeList(this.queryForm)
          }
        })
      },
      getDataBaseList(query) {
        createCodeApi
        .getDataBaseList({
          ...query
        })
        .then((res) => {
          if (res.subCode === 1000) {
            this.dataBaseList = res.data ? res.data.list : []
            this.dataBaseTotal = res.data.pageInfo.totalCount
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      openDataBaseDialog() {
        this.dataBaseVisible = true
        this.getDataBaseList(this.databaseForm)
      },
      closeDataBase() {
        this.dataBaseVisible = false
      },
      deleteItems() {
        if (this.selectRows.length == 0) {
          this.$alert('没有选中数据')
          return
        }
        this.$confirm(`是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          createCodeApi.deleteCodeItems(this.selectRows).then((res) => {
            if (res.subCode === 1000) {
              this.getCodeList(this.queryForm)
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      },
      removeItem(row) {
        const { id } = row
        if (this.selectRows.length == 0) {
          this.$alert('没有选中数据')
          return
        }
        this.$confirm('是否确认删除该项', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          createCodeApi.deleteCodeItem(id).then((res) => {
            if (res.subCode === 1000) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getCodeList(this.queryForm)
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      },
      handleUpdate(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        }
      },
      setSelectDataBaseRows(val) {
        this.selectDataBaseRows = val
        this.tableNames = this.selectDataBaseRows
        .map((item) => {
          return item.tableName
        })
        .join(',')
      },
      setSelectRows(val) {
        this.selectRows = val
      }
    }
  }
</script>


<style scoped>
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
