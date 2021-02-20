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

    const constraints = {
        video: true, audio: true
    }

    export default {
        name: "Room",
        components: {CircularButton},
        data: function () {
            return {
                status: RoomStatusType,
                remoteList: [],
                localVideo: null
            }
        },
        computed: {
            mediaList: function () {
                let list = [];
                for (let i = 0; i < this.remoteList.length; i++) {
                    list.push(this.remoteList[i])
                }
                list.push(this.localVideo);
                this.$nextTick(() => {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i] != null) {
                            // todo 待替换为以下注释内容，以获取远程流
                            this.$refs.video[i].srcObject = this.localVideo.stream
                            // this.$refs.video[i].srcObject = list[i].stream
                        }
                    }
                })
                return list;
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
                this.remoteList.push(media)
            },
            computeStyle(index) {
                return ui.videoStyle(index, this.mediaList.length);
            },
            getLocalUserMedia() {
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    let media = new Media();
                    media.stream = stream;
                    this.localVideo = media;
                    this.$nextTick(() => {
                        // 添加成功之后
                        media.element = this.$refs.video[0]
                        media.element.srcObject = stream;
                    })
                })
            }
        },
        mounted() {
            let media = new Media('', '');
            console.log(media)
            this.getLocalUserMedia();
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