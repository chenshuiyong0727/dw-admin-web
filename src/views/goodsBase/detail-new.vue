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
              <el-button type="primary" slot="append" @click="getImgUrl(form.actNo)"
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
      <el-row class="form-flex">
        <el-col :span="10">
          <el-table border :data="tableData">
<!--            <el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column align="center" prop="size" label="尺码" />
            <el-table-column align="center" prop="price" label="价格" />
          </el-table>
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
        <img :src="form.img" alt="" width="100%" >
      </div>
    </div>
  </div>
</template>
<script>
import { goodsBaseApi } from '@/api/goodsBase'
import { goodsBaseSizeApi } from '@/api/goodsBaseSize'
export default {
  data() {
    return {
      pictureZoomShow: false,
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
      // props: {
      //   lazy: false,
      //   multiple: true
      // },
      // uploadData: {},
      tableData: [],
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
    this.queryParam.goodsId = id
    if (this.id) {
      this.getDetailById(this.id)
    }
  },
  mounted() {
    this.listSysDict()
  },
  methods: {
    // getSize() {
    //   this.form.sizeList = []
    //   for (let i = 0; i < this.sizeList.length; i++) {
    //     this.form.sizeList.push(this.sizeList[i][1])
    //   }
    // },
    listSysDict() {
      let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
        localStorage.getItem('sysDictList')) : []
      this.typeList = sysDictList.filter(item => item.typeValue == 20221108)
      this.dataStatusList = sysDictList.filter(item => item.typeValue == 36)
    },
    getPage() {
      goodsBaseSizeApi.page(this.queryParam).then(res => {
        if (res.subCode === 1000) {
          this.tableData = res.data ? res.data.list : []
          let totalCount = res.data ? res.data.pageInfo.totalCount : 0
          if (totalCount < this.form.sizeList.length) {
            this.getPage()
          }
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    // init() {
    //   this.listSysDict()
    //   let typeList = this.typeList
    //   let options = []
    //   for (let i = 0; i < typeList.length; i++) {
    //     goodsBaseApi.listDropDownSizes({ type: typeList[i].fieldValue }, false).then(res => {
    //       if (res.subCode === 1000) {
    //         options.push({
    //           label: typeList[i].fieldName,
    //           value: typeList[i].fieldValue,
    //           children: res.data.map(item => {
    //             return {
    //               value: item.id,
    //               label: item.size
    //             }
    //           })
    //         })
    //       }
    //     })
    //   }
    //   this.options = options
    // },
    // avatarShow(e) {
    //   if (!e) {
    //     return
    //   }
    //   window.open(this.fileUrl + e)
    // },
    avatarShow() {
      this.pictureZoomShow = true
    },
    // async handleImageSuccess(res, file) {
    //   this.$message.success('上传成功')
    //   this.form.imgUrl = res.data
    // },
    // beforeImageUpload(file) {
    //   if (!this.form.actNo) {
    //     this.$message.error('请输入货号')
    //     return false
    //   }
    //   this.uploadData = { actNo: this.form.actNo } // 上传携带的参数名
    //   const fileName = file.name
    //   const fileType = fileName.substring(fileName.lastIndexOf('.'))
    //   // jpeg,.png,.jpg,.bmp,.gif
    //   if (
    //     fileType === '.jpg' ||
    //     fileType === '.png' ||
    //     fileType === '.jpeg' ||
    //     fileType === '.bmp' ||
    //     fileType === '.gif'
    //   ) {
    //     // 不处理
    //   } else {
    //     this.$message.error(
    //       '不是,jpeg,.png,.jpg,.bmp,.gif文件,请上传正确的图片类型'
    //     )
    //     return false
    //   }
    // },
    getDetailById(id) {
      if (id) {
        goodsBaseApi.getDetailById(id).then(res => {
          if (res.subCode === 1000) {
            this.form = res.data ? res.data : {}
            this.queryParam.goodsId = this.form.id
            this.getPage()
            // this.form.sizeList = []
            // this.sizeList = res.data.sizeListList
            // for (let i = 0; i < res.data.sizeListList.length; i++) {
            //   this.form.sizeList.push(res.data.sizeListList[i][1])
            // }
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
      let data = { actNo: actNo }
      goodsBaseApi.getGoodsByActNoAndSize(data).then(res => {
        if (res.subCode === 1000) {
          this.$message.success(res.subMsg)
          this.form = res.data ? res.data : {}
          this.queryParam.goodsId = this.form.id
          this.getPage()
        } else {
          this.$message.error(res.subMsg)
        }
      })
      //
      //
      // fileApi.getImgUrl({ actNo }).then(res => {
      //   if (res.subCode === 1000) {
      //     console.info(res.data)
      //     this.$message.success(res.subMsg)
      //     this.form.imgUrl = res.data.url
      //   } else {
      //     this.$message.error(res.subMsg)
      //   }
      // })
    },
    goBack() {
      this.$router.push({ path: '/goodsBase/list' })
    },
    // goEdit() {
    //   this.type = 2
    // },
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
        // if (!this.form.imgUrl) {
        //   this.$message.error('上传图片')
        //   return false
        // }
        // if (!this.form.sizeList.length) {
        //   this.$message.error('请选择尺码')
        //   return false
        // }
        // if (this.type == 2) {
        //   goodsBaseApi.update(this.form).then(res => {
        //     if (res.subCode === 1000) {
        //       this.$message.success('操作成功')
        //       this.goBack()
        //     } else {
        //       this.$message.error(res.subMsg)
        //     }
        //   })
        // } else {
        //   goodsBaseApi.add(this.form).then(res => {
        //     if (res.subCode === 1000) {
        //       this.$message.success('操作成功')
        //       // this.goBack()
        //       this.$confirm('是否继续添加商品?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //       }).then(() => {
        //         this.resetHandle()
        //       }).catch(() => {
        //         this.goBack()
        //       })
        //     } else {
        //       this.$message.error(res.subMsg)
        //     }
        //   })
        // }
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
