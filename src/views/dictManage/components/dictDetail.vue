<template>
  <el-drawer
    size="45%"
    :visible.sync="dictDetailVisible"
    :close-on-click-modal="false"
    :before-close="close"
    class="dictDetail-container"
  >
    <el-col slot="title" class="container-title">
      字典类型 -
      <el-tag type="info" class="container-title-tag">{{ title }}</el-tag>
    </el-col>

    <el-row class="container">
      <!-- 字典明细表 -->
      <el-col>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-button icon="el-icon-plus" type="primary" @click="handleInsert">
            添加
          </el-button>

          <el-form
            style="margin-top: 25px"
            :inline="true"
            :model="queryForm"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input
                v-model.trim="queryForm.fieldName"
                placeholder="字典名称"
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
        <el-table style="width:100%" height="430" ref="dictTable" :data="list">
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="fieldName"
            label="字典名称"
          ></el-table-column>

          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="fieldValue"
            label="字典值"
          ></el-table-column>

          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="sort"
            label="排序"
          ></el-table-column>

          <el-table-column
            align="center"
            fixed="right"
            show-overflow-tooltip
            label="操作"
            width="130"
          >
            <template v-slot="scope">
              <el-button type="text" @click="handleUpdate(scope.row)">
                编辑
              </el-button>

              <el-divider direction="vertical"></el-divider>

              <el-button type="text" @click="handleDelete(scope.row)">
                删除
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
    <dictEdit @updateData="updateData" :id="id" ref="dict-detail-edit" />
  </el-drawer>
</template>

<script>
import { dictListApi } from '@/api/dictManage'
import dictEdit from './dictEdit'
import { createCodeApi } from '@/api/createCode'
export default {
  name: 'DictManagement',
  components: { dictEdit },
  data() {
    return {
      fieldName: '',
      fieldValue: '',
      id: '',
      title: '',
      dictDetailVisible: false,
      userInfo: null,
      list: null,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        fieldName: '',
      },
    }
  },
  methods: {
    show(row) {
      this.dictDetailVisible = true
      this.id = row.id
      this.title = row.typeName
      this.getCodeData()
    },
    updateData() {
      this.getCodeData()
    },
    getCodeData() {
      createCodeApi
        .getListById({
          typeId: this.id,
          fieldName: this.fieldName ? this.filedName : this.queryForm.fieldName,
          fieldValue: this.fieldValue,
          ...this.queryForm
        })
        .then((res) => {
          if (res.subCode === 1000) {
            this.list = res.data ? res.data.list : []
            this.total = res.data.pageInfo.totalCount
          } else {
            this.$message.error(res.subMsg)
          }
        })
    },
    close() {
      this.list = null
      this.title = ''
      this.filedName = ''
      this.dictDetailVisible = false
    },
    handleInsert() {
      this.$refs['dict-detail-edit'].showInsert()
    },
    handleUpdate(row) {
      if (row.id) {
        this.$refs['dict-detail-edit'].showUpdate(row)
      }
    },
    handleDelete(row) {
      console.log(row)
      if (row.id) {
        const { id } = row
        this.$confirm('是否确认删除该项', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          dictListApi.deleteDict(id).then((res) => {
            if (res.subCode === 1000) {
              this.getCodeData()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        })
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getCodeData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNum = val
      this.getCodeData()
    },
    queryData() {
      this.queryForm.pageNum = 1
      this.getCodeData(this.queryForm)
    },
  },
}
</script>
<style lang="scss" scoped>
.dictDetail-container {
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
