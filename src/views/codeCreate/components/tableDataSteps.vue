<template>
  <div class="step-main" style="margin-top: 15px">
    <div class="step-content">
      <el-form
        ref="baseForm"
        :model="baseForm"
        :rules="rules"
        label-width="105px"
      >
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="表名称" prop="tableName">
              <el-input
                size="small"
                v-model="baseForm.tableName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="表类型" prop="tableType">
              <el-select
                size="small"
                v-model="baseForm.tableType"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="描述" prop="comments">
              <el-input
                size="small"
                v-model="baseForm.comments"
                autocomplete="off"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="数据库类型" prop="jdbcType">
              <el-select
                size="small"
                v-model="baseForm.jdbcType"
                placeholder="请选择"
                ref="jdbcType"
                style="width: 100%"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form ref="tableForm" :model="{ tableForm: tableFormCur }">
        <el-table :data="tableFormCur" @selection-change="setSelectRows" border>
          <el-table-column
            show-overflow-tooltip
            type="selection"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldName"
            label="字段名称"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-form-item
                :rules="columnRules.fieldName"
                :prop="'tableForm.' + scope.$index + '.fieldName'"
                class="el-form-item-table"
              >
                <el-input
                  v-model="scope.row.fieldName"
                  disabled
                  style="width: 100%"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldType"
            label="字段类型"
            min-width="180"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.fieldType'"
                :rules="columnRules.fieldType"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.fieldType" style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldLength"
            label="字段长度"
            min-width="140"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.fieldLength'"
                class="el-form-item-table"
              >
                <el-input-number
                  v-model="scope.row.fieldLength"
                  controls-position="right"
                  disabled
                  :min="0"
                  :max="20000"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldPrecision"
            label="字段精度"
            min-width="140"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.fieldComments'"
                class="el-form-item-table"
              >
                <el-input-number
                  disabled
                  v-model="scope.row.fieldPrecision"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldComments"
            label="字段描述"
            min-width="240"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.fieldComments'"
                :rules="columnRules.fieldComments"
                class="el-form-item-table"
              >
                <el-input
                  v-model="scope.row.fieldComments"
                  maxlength="100"
                  show-word-limit
                  :disabled="scope.row.disabled"
                  style="width: 100%"
                />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-button-group
        style="display: flex; justify-content: flex-end; margin-top: 30px"
      >
        <el-button disabled type="primary" style="margin-right: 10px"
        >上一步</el-button
        >
        <el-button type="primary" style="margin-right: 10px" @click="next"
        >下一步</el-button
        >
        <el-button @click="close" type="primary" style="margin-right: 10px"
        >取消</el-button
        >
        <el-button disabled type="primary">完成</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  function isCode(str) {
    const reg = /^\w+$/
    return reg.test(str)
  }
  export default {
    name: 'TableDataSteps',
    props: {
      baseForm: {
        type: Object,
        default: () => {
          return {}
        },
      },
      tableFormCur: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      const validateTableName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入表名'))
        } else {
          callback()
        }
      }

      const validateName = (rule, value, callback) => {
        if (!isCode(value)) {
          callback(new Error('只能为字母、数字或下划线'))
        } else {
          callback()
        }
      }

      return {
        index: 1,
        selectRows: null,
        columnRules: {
          fieldName: [
            { required: true, message: '请选择字段名称', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: validateName },
          ],
          fieldType: [
            { required: true, message: '请选择字段类型', trigger: 'change' },
          ],
          fieldComments: [
            { required: true, message: '请输入字段描述', trigger: 'blur' },
          ],
        },
        options: [
          {
            value: 'form',
            label: '表单',
          },
        ],
        options2: [{ value: 'mysql', label: 'MySQL' }],
        rules: {
          tableName: [
            { required: true, trigger: 'blur', validator: validateTableName },
          ],
          tableType: [
            { required: true, trigger: 'change', message: '请选择表类型' },
          ],
          jdbcType: [
            { required: true, trigger: 'change', message: '请选择数据库类型' },
          ],
          comments: [{ required: true, trigger: 'blur', message: '请输入描述' }],
        },
      }
    },

    methods: {
      close() {
        this.$emit('close')
      },
      next() {
        this.$emit('setActive')
      },
      setSelectRows(val) {
        this.selectRows = val
      },
    },
  }
</script>


<style scoped>
</style>
