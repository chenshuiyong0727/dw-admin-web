<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item label="" size="small">
            <el-select v-model="queryParam.systemId" @change="changeSystem">
              <el-option label="所属系统" value=""></el-option>
              <el-option
                v-for="item in systemList"
                :key="item.systemName"
                :label="item.systemName"
                :value="item.systemId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row  class="btm-distance">
      <el-button icon="el-icon-plus" type="primary" size="small" @click="addDialog">新增菜单</el-button>
      <el-button size="small" type="" icon="el-icon-plus"  @click="addDialogRoot">新增根菜单</el-button>
      <el-button type="danger" size="small" style="margin-right: 10px" icon="el-icon-delete" @click="batchdelete">批量删除</el-button>
      <el-button type="primary" size="small" @click="updateKeywordDialog">批量修改关键词</el-button>
      <el-button type="primary" size="small" @click="reload1()">重置</el-button>
    </el-row>
    <el-table
      border
      :data="tableData"
      row-key="id"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="selected"
      >
      <el-table-column fixed="right" align="center" label="操作" width="200" >
        <template slot-scope="scope">
            <el-button type="text" @click="addDialogList(scope.row)" >新增菜单</el-button>
            <el-button type="text" @click="updateDialog(scope.row)" >修改</el-button>
            <el-button type="text" @click="goDel(scope.row)">删除</el-button>
            <el-button type="text" @click="goCopy(scope.row)">复制</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip type="selection" width="55"/>
      <el-table-column show-overflow-tooltip  prop="id" width="140" label="id" />
      <el-table-column show-overflow-tooltip  prop="functionName" width="130" label="菜单名称" />
      <el-table-column show-overflow-tooltip  prop="functionKey" width="220" label="菜单键值" />
      <el-table-column show-overflow-tooltip  prop="locationPath" width="300" label="本地路径" />
      <el-table-column show-overflow-tooltip  prop="route"  width="200" label="路由" />
      <el-table-column show-overflow-tooltip  prop="sort" label="排序" />
      <el-table-column  prop="functionType" label="权限类型">
        <template slot-scope="scope">{{ scope.row.functionType | dictToDescTypeValue(8) }}</template>
      </el-table-column>
      <el-table-column  prop="operationType"  width="100" label="操作类型">
        <template slot-scope="scope">{{ scope.row.operationType | dictToDescTypeValue(9) }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  prop="functionDesc" label="权限描述" />
      <el-table-column show-overflow-tooltip  prop="functionLabel" label="权限标签" />
    </el-table>
    <copy-data-dialog v-if="isShowDialog1" :ids="ids" :keyword="keyword" :oldName="oldName"  @reload2="reload2" @reload1="reload1" @closeDialog1="closeDialog1" />
    <add-data-dialog v-if="isShowDialog" :modifyId="modifyId" :systemId="queryParam.systemId" :pData="pData" :isRoot="isRoot"  @refreshPage="refreshPage" @closDialog="closDialog" />
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { permissionMixin } from '@/mixins/permissionMixin'
import { systemContainerApi } from '@/api/systemManage'
import { getCookieByName } from '@/utils/auth'
import copyDataDialog from './components/copyDataDialog'
import addDataDialog from './components/addDataDialog'
import DICT_KEYS from '@/utils/staticEnum'
export default {
  components: { ThreeLevelRoute, addDataDialog,copyDataDialog },
  mixins: [permissionMixin],
  data() {
    return {
      queryParam: {
        systemId: 2,
        pid: 0
      },
      statusList: [
        { key: '删除', value: -1 },
        { key: '禁用', value: 0 },
        { key: '正常', value: 1 }
      ],
      tmpTreeData: {},
      isShowDialog1: false,
      isShowDialog: false,
      isRoot: 0,
      modifyId: '',
      selectedId: [],
      keyword: '',
      oldName: '',
      ids: [],
      authList: [],
      opList: [],
      systemList: [],
      pData: {},
      tableData: []
    }
  },
  mounted() {
    if (!this.$route.meta.routerId) {
      this.findMenuTreePageByLazy()
      this.listSysDict()
    }
  },
  methods: {
    reload1() {
      location.reload()
    },
    reload2() {
      this.isShowDialog1 = false
    },
    updateKeywordDialog() {
      if (this.ids.length == 0) {
        this.$alert('没有选中数据')
        return
      }
      this.$confirm('是否批量修改关键词（包含下一级）?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isShowDialog1 = true
      })
    },
    selected(val) {
      this.selectedId = val
      let temp = []
      for (let i = 0; i < this.selectedId.length; i++) {
        temp.push(this.selectedId[i].id)
        this.ids = temp
        // 健值
        let key = this.selectedId[i].functionKey
        if (key.indexOf('v1:') != -1) {
          key = key.substring(key.indexOf('v1:') + 3, key.length)
          if (key.indexOf(':') == -1) {
            this.keyword = key
          } else {
            key = key.substring(0, key.indexOf(':'))
            this.keyword = key
          }
        }
        // 名称
        let name = this.selectedId[i].functionName
        if (name.indexOf('管理') != -1) {
          name = name.replace('管理', '')
        }
        if (name.indexOf('列表') != -1) {
          name = name.replace('列表', '')
        }
        if (name.indexOf('信息') != -1) {
          name = name.replace('信息', '')
        }
        this.oldName = name
      }
    },
    changeSystem() {
      this.queryParam.pid = 0
      this.systemId = this.queryParam.systemId
      this.findMenuTreePageByLazy()
    },

    listSysDict() {
      let sysDictList = sessionStorage.getItem('sysDictList') ? JSON.parse(sessionStorage.getItem('sysDictList')) : []
      this.authList = sysDictList.filter(item => item.typeValue == DICT_KEYS.AUTHTYPE)
      this.opList = sysDictList.filter(item => item.typeValue == DICT_KEYS.OPTYPE)
      this.systemList = sessionStorage.getItem('systemList') ? JSON.parse(sessionStorage.getItem('systemList')) : []
      if (this.systemList) {
        this.systemList = this.systemList.filter(item => item.systemId != 3 && item.systemId != 4)
      }
    },
    findMenuTreePageByLazy() {
      if (!this.queryParam.systemId) {
        this.$message.error('请选择系统')
        return
      }
      systemContainerApi.findMenuTreePageByLazy(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    addDialogList(val) {
      this.pData = val
      this.modifyId = ''
      this.isShowDialog = true
      this.isRoot = 0
    },
    addDialogRoot() {
      this.pData = {}
      this.modifyId = ''
      this.isRoot = 1
      this.isShowDialog = true
    },
    addDialog() {
      this.pData = {}
      this.modifyId = ''
      this.isShowDialog = true
      this.isRoot = 0
    },
    updateDialog(val) {
      this.pData = {}
      this.modifyId = val.id
      this.isShowDialog = true
      this.isRoot = 0
    },
    closDialog() {
      this.isShowDialog = false
    },
    closeDialog1() {
      this.isShowDialog1 = false
    },
    refreshPage1() {
      this.tableData = []
      this.tmpTreeData = {}
      this.isShowDialog1 = false
      this.findMenuTreePageByLazy()
    },
    refreshPage(id, isReLoad) {
      if (isReLoad === true) {
        this.tableData = []
        this.tmpTreeData = {}
        this.isShowDialog = false
        this.findMenuTreePageByLazy()
        return
      } else {
        this.isShowDialog = false
        const cache = this.tmpTreeData[id]
        if (!cache) {
          this.findMenuTreePageByLazy()
        } else {
          // 通过节点id找到对应树节点对象
          let tree = cache.tree
          let treeNode = cache.treeNode
          let resolve = cache.resolve
          this.load(tree, treeNode, resolve)
        }
      }
    },
    goDel(val) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        systemContainerApi.delById(val.id).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            // location.reload()
            console.info(val.pid)
            this.refreshPage(val.pid)
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    goCopy(val) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        systemContainerApi.goCopy({ systemId: this.queryParam.systemId, id: val.id }).then(res => {
          if (res.subCode === 1000) {
            this.refreshPage(val.pid)
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    batchdelete() {
      if (this.ids.length == 0) {
        this.$alert('没有选中数据')
        return
      }
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        systemContainerApi.batchdelete(this.ids).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            location.reload()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    async load(tree, treeNode, resolve) {
      this.queryParam.pid = tree.id
      systemContainerApi.findMenuTreePageByLazy(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          resolve(res.data)
        } else {
          this.$message.error(res.subMsg)
        }
      })
      this.tmpTreeData[tree.id] = {tree, treeNode, resolve}
    },
    updateTimeChange() {
      if (this.updateTime) {
        this.queryParam.updateTimeFrom = this.updateTime[0]
        this.queryParam.updateTimeTo = this.updateTime[1]
      } else {
        this.queryParam.updateTimeFrom = null
        this.queryParam.updateTimeTo = null
      }
    },
    updateStatus(id, dataStatus) {
      this.$confirm('是否确认进行此状态修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userId = getCookieByName('user_id')
        systemContainerApi.updateUserStatus({id, dataStatus: dataStatus == 0 ? 1 : 0, sysUserId: userId}).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
            this.findMenuTreePageByLazy()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
