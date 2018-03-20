cc.Class({
    extends: cc.Component,

    properties: {
        inputPlayerName: {
            default: null,
            type: cc.Node
        },
        inputRoomId: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.gm = cc.find('GameManager').getComponent('GameManager');
    },

    onStartClicked () {
        var name = this.inputPlayerName.getComponent(cc.EditBox).string;
        var roomId = this.inputRoomId.getComponent(cc.EditBox).string;
        console.log(`name = ${name} roomId = ${roomId}`);
        if (name.length > 0) {
            this.gm.startSpinner();
            this.gm.emit(reqs.LOGIN, {
                name: name,
                roomId: roomId,
                method: loginMethods.FB_INST_GAMES,
                pid: Math.floor(Math.random() * 99999.0), // TODO facebook instant games uid
                avatar: "" //  TODO facebook avatar
            });
        } else {
            this.gm.toast("Please enter your name");
        }
    }

});
