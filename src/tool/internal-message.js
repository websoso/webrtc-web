import {UUID} from "../common/common";

const MESSAGE_MAX_LENGTH = 1024 * 3;

export function InternalMessage({code, count, order, payload}) {

    this.code = code;

    this.count = count;
    this.order = order;
    this.payload = payload;

    this.jsonStr = function () {
        return JSON.stringify(this);
    }

}

export function Collection({code, count}) {

    this.code = code;
    this.count = count;
    this.messageList = [];
    let __this = this;

    this.add = function (internalMessage) {
        __this.messageList[internalMessage.order - 1] = internalMessage;
        let completed = true;
        for (let i = 0; i < __this.messageList.length; i++) {
            if (__this.messageList[i] === null) {
                completed = false;
            }
        }
        return completed;
    }

}

export function Converter() {

    this.encode = function (message) {
        let messageJsonString = message.jsonStr();
        let length = messageJsonString.length;
        let messagePayloadList = [];
        let count;
        let code = UUID();
        if (length <= MESSAGE_MAX_LENGTH) {
            messagePayloadList.push(messageJsonString)
        } else {
            count = Math.ceil(length / MESSAGE_MAX_LENGTH);
            for (let i = 1; i <= count; i++) {
                let from = (i - 1) * MESSAGE_MAX_LENGTH;
                messagePayloadList.push(messageJsonString.substr(from, MESSAGE_MAX_LENGTH))
            }
        }
        let collection = new Collection({code, count});
        for (let i = 1; i <= messagePayloadList.length; i++) {
            let internalMessage = new InternalMessage({
                code, count,
                order: i,
                payload: messagePayloadList[i - 1]
            });
            collection.messageList.push(internalMessage);
        }
        return collection;
    }

    this.decode = function (internalMessage) {
        let collection = this.receivedMap.get(internalMessage.code);
        let completed;
        if (collection === undefined) {
            collection = new Collection({
                code: internalMessage.code,
                count: internalMessage.count
            })
            for (let i = 0; i < internalMessage.count; i++) {
                collection.messageList.push(null);
            }
            completed = collection.add(internalMessage);
            this.receivedMap.set(internalMessage.code, collection)
        } else {
            completed = collection.add(internalMessage);
        }
        if (completed) {
            this.receivedMap.delete(internalMessage.code)
            this.complete(collection);
        }
    }

    this.receivedMap = new Map();

    this.complete = function (collection) {
        let messageJsonString = '';
        for (let i = 0; i < collection.messageList.length; i++) {
            messageJsonString += collection.messageList[i].payload;
        }
        if (this.completed != null) {
            this.completed(messageJsonString);
        }
    };

    this.completed = null;

}