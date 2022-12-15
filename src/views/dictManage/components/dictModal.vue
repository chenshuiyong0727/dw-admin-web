<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="90% !important"
    top="4vh"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="125px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典类型编号" prop="typeValue">
            <el-input v-model="form.typeValue" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典类型名称" prop="typeName">
            <el-input v-model="form.typeName" autocomplete="off"></el-input>
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
    name: 'DictModal',
    data() {
      return {
        id: '',
        form: {},
        rules: {
          typeValue: [{ required: true, trigger: 'blur', message: '请输入编号' }],
          typeName: [{ required: true, trigger: 'blur', message: '请输入名称' }]
        },
        title: '',
        dialogFormVisible: false
      }
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
          this.form = {}
        } else {
          this.title = '编辑'
          const { id } = row
          this.id = id
          dictListApi.getDictDetailById({ id: this.id }).then((res) => {
            if (res.subCode === 1000) {
              this.form = res.data ? res.data : {}
            } else {
              this.$message.error(res.subMsg)
            }
          })
        }
        this.dialogFormVisible = true
      },
      // 关闭
      close() {
        this.dialogFormVisible = false
      },
      // 新增字典类型
      save() {
        // 添加字典的时候
        if (this.title === '添加') {
          this.$refs['form'].validate(async(valid) => {
            if (valid) {
              dictListApi.addDictItem({ ...this.form }).then((res) => {
                if (res.subCode === 1000) {
                  this.$emit('updateData')
                } else {
                  this.$message.error(res.subMsg)
                }
              })
            }
          })
        }
        // 编辑字典的时候
        if (this.title === '编辑') {
          this.$refs['form'].validate(async(valid) => {
            if (valid) {
              dictListApi
              .updateDict({ ...this.form, id: this.id })
              .then((res) => {
                this.$emit('updateData')
              })
            }
          })
        }
        this.dialogFormVisible = false
      }
    }
  }
</script>


<style scoped>
</style>
