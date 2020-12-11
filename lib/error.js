import * as Sentry from "sentry-miniapp";
import _ from "../lib/lodash.js";
import zh from "./language/zh.js"

const reportException = (err) => {
  let error;
  let tags = {
    message: "",
    category: "",
    data: {},
    type: 'error'
  };

  if (_.isError(err)) {
    error = err;
    Sentry.captureException(error);
  } else if (_.isObject(err) && err.type === "fail") {

    error = new Error();
    error.name = "HTTP_REQUEST_FAIL";
    error.message = `${err.errMsg}` || 'http';

    tags.message = err.errMsg;
    tags.data = { ...err };
    tags.category = 'HTTP';
    tags.type = 'http';

    Sentry.addBreadcrumb(tags);
    Sentry.captureException(error);

    wx.hideLoading();
    wx.showModal({
      content: zh.common.errorTimeout,
      showCancel: false,
      confirmText: zh.common.sure,
      success(res) {
        console.log('reportException', res);
        if (res.confirm) {
          // wx.reLaunch({
          //   url: '/pages/account/authorization/index',
          // })
        }
      }
    })
  } else if (_.isObject(err) && err.type === "code") {

    if (err.statusCode && err.statusCode > 200 && err.statusCode != 204) {
      error = new Error();
      error.name = 'SERVICE_EXCEPTION';
      let message = err.data.message || 'Service exception';
      error.message = message;

      tags.message = message;
      tags.data = { ...err};
      tags.category = 'HTTP';
      tags.type = 'http';
      Sentry.addBreadcrumb(tags);
      Sentry.captureException(error);


      wx.hideLoading();
      wx.showModal({
        content: zh.common.errorUnavailable,
        showCancel: false,
        confirmText: zh.common.sure,
        success(res) {
          console.log(res);
          // if (res.confirm) {
          //   wx.redirectTo({
          //     url: '/pages/dialog/index',
          //   })
          // }
        }
      })
    }
  }
  
}
export default reportException;