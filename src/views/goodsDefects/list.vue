<template>
  <three-level-route>
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.keyword" placeholder="关键词（货号、商品名）"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input placeholder="原因" v-model.trim="queryParam.reason"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              @change="createTimeChange"
              end-placeholder="创建时间结束"
              range-separator="至"
              start-placeholder="创建时间开始"
              type="daterange"
              v-model="createTime"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.type">
              <el-option label="类型" value=""></el-option>
              <el-option
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue"
                v-for="item in typeList">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                placeholder="入库价开始"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.priceFrom">
              </el-input>
              <span> - </span>
              <el-input
                placeholder="入库价结束"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.priceTo">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input placeholder="订单号" v-model.trim="queryParam.orderNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <div>
              <el-input
                placeholder="原售价开始"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.shelvesPriceFrom">
              </el-input>
              <span> - </span>
              <el-input
                placeholder="原售价结束"
                style="width: 47%"
                v-input-validation
                v-model.trim="queryParam.shelvesPriceTo">
              </el-input>
            </div>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6">-->
<!--          <el-form-item size="small">-->
<!--            <el-input placeholder="状态" v-model.trim="queryParam.status"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="6">
          <el-form-item size="small">
            <el-select v-model="queryParam.status">
              <el-option label="类型" value=""></el-option>
              <el-option
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue"
                v-for="item in statusList">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row justify="center" type="flex"
              v-if="buttonPermissionArr.searchBtn && buttonPermissionArr.searchBtn.length">
        <el-button @click="search" icon="el-icon-search" size="small" style="margin-right: 10px"
                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['查询']">查询
        </el-button>
        <el-button @click="resetHandle" icon="el-icon-refresh" size="small"
                   style="margin-right: 10px"
                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['查询']">重置
        </el-button>
<!--        <el-button @click="goDetail(null,3)" icon="el-icon-plus" size="small"-->
<!--                   style="margin-right: 10px"-->
<!--                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['新增']">新增-->
<!--        </el-button>-->
<!--        <el-button @click="batchdelete" icon="el-icon-delete" size="small"-->
<!--                   style="margin-right: 10px"-->
<!--                   type="danger" v-permission:[buttonPermissionArr.searchBtn]="['批量删除']">批量删除-->
<!--        </el-button>-->
<!--        <el-button @click="exportHandle" icon="el-icon-download" size="small"-->
<!--                   style="margin-right: 10px"-->
<!--                   type="primary" v-permission:[buttonPermissionArr.searchBtn]="['导出']">导出-->
<!--        </el-button>-->
      </el-row>
    </el-form>

    <el-table :data="tableData" @selection-change="selected" border height="600"
              style="margin-top: 20px">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
<!--      <el-table-column align="center" label="货号" prop="actNo"/>-->
<!--      <el-table-column align="center" label="商品名称" prop="goodsName"/>-->
<!--      <el-table-column align="center" label="图片" prop="img"/>-->
      <el-table-column align="center" label="图片" width="85">
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img" class="userPic"
               @click="avatarShow(scope.row.img)">
          <img v-if="!scope.row.img && scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl"
               class="userPic" @click="avatarShow(fileUrl+scope.row.imgUrl)">
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="actNo" label="货号">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactNo(scope.row.actNo)"> {{ scope.row.actNo }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center"  prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactNo(scope.row.actNo)"> {{ scope.row.goodsName }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110" prop="orderNo" label="订单号">
        <template slot-scope="scope">
          <a style="color: #20a0ff" @click="jumpactOrder(scope.row.orderNo)"> {{ scope.row.orderNo }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态"  width="60" prop="status">
        <template slot-scope="scope">
          <strong :class="scope.row.status == 1 ? 'color-danger' : 'color-success'">{{ scope.row.status | dictToDescTypeValue(45) }}
          </strong>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="120" label="原因" prop="reason"/>
      <el-table-column align="center" label="创建时间"  width="100" prop="createTime">
        <template slot-scope="scope">{{scope.row.createTime | formateTime('{y}-{m}-{d} {h}:{i}')
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型"  width="60" prop="type">
        <template slot-scope="scope">{{ scope.row.type | dictToDescTypeValue(20221108) }}</template>
      </el-table-column>
      <el-table-column align="center" label="入库价"  width="60" prop="price"/>
<!--      <el-table-column align="center" label="订单号" prop="orderNo"/>-->

      <el-table-column align="center" label="原售价" width="60" prop="shelvesPrice"/>
<!--      <el-table-column align="center" label="状态" prop="status"/>-->
      <el-table-column align="center" fixed="right" label="操作"
                       v-if="buttonPermissionArr.listBtn && buttonPermissionArr.listBtn.length"
                       width="110">
        <template slot-scope="scope">
<!--          <div>-->
<!--&lt;!&ndash;            <el-button @click="goDetail(scope.row.id , 1)" type="text"&ndash;&gt;-->
<!--&lt;!&ndash;                       v-permission:[buttonPermissionArr.listBtn]="['查看']">查看&ndash;&gt;-->
<!--&lt;!&ndash;            </el-button>&ndash;&gt;-->
<!--            <el-button @click="goDetail(scope.row.id , 2)" type="text"-->
<!--                       v-permission:[buttonPermissionArr.listBtn]="['编辑']">编辑-->
<!--            </el-button>-->
<!--          </div>-->
<!--          <el-button @click="goDel(scope.row.id)" type="text"-->
<!--                     v-permission:[buttonPermissionArr.listBtn]="['删除']">删除-->
<!--          </el-button>-->
          <el-button @click="changeStatus(scope.row.id, 2)" type="text"
                     v-if="scope.row.status == 1"
                     v-permission:[buttonPermissionArr.listBtn]="['更新状态']">已处理
          </el-button>
          <el-button @click="changeStatus(scope.row.id, 1)" type="text"
                     v-if="scope.row.status == 2"
                     v-permission:[buttonPermissionArr.listBtn]="['更新状态']">瑕疵
          </el-button>
          <el-button type="text" @click="changeStatusDialog1(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="top-15">
      <el-pagination
        :current-page="queryParam.pageNum"
        :page-size="queryParam.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        @current-change="pageChangeHandle"
        @size-change="reSearchHandle"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-row>
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="imageZoom" alt="" width="100%" >
      </div>
    </div>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="40%" center>
      <el-row class="form-flex" style="margin-bottom: 20px;">
        <el-col :span="8" style="text-align: right"><span>图片：</span></el-col>
        <el-col :span="8" :offset="1">
          <img v-if="orderData1.img" :src="orderData1.img" class="userPic"
               @click="avatarShow(orderData1.img)">
        </el-col>
      </el-row>
      <el-row class="form-flex" style="margin-bottom: 20px;">
        <el-col :span="8" style="text-align: right"><span>货号：</span></el-col>
        <el-col :span="8" :offset="1">
          <span>{{orderData1.actNo}}</span>
        </el-col>
      </el-row>
      <el-row class="form-flex" style="margin-bottom: 20px;">
        <el-col :span="8" style="text-align: right"><span>尺码：</span></el-col>
        <el-col :span="8" :offset="1">
          <span>{{orderData1.size}}</span>
        </el-col>
      </el-row>
      <el-row class="form-flex" style="margin-bottom: 20px;">
        <el-col :span="8" style="text-align: right"><i class="red">*</i><span>瑕疵原因：</span></el-col>
        <el-col :span="12" :offset="1">
          <el-input type="textarea" :rows="4" maxlength="140" size="small" v-model="requestParam.reason"></el-input>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="8" style="text-align: right"><i class="red">*</i><span>创建时间：</span></el-col>
        <el-col :span="8" :offset="1">
          <el-date-picker type="datetime" placeholder="发货截止时间" v-model="requestParam.createTime" value-format="yyyy-MM-dd HH:mm:ss">></el-date-picker>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="update" size="small">确 定</el-button>
       </span>
    </el-dialog>
  </three-level-route>
</template>

<script>
import ThreeLevelRoute from '@/components/ThreeLevelRoute'
import { goodsDefectsApi } from '@/api/goodsDefects'
import { permissionMixin } from '@/mixins/permissionMixin'
import { getExport } from '@/api/exportFile'
import { parseTime } from '@/utils/index'

export default {
  mixins: [permissionMixin],
  components: {
    ThreeLevelRoute
  },
  data() {
    return {
      orderData1: '',
      requestParam: {
        id: '',
        reason: '',
        createTime: ''
      },
      dialogVisible: false,
      pictureZoomShow: false,
      imageZoom: '',
      fileUrl: fileUrl,
      queryParam: {
        reason: '',
        createTimeFrom: '',
        createTimeTo: '',
        keyword: '',
        priceFrom: '',
        priceTo: '',
        orderNo: '',
        shelvesPriceFrom: '',
        shelvesPriceTo: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      },
      dataStatusList: [],
      typeList: [],
      statusList: [],
      createTime: '',
      selectedId: [],
      ids: [],
      tableData: [],
      totalCount: 1
    }
  },
  mounted() {
    this.getPage()
    this.listSysDict()
  },
  methods: {
    changeStatusDialog1(row) {
      this.orderData1 = row
      this.requestParam.reason = row.reason
      this.requestParam.createTime = parseTime(row.createTime)
      this.requestParam.id = row.id
      this.dialogVisible = true
    },
    avatarShow(e) {
      this.imageZoom = e
      this.pictureZoomShow = true
    },
    jumpactNo(actNo) {
      this.$router.push({ path: '/goodsBase/goodsInventory', query: { actNo } })
    },
    jumpactOrder(orderNo) {
      this.$router.push({ path: '/goodsOrder/list', query: { orderNo } })
    },
    createTimeChange() {
      if (this.createTime) {
        this.queryParam.createTimeFrom = this.createTime[0]
        this.queryParam.createTimeTo = this.createTime[1]
      } else {
        this.queryParam.createTimeFrom = null
        this.queryParam.createTimeTo = null
      }
    },
    getPage() {
      goodsDefectsApi.page(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data ? res.data.list : []
          this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
      this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
      this.statusList = sysDictList.filter(item => item.typeValue == 45)
    },
    pageChangeHandle(currentPage) {
      this.queryParam.pageNum = currentPage
      this.getPage()
    },
    reSearchHandle(size) {
      this.queryParam.pageSize = size
      this.queryParam.pageNum = 1
      this.getPage()
    },
    goDetail(id, type) {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/goodsBase/goodsDefects/detail', query: { id, type } })
    },
    update() {
      goodsDefectsApi.update(this.requestParam).then(res => {
        if (res.subCode === 1000) {
          this.$message.success('操作成功')
          this.getPage()
          this.dialogVisible = false
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    changeStatus(id, dataStatus) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodsDefectsApi.changeStatus({ id, dataStatus }).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
          } else {
            this.$message.error(res.subMsg)
          }
          this.getPage()
        })
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
        goodsDefectsApi.batchdelete(this.ids).then(res => {
          if (res.subCode === 1000) {
            this.$message.success(res.subMsg)
            this.getPage()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    },
    exportHandle() {
      let data = {}
      if (this.ids.length > 0) {
        data.ids = this.ids
      } else {
        this.$message.success('未勾选数据，导出符合条件的所有数据')
        data = {
          ...this.queryParam
        }
      }
      getExport('/gw/op/v1/goodsDefects/export', data, 'post', '瑕疵商品列表').then(() => {
        this.$emit('refresh')
      })
    },
    resetHandle() {
      this.queryParam = {
        reason: '',
        createTimeFrom: '',
        createTimeTo: '',
        keyword: '',
        goodsName: '',
        priceFrom: '',
        priceTo: '',
        orderNo: '',
        shelvesPriceFrom: '',
        shelvesPriceTo: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      }
      this.createTime = ''
      this.getPage()
    }
  }
}
</script>
