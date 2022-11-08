<template>
  <el-row class="upload-sty">
    <el-upload
      ref="upload"
      :action="url"
      :accept="acceptType"
      list-type="picture-card"
      :file-list="fileList"
      :limit="limit"
      :disabled="disabled"
      :on-error="uploadError"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :auto-upload="true"
      :http-request="uploadImg"
      :before-upload="beforeUpload"
      :class="{hideELUpload:hideELUpload}">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip" :hidden="hideELUpload">{{tip}}</div>
    </el-upload>
    <el-image-viewer
      v-if="showViewer"
      :z-index="9999"
      :on-close="closeViewer"
      :url-list="imageSrcList" />
  </el-row>
</template>

<script>
  import axios from 'axios'
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  import { commonApi } from '@/api/common'
  import { getCookieByName } from '@/utils/auth'
  export default {
    components: {
      ElImageViewer
    },
    props: {
      limit:{
        type: Number,
        default: 1
      },
      disabled:{
        type: Boolean,
        default: false
      },
      acceptType:{
        type: String,
        default: () => '.jpg, .jpeg, .png'
      },
      uploadImgList: {
        type: Array,
        default: () => []
      },
      fileSize:{
        type:Number,
        default: 10
      },
      typeDesc:{
        type:String,
        default:'上传图片只支持PNG, JPG, JPEG格式!'
      },
      tip: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        dialogImageUrl: '',
        showViewer: false,
        hideELUpload:false,
        fileList:[],
        dialogVideoUrl: '',
        dialogWidth: '',
        imageSrcList: [],
        uploadData: '',
        promise: [],
        fileInfo: {},
        pathName: '',
        url: ''
      }
    },
    watch: {
      uploadImgList: function(){
        this.fileList = this.uploadImgList;
        this.hideELUpload = this.disabled || this.fileList.length >= this.limit;
      },
      limit: function() {
        this.hideELUpload = this.disabled || this.fileList.length >= this.limit;
      }
    },
    methods: {
      beforeUpload (file) {
        this.fileInfo = file
        let index = file.name.lastIndexOf(".");
        let suffix = file.name.substring(index,file.name.length).toLowerCase();
        let isMarch = this.acceptType.indexOf(suffix) !== -1;
        let overSize = file.size / 1024 / 1024 < this.fileSize;
        if (!isMarch) {
          this.$message.error(this.typeDesc)
        }
        if (!overSize) {
          this.$message.error('上传文件大小不能超过'+this.fileSize+'MB!')
        }
        if (isMarch && overSize) {
          this.hideELUpload = this.disabled || this.fileList.length + 1 >= this.limit;
        }
        let promise = commonApi.signature({fileName: file.name, businessType: 1}).then(res => {
          if (res.subCode === 1000) {
            this.uploadData = res.data
            this.url = res.data.url
          } else {
            this.$message.error(res.subMsg)
          }
        })
        this.promise.push(promise)
        return isMarch && overSize
      },
      handleChange(file, fileList) {
        this.fileList = fileList
        this.hideELUpload = this.disabled || this.fileList.length >= this.limit
      },
      handleRemove (file, fileList) {
        this.fileList = fileList
        this.hideELUpload = this.disabled || this.fileList.length >= this.limit;
      },
      handlePictureCardPreview(file) {
        let curr = false
        this.imageSrcList = []
        this.fileList.forEach(row => {
          if (row.url === file.url) {
            curr = true
          }
          if (curr) {
            this.imageSrcList.push(row.url)
          }
        })
        this.showViewer = true
      },
      uploadError(err, file, fileList){
        this.hideELUpload = this.disabled || this.fileList.length >= this.limit;
        this.$message.error('文件上传失败!');
      },
      closeViewer() {
        this.showViewer = false
      },
      uploadImg() {
        Promise.all(this.promise).then(() => {
          let reopt = {
            method: 'put',
            url: this.uploadData.url,
            headers: {
              'Content-Type' : 'text/plain'
            },
            data: this.fileInfo
          }
          axios.request(reopt).then(res => {
            if (res.status === 200) {
              let picNetPath = res.request.responseURL.split('?')[0]
              this.$emit('uploadSuccess', picNetPath)
              // 添加日志信息
              this.uploadDoLog(picNetPath)
            } else {
              this.uploadError()
            }
          })
        })
      },
      uploadDoLog(path) {
        commonApi.uploadDoLog({
          url: path,
          fileName: this.fileInfo.name,
          size: this.fileInfo.size,
          originalImg: 1
        }).then(res => {
          if (res.subCode != 1000) {
            this.$message.error('上传图片日志添加失败')
          }
        })
      }
    },
    mounted(){
      this.fileList = this.uploadImgList;
      this.hideELUpload = this.disabled || this.fileList.length >= this.limit;
    }
  }
</script>

<style lang="scss" scoped>
  .upload-sty > div {
    display: flex;
  }
  ::v-deep .hideELUpload .el-upload.el-upload--picture-card {
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete{
    position: absolute !important;
  }

  .el-carousel__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .carousel-image {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
