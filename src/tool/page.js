import store from "../store";

export function Page(obj) {

    this.__vuePage = obj
    let __this = this;

    // [vue page]
    this.openDirect = function (directMutation) {
        store.commit(directMutation);
        __this.__vuePage.ShowDirect(true)
    }

    // [vue page]
    this.closeDirect = function () {
        __this.__vuePage.ShowDirect(false)
    }

    // [direct page] [room page]
    this.closePage = function () {
        __this.__vuePage.ClosePage()
    }

    this.receivedMessage = function (message) {
        __this.__vuePage.ReceivedMessage(message)
    }

    this.receivedSignal = function (signal) {
        __this.__vuePage.ReceivedSignal(signal)
    }

    this.openRoom = function (roomMutation) {
        store.commit(roomMutation);
        __this.__vuePage.ShowRoom(true)
    }

    this.closeRoom = function () {
        __this.__vuePage.ShowRoom(false)
    }

    this.directConnected = function () {
        __this.__vuePage.DirectConnected()
    }

}

export const pageManager = {

    vuePage: null,
    directPage: null,
    roomPage: null,

    initVuePage: function (page) {
        this.vuePage = page
    },
    initDirectPage: function (page) {
        this.directPage = page
    },
    initRoomPage: function (page) {
        this.roomPage = page
    },
    closeDirectPage: function () {
        if (this.directPage != null) {
            this.directPage.closePage();
        }
        if (this.vuePage != null) {
            this.vuePage.closeDirect();
        }
    }

}