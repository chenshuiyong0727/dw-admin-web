<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    width="350px"
    class="menu-management-choose"
    append-to-body
    @close="close"
  >
    <el-col>
      <el-tree
        :data="authorityData"
        :check-strictly="false"
        ref="tree"
        node-key="id"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :check-on-click-node="true"
        :default-expanded-keys="checkedKeys"
        :props="defaultProps"
        @check="authorityCheck">
      </el-tree>
    </el-col>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { systemContainerApi } from '@/api/systemManage'

export default {
  name: 'MenuManagementChoose',
  props: {
    id: {
      type: String,
      default: () => {
        return null
      }
    },
    systemId: {
      type: Number
    }
  },
  data() {
    return {
      menuId: '',
      checkedKeys: [],
      authorityData: [],
      defaultProps: {
        children: 'child',
        label: 'functionLabel'
      },
      treeExpandData: ['0'],
      dialogTitle: '选择菜单',
      dialogVisible: false,
      chooseLoading: false
    }
  },
  methods: {
    listTreeFunctions(systemId) {
      systemContainerApi.listTreeFunctions({
        systemId: systemId
      }).then(res => {
        if (res.subCode === 1000) {
          this.authorityData = res.data
          this.sortFunTree(this.authorityData)
          if (this.$route.query.id) {
            this.getOpSysRoleById(this.$route.query.id)
          }
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getOpSysRoleById(id) {
      systemContainerApi.getOpSysRoleById({ id }).then(res => {
        if (res.subCode === 1000) {
          this.roleName = res.data.roleName
          this.systemId = res.data.systemId
          this.hasAuthorityArr = res.data.opFunTreeListDtos
          this.sortFunTree(this.hasAuthorityArr)
          this.checkedKeys = res.data.functions
          res.data.functions.forEach((id) => {
            this.$nextTick(() => {
              let node = this.$refs.tree.getNode(id)
              if (node && node.isLeaf) {
                this.$refs.tree.setChecked(node, true)
              }
            })
          })
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    authorityCheck(v, k) {
      this.chooseNodes = []
      let copy_v = JSON.parse(JSON.stringify(v))
      let node = this.$refs.tree.getNode(copy_v)
      if (node.checked) {
        if (this.$refs.tree2.getNode(node.parent.data)) {
          let filterNodesArr = this.$refs.tree.getCheckedNodes().concat(this.$refs.tree.getHalfCheckedNodes())
          let brotherNode = filterNodesArr.filter(item => item.pid == copy_v.pid)
          let insertNode = brotherNode.filter(item => parseInt(item.id) > parseInt(copy_v.id))
          this.$refs.tree2.remove(copy_v)
          if (insertNode.length) {
            this.$refs.tree2.insertBefore(copy_v, insertNode[0])
          } else {
            this.$refs.tree2.append(copy_v, node.parent.data)
          }
        } else {
          this.chooseNodes.push(copy_v)
          this.findParent(copy_v, this.authorityData)
        }
      } else {
        this.deleteNode(copy_v, this.hasAuthorityArr)
      }
    },
    showMenuChoose(id , systemId) {
      this.systemId = systemId
      this.dialogVisible = true
      this.listTreeFunctions(this.systemId)
    },
    close() {
      this.dialogVisible = false
      this.authorityData = []
    },
    // 保存权限
    async save() {
      const node = this.$refs.tree.getCurrentNode()
      this.$emit('menuChoose', node)
      this.close()
    },

    // 节点过滤操作
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>
