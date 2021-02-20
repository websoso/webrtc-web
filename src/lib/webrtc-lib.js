import Connector from '../tool/connection'
import {Factory} from "../tool/message";
import {current} from "../common/common";

const servers = null;

const disc_option = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
}

export const RTCModeType = {
    DIRECT: 'DIRECT',
    ROOM: 'ROOM'
}

export function Stream(stream, tracks) {
    this.instance = stream;
    this.tracks = tracks;
}

function PeerConnection({mode, streams, fallback}) {

    this.mode = mode;
    this.instance = new RTCPeerConnection(servers);
    let __this = this;

    this.instance.onicecandidate = function (event) {
        if (event.candidate) {
            Connector.send(Factory.webrtcCandidate(event.candidate))
        }
    }

    this.instance.ontrack = function (event) {
        console.log(current(), '[webrtc] - [ontrack]', event)
        if (event.streams[0] !== undefined) {
            fallback(event.streams[0]);
        }
    };

    this.instance.onconnectionstatechange = function () {
        console.log(current(), '[webrtc] - [onconnectionstatechange]', __this.instance.connectionState)
    }

    this.addStreamList = function (streams) {
        streams.forEach(stream => {
            stream.tracks.forEach(track => {
                __this.instance.addTrack(track, stream.instance)
            })
        })
    }

    this.createOffer = function () {
        __this.instance.createOffer(disc_option)
        .then(offer => {
            __this.instance.setLocalDescription(offer)
            .then(() => {
                Connector.send(Factory.webrtcOffer(offer))
            }).catch(handleError);
        }).catch(handleError);
    }

    this.createAnswer = function (offer) {
        __this.instance.setRemoteDescription(offer)
        .then(() => {
            __this.instance.createAnswer(disc_option)
            .then((answer) => {
                __this.instance.setLocalDescription(answer)
                .then(() => {
                    Connector.send(Factory.webrtcAnswer(answer))
                }).catch(handleError)
            }).catch(handleError)
        }).catch(handleError)
    }

    this.setAnswer = function (answer) {
        __this.instance.setRemoteDescription(answer)
        .then(() => {
        }).catch(handleError);
    }

    this.setCandidate = function (candidate) {
        __this.instance.addIceCandidate(candidate)
        .then(() => {

        }).catch(handleError);
    }

    this.close = function () {
        __this.instance.close();
    }

    __this.addStreamList(streams);

}

function handleError(error) {
    console.error(error);
}

export const RTCManager = {

    instance: null,

    init: function ({mode, streams, fallback}) {
        if (this.instance == null) {
            this.instance = new PeerConnection({mode, streams, fallback});
            this.instance.createOffer();
        } else {
            this.instance.createOffer();
        }
    },

    createOffer: function () {

    },

    createAnswer: function ({mode, streams, fallback, offer}) {
        if (this.instance == null) {
            this.instance = new PeerConnection({mode, streams, fallback})
            this.instance.createAnswer(offer);
        } else {
            this.instance.createAnswer(offer);
        }
    },

    saveAnswer: function (answer) {
        if (this.instance != null) {
            this.instance.setAnswer(answer);
        } else {
            console.error('Null PeerConnection!')
        }
    },

    saveCandidate: function (candidate) {
        if (this.instance != null) {
            this.instance.setCandidate(candidate);
        } else {
            console.error('Null PeerConnection!')
        }
    },

    close: function () {
        if (this.instance != null) {
            this.instance.close();
            this.instance = null;
        } else {
            console.error('Null PeerConnection!')
        }
    }

}