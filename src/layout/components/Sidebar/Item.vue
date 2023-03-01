<script>
  import store from '@/store'
  export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    msgCount: {
      type: Number,
      default: 0
    }
  },
  render(h, context) {
    const { icon, title, msgCount } = context.props
    const vnodes = []
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      let node = <span slot='title'>{(title)}</span>
      if (title === '待发货商品') {
        if (store.getters.count3) {
          node = <div class='p-msg'><span slot='title'>{(title)}</span><i class='msg'>{(store.getters.count3)}</i></div>
        }
      } else if (title === '已发货商品'){
        if (store.getters.count4) {
          node = <div class='p-msg'><span slot='title'>{(title)}</span><i class='msg'>{(store.getters.count4)}</i></div>
        }
      } else if (title === '已揽件商品'){
        if (store.getters.count5) {
          node = <div class='p-msg'><span slot='title'>{(title)}</span><i class='msg'>{(store.getters.count5)}</i></div>
        }
      } else if (title === '已收货商品'){
        if (store.getters.count6) {
          node = <div class='p-msg'><span slot='title'>{(title)}</span><i class='msg'>{(store.getters.count6)}</i></div>
        }
      } else if (title === '瑕疵商品'){
        if (store.getters.count8) {
          node = <div class='p-msg'><span slot='title'>{(title)}</span><i class='msg'>{(store.getters.count8)}</i></div>
        }
      } else {
        if (msgCount) {
          node = <div class='p-msg'><span slot='title'>{(title)}</span><i class='msg'>{(msgCount)}</i></div>
        }
      }
      vnodes.push(node)
    }
    return vnodes
  }
}
</script>

<style lang="scss" scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.p-msg {
  display: flex;
  align-items: center;
  .msg {
    width: 20px;
    height: 20px;
    background: #F56C6C;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: #fff;
    margin-left: 20px;
  }
}

</style>
