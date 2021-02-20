import {DirectMutation, DirectStatusType} from "./constant";

export default {
    state: {
        direct_status: 'NONE',
        direct_username: null
    },
    mutations: {
        [DirectMutation.STATUS_NONE]: function (state) {
            state.direct_status = DirectStatusType.NONE;
        },
        [DirectMutation.STATUS_OFFER]: function (state) {
            state.direct_status = DirectStatusType.OFFER;
        },
        [DirectMutation.STATUS_ANSWER]: function (state) {
            state.direct_status = DirectStatusType.ANSWER;
        },
        [DirectMutation.STATUS_ONGOING]: function (state) {
            state.direct_status = DirectStatusType.ONGOING;
        },
        [DirectMutation.USERNAME]: function (state, username) {
            state.direct_username = username;
        }
    }
}