import store from "../store";
import {UUID} from "../common/common";

export const SignalType = {
    WEBRTC_OFFER: 'WEBRTC_OFFER',
    WEBRTC_ANSWER: 'WEBRTC_ANSWER',
    WEBRTC_CANDIDATE: 'WEBRTC_CANDIDATE',
    GROUP_JOIN: 'GROUP_JOIN',
    GROUP_QUIT: 'GROUP_QUIT',
}

export const EndpointType = {

    CLIENT_USER: 'CLIENT_USER',
    SERVER_ENDPOINT: 'SERVER_ENDPOINT'

}

export const LanguageType = {
    JS: 'JS',
    JAVA: 'JAVA',
    GO: 'GO'
}

export function Signal() {

    this.type = null;
    this.code = null;
    this.payload = null;
    this.endpoint = null;
    this.extended = null;
    this.timestamp = null;
    this.version = null;


    this.jsonStr = function () {
        return JSON.stringify(this);
    }

}

function Endpoint() {

    this.type = null;
    this.name = null;
    this.code = null;
    this.language = null;

}

function defaultSignal() {
    let signal = new Signal()
    let endpoint = new Endpoint()
    endpoint.type = EndpointType.CLIENT_USER;
    endpoint.language = LanguageType.JS
    endpoint.code = store.state.username
    endpoint.name = store.state.username
    signal.endpoint = endpoint;
    signal.timestamp = new Date().getTime()
    signal.version = "1.0"
    return signal
}

export const Factory = {

    groupJoin: function () {
        let signal = defaultSignal();
        signal.type = SignalType.GROUP_JOIN
        signal.payload = ""
        signal.code = UUID()
        return signal
    },

    webrtcAnswer: function (answer) {
        let signal = defaultSignal();
        signal.type = SignalType.WEBRTC_ANSWER
        signal.payload = JSON.stringify(answer)
        signal.code = UUID()
        return signal;
    },

    webrtcCandidate: function (candidate) {
        let signal = defaultSignal();
        signal.type = SignalType.WEBRTC_CANDIDATE
        signal.payload = JSON.stringify(candidate)
        signal.code = UUID()
        return signal;
    }

}