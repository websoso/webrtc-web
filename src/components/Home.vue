<template>
    <div class="wrapper">
        <logo class="logo"></logo>
        <h2 class="title">Communication with webrtc</h2>
        <div class="content-box">
            <div v-if="!$store.state.online">
                <input-button class="content-item" default-value="用户名" button-name="登录"
                              @button-click="login"></input-button>
            </div>
            <div v-if="$store.state.online">
                <input-button v-if="currentCall" class="content-item" default-value="请输入用户名" button-name="呼叫"
                              @button-click="call" :key="key"></input-button>
                <input-button v-if="!currentCall" class="content-item" default-value="请输入房间号" button-name="进入"
                              @button-click="enter"> :key="key"
                </input-button>
                <option-button class="content-item item-next" left-name="视频通话" right-name="视频会议"
                               @selected-change="changeSelect"></option-button>
                <base-button class="logout" @button-click="logout"></base-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Logo from "./Logo";
    import InputButton from "./InputButton";
    import OptionButton from "./OptionButton";
    import BaseButton from "./BaseButton";
    import {HomeMutation} from '../store/constant'
    import Connector from "../tool/connection";
    import {current, ToastExecutor} from "../common/common";

    export default {
        name: "Home",
        components: {
            Logo, InputButton, OptionButton, BaseButton
        },
        data: function () {
            return {
                currentCall: true
            }
        },
        methods: {
            changeSelect(leftSelected) {
                this.currentCall = leftSelected;
            },
            login(username) {
                let __this = this;
                if (username == null || '' === username) {
                    ToastExecutor.show({type: 'failure', content: '用户名错误'})
                    return
                }
                Connector.init({
                    username: username,
                    success: function () {
                        __this.$store.commit(HomeMutation.LOGIN)
                        __this.$store.commit(HomeMutation.USERNAME, username)
                    },
                    failure: function (event) {
                        console.error(current(), '[连接失败]', event)
                        ToastExecutor.show({type: 'failure', content: '连接失败'})
                    }
                });
            },
            call(username) {
                if (username == null || '' === username) {
                    ToastExecutor.show({type: 'failure', content: '用户名错误'})
                    return
                }
                this.$emit("call", username);
            },
            enter(room) {
                // todo 进入检查，确保能成功才出发以下事件
                this.$emit("enter", room);
            },
            logout() {
                console.log('logout')
                this.$store.commit(HomeMutation.LOGOUT);
            }
        },
        computed: {
            // 解决相同组件切换不触发组件生命周期钩子问题
            key: function () {
                return new Date().getTime();
            }
        }
    }
</script>

<style scoped>

    .wrapper {
        text-align: center;
        color: #2c3e50;
    }

    .logo {
        display: inline-block;
        position: relative;
        margin-top: 40px;
        user-select: none;
    }

    .title {
        user-select: none;
    }

    .content-box {
        margin-top: 54px;
    }

    .content-item {
        display: inline-block;
    }

    .item-next {
        margin-top: 16px;
    }

    .logout {
        margin-top: 160px;
        display: inline-block;
    }

</style>