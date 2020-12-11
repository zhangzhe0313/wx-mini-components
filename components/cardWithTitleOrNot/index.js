// components/cardWithTitleOrNot/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardWrapStyle: {  // 自定义卡片样式
      type: String,
      value: ''
    },
    cardTitleStyle: { // 卡片标题栏自定义
      type: String,
      value: ''
    },
    cardTitleMainStyle: { // 卡片标题栏主标题样式自定义
      type: String,
      value: ''
    },
    mainTitle: {  // 卡片标题栏主标题自定义
      type: String,
      value: ''
    },
    cardTitleSubStyle: {  // 卡片标题栏其他标题样式自定义
      type: String,
      value: ''
    },
    otherTitle: { // 卡片标题栏其他标题自定义
      type: String,
      value: ''
    },
    cardSlotStyle: {  // 卡片slot样式自定义
      type: String,
      value: ''
    },
    otherViewStyle: {
      type: String,
      value: ''
    },
    cardTitleImgStyle: {
      type: String,
      value: '' 
    },
    otherTitleImg: {
      type: String,
      value: ''
    },
    withRight: { // 是否显示右侧区域
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap({detail} = {}) {
      this.triggerEvent('titleEvent', detail)
    }
  }
})
