// components/modal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fadeStyle: {
      type: String,
      value: '',
      observer(newVal, oldValue, changedPath) {
       
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalStatus: false
  },
  options: {
    multipleSlots: true //使其可以使用多个slot，用name区分
  },


  /**
   * 组件的方法列表
   */
  methods: {
    //打开模态框
    showModal: function (event) {
      this.setData({
        showModalStatus: true
      })
    },
    //关闭模态框
    closeModal: function () {
      this.setData({
        showModalStatus: false
      })
    }
  }

})