<template>
  <div class="page-container">
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>选择系统：</span></el-col>
      <el-col :span="18" :offset="1">
        <el-select :disabled="modifyId ? true : false" v-model="systemId" @change="changeSystem" size="small" style="width: 100%">
          <el-option
            v-for="item in systemList"
            :key="item.systemId"
            :label="item.systemName"
            :value="item.systemId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5"><i class="red">*</i><span>角色名称：</span></el-col>
      <el-col :span="18" :offset="1"><el-input maxlength="15" v-model="roleName" placeholder="角色名称" size="small"></el-input></el-col>
    </el-row>
    <div class="author-list">
      <div class="list">
        <p>全部功能权限</p>
        <div class="list-left">
          <div class="border">
            <el-tree
              :data="authorityData"
              show-checkbox
              :check-strictly="false"
              ref="tree"
              node-key="id"
              :default-expanded-keys="checkedKeys"
              :props="defaultProps"
              @check="authorityCheck">
            </el-tree>
          </div>
          <div class="arrow">
            >>>>>
          </div>
        </div>
      </div>
      <div class="list">
        <p>已选功能权限</p>
        <div class="border border2">
          <el-tree
            :data="hasAuthorityArr"
            :check-strictly="false"
            default-expand-all
            ref="tree2"
            node-key="id"
            :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span style="width: 200px; display: inline-block;">{{ node.label }}</span>
              <span v-if="!node.childNodes.length">
                <el-button
                  type="text"
                  size="mini"
                  @click="() => removeNodes(node, data)">
                  <i class="el-icon-close" style="font-size: 16px; color: #999"></i>
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <el-row class="button" type="flex" justify="center">
      <el-button type="primary" @click="getCheckedKeys">确认</el-button>
      <el-button type="text" @click="goBack">返回</el-button>
    </el-row>
  </div>
</template>
<script>
import { systemContainerApi } from '@/api/systemManage'
import { getCookieByName } from '@/utils/auth'
export default {
  data() {
    return {
      modifyId: '',
      param: {
        level: ''
      },
      checkedKeys: [],
      authorityData: [],
      hasAuthorityArr: [],
      systemList: [],
      defaultProps: {
        children: 'child',
        label: 'functionLabel'
      },
      systemId: '',
      roleName: '',
      description: '',
      chooseNodes: [],
    }
  },
  mounted() {
    this.getOpSystemList()
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
            this.modifyId = this.$route.query.id
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
    sortFunTree(arr) {
      arr.sort((a, b) => {
        return a.id - b.id
      })
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].child && arr[i].child.length) {
          this.sortFunTree(arr[i].child)
        }
      }
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
    removeNodes(node, data) {
      this.$refs.tree.setChecked(data, false)
      this.deleteNode(data, this.hasAuthorityArr)
    },
    deleteNode(v, arr) {
      let node = this.$refs.tree2.getNode(v)
      if (node.parent.parent && node.parent.childNodes.length == 1) {
        this.deleteNode(node.parent.data, arr)
      } else {
        this.$refs.tree2.remove(node.data)
      }
    },
    findParent(v, arr) {
      for (let i = 0; i < arr.length; i++) {
        let val = JSON.parse(JSON.stringify(arr[i]))
        if (v.pid == arr[i].id) {
          this.chooseNodes.unshift(val)
          if (this.chooseNodes.length > 1) {
            this.chooseNodes[0].child = [this.chooseNodes.pop()]
          }
          if (v.pid != 0 && !this.$refs.tree2.getNode(arr[i])) {
            this.findParent(arr[i], this.authorityData)
          } else {
            let node = this.chooseNodes[0].child[0]
            let filterNodesArr = this.$refs.tree.getCheckedNodes().concat(this.$refs.tree.getHalfCheckedNodes())
            let brotherNode = filterNodesArr.filter(item => item.pid == node.pid)
            let insertNode = brotherNode.filter(item => parseInt(item.id) > parseInt(node.id))
            if (insertNode.length) {
              this.$refs.tree2.insertBefore(node, insertNode[0])
            } else {
              this.$refs.tree2.append(node, this.$refs.tree2.getNode(arr[i]).data)
            }
          }
        } else if (v.pid === '0' && v.id == arr[i].id) {
          let node = this.chooseNodes[0]
          let filterNodesArr = this.$refs.tree.getCheckedNodes().concat(this.$refs.tree.getHalfCheckedNodes())
          let brotherNode = filterNodesArr.filter(item => item.pid == node.pid)
          let insertNode = brotherNode.filter(item => parseInt(item.id) > parseInt(node.id))
          this.$refs.tree2.remove(val)
          if (insertNode.length) {
            this.$refs.tree2.insertBefore(node, insertNode[0])
          } else {
            this.$refs.tree2.append(node)
          }
          break
        } else {
          this.findParent(v, arr[i].child)
        }
      }
    },
    getOpSystemList() {
      systemContainerApi.getOpSystemList().then(res => {
        if (res.subCode === 1000) {
          this.systemList = res.data
          this.systemId = res.data[0].systemId
          this.listTreeFunctions(this.$route.query.systemId ? this.$route.query.systemId : this.systemId)
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getCheckedKeys() {
      let param = {
        roleName: this.roleName,
        systemId: this.systemId,
        functions: this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()),
        userId: getCookieByName('user_id')
      }
      if (!param.functions || param.functions.length == 0) {
        return this.$message.error('请选择权限')
      }
      if (this.$route.query.id) {
        // 修改
        systemContainerApi.updateOpSysRole({...param, id: this.modifyId}).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              type: 'success',
              message: '权限修改成功'
            })
            this.$router.go(-1)
          } else {
            this.$message.error(res.subMsg)
          }
        })
      } else {
        if (!this.roleName) {
          return this.$message.error('请填写角色名称')
        }
        // 新增
        systemContainerApi.saveOpSysRole(param).then(res => {
          if (res.subCode === 1000) {
            this.$message({
              type: 'success',
              message: '新增权限成功'
            })
            this.$router.go(-1)
          } else {
            this.$message.error(res.subMsg)
          }
        })
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    changeSystem() {
      this.hasAuthorityArr = []
      this.listTreeFunctions(this.systemId)
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    margin: 50px 0 0 90px;
    width: 900px;
    .el-row {
      margin-bottom: 15px;
    }
    .form-flex {
      width: 450px;
    }
    .author-list {
      display: flex;

      margin-bottom: 30px;
    }
    .arrow {
      margin: 0 20px;
    }
    .list {
      width: 500px;
      p {
        margin-bottom: 10px;
      }
      .border {
        width: 400px;
        border: 1px solid #ccc;
        padding: 20px 30px;
        box-sizing: border-box;
        max-height: 600px;
        overflow: auto;
      }
      .border2 {
        width: auto;
      }
    }
    .list-left {
      display: flex;
      align-items: center;
    }
  }
</style>

