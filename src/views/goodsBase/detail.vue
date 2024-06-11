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
        <el-col>
          <el-form-item prop="type" label="类型" class="is-required">
            <el-select v-model="form.type" :disabled="type === 1 ">
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
        <el-col :span="10">
          <el-form-item prop="actNo" label="货号" class="is-required">
            <el-input v-model="form.actNo" :disabled="type === 1 ">
              <el-button type="primary" slot="append" @click="getImgUrl(form.actNo)"
                         icon="el-icon-refresh">获取图片
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="name" label="商品名称">
            <el-input v-model="form.name" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="网络图片">
          <el-col :span="10">
            <img
              v-if="form.img"
              :src="form.img"
              style="width: 240px"
              @click="avatarShow(form.img)"
            />
          </el-col>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="本地图片" class="is-required">
          <el-upload
            :disabled="type == 1"
            class="avatar-uploader"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
            :data="uploadData"
          >
            <img
              v-if="form.imgUrl"
              :src="fileUrl + form.imgUrl"
              style="width: 240px"
              @click="avatarShow(fileUrl + form.imgUrl)"
            />
            <el-button v-if="type != 1" v-show="!form.imgUrl" size="small"
            >上传图片
            </el-button
            >
            <el-button
              v-if="type != 1"
              v-show="form.imgUrl"
              size="small"
              style="margin-right: 15px"
            >重新上传
            </el-button>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="sizeList" label="尺码" class="is-required">
            <el-cascader ref="owner" :disabled="type === 1 " v-model="sizeList"
                         :options="options" @change="getSize" :show-all-levels="true"
                         :props="props" size="small"
                         style="width:100%; display:inline-block"></el-cascader>

            <!--            <el-input v-model="sizeList" :disabled="type === 1 "></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row class="form-flex">-->
      <!--        <el-col :span="5"><i class="red">*</i><span>尺码：</span></el-col>-->
      <!--        <el-col :span="18" :offset="1">-->
      <!--          <el-cascader ref="owner" v-model="sizeList" :options="options" @change="getSize" :show-all-levels="true" :props="props" size="small"  style="width:100%; display:inline-block"></el-cascader>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row class="form-flex">-->
      <!--        <el-col :span="10">-->
      <!--          <el-form-item  prop="imgUrl" label="图片地址"    class="is-required" >-->
      <!--            <el-input v-model="form.imgUrl" :disabled="type === 1 "></el-input>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="brand" label="品牌">
            <el-input v-model="form.brand" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="name" label="发售日期">
            <el-input v-model="form.sellDate" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="name" label="发售价格">
            <el-input v-model="form.sellPrice" :disabled="type === 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex">
        <el-col :span="10">
          <el-form-item prop="remark" label="备注">
            <el-input type="textarea" :rows="4" maxlength="140" size="small"
                      :disabled="type === 1 " v-model="form.remark"></el-input>
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
    <div class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <div class="imageShow">
        <img :src="picture" alt="" width="100%" >
      </div>
    </div>
  </div>
</template>
<script>
import { fileApi } from '@/api/file'
import { goodsBaseApi } from '@/api/goodsBase'
import * as imageConversion from 'image-conversion'
import { hideLoading, showLoading } from '@/components/Loading/loading'

export default {
  data() {
    return {
      picture: '',
      pictureZoomShow: false,
      form: {
        type: '01',
        actNo: '',
        name: '',
        imgUrl: '',
        brand: '耐克',
        remark: '',
        sizeList: []
      },
      props: {
        lazy: false,
        multiple: true
      },
      uploadData: {},
      sizeList: [],
      uploadPath: uploadPath,
      fileUrl: fileUrl,
      typeList: [],
      dataStatusList: [],
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
    this.init()
  },
  methods: {
    getSize() {
      this.form.sizeList = []
      for (let i = 0; i < this.sizeList.length; i++) {
        this.form.sizeList.push(this.sizeList[i][1])
      }
    },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
    },
    init() {
      this.listSysDict()
      let typeList = this.typeList
      let options = []
      for (let i = 0; i < typeList.length; i++) {
        goodsBaseApi.listDropDownSizes({ type: typeList[i].fieldValue }, false).then(res => {
          if (res.subCode === 1000) {
            options.push({
              label: typeList[i].fieldName,
              value: typeList[i].fieldValue,
              children: res.data.map(item => {
                return {
                  value: item.id,
                  label: item.size
                }
              })
            })
          }
        })
      }
      this.options = options
    },
    avatarShow(e) {
      this.picture = e
      this.pictureZoomShow = true
    },
    async handleImageSuccess(res, file) {
      hideLoading()
      this.$message.success('上传成功')
      this.form.imgUrl = res.data
    },
    async beforeImageUpload(file) {
      if (!this.form.actNo) {
        this.$message.error('请输入货号')
        return false
      }
      this.uploadData = { actNo: this.form.actNo } // 上传携带的参数名
      const fileName = file.name
      const fileType = fileName.substring(fileName.lastIndexOf('.'))
      // jpeg,.png,.jpg,.bmp,.gif
      if (
        fileType === '.jpg' ||
        fileType === '.png' ||
        fileType === '.jpeg' ||
        fileType === '.bmp' ||
        fileType === '.gif'
      ) {
        // 不处理
      } else {
        this.$message.error(
          '不是,jpeg,.png,.jpg,.bmp,.gif文件,请上传正确的图片类型'
        )
        return false
      }
      showLoading()
      let overSize = file.size / 1024 / 1024
      console.info("size1",overSize)
      if (overSize > 1) {
        file = await imageConversion.compressAccurately(file, 200)
      }
      overSize = file.size / 1024 / 1024
      console.info("size2",overSize)
      return file
    },
    getDetailById(id) {
      if (id) {
        goodsBaseApi.getDetailById(id).then(res => {
          if (res.subCode === 1000) {
            this.form = res.data ? res.data : {}
            this.form.sizeList = []
            this.sizeList = res.data.sizeListList
            for (let i = 0; i < res.data.sizeListList.length; i++) {
              this.form.sizeList.push(res.data.sizeListList[i][1])
            }
          } else {
            this.$message.error(res.subMsg)
          }
        })
      }
    },
    getImgUrl(actNo) {
      if (!actNo) {
        this.$message.error('请输入货号')
        return false
      }
      fileApi.getImgUrl({ actNo }).then(res => {
        if (res.subCode === 1000) {
          console.info(res.data)
          this.$message.success(res.subMsg)
          this.form.imgUrl = res.data.url
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    goBack() {
      this.$router.push({ path: '/goodsBase/list' })
    },
    goEdit() {
      this.type = 2
    },
    resetHandle() {
      this.form = {
        type: '01',
        actNo: '',
        name: '',
        imgUrl: '',
        brand: '耐克',
        remark: '',
        sizeList: []
      }
      this.options = []
    },
    submit() {
      this.$refs['form'].validate(async(valid) => {
        if (!valid) {
          return false
        }
        if (!this.form.sizeList.length) {
          this.$message.error('请选择尺码')
          return false
        }
        if (this.type == 2) {
          goodsBaseApi.update(this.form).then(res => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              this.goBack()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        } else {
          goodsBaseApi.add(this.form).then(res => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              // this.goBack()
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
