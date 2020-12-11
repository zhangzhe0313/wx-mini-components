// components/simpleDescList/index.js
import { obtainOnlineHotDoctors } from '../../lib/api/index'
import _ from '../../lib/lodash'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    simpleDescListStyle: {  // 信息简化版列表样式自定义
      type: String,
      value: ''
    },
    scrollviewStyle: {  // scrollview 样式自定义
      type: String,
      value: ''
    },
    isScrollX: {  // scroll view x轴滚动
      type: Boolean,
      value: false
    },
    isScrollY: {  // scroll view y轴滚动
      type: Boolean,
      value: false
    },
    wrapStyle: {  // 子项样式自定义
      type: String,
      value: ''
    },
    wrapAvatarStyle: {  // 头像样式自定义
      type: String,
      value: ''
    },
    infosStyle: { // 文本区样式自定义
      type: String,
      value: ''
    },
    infosMainStyle: { // 文本 main 样式自定义
      type: String,
      value: ''
    },
    infosSubStyle: {  // 文本 sub 样式自定义
      type: String,
      value: ''
    },
    infosDescStyle: { // 文本 desc 样式自定义
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    doctorList: []
  },

  created() {
    this.onHandleOnlineDoctors()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onHandleOnlineDoctors() {
      obtainOnlineHotDoctors({}).then(res => {
        let _datas = _.take(res.data, 10)
        this.setData({
          doctorList: [..._datas]
        })
      })
    },
    doctorItemClick: function(e){
      this.triggerEvent('customevent', {
        doctorId: e.currentTarget.dataset.doctorid
       })
    }
  }
})
