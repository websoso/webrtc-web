const ui = {
    info: {
        width: null,
        height: null
    },
    init: function (element) {
        this.info.width = element.offsetWidth;
        this.info.height = element.offsetHeight;
    },
    videoStyle: function (index, listLength) {
        let boxWidth = this.info.width;
        if (listLength === 1) {
            return {
                width: boxWidth + 'px',
                height: boxWidth + 'px'
            }
        } else if (listLength > 1 && listLength <= 4) {
            if (boxWidth % 2 === 0) {
                return {
                    width: boxWidth / 2 + 'px',
                    height: boxWidth / 2 + 'px'
                }
            } else {
                let itemWidth = Math.floor(boxWidth / 2);
                return {
                    width: (index % 2 === 0 ? itemWidth : itemWidth + 1) + 'px',
                    height: itemWidth + 'px'
                }
            }
        } else {
            if (boxWidth % 3 === 0) {
                return {
                    width: boxWidth / 3 + 'px',
                    height: boxWidth / 3 + 'px'
                }
            } else if (boxWidth % 3 === 1) {
                let itemWidth = Math.floor(boxWidth / 3);
                if (index % 3 === 2) {
                    return {
                        width: itemWidth + 1 + 'px',
                        height: itemWidth + 'px'
                    }
                } else {
                    return {
                        width: itemWidth + 'px',
                        height: itemWidth + 'px'
                    }
                }
            } else {
                let itemWidth = Math.floor(boxWidth / 3);
                if (index % 3 === 2) {
                    return {
                        width: itemWidth + 'px',
                        height: itemWidth + 'px'
                    }
                } else {
                    return {
                        width: itemWidth + 1 + 'px',
                        height: itemWidth + 'px'
                    }
                }
            }
        }
    }
}

export default ui