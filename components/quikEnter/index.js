// components/quikEnter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    quikEnterStyle: { // 整体自定义样式
      type: String,
      value: ''
    },
    leftImg: {  // 左侧图片资源
      type: String,
      value: ''
    },
    leftImgStyle: { // 左侧图片样式自定义
      type: String,
      value: ''
    },
    middleStyle: {  // 中间文本样式自定义
      type: String,
      value: ''
    },
    mainStyle: {  // 主标题样式自定义
      type: String,
      value: ''
    },
    subStyle: { // 中间文本副标题样式自定义
      type: String,
      value: ''
    },
    middleMainContent: {  // 主标题
      type: String,
      value: ''
    },
    middleSubContent: { //  副标题
      type: String,
      value: ''
    },
    hasRight: { // 是否存在右侧部分视图
      type: Boolean,
      value: true
    },
    rightImg: { // 右侧显示图片
      type: String,
      value: ''
    },
    rightImgStyle: {  //  右侧显示图片自定义样式
      type: String,
      value: ''
    },
    rightContent: { // 右侧显示文本
      type: String,
      value: ''
    },
    rightContentStyle: {  // 右侧显示文本自定义样式
      type: String,
      value: ''
    },
    rightStyle: {
      type: String,
      value: ''
    },
    itemId: { // item项唯一标记
      type: String,
      value: ''
    },
    mainContentStyle: {
      type: String,
      value: ''
    },
    hasMainDesc: {
      type: Boolean,
      value: false
    },
    mainDescPreStyle: {
      type: String,
      value: ''
    },
    mainDescAftStyle: {
      type: String,
      value: ''
    },
    mainDescPre: {
      type: String,
      value: ''
    },
    mainDescAft: {
      type: String,
      value: ''
    },
    mainDescStyle: {
      type: String,
      value: ''
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
    handletap(e) {
      const _dataset = e.currentTarget.dataset;
      this.triggerEvent('enterEvent', _dataset.id)
    },
    handleImgClickEvent(e) {
      const _dataset = e.currentTarget.dataset;
      this.triggerEvent('imgClickEvent', _dataset.id)
    }
  }
})
