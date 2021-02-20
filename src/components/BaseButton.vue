<template>
    <div class="wrapper">
        <div class="button" @click="clickButton">退出</div>
    </div>
</template>

<script>
    export default {
        name: "BaseButton",
        methods: {
            clickButton: function () {
                this.$emit("button-click");
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        height: 40px;
        width: 200px;
        text-align: center;
    }
    .button {
        height: 40px;
        width: 130px;
        background-color: #f17039;
        display: inline-block;
        border-radius: 5px;
        line-height: 40px;
        text-align: center;
        color: white;
        cursor: pointer;
        user-select: none;
    }

    .button:hover {
        background-color: #de6835;
    }

    .button:active {
        background-color: #a94e28;
    }
</style>