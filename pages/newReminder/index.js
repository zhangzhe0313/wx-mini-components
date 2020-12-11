const { drugYongFaConst, pickerType, drugWeightConst, drugLabelConst, drugTimesConst } = require("../../lib/constData")
const { formatDate, getMapNameByValue } = require("../../lib/util")

// pages/newReminder/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ShowWeeklyTimes: false,
    originData: [
      {
        id:  drugLabelConst.YF,
        name: '用法',
        type: pickerType.SELECT,
        origins: drugYongFaConst,
        selected: {
          name: '',
          value: -1
        }
      }, {
        id: drugLabelConst.YL,
        name: '用量',
        type: pickerType.INPUT,
        selected: {
          name: '1',
          value: 1
        }
      }, {
        id: drugLabelConst.DW,
        name: '单位',
        type: pickerType.SELECT,
        origins: drugWeightConst,
        selected: {
          name: '',
          value: -1
        }
      }
    ],
    yongFaYongLiang: {
      yongFa: '',
      yongLiang: '',
      danWei: ''
    },
    ShowZQPC: false,
    ZQPCoriginData: [{
      id: drugLabelConst.PC,
      name: '频次',
      type: pickerType.SELECT,
      origins: drugTimesConst,
      selected: {
        name: '',
        value: -1
      }
    }],
    pinCi: '',
    startDate: formatDate(Date.now(), 'yyyy-MM-dd'),
    endDate: formatDate(Date.now(), 'yyyy-MM-dd'),
    startMinDate: '2000-01-01',
    endMinDate: formatDate(Date.now(), 'yyyy-MM-dd'),
    isStartDateInit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  handleWeeklyTimes () {
    this.setData({
      ShowWeeklyTimes: true,
    })
  },
  handleZQPC () {
    this.setData({
      ShowZQPC: true,
    })
  },
  handleClosePicker () {
    this.setData({
      ShowWeeklyTimes: false,
      ShowZQPC: false,
    })
  },
  handlePickerResult ({ detail } = {}) {

    console.log('handlePickerResult', detail)

    let _that = this
    let key = null
    detail.map(ele => {
      switch (ele.id) {
        case drugLabelConst.YL:
          key = 'yongFaYongLiang.yongLiang'
          break
        case drugLabelConst.YF:
          key = 'yongFaYongLiang.yongFa'
          break
        case drugLabelConst.DW:
          key = 'yongFaYongLiang.danWei'
          break
        case drugLabelConst.ZQ:
          key = 'ZhouQiPinCi.zhouQi'
          break
        case drugLabelConst.PC:
          key = 'pinCi'
          break
      }

      if (key) {
        _that.setData({
          [key]: ele.selected.name
        })
      }
    })

    _that.setData({
      ShowWeeklyTimes: false,
      ShowZQPC: false
    }, function() {
      if (_that.data.isStartDateInit) {
        const _startDate = formatDate(Date.now(), 'yyyy-MM-dd')
        _that.handleRelativeDateChange(_startDate, false)
      } else {
        wx.showModal({
          title: '提示',
          content: '用药周期发生变化，是否重置用药起止时间？',
          cancelText: '否',
          confirmText: '是',
          success (res) {
            if (res.confirm) {
              _that.handleRelativeDateChange(formatDate(Date.now(), 'yyyy-MM-dd'), true)
            }
          }
        })
      }
    })
  },
  bindStartDateChange({detail: {value}} = e) {
    this.handleRelativeDateChange(value, true)
  },
  handleRelativeDateChange(_startDate, isChanged) {
    if (!_startDate) {
      return
    }

    const _pinCi = Number.parseInt(getMapNameByValue('name', drugTimesConst, this.data.pinCi))
    let  _endDate = ''
    if (typeof _pinCi == 'number') {
      const _begin = new Date(formatDate(_startDate, 'yyyy/MM/dd')).getTime()
      if (_pinCi == 1) {
        _endDate = _startDate
      } else {
        _endDate = formatDate(_begin + _pinCi * 24 * 60 * 60 * 1000 , 'yyyy-MM-dd')
      }
    } else {
      _endDate = _startDate
    }

    this.setData({
      startDate: _startDate,
      endMinDate: _startDate,
      endDate: _endDate,
      isStartDateInit: !isChanged ? true : false
    })
  }
})