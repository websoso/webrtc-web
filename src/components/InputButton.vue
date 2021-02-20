<template>
    <div class="wrapper">
        <div :class='{left: true, focus: isFocus}'>
            <label>
                <input type="text" class="content" :placeholder="defaultValue" v-model="content" @focus="handleFocus"
                       @blur="handleBlur">
            </label>
        </div>
        <div class="right" @click="clickButton">{{buttonName}}</div>
    </div>
</template>

<script>
    export default {
        name: "InputButton",
        props: ["buttonName", "defaultValue"],
        data: function () {
            return {
                isFocus: false,
                content: null,
                title: 'TITLE'
            }
        },
        methods: {
            clickButton: function () {
                if ('' === this.content) {
                    this.content = null
                }
                this.$emit("button-click", this.content);
            },
            handleFocus: function () {
                this.isFocus = true
            },
            handleBlur: function () {
                this.isFocus = false
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        text-align: left;
        display: inline-block;
        width: 300px;
    }

    .left {
        vertical-align: top;
        display: inline-block;
        width: 190px;
        height: 40px;
        background-color: #ffffff;
        border: #D0D0D0 solid 1px;
        border-radius: 5px;
        text-align: left;
    }

    .left:hover {
        border: #f17039 solid 1px;
    }

    .focus {
        border: #f17039 solid 1px;
    }

    .blur {
        border: #D0D0D0 solid 1px;
    }

    .right {
        margin-left: -5px;
        vertical-align: top;
        display: inline-block;
        width: 100px;
        height: 42px;
        border-radius: 0 5px 5px 0;
        background-color: #f17039;
        line-height: 42px;
        color: #ffffff;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .right:hover {
        background-color: #de6835;
    }

    .right:active {
        background-color: #a94e28;
    }

    .content {
        margin-left: 14px;
        -webkit-appearance: none;
        outline: none;
        vertical-align: top;
        display: inline-block;
        width: 176px;
        height: 40px;
        padding: 0;
        border: none;
        font-size: 15px;
        color: #202020;
    }

    .content::-webkit-input-placeholder {
        color: #ccc;
        font-size: 15px;
    }

    .content:-moz-placeholder {
        color: #ccc;
        font-size: 15px;
    }

    .content::-moz-placeholder {
        color: #ccc;
        font-size: 15px;
    }

    .content:-ms-input-placeholder {
        color: #ccc;
        font-size: 15px;
    }
</style>