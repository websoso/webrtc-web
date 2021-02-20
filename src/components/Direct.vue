<template>
    <div class="direct-wrapper">
        <div class="direct-box">
            <div class="video-position">
                <div class="big-video-box">
                    <video class="videoStyle" autoplay playsinline muted ref="bigVideoBack"></video>
                    <video :class='{videoStyle: true, blurMask: blurMask}' autoplay playsinline muted
                           ref="bigVideo"></video>
                    <div v-if="blackMask" class="black-mask"></div>
                    <div v-if="gradualMask" class="top-linear"></div>
                </div>
                <div v-if="smallShow" class="small-video">
                    <video class="videoStyle" autoplay playsinline ref="smallVideo"></video>
                </div>
            </div>
            <div v-if="localVideoDuring" class="content-box">
                <div v-if="$store.state.direct.direct_status === status.NONE">NONE</div>
                <div v-if="$store.state.direct.direct_status === status.OFFER">
                    <div class="call-username-box">
                        <div class="call-username">{{$store.state.direct.direct_username}}</div>
                        <div class="call-desc">正在等待对方接受邀请...</div>
                    </div>
                    <circular-button class="cancel-button" color="#d64e4e" name="取消" src-name="phone"
                                     @button-click="cancel"></circular-button>
                </div>
                <div v-if="$store.state.direct.direct_status === status.ANSWER">
                    <div class="call-username-box">
                        <div class="call-username">{{$store.state.direct.direct_username}}</div>
                        <div class="call-desc">邀请你视频通话</div>
                    </div>
                    <circular-button class="refuse-button" color="#d64e4e" name="拒绝" src-name="phone"
                                     @button-click="refuse"></circular-button>
                    <circular-button class="answer-button" color="#48b92c" name="接听" src-name="video"
                                     @button-click="answer"></circular-button>
                </div>
                <div v-if="$store.state.direct.direct_status === status.ONGOING">
                    <circular-button class="hang-up-button" color="#d64e4e" name="挂断" src-name="phone"
                                     @button-click="hangUp"></circular-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CircularButton from "./CircularButton";
    import {DirectStatusType, DirectMutation} from '../store/constant'
    import {Page, pageManager} from "../tool/page";
    import Connector from "../tool/connection";
    import {Factory, SignalType} from "../tool/message";
    import {RTCManager, Stream, RTCModeType} from "../lib/webrtc-lib";

    const constraints = {
        video: true, audio: true
    }

    export default {
        name: "Direct",
        components: {CircularButton},
        data: function () {
            return {
                status: DirectStatusType,
                blackMask: false,
                gradualMask: false,
                blurMask: false,
                smallShow: false,
                localVideoDuring: false,
                mediaStream: {
                    local: null,
                    remote: null
                }
            }
        },
        methods: {
            cancel() {
                // 发送消息
                Connector.send(Factory.directCancelOffer())
                // 关闭页面
                this.ClosePage();
                // 退出页面
                pageManager.vuePage.closeDirect();
            },
            refuse() {
                // 发送消息
                Connector.send(Factory.directRefuse())
                // 关闭页面
                this.ClosePage();
                // 退出页面
                pageManager.vuePage.closeDirect();
            },
            answer() {
                // 发送消息
                Connector.send(Factory.directAnswer())
            },
            hangUp() {
                // Connector.send(Factory.directHangUp())
                this.finish();
            },
            finish() {
                RTCManager.close();
                this.ClosePage();
                pageManager.vuePage.closeDirect();
            },
            DirectConnected() {
                this.smallShow = true;
                this.$nextTick(() => {
                    this.$store.commit(DirectMutation.STATUS_ONGOING)
                    this.$refs.smallVideo.srcObject = this.mediaStream.remote
                    this.gradualMask = false;
                    this.blackMask = false;
                    this.blurMask = false;
                })
            },
            ClosePage() {
                // 关闭媒体
                this.closeAllMedia();
            },
            ReceivedMessage(message) {
                let __this = this;
                switch (message.signal) {
                    case SignalType.DIRECT_ANSWER:
                        __this.initPeerConnection();
                        break;
                    case SignalType.WEBRTC_OFFER:
                        __this.receivedOffer(message.payload);
                        break;
                    case SignalType.WEBRTC_ANSWER:
                        __this.receivedAnswer(message.payload);
                        break;
                    case SignalType.WEBRTC_CANDIDATE:
                        __this.receivedCandidate(message.payload);
                        break;
                    case SignalType.DIRECT_HANG_UP:
                        __this.finish();
                        break;
                }
            },
            initPeerConnection: function () {
                let __this = this;
                let streamList = []
                let tracks = []
                this.mediaStream.local.getTracks().forEach(track => {
                    tracks.push(track)
                })
                let stream = new Stream(this.mediaStream.local, tracks);
                streamList.push(stream);
                RTCManager.init({
                    mode: RTCModeType.DIRECT,
                    streams: streamList,
                    fallback: __this.receivedRemoteStream
                })
            },
            receivedOffer(offer) {
                let __this = this;
                let streamList = []
                let tracks = []
                this.mediaStream.local.getTracks().forEach(track => {
                    tracks.push(track)
                })
                let stream = new Stream(this.mediaStream.local, tracks);
                streamList.push(stream);
                RTCManager.createAnswer({
                    mode: RTCModeType.DIRECT,
                    streams: streamList,
                    fallback: __this.receivedRemoteStream,
                    offer: offer
                })
            },
            receivedAnswer(answer) {
                RTCManager.saveAnswer(answer);
            },
            receivedCandidate(candidate) {
                RTCManager.saveCandidate(candidate);
            },
            receivedRemoteStream(stream) {
                this.smallShow = true;
                this.$nextTick(() => {
                    this.$refs.smallVideo.srcObject = stream
                    this.$refs.smallVideo.onplaying = this.smallVideoStartPlay;
                })
            },
            smallVideoStartPlay() {
                this.$store.commit(DirectMutation.STATUS_ONGOING)
                this.gradualMask = false;
                this.blackMask = false;
                this.blurMask = false;
                this.localVideoDuring = true;
            },
            bigVideoStartPlay() {
                if (this.$store.state.direct.direct_status === this.status.OFFER) {
                    this.gradualMask = true;
                    this.blackMask = false;
                    this.blurMask = false;
                    this.localVideoDuring = true;
                }
                if (this.$store.state.direct.direct_status === this.status.ANSWER) {
                    this.gradualMask = true;
                    this.blackMask = true;
                    this.blurMask = true;
                    this.localVideoDuring = true;
                }
            },
            getLocalUserMedia() {
                navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
                    if (this.$store.state.direct.direct_status === this.status.OFFER) {
                        this.$refs.bigVideo.srcObject = mediaStream
                        this.$refs.bigVideo.onplaying = this.bigVideoStartPlay;
                        this.mediaStream.local = mediaStream;
                        this.mediaStream.remote = mediaStream;
                    }
                    if (this.$store.state.direct.direct_status === this.status.ANSWER) {
                        this.$refs.bigVideo.srcObject = mediaStream
                        this.$refs.bigVideo.onplaying = this.bigVideoStartPlay;
                        this.$refs.bigVideoBack.srcObject = mediaStream
                        this.mediaStream.local = mediaStream;
                        this.mediaStream.remote = mediaStream;
                    }
                })
            },
            closeAllMedia() {
                if (this.mediaStream.local) {
                    this.mediaStream.local.getTracks().forEach(track => {
                        track.stop();
                    })
                }
                if (this.mediaStream.remote) {
                    this.mediaStream.remote.getTracks().forEach(track => {
                        track.stop();
                    })
                }
            }
        },
        created() {
            pageManager.initDirectPage(new Page(this));
        },
        mounted() {
            this.getLocalUserMedia();
        }

    }
</script>

<style scoped>
    .direct-wrapper {
        height: 100%;
        background-color: #202020;
    }

    .direct-box {
        height: 100%;
        position: relative;
    }

    .video-position {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .big-video-box {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .videoStyle {
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .blurMask {
        -webkit-filter: blur(7px);
        -moz-filter: blur(7px);
        -ms-filter: blur(7px);
        -o-filter: blur(7px);
        filter: blur(7px);
        filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
    }

    .black-mask {
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
    }

    .top-linear {
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 300px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
    }

    .small-video {
        right: 8px;
        top: 30px;
        position: absolute;
        width: 100px;
        height: 178px;
        background-color: #202020;
    }

    .content-box {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .call-username-box {
        position: absolute;
        right: 16px;
        top: 40px;
        width: 300px;
        height: 60px;
        text-align: right;
        user-select: none;
    }

    .call-username {
        width: 300px;
        height: 36px;
        line-height: 36px;
        font-size: 30px;
        color: white;
    }

    .call-desc {
        width: 300px;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: white;
    }

    .cancel-button, .hang-up-button {
        position: absolute;
        display: inline-block;
        left: calc(50% - 34px);
        bottom: 40px;
    }

    .refuse-button {
        position: absolute;
        display: inline-block;
        left: 34px;
        bottom: 40px;
    }

    .answer-button {
        position: absolute;
        display: inline-block;
        right: 34px;
        bottom: 40px;
    }

</style>