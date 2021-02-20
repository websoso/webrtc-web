<template>
    <div class="circular-button-wrapper" @click="clickButton">
        <div class="image-background" :style="{backgroundColor: color}">
            <img class="icon" :src="src" alt="icon">
        </div>
        <div class="name">{{name}}</div>
    </div>
</template>

<script>
    export default {
        name: "CircularButton",
        props: ['color', 'name', 'srcName'],
        computed: {
            src: function () {
                return require('../static/' + this.srcName + '.png')
            }
        },
        methods: {
            clickButton: function () {
                this.$emit("button-click");
            }
        }
    }
</script>

<style scoped>
    .circular-button-wrapper {
        width: 68px;
        user-select: none;
    }

    .image-background {
        width: 68px;
        height: 68px;
        border-radius: 34px;
    }

    .icon {
        width: 68px;
        height: 68px;
    }

    .name {
        width: 68px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: white;
        font-size: 12px;
    }

</style>