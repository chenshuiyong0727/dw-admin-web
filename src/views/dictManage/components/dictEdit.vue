<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="125px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典名称" prop="fieldName">
            <el-input v-model="form.fieldName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典值" prop="fieldValue">
            <el-input v-model="form.fieldValue" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              :min="1"
              :max="500"
              v-model="form.sort"
              autocomplete="off"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dictListApi } from '@/api/dictManage'
export default {
  name: 'DictDetailEdit',
  props: {
    id: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  data() {
    return {
      form: {
        sort: '',
        fieldName: '',
        sort: 1,
        // 设置默认值
        fieldValue: '',
      },
      rules: {
        dictName: [{ required: true, trigger: 'blur', message: '请输入值' }],
        dictValue: [{ required: true, trigger: 'blur', message: '请输入值' }],
        sortNo: [{ required: true, trigger: 'blur', message: '请输入排序' }],
      },
      title: '',
      dialogFormVisible: false,
    }
  },
  methods: {
    showInsert(row) {
      this.title = '字典类型 - 添加'
      this.dialogFormVisible = true
    },
    showUpdate(row) {
      this.title = '字典类型 - 编辑'
      this.dialogFormVisible = true
      dictListApi.getInnerDictDetail({ id: row.id }).then((res) => {
        if (res.subCode === 1000) {
          this.form = res.data ? res.data : {}
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    close() {
      this.dialogFormVisible = false
    },

    save() {
      if (this.title === '字典类型 - 添加') {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            dictListApi
              .addDict({ ...this.form, typeId: this.id })
              .then((res) => {
                if (res.subCode === 1000) {
                  this.$emit('updateData')
                } else {
                  this.$message.error(res.subMsg)
                }
              })
          }
        })
      }
      this.dialogFormVisible = false
      // // 编辑的时候
      if (this.title === '字典类型 - 编辑') {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            dictListApi
              .updateInnerDict({
                typeId: this.id,
                ...this.form,
              })
              .then((res) => {
                if (res.subCode === 1000) {
                  this.$emit('updateData')
                } else {
                  this.$message.error(res.subMsg)
                }
              })
          }
        })
      }
    },
  },
}
</script>
