<template>
  <el-dialog
    title="物流"
    :visible.sync="dialogVisible"
    width="40%"
    center
    @close="closDialog">
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>顺丰速运：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{requestParamWl.waybillNo}}</span>
      </el-col>
      <el-col :span="2">
        <el-button
          type="text"
          style="padding-top: 0px;padding-bottom: 0px;"
          @click="copyUrl(requestParamWl.waybillNo )">复制
        </el-button>
<!--        <span>{{requestParamWl.waybillNo}}</span>-->
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>实际金额：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{requestParamWl.freight}}</span>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="8" style="text-align: right"><span>收货地址：</span></el-col>
      <el-col :span="8" :offset="1">
        <span>{{requestParamWl.receiverAddress}}</span>
      </el-col>
    </el-row>
    <div style="">
      <div class="package-status" style="">
        <div class="status-box" >
          <ul class="status-list">
            <li :class="index==0 || wlDataSize==(index+1) ? 'latest' : ''"
                v-for="(item,index) in wlData" :key="index">
              <div
                :class="index==0 || wlDataSize==(index+1) ? 'status-time-latest' : 'status-time-before'">
                <strong>
                  {{item.status}}
                </strong>
                <span>
                     {{item.date | formateTime('{m}-{d} {h}:{i}') }}
                  </span>
              </div>
              <div
                style=" width: 38vw; "
                :class="index==0 || wlDataSize==(index+1) ? 'status-content-latest' : 'status-content-before'">
                {{item.message}}
              </div>
              <div class="status-line"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { goodsOrderApi } from '@/api/goodsOrder'
import { parseTime } from '@/utils/index'

export default {
  props: {
    requestParamWl: {
      type: Object
    },
    wlDataSize: {
      type: Number
    },
    wlData: {
      type: Array
    },
  },
  data() {
    return {
      dialogVisible: true,
      addressList: [],
      statusList: [],
      requestParam: {
        id: '',
        waybillNo: '',
        deliveryDeadlineTime: '',
        freight: '',
        status: '',
        addressId: '',
        reason: '色差'
      }
    }
  },
  mounted() {
  },
  methods: {
    closDialog() {
      this.$emit('closDialog')
    },
    // 复制链接
    copyUrl(url) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', url)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      document.body.removeChild(input)
      this.$message.success('已复制至剪切板')
    },
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog__header, ::v-deep .el-dialog__body {
    border-bottom: 1px solid #ddd;
  }

  .el-row {
    margin-bottom: 20px
  }


  .package-status {
    color: #b8b8b8;
    padding: 18px 0 0 0
  }

  .package-status .status-list {
    margin: 0;
    padding: 0;
    margin-top: -5px;
    padding-left: 7px;
    list-style: none;
  }

  .package-status .status-list li {
    border-left: 2px solid #d9d9d9;
    width: 80vw;
    text-align: left;
  }

  .package-status .status-list li:before { /* 流程点的样式 */
    content: "";
    border: 3px solid #f3f3f3;
    background-color: #d9d9d9;
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    margin-left: -6px;
    margin-bottom: 2px;
    margin-right: 10px;
  }

  .package-status .status-list .latest:before {
    background-color: #333;
    border-color: #333;
  }

  .package-status .status-box {
    overflow: hidden
  }

  .package-status .status-list li {
    height: auto;
  }

  .package-status .status-list {
    margin-top: -8px
  }

  .package-status .status-box {
    position: relative
  }

  .package-status .status-box:before {
    content: " ";
    background-color: #f3f3f3;
    display: block;
    position: absolute;
    top: -8px;
    left: 20px;
    width: 10px;
    height: 4px
  }

  .package-status .status-list {
    margin-top: 0px;
  }

  /* .package-status .status-list .latest{border:none} */
  /* .package-status .status-list li{margin-bottom:-2px} */


  .status-list li:not(:first-child) {
    padding-top: 10px;
  }

  .status-content-before {
    text-align: left;
    margin-right: 20px;
    margin-left: 25px;
    /*margin-top: -20px;*/
  }

  .status-content-latest {
    text-align: left;
    margin-right: 20px;
    margin-left: 25px;
    color: #333;
    /*margin-top: -20px;*/
  }

  .status-time-before {
    text-align: left;
    margin-left: 25px;
    font-size: 15px;
    margin-top: -17px;

  }

  .status-time-latest {
    text-align: left;
    margin-left: 25px;
    color: #333;
    font-size: 15px;
    margin-top: -17px;
  }
  .rigth-content-bottom {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 2px;
    /*margin-top: 16px;*/
    /*overflow: scroll;*/
  }
</style>
