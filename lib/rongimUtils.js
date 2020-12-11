var notificationEvent = require('./event.js')
import notificationConfig from './notificationConfig'
const RongIMLib = require('./RongIMLib-3.0.7.js');
import config from './config'
import { formatDate } from './util'
import reportException from './error'
export const ADA_ADMIN = "ada-admin"
const DATE_SHOW_FORMAT = "yyyy年MM月dd日 hh:mm"

export const MessageExtraType = {
	QUESTION: config.messageType.dialog,
	DOCTOR_EXIT: config.messageType.quitTask,
	DOCTOR_ENTER: config.messageType.accept,
	USER_ENTER: config.messageType.finishSelfDiagnose,
	HEART: config.messageType.heartListener,
}

export const MessageUIType = {
	TEXT_MESSAGE: 'text_message',
	EMPTY: 'empty',
	REPORT: 'report',
	TIP: 'tip',
	USER_ENTER: 'user_enter',
}

let im

export function initRongIM() {
	im = RongIMLib.init({
		appkey: config.appKey,
	});
}

/**
 * 将字符串或者null转换成数组
 */
export function convertStringToArray(str) {
	if (str === null || str === undefined) {
		return []
	}
	if (typeof str === "string") {
		try {
			return JSON.parse(str)
		} catch (e) {
			console.error(e)
			return []
		}
	}
	if (Array.isArray(str)) {
		return str
	}
	console.error('无法将对象转换成数组', str)
	return []
}

/**
 * 服务器返回的dialogs消息历史，转换成UI可以用的数据
 */
export function convertMessageListToUIList(messages, extraData) {
	const messageList = convertStringToArray(messages)
		.map(item => convertMessageToUIModel(item, extraData))
		.flat()
		.filter(item => item !== undefined)
	return messageList
}

/**
 * 服务器存储的消息数据转换成UI可以用的数据
 */
export function convertMessageToUIModel(message, extraData) {
	if (message === null || message === undefined) {
		return []
	}
	const objectName = getMessageObjectName(message)
	let result = []
	switch (objectName) {
		case "RC:TxtMsg": {
			result = convertTxtMsgToUIModel(message, extraData)
			break
		}
		default: {
			console.error(message)
			throw new Error(`不支持的消息类型 ${objectName}`)
		}
	}
	return result.filter(item => item !== undefined)
}

export function convertTxtMsgToUIModel(message, extraData) {
	// console.log('convertTxtMsgToUIModel', message)
	const app = getApp()
	const { senderUserId, messageUId, content: { content } } = message
	const { doctorId, userkey } = app.globalData.userInfo
	const myId = app.isCApp() ? userkey : doctorId
	const isMySend = senderUserId === myId
	const extra = getMessageExtra(message)
	const { userAvatar, doctorAvatar } = extraData
	if (userAvatar === null || userAvatar === undefined) {
		throw new Error('缺少必要参数 userAvatar')
	}
	if (doctorAvatar === null || doctorAvatar === undefined) {
		throw new Error('缺少必要参数 doctorAvatar')
	}
	let myAvatar
	let otherAvatar
	if (app.isCApp()) {
		myAvatar = userAvatar
		otherAvatar = doctorAvatar
	} else if (app.isDApp()) {
		myAvatar = doctorAvatar
		otherAvatar = userAvatar
	}

	if (extra === undefined) {
		// 普通消息，没有 extra 附加信息
		return [{
			id: messageUId,
			type: MessageUIType.TEXT_MESSAGE,
			message: content,
			avatar: isMySend ? myAvatar : otherAvatar,
			isLeftMessage: !isMySend,
			rawRongMessage: message,
		}]
	}

	const { type } = extra
	switch (type) {
		case MessageExtraType.QUESTION: {
			return [{
				id: messageUId,
				type: MessageUIType.TEXT_MESSAGE,
				message: content,
				avatar: isMySend ? myAvatar : otherAvatar,
				isLeftMessage: !isMySend,
				rawRongMessage: message,
			}]
		}
		case MessageExtraType.DOCTOR_ENTER: {
			// console.log('doctor_enter', extra)
			const { inquiryStartAt } = extra
			const tipMessage = {
				id: `${messageUId}_tip`,
				type: MessageUIType.TIP,
				message: formatDate(inquiryStartAt, DATE_SHOW_FORMAT),
			}
			return [tipMessage, {
				id: messageUId,
				type: MessageUIType.TEXT_MESSAGE,
				message: content,
				avatar: isMySend ? myAvatar : otherAvatar,
				isLeftMessage: !isMySend,
				rawRongMessage: message,
			}]
		}
		case MessageExtraType.DOCTOR_EXIT: {
			// {type: 4, key: "5fab768ffd58880008af12e7", hasReport: true, eReportId: "5fab778fcb2cda0008b23b1f"}
			// console.log('doctor_exit', extra)
			const { hasReport, key } = extra
			return [{
				...extra,
				id: messageUId,
				type: hasReport && getApp().isCApp() ? MessageUIType.REPORT : MessageUIType.EMPTY,
				inquiryKey: key,
				avatar: isMySend ? myAvatar : otherAvatar,
				isLeftMessage: !isMySend,
				rawRongMessage: message,
			}]
		}
		case MessageExtraType.USER_ENTER: {
			// user enter
			// {"type":7,"profileKey":"5f73f08903043d0008e851c9","lineUpStartAt":1603768024000,"findingKey":"finding:Fever","symptom":"发烧"}
			// console.log('user_enter', message, extra)
			const { sentTime } = message
			return [{
				id: `${messageUId}_tip`,
				type: MessageUIType.TIP,
				message: formatDate(sentTime, DATE_SHOW_FORMAT),
			}, {
				...extra,
				id: messageUId,
				type: MessageUIType.USER_ENTER,
				message: content,
				avatar: isMySend ? myAvatar : otherAvatar,
				isLeftMessage: !isMySend,
				rawRongMessage: message,
			}, getApp().isCApp() ? {
				id: `${messageUId}_tip2`,
				type: MessageUIType.TIP,
				message: '请稍候, 已通知医生, 超时将自动取消',
				withBackground: true,
			} : undefined]
		}
		default: {
			console.error(message)
			throw new Error(`不能识别的消息extra类型 ${type}`)
		}
	}
}

export function getMessageExtra(message) {
	const { extra: extraStr } = message.content
	let extra = extraStr
	if (typeof extraStr === 'string') {
		if (extraStr.trim() === "") {
			extra = undefined
		} else {
			try {
				extra = JSON.parse(extraStr)
			} catch (err) {
				console.error(err)
				console.error(extraStr)
				extra = undefined
			}
		}
	}

	if (extra !== undefined) {
		if (extra.attributeEvidences) {
			// fixes，消息回复 C端 没有给 type 参数
			extra.type = MessageExtraType.QUESTION
		}
	}

	return extra
}

export function getMessageObjectName(message) {
	if (message.messageType !== undefined) {
		return message.messageType
	}
	if (message.objectName !== undefined) {
		return message.objectName
	}
	console.error(message)
	throw new Error('获取 obejctName 失败')
}

/**
 * 融云链接
 */
export function connectRongIM(userInfo) {
	im.connect({ token: userInfo.token })
		.then(function (user) {
			// console.log('链接成功, 链接用户 id 为: ', user.id);
			// const userInfo = wx.getStorageSync('userInfo')
			// console.log(userInfo)
			const userkey = getApp().isCApp() ? userInfo.userkey : userInfo.doctorId
			if (userkey !== user.id) {
				throw {
					code: -1010,
					msg: `融云链接成功，但是用户不一致, ${JSON.stringify(userInfo)} ${JSON.stringify(user)}`,
				}
			}
		}).catch(function (error) {
			const { code } = error
			switch (code) {
				case 34001: {
					// 重复链接
					break
				}
				default: {
					console.error('链接失败: ', error);
					reportException(error)
					wx.showModal({
						title: '融云链接出错',
						content: typeof error === "string" ? error : JSON.stringify(error),
						showCancel: false,
					})
				}
			}
		});
}

export function disconnectRongIm() {
	im.disconnect().then(function () {
		console.log('断开链接成功');
	});
}

export function sendRongMessage(targetId, { messageType = RongIMLib.MESSAGE_TYPE.TEXT, content = '', extra = undefined }) {
	if (content === null || content === undefined) {
		throw new Error('content 是必传字段')
	}
	return getConversation(targetId)({ messageType, content, extra })
}

export function getConversation(targetId) {
	const conversation = im.Conversation.get({
		targetId,
		type: RongIMLib.CONVERSATION_TYPE.PRIVATE
	})
	return function ({ messageType = RongIMLib.MESSAGE_TYPE.TEXT, content = '', extra = undefined }) {
		if (content === null || content === undefined) {
			throw new Error('content 是必传字段')
		}
		return conversation.send({
			messageType,
			content: {
				content,
				extra
			}
		}).then((message) => {
			console.log('send rong message success', message)
			return message
		}).catch((error) => {
			console.error('send rong message failure', error)
			reportException(error)

			if (error.code === 30001) {
				// Please connect successfully first
				const userInfo = wx.getStorageSync('userInfo')
				connectRongIM(userInfo)
				wx.showModal({
					title: '发送消息失败',
					content: '请稍后再试',
					showCancel: false,
				})
				return
			}

			wx.showModal({
				title: '发送消息失败',
				content: `当前融云链接状态: ${getApp().globalData.RongIMStatus}, 错误信息: ${JSON.stringify(error)}`,
				showCancel: false,
			})

			return Promise.reject(error)
		})
	}
}

export function watchRongMessage(app) {
	im.watch({
		message: function (event) {
			var message = event.message;
			console.log('收到新消息:', message);
			notificationEvent.emit(notificationConfig.nameMessage, message)
		},
		status: function (event) {
			var status = event.status;
			console.log('连接状态码:', status);
			app.globalData.RongIMStatus = status

			if (status == 6) {
				wx.showModal({
					title: '提示',
					content: '该账号已在另一终端登录！',
					showCancel: false,
					success (res) {}
				})
			}
		}
	});
}