import reportException from './error'

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const formatDate = (date, fmt) => {
  if (!date || !fmt) {
    return ''
  }

  let _that = new Date(date)

  if (_that.toString() === 'Invalid Date') {
    if (typeof date === "string") {
      // ios 不支持带 ‘-’ 的时间格式，需转换成 ‘/’
      date = date.replace(/-/g, '/')
      _that = new Date(date)
    }
  }

  if (_that.toString() === 'Invalid Date') {
    reportException(new Error(`不支持的时间格式 ${date} ${fmt}`))
  }

  var o = {
    "M+": _that.getMonth() + 1,                 //月份
    "d+": _that.getDate(),                    //日
    "h+": _that.getHours(),                   //小时
    "m+": _that.getMinutes(),                 //分
    "s+": _that.getSeconds(),                 //秒
    "q+": Math.floor((_that.getMonth() + 3) / 3), //季度
    "S": _that.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (_that.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};


export const startDate = () => {

  let nowDate = new Date(),
    currentYear = new Date(
      nowDate.getFullYear() - 100,
      nowDate.getMonth(),
      nowDate.getDate()).getTime()

  return formatDate(currentYear, 'yyyy-MM-dd');
};

export const lastDate = () => {

  let nowDate = new Date();
  return formatDate(nowDate, 'yyyy-MM-dd');
};

export const isYoungChildren = (date, age = 11) => {

  let now = new Date(),
    _nowDate = new Date(formatDate(now.toLocaleDateString(), 'yyyy-MM-dd')),
    _currentYear = new Date(
      _nowDate.getFullYear() - age,
      _nowDate.getMonth(),
      _nowDate.getDate()).getTime(),
    _dateTime = new Date(date).getTime();

  return _currentYear < _dateTime
};

export const trimString = function (data) {
  if (!data || typeof (data) != 'string') {
    return '';
  }
  return data.replace(/\s+/g, '');
};

export const navigetorTo = path => {
  if (!path || trimString(path) === '') {
    return
  } else {
    return wx.navigateTo({
      url: '/pages/' + path + '/index',
    })
  }
}

export const setPageTitle = function (title) {
  wx.setNavigationBarTitle({
    title: title,
  })
}

export const navigetorBack = () => {
  wx.navigateBack({
    delta: 0,
  })
}

export const redirectToPage = path => {
  if (!path || trimString(path) === '') {
    return
  } else {
    wx.redirectTo({
      url: '/pages/' + path + '/index',
    })
  }
}

export const switchTargetTab = (tab) => {
  if (!tab || trimString(tab) === '') {
    return
  } else {
    return wx.switchTab({
      url: '/pages/' + tab + '/index',
    })
  }
}

export const navigetorToWithId = (path, id) => {
  if (!path || trimString(path) === '') {
    return
  } else {
    wx.navigateTo({
      url: '/pages/' + path + '/index?id=' + id,
    })
  }
}

export const redirectToWithId = (path, id) => {
  if (!path || trimString(path) === '') {
    return
  } else {
    wx.redirectTo({
      url: '/pages/' + path + '/index?id=' + id,
    })
  }
}

export const httpErrorCode = {
  PROCESSING_INQUIRY: 7006
}

export function dealHttpResults(responseArr) {
  // console.log(responseArr)
  const res = responseArr.map(item => dealHttpResult(item))
  // console.log(res)
  return res
}

export function dealHttpResult(response) {
  let responseData

  if (response === undefined) {
    return undefined
  }

  if (response.errMsg === undefined) {
    // 不是网络请求的结果
    responseData = response
  } else {
    if (response.errMsg !== 'request:ok') {
      return Promise.reject(`网络异常(${response.errMsg})`)
    }
    if (response.statusCode !== 200) {
      return Promise.reject(`数据请求异常(${response.statusCode})`)
    }
    responseData = response.data
  }

  const { code, msg, data } = responseData

  if (code === undefined) {
    // 不是 code msg data 结构的数据
    return responseData
  }

  for (const errorKey in httpErrorCode) {
    if (httpErrorCode[errorKey] === code) {
      return Promise.reject(responseData)
    }
  }

  if (code !== 0) {
    return Promise.reject(msg)
  }

  return data
}

export function dealUrlPath(path, pathMap, queryMap) {
  let result = path
  if (pathMap !== undefined) {
    for (const key in pathMap) {
      const value = pathMap[key]
      result = result.replace(`{{${key}}}`, value)
    }
  }
  if (queryMap !== undefined) {
    let index = 0
    for (const key in queryMap) {
      const value = queryMap[key]
      if (index === 0) {
        result = result + "?"
      } else {
        result = result + "&"
      }
      result = result + `${key}=${value}`
      index += 1
    }
  }
  // console.log(result)
  return result
}

export const getComplaintFromJsonString = datas => {
  if (!datas) {
    return {
      evidences: [],
      conditions: []
    };
  }

  let jsonString = JSON.parse(datas);
  if (jsonString) {
    return {
      evidences: (jsonString.cdxCase && jsonString.cdxCase.evidences) || [],
      conditions: jsonString.conditions || []
    };
  } else {
    return {
      evidences: [],
      conditions: []
    };
  }
};

// 获取evidence及attributes
export const getPatientEvidences = datas => {
  if (!datas) {
    return [];
  }

  let _origin = getComplaintFromJsonString(datas);

  let _maybeArry = [];
  _origin.evidences.forEach(ele => {
    if (ele.type === "PATHOLOGICAL") {
      let _attributeEvidences = [];
      ele.attributeEvidences.forEach(element => {
        if (element.professionalStateName !== "否") {
          _attributeEvidences.push(element);
        }
      });
      _maybeArry.push({
        id: ele.professionalName,
        attributes: _attributeEvidences
      });
    }
  });
  return _maybeArry;
};

export const getTermsWithPatient = datas => {
  let _terms = null
  for (let i = 0; i < datas.length; i++) {
    for (let j = 0; j < datas[i].attributes.length; j++) {
      if (datas[i].attributes[j].key.indexOf('attribute:TimeSinceOnset') !== -1) {
        _terms = datas[i].attributes[j].professionalStateName
        break;
      }
    }
    if (_terms) {
      break;
    }
  }
  return _terms
}

export const changEvidenceToString = datas => {
  let _string = ''
  for (let i = 0; i < datas.length; i++) {
    if (i < datas.length - 1) {
      _string += (datas[i].id + '，')
    } else {
      if (datas[i].attributes.length === 0) {
        _string += (datas[i].id + '。')
      }
    }
    for (let j = 0; j < datas[i].attributes.length; j++) {
      if (j < datas[i].attributes.length && i !== datas.length - 1) {
        _string += (datas[i].attributes[j].professionalName + '：' + datas[i].attributes[j].professionalStateName) + '，'
      } else {
        _string += (datas[i].attributes[j].professionalName + '：' + datas[i].attributes[j].professionalStateName) + '。'
      }
    }
  }
  return _string
}

export function commonErrorCatch(err) {
  console.error(err)
  reportException(err)
  if (err) {
    wx.showModal({
      title: '出现错误',
      content: typeof err === "string" ? err : JSON.stringify(err),
      showCancel: false,
    })
  }
}

export function subTargetString(target) {
  if (typeof target != 'string') {
    return ''
  }

  console.log('subTargetString', target)
  let _index = target.indexOf('市,')
  if (_index != -1) {
    return target.substr(0, _index)
  } else {
    return target
  }
}

export function transferToJson(jsonString) {
  if (typeof jsonString == 'string' && trimString(jsonString) != '') {
    return JSON.parse(jsonString)
  } else if (jsonString && (typeof jsonString == 'object')) {
    return jsonString
  }
}

export function clean(obj, func) {
  for (const name in obj) {
    const value = obj[name]
    if (func(value)) {
      delete obj[name]
    }
  }
  return obj
}

export function cleanUndefined(obj) {
  // console.log('cleanUndefined before', obj)
  return clean(obj, item => item === undefined)
  // console.log('cleanUndefined after', obj)
}

export function promisic(func) {
  return function (params) {
    return new Promise(function (resolve, reject) {
      var args = Object.assign(params, {
        success: function (res) {
          resolve(res);
        },
        fail: function (error) {
          reject(error);
        }
      });
      func(args);
    });
  };
}

export function getMapNameByValue(kind, maps, value) {
  if (!kind) {
    return ''
  }

  if (!(typeof maps == 'object' && maps instanceof Object)) {
      return ''
  }

  if (kind == 'value') {
    const find = Object.values(maps).find(item => item.value === value)
    return find ? find.name : ''
  } else if (kind == 'name') {
    const find = Object.values(maps).find(item => item.name === value)
    return find ? find.value : -1
  } else {
    return ''
  }
}