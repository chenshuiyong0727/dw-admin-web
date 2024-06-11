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
          <el-form-item prop="reason" label="原因" class="is-required">
            <el-input type="textarea" :rows="4" maxlength="140" size="small"
                      :disabled="type === 1 " v-model="form.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="createTime" label="创建时间" class="is-required">
            <el-date-picker
              :disabled="type === 1 "
              v-model="form.createTime"
              type="datetime"
              placeholder="选择创建时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col>
          <el-form-item prop="type" label="类型">
            <el-select v-model="form.type" :disabled="type === 1 ">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in typeList"
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
          <el-form-item prop="actNo" label="货号">
            <el-input v-model="form.actNo" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="goodsName" label="商品名称">
            <el-input v-model="form.goodsName" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="img" label="图片地址-得物">
            <el-input v-model="form.img" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="price" label="入库价">
            <el-input v-model="form.price" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="orderNo" label="订单号">
            <el-input v-model="form.orderNo" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="shelvesPrice" label="原售价">
            <el-input v-model="form.shelvesPrice" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="status" label="状态" class="is-required">
            <el-input v-model="form.status" :disabled="type === 1 "></el-input>
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
import { goodsDefectsApi } from '@/api/goodsDefects'
export default {
  data() {
    return {
      form: {
        reason: '',
        createTime: '',
        type: '',
        actNo: '',
        goodsName: '',
        img: '',
        price: '',
        orderNo: '',
        shelvesPrice: '',
        status: ''
      },
      dataStatusList: [],
      typeList: [],
      statusList: [],
      type: '',
      id: '',
      rules: {
        reason: [
          { required: true, trigger: 'blur', message: '原因非空' }
        ],
        createTime: [
          { required: true, trigger: 'blur', message: '创建时间非空' }
        ],
        status: [
          { required: true, trigger: 'blur', message: '状态非空' }
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
        goodsDefectsApi.getDetailById(id).then(res => {
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
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
      this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
      this.statusList = sysDictList.filter(item => item.typeValue == 45)
    },
    goBack() {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/goodsBase/goodsDefects' })
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
          goodsDefectsApi.update(this.form).then(res => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              this.goBack()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        } else {
          goodsDefectsApi.add(this.form).then(res => {
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
