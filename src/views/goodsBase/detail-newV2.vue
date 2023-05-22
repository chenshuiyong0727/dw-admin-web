<template>
  <div class="page-container">
    <el-row type="flex" justify="space-between" class="top-flex">
      <h5 v-if="type == 1">详情</h5>
      <h5 v-if="type == 2">编辑</h5>
      <h5 v-if="type == 3">新增</h5>
      <el-button size="small" style="margin-right: 10px ; margin-bottom: 10px" @click="goBack()">
        返回列表
      </el-button>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="actNo" label="货号" class="is-required">
            <el-input v-model="form.actNo" :disabled="type == 1 ">
              <el-button type="primary" slot="append" @click="getImgUrl()"
                         :disabled="type == 1 "
                         icon="el-icon-refresh">获取资料
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item prop="type" label="类型" class="is-required">
            <el-select v-model="form.type" :disabled="type == 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in typeList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="18">
          <el-form-item prop="name" label="商品名称">
            <el-input v-model="form.name" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="name" label="发售价格">
            <el-input v-model="form.sellPrice" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="图片" class="is-required">
          <el-col :span="10">
            <img
              v-if="form.img"
              :src="form.img"
              style="width: 240px"
              @click="avatarShow"
            />
          </el-col>
        </el-form-item>
      </el-row>
      <!--      <el-row class="form-flex">-->
      <!--        <el-col :span="10">-->
      <!--          <el-form-item prop="sizeList" label="尺码" class="is-required">-->
      <!--            <el-cascader ref="owner" :disabled="type == 1 " v-model="sizeList"-->
      <!--                         :options="options" @change="getSize" :show-all-levels="true"-->
      <!--                         :props="props" size="small"-->
      <!--                         style="width:100%; display:inline-block"></el-cascader>-->

      <!--            &lt;!&ndash;            <el-input v-model="sizeList" :disabled="type == 1 "></el-input>&ndash;&gt;-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row class="form-flex">-->
      <!--        <el-col :span="5"><i class="red">*</i><span>尺码：</span></el-col>-->
      <!--        <el-col :span="18" :offset="1">-->
      <!--          <el-cascader ref="owner" v-model="sizeList" :options="options" @change="getSize" :show-all-levels="true" :props="props" size="small"  style="width:100%; display:inline-block"></el-cascader>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row class="form-flex">-->
      <!--        <el-col :span="10">-->
      <!--          <el-form-item  prop="imgUrl" label="图片地址"    class="is-required" >-->
      <!--            <el-input v-model="form.imgUrl" :disabled="type == 1 "></el-input>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="brand" label="品牌">
            <el-input v-model="form.brand" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="name" label="发售日期">
            <el-input v-model="form.sellDate" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="remark" label="备注">
            <el-input type="textarea" :rows="4" maxlength="140" size="small"
                      :disabled="type == 1 " v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-form-item label="图片" class="is-required">-->
      <!--          <el-col :span="10">-->
      <!--            <img-->
      <!--              v-if="form.img"-->
      <!--              :src="form.img"-->
      <!--              style="width: 240px"-->
      <!--              @click="avatarShow"-->
      <!--            />-->
      <!--          </el-col>-->
      <!--        </el-form-item>-->
      <!--      </el-row>-->
      <el-row>
        <el-col :span="11">
          <h5>尺码列表</h5>
          <el-table :row-style="{height:'40px'}"
                    :cell-style="{padding:'0px'}" border :data="tableData" @row-click="rowClick">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column align="center" prop="size" width="50" label="尺码"/>
            <el-table-column align="center" prop="price" width="57" label="当前价"/>
            <el-table-column align="center" prop="oldInventory" width="71" label="原始库存"/>
            <el-table-column align="center" prop="inventory" width="71" label="当前库存"/>
            <el-table-column align="center" prop="inPrice" width="57" label="入库价"/>
            <el-table-column align="center" prop="" label="到手价">
              <template v-if="scope.row.price" slot-scope="scope">{{(scope.row.price -
                (scope.row.price * 0.075 + 38 + 8.5)) | numFilter}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" label="预计利润">
              <template v-if="scope.row.inPrice" slot-scope="scope">
              <span
                :style="(scope.row.price - (scope.row.price * 0.075 + 38 + 8.5) - scope.row.inPrice - 10) > 50 ? 'color: red' : ''"
              >
                {{(scope.row.price - (scope.row.price * 0.075 + 38 + 8.5) - scope.row.inPrice - 10) | numFilter}}
              </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col style="margin-left: 30px;" :span="12">
          <h5>价格走势</h5>
          <div style=" display: flex;">
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>当前尺码</strong></p>
                <p class="color-danger"><strong>{{sizeTitle}}</strong></p>
              </div>
            </el-row>
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>价格更新日期</strong></p>
                <p>{{priceData.date}}</p>
              </div>
            </el-row>
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>当前价格</strong></p>
                <p>{{priceData.price}} </p>
              </div>
            </el-row>
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>当前到手价</strong></p>
                <p>{{priceData.theirPrice}} </p>
              </div>
            </el-row>
          </div>
          <div style=" display: flex;">
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>365天最高价</strong></p>
                <p>{{priceData.price365}} </p>
              </div>
            </el-row>
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>365天最高到手价</strong></p>
                <p>{{priceData.theirPrice365}} </p>
              </div>
            </el-row>
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>180天最高价</strong></p>
                <p>{{priceData.price180}} </p>
              </div>
            </el-row>
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>180天最高到手价</strong></p>
                <p>{{priceData.theirPrice180}} </p>
              </div>
            </el-row>
          </div>
          <div style=" display: flex;">
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>30天最高价</strong></p>
                <p>{{priceData.price30}} </p>
              </div>
            </el-row>
            <el-row class="clearfix btm-distance">
              <div class="overview">
                <p><strong>30天最高到手价</strong></p>
                <p>{{priceData.theirPrice30}} </p>
              </div>
            </el-row>
          </div>
          <div>
            <el-button @click="profitData(30)" round>30天走势图</el-button>
            <el-button @click="profitData(180)" round>180天走势图</el-button>
            <el-button @click="profitData(365)" round>365天走势图</el-button>
          </div>
          <div>
            <ve-line
              :data="chartData"
              :legend-visible="false"
              :loading="loading"
              :data-empty="dataEmpty"
              :settings="chartSettings"></ve-line>
          </div>
          <!--          <el-table border :data="tableData1">-->
          <!--            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>-->
          <!--            <el-table-column align="center" prop="date"  label="日期" />-->
          <!--            <el-table-column align="center" prop="price" label="价格" />-->
          <!--            <el-table-column align="center" prop="theirPrice" label="到手价" />-->
          <!--&lt;!&ndash;            <el-table-column align="center" prop=""  label="到手价">&ndash;&gt;-->
          <!--&lt;!&ndash;              <template v-if="scope.row.price" slot-scope="scope">&ndash;&gt;-->
          <!--&lt;!&ndash;                {{(scope.row.price - (scope.row.price * 0.075 + 38 + 8.5)) | numFilter}}&ndash;&gt;-->
          <!--&lt;!&ndash;              </template>&ndash;&gt;-->
          <!--&lt;!&ndash;            </el-table-column>&ndash;&gt;-->
          <!--          </el-table>-->
          <!--            <el-pagination-->
          <!--              @size-change="reSearchHandle"-->
          <!--              @current-change="pageChangeHandle"-->
          <!--              :current-page="queryParam1.pageNum"-->
          <!--              :page-sizes="[10, 30, 50, 100,150,200]"-->
          <!--              :page-size="queryParam1.pageSize"-->
          <!--              layout="total, sizes, prev, pager, next, jumper"-->
          <!--              :total="totalCount1">-->
          <!--            </el-pagination>-->
        </el-col>
      </el-row>
      <el-form-item style="margin-top: 20px;">
        <el-button-group v-if="type != 1">
          <el-button v-if="form.id" type="primary" @click="submit()">提交修改</el-button>
          <el-button @click="goBack()">取消</el-button>
        </el-button-group>
        <el-button-group v-else>
          <el-button type="primary" @click="goEdit(id,2)">编辑</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="form.img" alt="" width="100%">
      </div>
    </div>
  </div>
</template>
<script>
import { goodsBaseApi } from '@/api/goodsBase'
import { goodsBaseSizeApi } from '@/api/goodsBaseSize'
import { goodsBaseSizePriceApi } from '@/api/goodsBaseSizePrice'

export default {
  data() {
    return {
      pictureZoomShow: false,
      reqCount: 0,
      form: {
        sellDate: '',
        sellPrice: '01',
        img: '',
        type: '01',
        actNo: '',
        name: '',
        imgUrl: '',
        brand: '耐克',
        remark: '',
        sizeList: []
      },
      queryParam: {
        goodsId: ''
      },
      queryParam1: {
        goodsId: '',
        sizeId: '',
        dayNum: 30
      },
      tableData1: [],
      totalCount1: 1,
      tableData: [],
      typeList: [],
      dataStatusList: [],
      sizeTitle: '',
      type: '',
      id: '',
      options: [],
      rules: {
        type: [
          { required: true, trigger: 'blur', message: '类型非空' }
        ],
        actNo: [
          { required: true, trigger: 'blur', message: '货号非空' }
        ],
        imgUrl: [
          { required: true, trigger: 'blur', message: '图片地址非空' }
        ]
      },
      chartSettings: {
        xAxisType: 'time',
        area: false,
        scale: [true],
        axisSite: { right: ['date'] },
        labelAlias: {
          'price': '价格',
          'date': '日期'
        }
      },
      chartData: {
        columns: ['date', 'price'],
        rows: []
      },
      priceData: {},
      loading: false,
      dataEmpty: false
    }
  },
  created() {
    const { id, type } = this.$route.query
    this.id = id
    this.type = type
    this.form.id = id
    this.queryParam.goodsId = id
    if (this.id) {
      this.getDetailById(this.id)
    }
  },
  mounted() {
    this.listSysDict()
  },
  methods: {
    profitData(dayNum) {
      this.queryParam1.dayNum = dayNum
      this.getPriceData()
    },
    rowClick(row) {
      this.sizeTitle = row.size
      this.queryParam1.goodsId = this.form.id
      this.queryParam1.sizeId = row.sizeId
      this.getPriceData()
    },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
    },
    getPriceData() {
      goodsBaseSizePriceApi.getPriceData(this.queryParam1).then(res => {
        if (res.subCode === 1000) {
          this.priceData = res.data
          this.dataEmpty = false
          this.loading = false
          this.chartData.rows = res.data ? res.data.list : []
          let theirPrice = res.data.price - (res.data.price * 0.075 + 38 + 8.5)
          this.priceData.theirPrice = parseFloat(theirPrice).toFixed(2)

          let theirPrice30 = res.data.price30 - (res.data.price30 * 0.075 + 38 + 8.5)
          this.priceData.theirPrice30 = parseFloat(theirPrice30).toFixed(2)

          let theirPrice180 = res.data.price180 - (res.data.price180 * 0.075 + 38 + 8.5)
          this.priceData.theirPrice180 = parseFloat(theirPrice180).toFixed(2)

          let theirPrice365 = res.data.price365 - (res.data.price365 * 0.075 + 38 + 8.5)
          this.priceData.theirPrice365 = parseFloat(theirPrice365).toFixed(2)
        } else if (res.subCode === 10086) {
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    getPage() {
      goodsBaseSizeApi.page(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data ? res.data.list : []
          let totalCount = res.data ? res.data.pageInfo.totalCount : 0
          if (this.form.sizeVoList && this.tableData) {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].sizeId && this.tableData[i].inventory) {
                this.queryParam1.goodsId = this.form.id
                this.queryParam1.sizeId = this.tableData[i].sizeId
                this.sizeTitle = this.tableData[i].size
                this.getPriceData()
                break
              }
            }
          }
          if (totalCount < this.form.sizeList.length && this.reqCount < 5) {
            console.info(this.reqCount)
            setTimeout(() => {
              this.reqCount = this.reqCount + 1
              this.getPage()
            }, 2000)
          }
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    avatarShow() {
      this.pictureZoomShow = true
    },
    getDetailById(id) {
      if (id) {
        goodsBaseApi.getDetailById(id).then(res => {
          if (res.subCode === 1000) {
            this.form = res.data ? res.data : {}
            this.queryParam.goodsId = this.form.id
            this.getPage()
            this.getImgUrl()
          } else {
            this.$message.error(res.subMsg)
          }
        })
      }
    },
    getImgUrl() {
      if (!this.form.actNo) {
        this.$message.error('请输入货号')
        return false
      }
      let data = { actNo: this.form.actNo }
      goodsBaseApi.getGoodsByActNoAndSizeH5(data).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
          this.form = res.data ? res.data : {}
          this.queryParam.goodsId = this.form.id
          this.getPage()
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    goBack() {
      this.$router.push({ path: '/goodsBase/list' })
    },
    goEdit(id, type) {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/goodsBase/list/detail', query: { id, type } })
    },
    resetHandle() {
      this.form = {
        sellDate: '',
        sellPrice: '',
        img: '',
        type: '01',
        actNo: '',
        name: '',
        imgUrl: '',
        brand: 'Nike',
        remark: '',
        sizeList: []
      }
      this.tableData = []
    },
    submit() {
      this.$refs['form'].validate(async(valid) => {
        if (!valid) {
          return false
        }
        goodsBaseApi.update(this.form).then(res => {
          if (res.subCode === 1000) {
            this.$message.success('操作成功')
            this.$confirm('是否继续添加商品?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.resetHandle()
            }).catch(() => {
              this.goBack()
            })
          } else {
            this.$message.error(res.subMsg)
          }
        })
      })
    }
  }
}
</script>
<style>
  h5 {
    font-size: 16px;
    padding-bottom: 10px;
  }

  .overview {
    padding: 10px 10px;
    border-radius: 5px;
    background: #eee;
    /*    height: 135px;
        width: 195px;*/
    margin-right: 15px;
    float: left;

  strong {
    /*font-size: 16px;*/
    color: #111;
    padding-bottom: 5px;
    display: inline-block;
  }

  p {
    line-height: 25px;
  }

  }
</style>
