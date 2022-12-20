<template>
  <!-- 按钮 -->
  <div class="left-right-button" v-show="buttonShow">
    <el-button
      type="primary"
      icon="el-icon-d-arrow-left"
      size="small"
      circle
      @mousedown.native="mouseDown('leftAll')"
      @mouseup.native="mouseUp()"
    ></el-button>
    <el-button
      type="primary"
      icon="el-icon-arrow-left"
      size="small"
      circle
      @mousedown.native="mouseDown('left')"
      @mouseup.native="mouseUp()"
    ></el-button>
    <el-button
      type="primary"
      size="small"
      icon="el-icon-arrow-right"
      circle
      @mousedown.native="mouseDown('right')"
      @mouseup.native="mouseUp()"
    ></el-button>
    <el-button
      type="primary"
      size="small"
      icon="el-icon-d-arrow-right"
      circle
      @mousedown.native="mouseDown('rightAll')"
      @mouseup.native="mouseUp()"
    ></el-button>
  </div>
</template>

<script>
  export default {
    props: ["tableRef"],
    data() {
      return {
        buttonShow: true,
        progressTimer: null, //定时器
      };
    },
    mounted() {
      window.addEventListener("scroll", this.windowScroll);//监听滚动事件，一旦发生滚动调用windowScrol函数
    },
    methods: {
      //this.tableRef.$refs.bodyWrapper.scrollLeft表示横向滚动条的位置，0则是在最左侧
      mouseDown(position) {
        if (["left", "right"].includes(position)) {
          this.progressTimer = setInterval(() => {
            this.tableRef.$refs.bodyWrapper.scrollLeft =
              position === "left"
                ? this.tableRef.$refs.bodyWrapper.scrollLeft - 100
                : this.tableRef.$refs.bodyWrapper.scrollLeft + 100;
          }, 50);
        } else {
          this.tableRef.$refs.bodyWrapper.scrollLeft =
            position === "leftAll"
              ? this.tableRef.$refs.bodyWrapper.scrollLeft - 1000
              : this.tableRef.$refs.bodyWrapper.scrollLeft + 1000;
        }
      },
      mouseUp() {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
      },
      windowScroll() {
        // 滚动条距离页面顶部的距离
        let scrollTop = document.documentElement.scrollTop; //滚动条在Y轴上的滚动距离。
        let clientHeight = document.documentElement.clientHeight; //内容可视区域的高度。
        let scrollHeight = document.documentElement.scrollHeight; //内容可视区域的高度加上溢出（滚动）的距离。
        this.buttonShow =
          scrollTop + clientHeight > scrollHeight - 50 ? false : true;//当滚动条拉到地下时隐藏滚动条
      },
      beforeDestroy() {
        window.removeEventListener("scroll", this.windowScroll); //销毁监听，此处暂时没用到
      },
    },
  };
</script>

<style>
  .left-right-button {
    position: fixed;
    left: 230px;
    bottom: 5px;
    width: 200px;
    height: 60px;
  }
</style>
