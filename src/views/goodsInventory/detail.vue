<template>
    <div class="page-container container-flex">
      <div class="container-left" >
        <el-row class="clearfix btm-distance">
          <div class="overview">
            <h5>{{form.actNo}}</h5>
            <img
              v-if="form.imgUrl"
              :src="fileUrl + form.imgUrl"
              style="width: 100px;height: 100px;"
              @click="avatarShow(form.imgUrl)"
            />
          </div>
        </el-row>
        <el-form ref="form" style="padding-top: 70px;">
          <el-row class="query-form">
            <el-col>
              <el-form-item size="small">
                <el-input v-model.trim="unifiedPrice" placeholder="一键设置入库价">
                  <el-button type="primary"  slot="append" @click="setUnifiedPrice()" >确认</el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="clearfix btm-distance">
          <span @click="addSizeHandle(item, index)"
                :class="activeIndex.includes(index) ? 'cityActive' : 'city'"
                v-for="(item, index) in form.sizeVoList" :key="item.id">{{item.size}} </span>
        </el-row>
      </div>
      <div class="container-right">
        <el-table style="margin-top: 20px" border :data="tableData">

<!--          <el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column align="center" prop="size" label="尺码"/>
          <el-table-column align="center" prop="inventory" label="库存">
            <template scope="scope">
              <div class="input-box">
                <el-input-number size="small"  v-model="scope.row.inventory" ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="单价">
            <template scope="scope">
              <div class="input-box">
                <el-input size="small"  v-model="scope.row.price"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="总价">
            <template v-if="scope.row.price && scope.row.inventory" slot-scope="scope">{{scope.row.price * scope.row.inventory }}</template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" @click="goDel(scope.row.sizeIndex,scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
import { goodsBaseApi } from '@/api/goodsBase'
import { goodsInventoryApi } from '@/api/goodsInventory'
import { permissionMixin } from '@/mixins/permissionMixin'

export default {
  mixins: [permissionMixin],
  components: {
  },
  data() {
    return {
      form: {
        sizeVoList: '',
        actNo: '',
        imgUrl: ''
      },
      queryParam1: {
        keyword: '',
        pageSize: 10,
        pageNum: 1
      },
      queryParam: {
        id: '',
        goodsId: '',
        sizeId: '',
        inventoryFrom: '',
        inventoryTo: '',
        createTimeFrom: '',
        createTimeTo: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        pageSize: 10,
        pageNum: 1
      },
      activeIndex: [],
      fileUrl: fileUrl,
      goodsId: '',
      unifiedPrice: '',
      dataStatusList: [],
      createTime: '',
      updateTime: '',
      selectedId: [],
      ids: [],
      tableData: [],
      totalCount: 1
    }
  },
  created() {
    const { goodsId } = this.$route.query
    this.goodsId = goodsId
    this.form.goodsId = goodsId
    if (this.goodsId) {
      this.getDetailById(this.goodsId)
    }
  },
  methods: {
    setUnifiedPrice() {
      if(!this.unifiedPrice) {
        this.$message.error('请输入价格')
        return
      }
      let table1 = []
      for (let i=0; i<this.tableData.length; i++){
        let data1 = this.tableData[i]
        data1.price = this.unifiedPrice
        table1.push(data1)
      }
      this.tableData = table1
    },
    addSizeHandle(item, index = 0) {
      if (!this.activeIndex.includes(index)){
        this.activeIndex.push(index)
        item.sizeIndex = index
        this.tableData.push(item)
        let table1 = []
        for (let i=0; i<this.tableData.length; i++){
          let data1 = this.tableData[i]
          let price = 1
          if (this.unifiedPrice) {
            price = this.unifiedPrice
          }
          data1.price = price
          data1.inventory = 1
          table1.push(data1)
        }
        this.tableData = table1
      } else {
        this.del(index)
        this.delItem(item)
      }
    },
    goDel(index,item) {
      this.del(index)
      this.delItem(item)
    },
    del(index){
      for (let i=0; i<this.activeIndex.length; i++){
        if (this.activeIndex[i] == index){
          this.activeIndex.splice(i, 1)
        }
      }
      console.log(this.activeIndex)
    },
    delItem(item){
      for (let i=0; i<this.tableData.length; i++){
        if (this.tableData[i].id == item.id){
          this.tableData.splice(i, 1)
        }
      }
      console.log(this.tableData)
    },
    avatarShow(e) {
      if (!e) {
        return
      }
      window.open(this.fileUrl + e)
    },
    getDetailById(id) {
      if (id) {
        goodsBaseApi.getDetailById(id).then(res => {
          if (res.subCode === 1000) {
            this.form = res.data ? res.data : {}
          } else {
            this.$message.error(res.subMsg)
          }
        })
      }
    },
    changeStatus(id, dataStatus) {
      goodsInventoryApi.changeStatus({ id, dataStatus }).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
        } else {
          this.$message.error(res.subMsg)
        }
        this.getPage()
      })
    },
    search() {
      this.queryParam.pageNum = 1
      this.getPage()
    },
    selected(val) {
      this.selectedId = val
      let temp = []
      for (let i = 0; i < this.selectedId.length; i++) {
        temp.push(this.selectedId[i].id)
      }
      this.ids = temp
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
        goodsInventoryApi.batchdelete(this.ids).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.getPage()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    resetHandle() {
      this.queryParam = {
        id: '',
        goodsId: '',
        sizeId: '',
        inventoryFrom: '',
        inventoryTo: '',
        createTimeFrom: '',
        createTimeTo: '',
        updateTimeFrom: '',
        updateTimeTo: '',
        pageSize: 10,
        pageNum: 1
      }
      this.createTime = ''
      this.updateTime = ''
      this.getPage()
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    height: 100%;

    .container-left {
      h5 {
        font-size: 14px;
        font-weight: bold;
        /*border-bottom: 1px solid #ddd;*/
        margin: 0;
        padding: 0 0 10px 0;
      }

      .select {
        padding-top: 15px;
      }

      .project-list {
        li {
          padding: 10px 0;

          &.on {
            a {
              color: rgb(64, 158, 255);
              text-decoration: underline
            }
          }
        }
      }
    }

    .container-right {
      .list {
        border-top: 1px solid #ddd;
        padding-top: 15px;
        margin-top: 15px;

        .from-title {
          background: #eee;
          padding: 0 15px;
        }

        .form-flex {
          line-height: 40px;
        }
      }
    }
  }

  .no-data p {
    text-align: center;
    padding-top: 100px;
  }
  .overview {
    padding: 20px 15px;
    border-radius: 5px;
    height: 80px;
    /*width: 195px;*/
    margin-right: 35px;
    float: left;
    strong {
      font-size: 16px;
      color: #111;
      padding-bottom: 5px;
      display: inline-block;
    }
    p {
      line-height: 25px;
    }
  }
</style>

