import store from "../store";
import {ToastMutation} from "../store/constant";

export function current() {
    let current = dateFormat("YYYY-mm-dd HH:MM:SS:ss", new Date())
    return '[' + current + ']'
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString(),          // 秒
        "s+": date.getMilliseconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

export const ToastExecutor = {

    timer: null,

    show: function (options) {
        let __this = this;
        // 移除定时器
        if (this.timer != null) {
            clearTimeout(this.timer);
        }
        // 参数校验
        if (!CheckToastParam(options)) {
            this.show(defaultObj);
        }
        // 设置吐司内容
        store.commit(ToastMutation.DO_TYPE, options.type);
        store.commit(ToastMutation.DO_CONTENT, options.content);
        store.commit(ToastMutation.DO_SHOW, true);
        // 配置定时器
        let duration;
        if (options.duration == null) {
            duration = 2000
        } else {
            duration = options.duration;
        }
        this.timer = setTimeout(function () {
            __this.hide();
        }, duration)
    },
    hide: function () {
        store.commit(ToastMutation.DO_SHOW, false);
    }

}

const defaultObj = {
    type: 'failure',
    content: '吐司失败',
    duration: 2000
}

function CheckToastParam(obj) {
    if (obj == null) {
        return false;
    }
    if (obj.type == null) {
        return false;
    }
    if ('success' !== obj.type && 'failure' !== obj.type) {
        return false;
    }
    if (obj.content == null) {
        return false;
    }
    return '' !== obj.content;
}

function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export function UUID() {
    return (s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()).toUpperCase();
}


