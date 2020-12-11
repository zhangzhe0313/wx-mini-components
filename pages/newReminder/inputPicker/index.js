const { pickerType } = require("../../../lib/constData")
const { getMapNameByValue } = require("../../../lib/util")

// pages/newReminder/inputPicker/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    originData: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    optOriginData: [],
    selectTabs: [],
    activeTab: 0,
    pickerValue: []
  },

  ready() {
    this.handleOriginData()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleOriginData() {
      let _that = this
      let _newOriginData = [..._that.properties.originData]
      let _tabs = _newOriginData.filter(ele => ele.type != pickerType.INPUT)

      _that.setData({
        optOriginData: [..._that.properties.originData],
        selectTabs: [..._tabs],
        pickerValue: [_tabs[0].selected.value]
      })
    },
    handleBindpickChange ({detail: { value } } = e) {
      let _tabInfos = this.data.optOriginData[this.data.activeTab]
      let _tabInfo = _tabInfos.origins[value[0]]

      let _optOriginData = this.data.optOriginData.map(ele => {
        if (ele.id == _tabInfos.id) {
          return {
            ...ele,
            selected: {
              name: _tabInfo.name,
              value: ele.origins.findIndex(ele => ele.value == _tabInfo.value)
            }
          }
        } else {
          return ele
        }
      })

      this.setData({
        optOriginData: [..._optOriginData]
      })
    },
    changeTab(e) {
      const _dataset = e.currentTarget.dataset
      if (_dataset.index === this.data.activeTab) {
        return
      }
      this.setData({
        activeTab: _dataset.index,
        pickerValue: [this.data.optOriginData[_dataset.index].selected.value]
      })
    },
    handleInputChange (e) {
      const _dataset = e.currentTarget.dataset
      const _value = e.detail.value

      let _optOriginData = this.data.optOriginData.map(ele => {
        if (ele.type == pickerType.INPUT && ele.id == _dataset.id) {
          return {
            ...ele,
            selected: {
              name: _value,
              value: _value
            }
          }
        } else {
          return ele
        }
      })

      this.setData({
        optOriginData: [..._optOriginData]
      })
    },
    handleCancelOpt({detail} = {}) {
      this.setData({
        activeTab: 0
      })
      this.triggerEvent('pickerHideEvent', detail)
    },
    handleSureOpt({detail} = {}) {
      this.setData({
        activeTab: 0
      })
      let _result = this.data.optOriginData.map(ele => {
        return {
          id: ele.id,
          selected: {
            name: ele.selected.value == -1 ? ele.origins[0].name : ele.selected.name,
            value: ele.selected.value == -1 ? ele.origins[0].value : ele.selected.value
          },
        }
      })
      this.triggerEvent('pickerSureEvent', { detail } = _result)
    }
  }
})
