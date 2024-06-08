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
          <el-form-item prop="type" label="球队类型" class="is-required">
            <el-select v-model="form.type" :disabled="type == 1 ">
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
          <el-form-item prop="name" label="名称" class="is-required">
            <el-input v-model="form.name" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-row class="form-flex">-->
<!--        <el-col :span="10">-->
<!--          <el-form-item prop="imgUrl" label="图片地址">-->
<!--            <el-input v-model="form.imgUrl" :disabled="type == 1 "></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
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
          <el-form-item prop="img" label="图片地址-外链">
            <el-input v-model="form.img" :disabled="type == 1 "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-flex" v-if="form.img">
        <el-col :span="10">
          <el-form-item prop="img" label="图片地址-外链-预览">
            <img v-if="form.img" :src="form.img" class="userPic" @click="avatarShow(form.img)" alt="">
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
        <img :src="imageZoom" alt="" width="100%" >
      </div>
    </div>
  </div>
</template>
<script>
import { baseTeamApi } from '@/api/sport/baseTeam'
import { validatorRule } from '@/utils/validateRlue'
import { hideLoading, showLoading } from '@/components/Loading/loading'
import * as imageConversion from 'image-conversion'

export default {
  data() {
    return {
      form: {
        type: 1,
        name: '',
        imgUrl: '',
        img: '',
        remark: ''
      },
      uploadPath: uploadPath,
      fileUrl: fileUrl,
      pictureZoomShow: false,
      imageZoom: '',
      typeList: [],
      dataStatusList: [],
      type: '',
      id: '',
      rules: {
        type: [
          { required: true, trigger: 'blur', message: '球队类型非空' }
        ],
        name: [
          { required: true, trigger: 'blur', message: '名称非空' }
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
    avatarShow(e) {
      this.imageZoom = e
      this.pictureZoomShow = true
    },
    async handleImageSuccess(res, file) {
      hideLoading()
      this.$message.success('上传成功')
      this.form.imgUrl = res.data
    },
    beforeImageUpload(file) {
      showLoading()
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
    },
    getDetailById(id) {
      if (id) {
        baseTeamApi.getDetailById(id).then(res => {
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
      this.typeList = sysDictList.filter(item => item.typeValue == 62)
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
    },
    goBack() {
      // *** 根据真实路径配置地址
      this.$router.push({ path: '/sport/baseTeam' })
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
          baseTeamApi.update(this.form).then(res => {
            if (res.subCode === 1000) {
              this.$message.success('操作成功')
              this.goBack()
            } else {
              this.$message.error(res.subMsg)
            }
          })
        } else {
          baseTeamApi.add(this.form).then(res => {
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
