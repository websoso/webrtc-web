<template>
    <div class="toast-wrapper" ref="toastWrapper">
        <transition name="fade">
            <div v-if="toast.show" class="toast-box">
                <div class="toast-image-box">
                    <img class="toast-image" alt="Toast logo" :src="src">
                </div>
                <div class="toast-content-box">
                    {{toast.content}}
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

    export default {
        name: "Toast",
        props: ['toast'],
        data: function () {
            return {
                dd: ''
            }
        },
        computed: {
            src: function () {
                return require('../static/' + this.toast.type + '.png')
            }
        }
    }
</script>

<style scoped>

    .toast-wrapper {
        position: absolute;
        z-index: 998;
    }

    .toast-box {
        position: absolute;
        z-index: 999;
        background-color: #1e1f23;
        border-radius: 6px;
        text-align: center;
    }

    .toast-image-box {
        display: inline-block;
    }

    .toast-image {
        display: inline-block;
    }

    /* 超视口 */
    @media screen and (min-width: 414px) {
        .toast-wrapper {

        }

        .toast-box {
            height: 138px;
            width: 138px;
            left: 138px;
            top: 207px;
        }

        .toast-image-box {
            vertical-align: top;
            display: inline-block;
            padding: 16px 0 0 0;
            height: 78px;
            width: 138px;
        }

        .toast-image {
            width: 78px;
            height: 78px;
        }

        .toast-content-box {
            margin-top: 10px;
            vertical-align: top;
            display: inline-block;
            height: 14px;
            width: 138px;
            color: #FFFFFF;
            font-size: 14px;
            line-height: 14px;
        }
    }

    /* 全视口 */
    @media screen and (max-width: 414px) {
        .toast-wrapper {

        }

        .toast-box {
            height: 34vw;
            width: 34vw;
            left: 33vw;
            top: 50vw;
        }

        .toast-image-box {
            vertical-align: top;
            display: inline-block;
            padding: 3.86vw 0 0 0;
            height: 18.8vw;
            width: 34vw;
        }

        .toast-image {
            width: 18.8vw;
            height: 18.8vw;
        }

        .toast-content-box {
            margin-top: 2.44vw;
            vertical-align: top;
            display: inline-block;
            height: 13vw;
            width: 34vw;
            color: #FFFFFF;
            font-size: 3.38vw;
            line-height: 3.38vw;
        }
    }

</style>