import * as Sentry from "sentry-miniapp";

const initializeSentry = (config, app) => {
  if (config.sentry && config.environment !== 'test') {
    Sentry.init({
      dsn: config.sentry,
      environment: config.env || 'EnvironmentError',
      release: config.version
    });
    const tag = {
      "deviceid": config.deveiceId,
      "userCode": app.globalData.userCode
    }

    const userInfo = wx.getStorageSync("userInfo");
    
    if (userInfo) {
      tag.openId = userInfo.openId;
    }

    Sentry.setTags(tag);
  }
}
export default initializeSentry;