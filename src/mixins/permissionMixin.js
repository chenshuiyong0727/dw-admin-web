import { getButtonPermission } from '@/utils'
export const permissionMixin = {
  data() {
    return {
      // 页面所有按钮的权限
      buttonPermissionArr: []
    }
  },
  mounted() {
    // 判断按钮权限
    this.buttonPermissionArr = getButtonPermission(this.$route.path)
    // console.log(this.buttonPermissionArr)
  }
}
