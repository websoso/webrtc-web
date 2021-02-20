import {SignalType} from "./message";
import store from "../store";
import {DirectMutation, HomeMutation, ModeType} from "../store/constant";
import {pageManager} from "./page";

const MessageHandler = {

    received: function (message) {
        switch (message.signal) {
            case SignalType.DIRECT_OFFER:
                this.directOffer(message);
                break;
            case SignalType.DIRECT_CANCEL_OFFER:
                this.directCancelOffer();
                break;
            case SignalType.DIRECT_REFUSE:
                this.directRefuse(message);
                break;
            case SignalType.DIRECT_ANSWER:
                this.webrtcMessage(message);
                break;
            case SignalType.WEBRTC_OFFER:
                this.webrtcMessage(message);
                break;
            case SignalType.WEBRTC_ANSWER:
                this.webrtcMessage(message);
                break;
            case SignalType.WEBRTC_CANDIDATE:
                this.webrtcMessage(message);
                break;
            case SignalType.DIRECT_HANG_UP:
                this.webrtcMessage(message);
                break;
        }
    },

    directOffer: function (message) {
        store.commit(HomeMutation.WEBRTC_MODE, ModeType.WEBRTC_DIRECT);
        store.commit(DirectMutation.USERNAME, message.info.username);
        pageManager.vuePage.openDirect(DirectMutation.STATUS_ANSWER);
    },

    directCancelOffer: function () {
        pageManager.closeDirectPage();
    },

    directRefuse: function (message) {
        store.commit(HomeMutation.WEBRTC_MODE, ModeType.WEBRTC_DIRECT);
        store.commit(DirectMutation.USERNAME, message.info.username);
        pageManager.closeDirectPage();
    },

    webrtcMessage: function (message) {
        // todo 如果增加 room 后，应该进行模式判断
        pageManager.directPage.receivedMessage(message);
    }

}

export default MessageHandler;