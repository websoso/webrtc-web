<template>
    <div class="wrapper">
        <div class="common">
            <div class="common-block" @click="clickLeft">
                <div class="select">
                    <div v-if="leftSelected" class="active"></div>
                </div>
                <div class="content">{{leftName}}</div>
            </div>
        </div>
        <div class="common">
            <div class="common-block" @click="clickRight">
                <div class="select">
                    <div v-if="!leftSelected" class="active"></div>
                </div>
                <div class="content">{{rightName}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OptionButton",
        props: ["leftName", "rightName"],
        data: function () {
            return {
                leftSelected: true
            }
        },
        methods: {
            clickLeft: function () {
                if (!this.leftSelected) {
                    this.change()
                }
            },
            clickRight: function () {
                if (this.leftSelected) {
                    this.change()
                }
            },
            change: function () {
                this.leftSelected = !this.leftSelected
                this.$emit("selected-change", this.leftSelected);
            }
        }
    }
</script>

<style scoped>

    .wrapper {
        width: 280px;
        height: 40px;
        padding: 0;
        /*background-color: #62ca37;*/
        border-radius: 20px;
    }

    .common {
        display: inline-block;
        vertical-align: top;
        width: 140px;
        height: 40px;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
    }

    .common-block {
        display: inline-block;
        width: 100px;
        height: 40px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .common-block:hover {
        color: #f17039;
    }

    .select {
        margin-top: 10px;
        vertical-align: center;
        display: inline-block;
        height: 18px;
        width: 18px;
        border-radius: 10px;
        border: rgba(255, 180, 0, .5) solid 1px;
        cursor: pointer;
        background-color: white;
    }

    .active {
        height: 14px;
        width: 14px;
        background-color: #f17039;
        border-radius: 10px;
        margin-top: 2px;
        margin-left: 2px;
        cursor: pointer;
    }

    .content {
        cursor: pointer;
        vertical-align: top;
        display: inline-block;
        height: 40px;
        width: 80px;
        line-height: 40px;
        background-color: white;
        user-select: none;
    }

</style>