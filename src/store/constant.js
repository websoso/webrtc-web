export const HomeMutation = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    USERNAME: 'USERNAME',
    WEBRTC_MODE: 'WEBRTC_MODE'
}

export const ModeType = {
    WEBRTC_DIRECT: 'WEBRTC_DIRECT',
    WEBRTC_ROOM: 'WEBRTC_ROOM'
}

export const DirectMutation = {
    STATUS_NONE: 'STATUS_NONE',
    STATUS_OFFER: 'STATUS_OFFER',
    STATUS_ANSWER: 'STATUS_ANSWER',
    STATUS_ONGOING: 'STATUS_ONGOING',
    USERNAME: 'DIRECT_USERNAME'
}

export const DirectStatusType = {
    NONE: 'NONE',
    OFFER: 'OFFER',
    ANSWER: 'ANSWER',
    ONGOING: 'ONGOING'
};

export const RoomMutation = {
    STATUS_OUT_ROOM: 'STATUS_OUT_ROOM',
    STATUS_IN_ROOM: 'STATUS_IN_ROOM',
    ROOM_CODE: 'ROOM_CODE'
}

export const RoomStatusType = {
    OUT_ROOM: 'OUT_ROOM',
    IN_ROOM: 'IN_ROOM'
}

export const ToastMutation = {
    DO_TYPE: 'DO_TYPE',
    DO_CONTENT: 'DO_CONTENT',
    DO_SHOW: 'DO_SHOW'
}