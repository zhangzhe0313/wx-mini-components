// components/Button/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    openType: String,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap() {
      if (this.data.disabled) return false;
      this.triggerEvent('click')
    },
    bindgetuserinfo({ detail = {} } = {}) {
      this.triggerEvent('getuserinfo', detail);
    },
    bindcontact({ detail = {} } = {}) {
      this.triggerEvent('contact', detail);
    },
    bindgetphonenumber({ detail = {} } = {}) {
      this.triggerEvent('getphonenumber', detail);
    }
  }
})
