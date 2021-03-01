import {RoomMutation, RoomStatusType} from "./constant";

export default {
    state: {
        room_status: 'OUT_ROOM',
        room_code: null
    },
    mutations: {
        [RoomMutation.STATUS_OUT_ROOM]: function (state) {
            state.room_status = RoomStatusType.OUT_ROOM;
        },
        [RoomMutation.STATUS_IN_ROOM]: function (state) {
            state.room_status = RoomStatusType.IN_ROOM;
        },
        [RoomMutation.ROOM_CODE]: function (state, roomCode) {
            state.room_code = roomCode;
        }
    }
}