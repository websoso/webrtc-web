import store from "../store";

export const SignalType = {
    // webrtc
    WEBRTC_OFFER: 'WEBRTC_OFFER',
    WEBRTC_ANSWER: 'WEBRTC_ANSWER',
    WEBRTC_CANDIDATE: 'WEBRTC_CANDIDATE',
    // direct
    DIRECT_OFFER: 'DIRECT_OFFER',
    DIRECT_CANCEL_OFFER: 'DIRECT_CANCEL_OFFER',
    DIRECT_ANSWER: 'DIRECT_ANSWER',
    DIRECT_REFUSE: 'DIRECT_REFUSE',
    DIRECT_HANG_UP: 'DIRECT_HANG_UP',
    // room
    ROOM_ENTER: 'ROOM_ENTER',
    ROOM_LEAVE: 'ROOM_LEAVE'
}

export const InfoType = {
    CLIENT_USER: 'CLIENT_USER',
    SERVER_SFU: 'SERVER_SFU'
}

export const InfoLanguage = {
    JS: 'JS',
    JAVA: 'JAVA',
    GO: 'GO'
}

function Message(signal, payload) {


    this.signal = signal;
    this.payload = payload;
    this.info = new Info(store.state.username, InfoType.CLIENT_USER, InfoLanguage.JS);


    this.jsonStr = function () {
        return JSON.stringify(this);
    }

}

function Info(username, type, language) {

    this.username = username;
    this.type = type;
    this.language = language;

}

// 在此处完成对消息的拆分
export const Factory = {

    webrtcOffer: function (payload) {
        return new Message(SignalType.WEBRTC_OFFER, payload);
    },

    webrtcAnswer: function (payload) {
        return new Message(SignalType.WEBRTC_ANSWER, payload);
    },

    webrtcCandidate: function (payload) {
        return new Message(SignalType.WEBRTC_CANDIDATE, payload);
    },

    directOffer: function() {
        return new Message(SignalType.DIRECT_OFFER, '');
    },

    directCancelOffer: function() {
        return new Message(SignalType.DIRECT_CANCEL_OFFER, '');
    },

    directAnswer: function() {
        return new Message(SignalType.DIRECT_ANSWER, '');
    },

    directRefuse: function() {
        return new Message(SignalType.DIRECT_REFUSE, '');
    },

    directHangUp: function() {
        return new Message(SignalType.DIRECT_HANG_UP, '');
    },

    roomEnter: function() {
        return new Message(SignalType.ROOM_ENTER, '');
    },

    roomLeave: function() {
        return new Message(SignalType.ROOM_LEAVE, '');
    }

}



