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
          <el-form-item prop="id" label="订单主键" class="is-required">
            <el-input v-model="form.id" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="orderNo" label="订单号" class="is-required">
            <el-input v-model="form.orderNo" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="inventoryId" label="库存编号" class="is-required">
            <el-input v-model="form.inventoryId" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item prop="status" label="状态" class="is-required">
            <el-select v-model="form.status" :disabled="type === 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in statusList"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="+item.fieldValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="shelvesPrice" label="原售价" class="is-required">
            <el-input v-model="form.shelvesPrice" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="freight" label="运费">
            <el-input v-model="form.freight" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="poundage" label="手续费">
            <el-input v-model="form.poundage" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="theirPrice" label="到手价">
            <el-input v-model="form.theirPrice" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="addressId" label="地址编号">
            <el-input v-model="form.addressId" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="waybillNo" label="运单编号">
            <el-input v-model="form.waybillNo" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button-group v-if="type != 1">
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="goBack()">取消</el-button>
        </el-button-group>
        <el-button-group v-else>
          <el-button type="primary" @click="goEdit">编辑</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { goodsOrderApi } from '@/api/goodsOrder'

  export default {
    data() {
      return {
        form: {
          id: '',
          orderNo: '',
          inventoryId: '',
          status: '',
          shelvesPrice: '',
          freight: '',
          poundage: '',
          theirPrice: '',
          addressId: '',
          waybillNo: ''
        },
        statusList: [],
        dataStatusList: [],
        type: '',
        id: '',
        rules: {
          id: [
            { required: true, trigger: 'blur', message: '订单主键非空' }
          ],
          orderNo: [
            { required: true, trigger: 'blur', message: '订单号非空' }
          ],
          inventoryId: [
            { required: true, trigger: 'blur', message: '库存编号非空' }
          ],
          status: [
            { required: true, trigger: 'blur', message: '状态非空' }
          ],
          shelvesPrice: [
            { required: true, trigger: 'blur', message: '原售价非空' }
          ]
        }
      }
    },
    created() {
      const { id, type } = this.$route.query
      this.id = id
      this.type = type
      this.form.id = id
      if (this.id) {
        this.getDetailById(this.id)
      }
    },
    mounted() {
      this.listSysDict()
    },
    methods: {
      getDetailById(id) {
        if (id) {
          goodsOrderApi.getDetailById(id).then(res => {
            if (res.subCode === 1000) {
              this.form = res.data ? res.data : {}
            } else {
              this.$message.error(res.subMsg)
            }
          })
        }
      },
      listSysDict() {
        let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
          localStorage.getItem('sysDictList')) : []
        this.statusList = sysDictList.filter(item => item.typeValue == 37)
        this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
      },
      goBack() {
        // *** 根据真实路径配置地址
        this.$router.push({ path: '/goodsOrder/list' })
      },
      goEdit() {
        this.type = 2
      },
      submit() {
        this.$refs['form'].validate(async(valid) => {
          if (!valid) {
            return false
          }
          if (this.type == 2) {
            goodsOrderApi.update(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$store.dispatch('apply/orderInfo')
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          } else {
            goodsOrderApi.add(this.form).then(res => {
              if (res.subCode === 1000) {
                this.$message.success('操作成功')
                this.goBack()
              } else {
                this.$message.error(res.subMsg)
              }
            })
          }
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
</style>
