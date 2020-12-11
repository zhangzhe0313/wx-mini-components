// components/ColumnsCardSelects/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rowsCardStyle: {  // 自定义卡片样式
      type: String,
      value: ''
    },
    cardItemStyle: {  // 自定义子卡片样式
      type: String,
      value: ''
    },
    cardItemImgStyle: { // 自定义子卡片中图片样式
      type: String,
      value: ''
    },
    cardItemTextStyle: {  // 自定义子卡片中文本区样式
      type: String,
      value: ''
    },
    cardItemTextMainStyle: {  // 自定义子卡片中文本样式
      type: String,
      value: ''
    },
    rowsCardList: { // 数据源
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
      this.triggerEvent('rowsCardSelectEvent', _dataset.id)
    }
  }
})
