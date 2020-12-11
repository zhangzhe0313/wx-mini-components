// components/columnsCardSelects/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    colomnsCardStyle: { // 卡片样式自定义
      type: String,
      value: ''
    },
    cardItemStyle: {  // 卡片子项样式自定义
      type: String,
      value: ''
    },
    cardItemImgStyle: { // 卡片子项图片样式自定义
      type: String,
      value: ''
    },
    rightLeftStyle: { // 卡片子项右侧样式自定义
      type: String,
      value: ''
    },
    rightMainStyle: { // 卡片子项右侧main样式自定义
      type: String,
      value: ''
    },
    rightSubStyle: {  // 卡片子项右侧描述样式自定义
      type: String,
      value: ''
    },
    rightImgStyle: {  // 卡片子项右侧图片样式自定义
      type: String,
      value: ''
    },
    columnsCardList: {  // 数据源
      type: Array,
      value: []
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
    handleTap(e) {
      const _dataset = e.currentTarget.dataset;
      this.triggerEvent('columnsCardSelectEvent', _dataset.id)
    }
  }
})
