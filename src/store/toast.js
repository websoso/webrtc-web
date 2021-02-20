import {ToastMutation} from './constant'

export default {
    state: {
        data: {
            type: 'failure', // success/failure
            content: '失败',
            show: false
        }
    },
    mutations: {
        [ToastMutation.DO_TYPE]: function (state, type) {
            state.data.type = type;
        },
        [ToastMutation.DO_CONTENT]: function (state, content) {
            state.data.content = content;
        },
        [ToastMutation.DO_SHOW]: function (state, show) {
            state.data.show = show;
        }
    }
}