import Paho from '../lib/paho-mqtt'
import {current} from '../common/common'
import store from "../store";
import {ModeType} from "../store/constant";
import {Converter} from "./internal-message";
import MessageHandler from './message-handler'
import SignalHandler from './signal-handler'

const option = {
    host: 'onesoso.com',
    port: 443,
    path: '/webrtc/mosquitto',
    user: 'js_client',
    password: '000000'
}

let clientInstance = null;

function PahoClient({username, success, failure}) {
    this.instance = new Paho.Client(option.host, option.port, option.path, clientId(username));
    this.converter = new Converter();
    bindEvent(this);
    let __this = this;
    this.connect = function () {
        __this.instance.connect(
            connect_option({
                success: function () {
                    __this.subscribeClientSelf();
                },
                failure: function (event) {
                    if (typeof failure === 'function') {
                        failure(event)
                    }
                }
            })
        )
    };
    this.subscribeClientSelf = function () {
        __this.instance.subscribe(topicClientUser(username), subscribe_option({
            success: function (event) {
                if (typeof success === 'function') {
                    success(event)
                }
            },
            failure: function (event) {
                if (typeof failure === 'function') {
                    failure(event)
                }
            }
        }));
    }
    this.send = function (topic, collection) {
        for (let i = 0; i < collection.messageList.length; i++) {
            __this.instance.publish(topic, collection.messageList[i].jsonStr(), 0, false);
        }
    }
}

function clientId(username) {
    let preClient = 'JS_USER_'
    return preClient + username;
}

function topicClientUser(username) {
    let preClientTopic = 'WEBRTC/USER/JS_USER_'
    return preClientTopic + username;
}

function topicServerUser() {
    return 'WEBRTC/SERVER/SFU_ENDPOINT'
}

function connect_option({success, failure}) {
    return {
        reconnect: true,
        timeout: 2,
        userName: option.user,
        password: option.password,
        useSSL: true,
        keepAliveInterval: 30,
        mqttVersion: 4,
        invocationContext: {
            firstConnection: true
        },
        onSuccess: function (event) {
            success(event);
        },
        onFailure: function (event) {
            failure(event);
        }
    }
}

function subscribe_option({success, failure}) {
    return {
        qos: 0,
        onSuccess: function (event) {
            success(event);
        },
        onFailure: function (event) {
            failure(event);
        }
    }
}

function bindEvent(client) {
    client.instance.onConnected = function (event) {
        console.log(current(), '[message-client] - [Connected]: ', event);
    }
    client.instance.onConnectionLost = function (event) {
        console.log(current(), '[message-client] - [ConnectionLost]: ', event);
    }
    client.instance.onMessageDelivered = function () {
        // console.log(current(), '[客户端监听] - [MessageDelivered]: ', event)
    }
    client.instance.onMessageArrived = function (event) {
        client.converter.decode(JSON.parse(event.payloadString))
    }
    client.converter.completed = function (jsonData) {
        let dataObj = JSON.parse(jsonData);
        console.log(current(), '[message] - [receiving] - [' + dataObj.type + ']', dataObj);
        if (dataObj.endpoint != null) {
            SignalHandler.received(dataObj)
        } else {
            MessageHandler.received(dataObj)
        }
    }
}

const Connector = {

    init: function ({username, success, failure}) {
        clientInstance = new PahoClient({username, success, failure});
        clientInstance.connect();
    },

    send: function (message) {
        if (message == null) {
            console.error('message can not be null!')
        }
        if (message.constructor.name !== 'Message' && message.constructor.name !== 'Signal') {
            console.error('message must be Message instance')
        }
        let topic = null;
        if (store.state.webrtc_mode === ModeType.WEBRTC_DIRECT) {
            topic = topicClientUser(store.state.direct.direct_username)
        }
        if (store.state.webrtc_mode === ModeType.WEBRTC_ROOM) {
            topic = topicServerUser()
        }
        if (topic != null && topic !== topicClientUser(store.state.username)) {
            let collection = clientInstance.converter.encode(message);
            clientInstance.send(topic, collection);
            console.log(current(), '[message] - [sending] - [' + message.type + ']', message)
        } else {
            console.error('topic can not be null, or can not be user self!')
        }
    }

}

export default Connector;


