<template>
    <div id="app" class="app-view" ref="wrapper">
        <home class="home" @call="call" @enter="enter"></home>
        <transition name="fade">
            <direct class="direct" v-if="directShow" @button-click="hideDirect"></direct>
        </transition>
        <transition name="fade">
            <room class="room" v-if="roomShow" @button-click="hideRoom"></room>
        </transition>
        <toast :toast="$store.state.toast.data"></toast>
    </div>
</template>

<script>
    import ui from './common/ui'
    import Home from "./components/Home";
    import Direct from "./components/Direct";
    import Room from "./components/Room";
    import {HomeMutation, DirectMutation, RoomMutation, ModeType} from "./store/constant";
    import {Page, pageManager} from "./tool/page";
    import Toast from "./components/Toast";
    import Connector from "./tool/connection";
    import {Factory} from "./tool/message";

    export default {
        name: 'App',
        data: function () {
            return {
                directShow: false,
                roomShow: false
            }
        },
        components: {
            Home, Direct, Room, Toast
        },
        created() {
            pageManager.initVuePage(new Page(this));
        },
        mounted() {
            ui.init(this.$refs.wrapper);
        },
        methods: {
            hideDirect: function () {
                this.directShow = false
            },
            hideRoom: function () {
                this.roomShow = false
            },
            call: function (username) {
                this.$store.commit(HomeMutation.WEBRTC_MODE, ModeType.WEBRTC_DIRECT);
                this.$store.commit(DirectMutation.USERNAME, username);
                pageManager.vuePage.openDirect(DirectMutation.STATUS_OFFER);
                Connector.send(Factory.directOffer())
            },
            enter: function (room) {
                this.$store.commit(HomeMutation.WEBRTC_MODE, ModeType.WEBRTC_ROOM);
                this.$store.commit(RoomMutation.ROOM_CODE, room);
                pageManager.vuePage.openRoom(RoomMutation.STATUS_IN_ROOM);
            },
            ShowDirect(show) {
                this.directShow = show
            },
            ShowRoom(show) {
                this.roomShow = show
            }
        }
    }
</script>

<style>
    html {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    body {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
        padding: 0;
        text-align: center;
        background-color: antiquewhite;
        height: 100%;
        width: 100%;
    }

    #app {
        display: inline-block;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        background-color: #ffffff;
        color: #2c3e50;
        margin: 0;
        position: relative;
    }

    /* 超视口 */
    @media screen and (min-width: 414px) {
        .app-view, .home, .direct, .room {
            position: absolute;
            height: 736px;
            width: 414px;
        }
    }

    /* 全视口 */
    @media screen and (max-width: 414px) {
        .app-view, .home, .direct, .room {
            position: absolute;
            height: 100vh;
            width: 100vw;
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

</style>
