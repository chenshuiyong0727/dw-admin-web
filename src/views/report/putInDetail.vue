<template>
  <div class="page-container">
    <el-form ref="form">
      <el-row class="query-form">
        <el-col :span="6">
          <el-form-item size="small">
            <el-date-picker
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="创建时间开始"
              end-placeholder="创建时间结束"
              @change="createTimeChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.actNo" placeholder="货号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small">
            <el-input v-model.trim="queryParam.size" placeholder="尺码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-search"
                     @click="search">查询
          </el-button>
          <el-button type="primary" size="small" style="margin-right: 10px" icon="el-icon-refresh"
                     @click="resetHandle">重置
          </el-button>
          <el-button type="primary" size="small" style="margin-right: 10px"
                     @click="returnPage">返回
          </el-button>
          <el-button type="primary" size="small" style="margin-right: 10px"
                     @click="viewAll(months)">库存详情
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <buttomButton style="z-index: 9999" :tableRef="this.$refs['queryTable']"></buttomButton>
    <el-table ref="queryTable" height="600" style="margin-top: 20px" border :data="tableData">
      <el-table-column align="center" prop="actNo" label="货号"/>
      <el-table-column align="center" prop="oldInventory"  label="原始库存" sortable/>
      <el-table-column align="center" prop="inventoryAmount"  label="入库总额" sortable/>
            <el-table-column align="center" label="图片" fixed="left">
              <template slot-scope="scope">
                <img v-if="scope.row.imgUrl" :src="fileUrl+scope.row.imgUrl" class="userPic"
                     @click="avatarShow(scope.row.imgUrl)">
              </template>
            </el-table-column>
      <el-table-column align="center" prop="size" label="尺码" sortable/>
      <el-table-column align="center" prop="price" label="入库价" sortable/>
      <el-table-column align="center" prop="size"  label="得物价" sortable/>
      <el-table-column align="center" prop="" label="预计利润" sortable>
        <template v-if="scope.row.dwPrice" slot-scope="scope">
          <!--              style="color: red"-->
          <span
            :style="(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) > 50 ? 'color: red' : ''"
          >
                {{(scope.row.dwPrice - (scope.row.dwPrice * 0.075 + 38 + 8.5) - scope.row.price - 10) | numFilter}}
              </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="inventory"  label="剩余库存" sortable/>
      <el-table-column align="center" prop="successCount"  label="成功数" sortable/>
      <el-table-column align="center" prop="galleryCount"  label="上架数" sortable/>

<!--      <el-table-column align="center" prop="" label="总入库价">-->
<!--        <template slot-scope="scope">{{scope.row.price * scope.row.oldInventory }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" prop="" label="手续费" sortable>
        <template v-if="scope.row.dwPrice" slot-scope="scope">{{(scope.row.dwPrice * 0.075 + 38 +
          8.5) | numFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="" label="到手单价" sortable sortable>
        <template v-if="scope.row.dwPrice" slot-scope="scope">{{(scope.row.dwPrice -
          (scope.row.dwPrice * 0.075 + 38 + 8.5)) | numFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="入库时间" sortable>
        <template slot-scope="scope">{{scope.row.createTime | formateTime() }}</template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="编号"/>
    </el-table>
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="fileUrl + imageZoom" alt="" width="100%">
      </div>
    </div>
  </div>
</template>

<script>
import { reportApi } from '@/api/report'
import buttomButton from '@/components/buttomButton'

export default {
  components: {
    buttomButton
  },
  data() {
    return {
      sizeData: '',
      imageZoom: '',
      isShowDialog: false,
      createTime: [],
      queryParam: {
        createTimeFrom: '',
        createTimeTo: '',
        size: '',
        actNo: ''
      },
      pictureZoomShow: false,
      fileUrl: fileUrl,
      dataStatusList: [],
      imgUrl: '',
      actNo: '',
      months: '',
      tableData: []
    }
  },
  created() {
    const { months } = this.$route.query
    this.months = months
    if (this.months) {
      this.createTime[0] = this.months
      this.createTime[1] = this.months
      this.queryParam.createTimeFrom = this.months
      this.queryParam.createTimeTo = this.months
      this.getPage()
    }
  },
  // mounted() {
  //   this.getPage()
  //   this.listSysDict()
  // },
  methods: {
    viewAll(months) {
      this.$router.push({ path: '/goodsBase/goodsInventory/dataDetail', query: { months }})
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
    avatarShow(e) {
      this.imageZoom = e
      this.pictureZoomShow = true
    },
    jumpactNo() {
      if (!this.actNo) {
        this.$alert('没有选中数据')
        return
      }
      let actNo = this.actNo
      this.$router.push({ path: '/goodsOrder/list', query: { actNo }})
    },
    getPage() {
      reportApi.putInStorageDayDetail(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data ? res.data : []
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
    },
    search() {
      this.queryParam.pageNum = 1
      this.getPage()
    },
    returnPage() {
      this.$router.go(-1)
    },
    resetHandle() {
      this.queryParam = {
        createTimeFrom: '',
        createTimeTo: '',
        size: '',
        actNo: ''
      }
      this.months = this.months + '-01'
      let to = this.getNextMonth(this.months)
      this.createTime[0] = this.months
      this.createTime[1] = to
      this.queryParam.createTimeFrom = this.months
      this.queryParam.createTimeTo = to
      this.search()
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
</style>

