<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">库存总数</div>
            <div class="color-main address-content">
              <span class="color-danger">{{form.inventoryNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">库存比例</div>
            <div class="color-main address-content">
              <span v-if="form.inventoryNum  &&form.goodsPutInNum" >{{form.inventoryRatio}}%</span>
              <span v-else > 0%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpGoods()">
            <div class="layout-title">商品款式总数</div>
            <div class="color-main address-content">
              <span >{{form.goodsNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title" >入库商品总数</div>
            <div class="color-main address-content">
              <span >{{form.goodsPutInNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">交易成功数</div>
            <div class="color-main address-content">
              <span >{{form.successNum}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">库存成本</div>
            <div class="color-main address-content">
              <span >{{form.inventoryCost}}</span>
            </div>
          </div>
        </el-col>
<!--        <el-col :span="4">-->
<!--          <div class="out-border" @click="jumpactNo()">-->
<!--            <div class="layout-title">市值总价</div>-->
<!--            <div class="color-main address-content">-->
<!--              <span >{{form.marketValue}}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-col>-->
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">利润总额</div>
            <div class="color-main address-content">
              <span class="color-danger">{{form.profitsAmount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">市值利润</div>
            <div class="color-main address-content">
              <span >{{form.marketValue - form.inventoryCost}}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">成功总额</div>
            <div class="color-main address-content">
              <span >{{form.orderAmount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">总运费</div>
            <div class="color-main address-content">
              <span >{{form.freight}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">手续费</div>
            <div class="color-main address-content">
              <span >{{form.poundage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border">
            <div class="layout-title">其他收支</div>
            <div class="color-main address-content">
              <span >{{form.otherRevenue}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border"  @click="jumpactOrder(7)">
            <div class="layout-title">平均利润</div>
            <div class="color-main address-content">
              <span class="color-danger">{{form.profitsAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactNo()">
            <div class="layout-title">库存均价</div>
            <div class="color-main address-content">
              <span >{{form.inboundAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">成功均价</div>
            <div class="color-main address-content">
              <span >{{form.orderAmountAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title" >运费均价</div>
            <div class="color-main address-content">
              <span >{{form.freightAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4" >
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">成本均价</div>
            <div class="color-main address-content">
              <span >{{form.costAverage}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="out-border" @click="jumpactOrder(7)">
            <div class="layout-title">实际利润比例</div>
            <div class="color-main address-content">
              <span >{{form.profitsProportion}}%</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item"  @click="jumpactOrder(2)">
              <span class="font-medium">已上架商品</span>
              <span style="float: right" >({{orderIofo.count2}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(3)">
              <span class="font-medium">待发货商品</span>
              <span
                style="float: right"
                :class="orderIofo.count3 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count3}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(4)">
              <span class="font-medium">已发货商品</span>
              <span
                style="float: right"
                    :class="orderIofo.count4 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count4}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(5)">
              <span class="font-medium">已揽件商品</span>
              <span
                style="float: right"
                :class="orderIofo.count5 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count5}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(6)">
              <span class="font-medium">已收货商品</span>
              <span
                style="float: right"
                :class="orderIofo.count6 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count6}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item" @click="jumpactOrder(8)">
              <span class="font-medium">瑕疵商品</span>
              <span
                style="float: right"
                :class="orderIofo.count8 > 0 ? 'color-danger' : ''"
              >({{orderIofo.count8}})</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { goodsOrderApi } from '@/api/goodsOrder'
export default {
  name: 'homePage',
  data() {
    return {
      form: {
      },
      orderIofo: {
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      goodsOrderApi.indexData().then(res => {
        if (res.subCode === 1000) {
          this.form = res.data ? res.data.commonDto : {}
          this.orderIofo = res.data ? res.data.countDto : {}
          if (this.form.inventoryCost && this.form.inventoryNum) {
            this.form.inboundAverage = parseFloat(this.form.inventoryCost / this.form.inventoryNum).toFixed(2)
          }
          this.form.goodsPutInNum = this.form.inventoryNum + this.form.successNum
          if (this.form.successNum) {
            this.form.orderAmountAverage = parseFloat(this.form.orderAmount / this.form.successNum).toFixed(2)
            this.form.freightAverage = parseFloat(this.form.freight / this.form.successNum).toFixed(2)
            this.form.profitsAverage = parseFloat(this.form.profitsAmount / this.form.successNum).toFixed(2)
          }
          this.form.costAverage = this.form.inboundAverage / 1 + this.form.freightAverage / 1
          this.form.inventoryRatio = parseFloat(this.form.inventoryNum / this.form.goodsPutInNum * 100).toFixed(2)
          this.form.profitsProportion = parseFloat(this.form.profitsAverage / this.form.costAverage * 100).toFixed(2)
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    jumpactOrder(type) {
      let path = '/goodsOrder/list' + type
      this.$router.push({ path: path })
    },
    jumpactNo() {
      this.$router.push({ path: '/goodsBase/goodsInventory'})
    },
    jumpGoods() {
      this.$router.push({ path: '/goodsBase/list'})
    },
  }
}
</script>

<style scoped>
.app-container {
  margin-top: 0px;
  margin-left: 20px;
  margin-right: 150px;
}

.address-layout {
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #DCDFE6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409EFF;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #F2F6FC;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  cursor: pointer;
  border-bottom: 1px solid #EBEEF5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  cursor: pointer;
  border: 1px solid #DCDFE6;
  margin-bottom: 30px;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}
.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}
.address-content{
  padding: 20px;
  font-size: 18px
}
.color-danger {
  color: #F56C6C;
}
</style>
