<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="90% !important"
    top="4vh"
    @close="close"
  >
    <div class="generator-main">
      <div class="generator-el-steps">
        <el-steps
          :active="active"
          align-center
          finish-status="finish"
          :direction="direction"
          class="steps"
        >
          <!-- for 循环展示字段 -->
          <el-step
            v-for="(step, index) in stepArray"
            :key="index"
            :title="step.title"
          ></el-step>
        </el-steps>
      </div>
      <tableDataStep
        ref="firstStep"
        :id="id"
        :baseForm="baseForm"
        :tableFormCur="tableFormCur"
        @close="close"
        @setActive="next"
        v-if="active === 1"
      />
      <frontEndStep
        ref="secondStep"
        :tableFormCur="tableFormCur"
        :id="id"
        @close="close"
        @prev="prevFront"
        @next="nextFront"
        v-if="active === 2"
      />
      <backEndStep
        :dictList="dictList"
        :tableFormCur="tableFormCur"
        @updateCodeEidt="updateAll"
        :id="id"
        @close="close"
        @prev="lastPrev"
        v-if="active === 3"
      />
    </div>
  </el-dialog>
</template>

<script>
import { dictListApi } from '@/api/dictManage'
import { createCodeApi } from '@/api/createCode'
import tableDataStep from './tableDataSteps'
import backEndStep from './backendStep'
import frontEndStep from './frontendStep'
export default {
  name: 'TableEdit',
  components: {
    tableDataStep,
    backEndStep,
    frontEndStep,
  },
  data() {
    return {
      dictList: [],
      id: '',
      baseForm: {},
      tableFormCur: [],
      stepArray: [
        { title: '数据库表设置' },
        { title: '前端展示设置' },
        { title: '后端实体设置' },
      ],
      title: '',
      dialogFormVisible: false,
      direction: 'horizontal',
      active: 1,
    }
  },
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '代码生成 - 添加'
      } else {
        const { id } = row
        this.id = id
        this.title = '代码生成 - 编辑'
      }
      this.dialogFormVisible = true
      this.getData(this.id)
      this.getDictList()
    },
    // 关闭
    close() {
      this.dialogFormVisible = false
      this.active = 1
    },
    next(firstObj) {
      this.active = this.active + 1
      this.formObj = firstObj
    },
    prevFront() {
      this.active = this.active - 1
    },
    nextFront() {
      this.active = this.active + 1
    },
    lastPrev() {
      this.active = this.active - 1
    },
    getDictList() {
      dictListApi.getCodeList({ pageNum: 1, pageSize: 1000 }).then((res) => {
        if (res.subCode === 1000) {
          this.dictList = res.data ? res.data.list : []
          this.dictList = this.dictList.map((item) => {
            return { value: item.typeValue, label: item.typeName }
          })
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    updateAll() {
      createCodeApi
        .updateCode({ columnList: this.tableFormCur, ...this.baseForm })
        .then((res) => {
          if (res.subCode === 1000) {
            this.$message({
              message: '编辑成功',
              type: 'success',
            })
            this.dialogFormVisible = false
          } else {
            this.$message.error(res.subMsg)
          }
        })
    },
    getData(id) {
      createCodeApi.getCodeDetailById({ id }).then((res) => {
        if (res.subCode === 1000) {
          this.tableFormCur = res.data ? res.data.columnList1 : []
          this.baseForm = res.data ? res.data.genTableDto : {}
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
  },
}
</script>


<style scoped>
</style>
