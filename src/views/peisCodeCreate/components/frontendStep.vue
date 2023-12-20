<template>
  <div style="margin-top: 15px" class="step-main">
    <div class="step-content">
      <el-form ref="tableForm" :model="{ tableForm: tableFormCur }">
        <el-table height="600" :data="tableFormCur" border>
          <el-table-column
            show-overflow-tooltip
            prop="fieldName"
            label="字段名称"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.fieldName'"
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
            min-width="200"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.fieldComments'"
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
            prop="showType"
            label="展示方式"
            min-width="140"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.showType'"
                class="el-form-item-table"
              >
                <el-select
                  v-model="scope.row.showType"
                  placeholder="请选择"
                  default-first-option=""
                  filterable
                  clearable
                  @change="showTypeChange(scope.row)"
                  :disabled="scope.row.disabled"
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
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izShowList"
            label="列表显示"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.izShowList'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izShowList"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="
                    scope.row.disabled ||
                    scope.row.showType === null ||
                    scope.row.showType === ''
                  "
                  @change="izShowListChange(scope.row)"
                >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="izKeyword"
            label="关键词匹配"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.izKeyword'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izKeyword"
                  :active-value="'1'"
                  :inactive-value="'0'"
                  @change="izKeywordChange(scope.row)"
                >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izShowForm"
            label="表单显示"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.izShowForm'"
                class="el-form-item-table"
              >
                <el-switch
                  :disabled="
                    scope.row.disabled ||
                    scope.row.showType === null ||
                    scope.row.showType === ''
                  "
                  v-model="scope.row.izShowForm"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="queryType"
            label="检索类别"
            min-width="140"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.' + scope.$index + '.queryType'"
                class="el-form-item-table"
              >
                <!-- 如果为 2 3 字典和日期, 或者 不在列表显示 的话 禁止手动选择 -->
                <el-select
                  v-model="scope.row.queryType"
                  placeholder="请选择(可空)"
                  default-first-option=""
                  clearable
                  collapse-tags
                  :disabled="
                    scope.row.disabled ||
                    scope.row.showType === '2' ||
                    scope.row.showType === '3' ||
                    scope.row.showType === '4' ||
                    scope.row.izShowList === null ||
                    scope.row.izShowList === 0
                  "
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
        <el-button type="primary" @click="prev" style="margin-right: 10px"
        >上一步
        </el-button
        >
        <el-button @click="next" type="primary" style="margin-right: 10px"
        >下一步
        </el-button
        >
        <el-button type="primary" style="margin-right: 10px" @click="close"
        >取消
        </el-button
        >
        <el-button disabled type="primary">完成</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  function isNull(val) {
    /**
     * 判断是否为空
     *  val
     * @returns
     */
    return (
      val === undefined ||
      val == null ||
      val === '' ||
      val === '' ||
      val === 'undefined' ||
      val === 'null' ||
      val === 'NULL'
    )
  }

  export default {
    name: 'FrontendStep',
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
      }
    },
    data() {
      return {
        options: [
          {
            value: '0',
            label: '文本框'
          },
          {
            value: '1',
            label: '文本域'
          },
          {
            value: '2',
            label: '字典选择'
          },
          {
            value: '3',
            label: '时间控件'
          },
          {
            value: '4',
            label: '日期控件'
          }
        ],
        options2: [
          {
            value: 'EQ',
            label: '全值匹配'
          },
          {
            value: 'RANGE',
            label: '范围匹配'
          },
          {
            value: 'LIKE',
            label: '模糊匹配'
          },
          {
            value: 'KEYWORD',
            label: '关键词'
          }
        ]
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      prev() {
        this.$emit('prev')
      },
      next() {
        this.$emit('next')
      },

      // 生成方案
      showTypeChange(el) {
        if (!isNull(el)) {
          if (isNull(el.showType)) {
            el.izShowForm = 0
            el.izShowList = 0
            el.queryType = ''
          } else {
            // 如果是 字典 则需要把 Java类型强制改为 String 且不可改
            if (el.showType === '2') {
              el.javaType = 'Integer'
            }
          }
          this.izShowListChange(el)
        }
      },
      // 列表显示
      izShowListChange(el) {
        if (!isNull(el)) {
          // 在列表显示
          if (el.izShowList === 1) {
            // 字典
            if (el.showType === '2') {
              el.queryType = 'EQ'
            }
            // 日期
            else if (el.showType === '3' || el.showType === '4') {
              el.queryType = 'RANGE'
            }
          } else {
            el.queryType = ''
          }
        }
      },
      // 列表显示
      izKeywordChange(el) {
        if (!isNull(el)) {
          // 在列表显示
          if (el.izKeyword === 1 || el.izKeyword === '1') {
            // 字典
            el.queryType = 'KEYWORD'
          } else {
            el.queryType = ''
          }
        }
      }
    }
  }
</script>


<style scoped>
</style>
