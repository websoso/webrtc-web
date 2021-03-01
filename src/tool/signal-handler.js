import {SignalType} from "./signal";
import {pageManager} from "./page";

const SignalHandler = {

    received: function (signal) {
        switch (signal.type) {
            case SignalType.WEBRTC_OFFER:
                // 将字符串转换为对象
                signal.payload = JSON.parse(signal.payload)
                this.webrtcSignal(signal);
                break
            case SignalType.WEBRTC_CANDIDATE:
                // 将字符串转换为对象
                signal.payload = JSON.parse(signal.payload)
                this.webrtcSignal(signal);
                break
        }
    },

    webrtcSignal: function (signal) {
        pageManager.roomPage.receivedSignal(signal);
    }

}
export default SignalHandler;