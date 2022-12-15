<template>
  <el-dialog
    title="生成代码"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="105px"
      class="gen-create"
    >
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="代码标题" prop="codeTitle">
            <el-input v-model="form.codeTitle"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="标题简介" prop="codeTitleBrief">
            <el-input v-model="form.codeTitleBrief"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="包路径" prop="packageName">
            <el-input v-model="form.packageName"/>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="模块名" prop="moduleName">
            <el-input v-model="form.moduleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="作者信息" prop="authorName">
            <el-input v-model="form.authorName" autocomplete="off"></el-input>
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
  import { createCodeApi } from '@/api/createCode'
  import { getExport } from '@/api/exportFile'

  export default {
    name: 'GenCreate',
    props: {
      id: {
        type: String,
        default: () => {
          return ''
        }
      }
    },
    data() {
      return {
        templateList: [
          {
            value: 'test',
            label: '测试'
          },
          {
            value: 'form',
            label: 'Form表单'
          }
        ],
        form: {
          id: '',
          tableId: '',
          tableType: 0,
          codeTitle: '',
          codeTitleBrief: '',
          packageName: '',
          moduleName: '',
          authorName: ''
        },
        dict: {},
        rules: {
          codeTitle: [
            { required: true, trigger: 'blur', message: '请输入代码标题' }
          ],
          codeTitleBrief: [
            { required: true, trigger: 'blur', message: '请输入代码标题简介' }
          ],
          packageName: [
            { required: true, trigger: 'blur', message: '请输入包路径' }
          ],
          moduleName: [
            { required: true, trigger: 'blur', message: '请输入模块名' }
          ],
          authorName: [
            { required: true, trigger: 'blur', message: '请输入作者信息' }
          ]
        },
        dialogFormVisible: true
      }
    },
    mounted() {
      this.getDetailById()
    },
    methods: {
      // 获取生成代码的详情信息
      getDetailById() {
        const id = this.id
        createCodeApi.codeDetail({ tableId: id }).then((res) => {
          if (res.subCode === 1000) {
            this.form = res.data ? res.data : {}
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      close() {
        this.$emit('closeDialog')
      },
      // 点击确定，导出生成代码
      save() {
        this.$refs['form'].validate(async(valid) => {
          if (valid) {
            getExport(
              '/gw/op/v1/code/genLogs/create',
              { ...this.form, tableId: this.id, templateId: 1 },
              'post',
              '导出代码'
            ).then(() => {
              this.$notify({
                title: '成功',
                message: '这是一条成功的提示消息',
                type: 'success'
              })
              this.$emit('refresh')
            })
          }
        })
      }
    }
  }
</script>
