<template>
    <div class="room-wrapper">
        <div class="room-box">
            <div class="video-position">
                <div class="video-box" v-for="(item, index) in mediaList" :key="index" :style="computeStyle(index)"
                     @click="AddVideo">
                    <video class="video-style" autoplay playsinline muted ref="video">
                    </video>
                </div>
            </div>
            <div v-if="$store.state.room.room_status === status.IN_ROOM">
                <circular-button class="hang-up-button" color="#d64e4e" name="挂断" src-name="phone"
                                 @button-click="hangUp"></circular-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CircularButton from "./CircularButton";
    import {RoomStatusType} from '../store/constant';
    import ui from '../common/ui'
    import Connector from "../tool/connection";
    import {Factory} from "../tool/signal";
    import {Page, pageManager} from "../tool/page";
    import {SignalType} from "../tool/signal";
    import {RTCManager, RTCModeType, Stream} from "../lib/webrtc-lib";
    import {current} from "../common/common";

    const constraints = {
        video: true, audio: true
    }

    export default {
        name: "Room",
        components: {CircularButton},
        data: function () {
            return {
                status: RoomStatusType,
                mediaList: [],
                mediaLocal: null,
                mediaMap: null
            }
        },
        methods: {
            hangUp() {
                this.$emit("button-click");
            },
            AddVideo() {
                let media = new Media();
                media.element = null
                media.stream = null
                this.mediaList.push(media)
            },
            computeStyle(index) {
                return ui.videoStyle(index, this.mediaList.length);
            },
            localVideoStartPlay() {
                Connector.send(Factory.groupJoin())
            },
            getLocalUserMedia() {
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    this.addUniqueMedia(stream, true);
                })
            },
            addUniqueMedia(mediaStream, isLocal) {
                console.log(mediaStream)
                // 如果没有，创建一个新的 Stream，并添加到 mediaList
                let media = this.mediaMap.get(mediaStream.id)
                if (media === undefined) {
                    console.log("[不存在]")
                    let media = new Media();
                    this.mediaMap.set(mediaStream.id, media)
                    media.stream = mediaStream;
                    this.mediaLocal = media
                    this.mediaList.push(media);
                    this.$nextTick(() => {
                        // 添加成功之后
                        let size = this.$refs.video.length;
                        media.element = this.$refs.video[size-1]
                        media.element.srcObject = mediaStream;
                        if (isLocal) {
                            media.element.onplaying = this.localVideoStartPlay;
                            console.log("[获取本地流]")
                        } else {
                            console.log("[获取远程流]")
                        }
                    })
                } else {
                    console.log("[存在]")
                    media.element.srcObject = mediaStream
                }
            },
            receivedOffer(offer) {
                let __this = this;
                let streamList = []
                let tracks = []
                this.mediaLocal.stream.getTracks().forEach(track => {
                    tracks.push(track)
                })
                let stream = new Stream(this.mediaLocal.stream, tracks);
                streamList.push(stream);
                RTCManager.createAnswer({
                    mode: RTCModeType.ROOM,
                    streams: streamList,
                    fallback: __this.receivedRemoteStream,
                    offer: offer
                })
            },
            receivedRemoteStream(mediaStream) {
                console.log(current(), '[page] - [room] - [ontrack]', mediaStream)
                console.log(current(), '[page] - [room] - [ontrack]', mediaStream.getTracks().length)
                this.addUniqueMedia(mediaStream, false)
            },
            ReceivedSignal(signal) {
                let __this = this;
                switch (signal.type) {
                    case SignalType.WEBRTC_OFFER:
                        __this.receivedOffer(signal.payload);
                        break
                    case SignalType.WEBRTC_CANDIDATE:
                        RTCManager.saveCandidate(signal.payload);
                        break
                }
            }
        },
        mounted() {
            this.getLocalUserMedia();
        },
        created() {
            pageManager.initRoomPage(new Page(this));
            this.mediaMap = new Map()
        }
    }

    function Media(element, stream) {
        this.element = element;
        this.stream = stream;
    }

</script>

<style scoped>
    .room-wrapper {
        height: 100%;
        background-color: #1e1f23;
    }

    .room-box {
        height: 100%;
        position: relative;
        background-color: #1e1f23;
    }

    .video-position {
        text-align: center;
        position: absolute;
        left: 0;
        top: 40px;
        width: 100%;
        height: calc(100% - 40px);
        background-color: #1e1f23;
    }

    .video-box {
        position: relative;
        display: inline-block;
        vertical-align: top;
        text-align: center;
    }

    .video-style {
        width: 100%;
        height: 100%;
        background-color: #101010;
        object-fit: cover;
    }

    .hang-up-button {
        position: absolute;
        display: inline-block;
        left: calc(50% - 34px);
        bottom: 40px;
    }
</style>