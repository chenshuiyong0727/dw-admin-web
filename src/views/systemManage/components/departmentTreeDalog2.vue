<template>
  <el-dialog
    title="部门列表展示"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">
    <el-row>
      <el-tree
        :data="departmentTreeData"
        :default-expand-all="false"
        show-checkbox
        node-key="id"
        ref="tree"
        accordion
        :check-strictly="true"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        :default-expanded-keys="checkedKeys">
      </el-tree>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmHandle" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>

  export default {
    props: {
      pageType: {
        type: Number,
        default: 1 // 1=>新增 2=>修改
      },
      departmentId: {
        type: Array,
        default: []
      },
      departmentTreeData: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        dialogVisible: true,
        // departmentTreeData: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        departmentMsg: '',
        checkedKeys: []
      }
    },
    mounted() {
      // this.listTreeDepartments()
      if (this.pageType == 2) {
        this.checkedKeys = this.departmentId
      }
    },
    methods: {
      closDialog() {
        this.$emit('closDialog')
      },
      // checkChangeHandle(data, checked, node) {
      //   // 设置单选
      //   if (checked) {
      //     this.$refs.tree.setCheckedNodes([data])
      //   }
      // },
      // getValueHandle(k, v) {
      //   // 获取选中值
      //   //this.$refs.tree.setCheckedKeys([])
      //   // let checkVal = value.id
      //   // this.$refs.tree.setCheckedKeys([checkVal])
      //   //console.log(k)
      // },
      confirmHandle() {
        // let parentDepMsg = {}
        // if (this.$refs.tree.getCheckedNodes().length && this.$refs.tree.getHalfCheckedNodes().length) {
        //   parentDepMsg = this.$refs.tree.getHalfCheckedNodes().filter(item => item.id == this.$refs.tree.getCheckedNodes()[0].superiorDepartment)[0]
        // }
        this.departmentMsg = this.$refs.tree.getCheckedNodes()
        console.log(this.departmentMsg)
        let departmentIdArr = []
        for (let i = 0; i < this.departmentMsg.length; i++) {
          departmentIdArr.push(this.departmentMsg[i].id)
        }
        this.$emit('getDepartmentMsg', departmentIdArr.join(';'))
        this.dialogVisible = false
      }
      // listTreeDepartments() {
      //   systemContainerApi.listTreeDepartments().then(res => {
      //     if (res.data) {
      //       this.departmentTreeData = res.data
      //       if (this.pageType == 2) {
      //         this.checkedKeys.push(this.departmentId)
      //       }
      //     } else {
      //       this.$message.error(res.subMsg)
      //     }
      //   })
      // }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog__header, ::v-deep .el-dialog__body {
    border-bottom: 1px solid #ddd;
  }
</style>
