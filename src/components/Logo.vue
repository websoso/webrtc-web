<template>
    <div class="wrapper">
        <img class="logo" alt="Vue logo" src="../static/logo.jpg">
        <div class="content-box">
            <div :class="{title: true, online: online}">webrtc</div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: "Logo",
        computed: {
            ...mapGetters(['online'])
        }
    }
</script>

<style scoped>
    .wrapper {
        position: relative;
        width: 200px;
        height: 200px;
    }

    .logo {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 200px;
        height: 200px;
    }

    .content-box {
        position: absolute;
        top: 63px;
        left: 44px;
        width: 106px;
        height: 82px;
    }

    .title {
        width: 106px;
        height: 82px;
        line-height: 82px;
        text-align: center;
        color: #e73835;
        font-size: 24px;
        font-weight: bold;
    }

    .status {
        margin-top: 4px;
        margin-left: 23px;
        border-radius: 2px;
        width: 60px;
        height: 4px;
    }

    .online {
        color: #62ca37;
    }

    .offline {
        background-color: #e73835;
    }
</style>