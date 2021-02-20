import Vue from 'vue'
import Vuex from 'vuex'
import {HomeMutation} from './constant'
import direct from "./direct";
import room from "./room";
import toast from './toast'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        online: false,
        username: null,
        webrtc_mode: null
    },
    mutations: {
        [HomeMutation.LOGIN]: function (state) {
            state.online = true
        },
        [HomeMutation.LOGOUT]: function (state) {
            state.online = false
        },
        [HomeMutation.USERNAME]: function (state, username) {
            state.username = username
        },
        [HomeMutation.WEBRTC_MODE]: function (state, mode) {
            state.webrtc_mode = mode
        }
    },
    getters: {
        online: function (state) {
            return state.online
        },
        username: function (state) {
            return state.username;
        }
    },
    modules: {
        direct: direct, room: room, toast: toast
    }
});

export default store;