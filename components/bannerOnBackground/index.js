// components/bannerOnBackground/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerBackgroundStyle: {  // 背景自定义样式
      type: String,
      value: ''
    },
    groundImgStyle: { // 背景图片自定义样式
      type: String,
      value: ''
    },
    swiperWrapStyle: {  // swiper自定义样式
      type: String,
      value: ''
    },
    bannerImgStyle: { // banner项图片自定义样式
      type: String,
      value: ''
    },
    backgroundImg: {  // 背景图资源
      type: String,
      value: ''
    },
    banners: {  // banner 图片资源
      type: Array,
      value: []
    },
    bannerTitle: {  // banner 大标题
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

  }
})
