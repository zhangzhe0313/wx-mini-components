const { transferObjToKeyValueString } = require("../../lib/util");

// components/layout/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    statusNavStyle: { // 自定义导航头样式，包括状态栏，导航栏
      type: String,
      value: ''
    },
    statusStyle: { // 自定义状态栏样式
      type: String,
      value: ''
    },
    navBarStyle: {  // 自定义导航栏样式
      type: String,
      value: ''
    },
    isHideBack: {  // 是否隐藏自定义返回
      type: Boolean,
      value: false
    },
    isHideBackIcon: {  // 是否隐藏自定义返回icon
      type: Boolean,
      value: false
    },
    backImg: {  // 自定义返回icon资源
      type: String,
      value: '../../assets/img/back.svg'
    },
    backTitle: {  // 自定义返回文案
      type: String,
      value: null
    },
    backArrowStyle: { // 自定义返回icon样式
      type: String,
      value: ''
    },
    backTitleStyle: {  // 自定义返回文案样式
      type: String,
      value: ''
    },
    layoutTitle: {  // 自定义页面导航栏文案
      type: String,
      value: ''
    },
    layoutTitleStyle: {  // 自定义页面导航栏文案样式
      type: String,
      value: ''
    },
    isLayoutEvent: { // 是否自定义返回事件
      type: Boolean,
      value: false
    },
    slotStyle: {  // slot 自定义样式
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mobileStatusHeight: 0,
    mobileNavHeight: 0,
    mainHeight: 0,
    menusInfos: {
      width: 0,
      height: 0,
      right: 0
    },
    isIosSystem: false
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    setNavStatusSize() {
      let _that = this,
          sysInfo = wx.getSystemInfoSync(),
          _statusHeight = sysInfo.statusBarHeight,
          isIos = sysInfo.system.indexOf('iOS') > -1,
          _navHeight = 0;
      if (isIos) {
        _navHeight = 44
      } else {
        _navHeight = 48
      }

      const _menu = wx.getMenuButtonBoundingClientRect();
      let _infos = {
        width: _menu.width,
        height: _menu.height,
        right: _menu.right,
        marginRight: sysInfo.screenWidth - _menu.right
      }

      _that.setData({
        mobileStatusHeight: _statusHeight,
        mobileNavHeight: _navHeight,
        mainHeight: sysInfo.screenHeight - (_navHeight + _statusHeight),
        menusInfos: _infos,
        isIosSystem: isIos
      })
    },
    handleTap({ detail } = {}) {
      if (this.properties.hideBack) {
        return
      }

      if (this.properties.isLayoutEvent) {
        this.triggerEvent('layoutEvent', detail)
      } else {
        wx.navigateBack({
          delta: 1,
        })
      }
    }
  },

  attached: function () {
    const _that = this
    _that.setNavStatusSize()
  }
})
