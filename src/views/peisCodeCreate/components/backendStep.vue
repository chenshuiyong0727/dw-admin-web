<template>
  <div style="margin-top: 15px" class="step-main">
    <div class="step-content">
      <el-form ref="tableForm" :model="{ tableForm: tableFormCur }">
        <el-table height="600" :data="tableFormCur" border>
          <el-table-column
            show-overflow-tooltip
            prop="fieldName"
            label="字段名称"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.fieldName'"
                :rules="columnRules.fieldName"
                class="el-form-item-table"
              >
                <el-input
                  v-model="scope.row.fieldName"
                  :disabled="true"
                  style="width: 100%"
                />
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
                  :disabled="true"
                  style="width: 100%"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="javaType"
            label="Java类型"
            min-width="130"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.javaType'"
                :rules="columnRules.javaType"
                class="el-form-item-table"
              >
                <el-input :disabled="scope.row.javaType === 'Integer'"
                          v-model="scope.row.javaType"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="dictTypeCode"
            label="字典类型编号"
            min-width="160"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.dictTypeCode'"
                :rules="columnRules.dictTypeCode"
                class="el-form-item-table"
              >
                <el-select
                  v-model="scope.row.dictTypeCode"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in dictList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="validateType"
            label="验证类别"
            min-width="280"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.validateType'"
                :rules="columnRules.validateType"
                class="el-form-item-table"
              >
                <el-select
                  v-model="scope.row.validateTypeList"
                  placeholder="请选择"
                  default-first-option=""
                  filterable
                  multiple
                  collapse-tags
                  :disabled="scope.row.disabled"
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
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-button-group
        style="display: flex; justify-content: flex-end; margin-top: 30px"
      >
        <el-button @click="prev" type="primary" style="margin-right: 10px"
        >上一步
        </el-button
        >
        <el-button disabled type="primary" style="margin-right: 10px"
        >下一步
        </el-button
        >
        <el-button type="primary" @click="close" style="margin-right: 10px"
        >取消
        </el-button
        >
        <el-button type="primary" @click="updateCode">完成</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BackendSteps',
    props: {
      id: {
        type: String,
        default: () => {
          return ''
        }
      },
      tableFormCur: {
        type: Array,
        default: () => {
          return []
        }
      },
      dictList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      const validateDictCode = (rule, value, callback) => {
        let index = parseInt(rule.field.split('.')[1])
        let item = this.tableFormCur[index]
        if (item.showType === '2' && item.dictTypeCode === null) {
          callback(new Error('请输入字典编号'))
        }
        callback()
      }
      return {
        options2: [
          {
            value: 'IS_NOT_NULL',
            label: '不能为空'
          },
          {
            value: 'IS_INTEGER',
            label: '整数'
          },
          {
            value: 'IS_DECIMAL',
            label: '浮点数'
          },
          {
            value: 'IS_PRIMES',
            label: '质数_素数'
          },
          {
            value: 'IS_LETTER',
            label: '纯字母'
          },
          {
            value: 'IS_UPPER_CASE',
            label: '大写'
          },
          {
            value: 'IS_LOWER_CASE',
            label: '小写'
          },
          {
            value: 'IS_IP',
            label: 'Ip'
          },
          {
            value: 'IS_IPV4',
            label: 'Ipv4'
          },
          {
            value: 'IS_IPV6',
            label: 'Ipv6'
          },
          {
            value: 'IS_MONEY',
            label: '金额'
          },
          {
            value: 'IS_EMAIL',
            label: '邮箱'
          },
          {
            value: 'IS_MOBILE',
            label: '手机号'
          },
          {
            value: 'IS_CITIZENID',
            label: '18位身份证'
          },
          {
            value: 'IS_CHINESE',
            label: '汉字'
          },
          {
            value: 'IS_GENERAL',
            label: '字母数字和下划线'
          },
          {
            value: 'IS_GENERAL_WITH_CHINESE',
            label: '汉字或字母或数字或下划线'
          },
          {
            value: 'IS_ZIPCODE',
            label: '邮编'
          },
          {
            value: 'URL',
            label: 'URL'
          },
          {
            value: 'IS_MAC',
            label: 'MAC地址'
          },
          {
            value: 'IS_PLATE_NUMBER',
            label: '中国车牌'
          },
          {
            value: 'IS_SECURITY_PASSWORD',
            label: '安全密码'
          }
        ],
        columnRules: {
          javaType: [
            { required: true, message: '请选择Java类型', trigger: 'change' }
          ],
          dictTypeCode: [
            { required: true, validator: validateDictCode, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      prev() {
        this.$emit('prev')
      },
      updateCode() {
        this.$refs['tableForm'].validate((valid) => {
          if (valid) {
            this.$emit('updateCodeEidt')
          } else {
            return false
          }
        })
      }
    }
  }
</script>


<style scoped>
</style>
