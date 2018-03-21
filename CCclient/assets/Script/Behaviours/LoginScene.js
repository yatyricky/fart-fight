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
        },
        helpPage: {
            default: null,
            type: cc.Node
        }
    },

    start () {
        if (window.GM != null) {
            this.inputPlayerName.getComponent(cc.EditBox).string = window.GM.localName;
        }
    },

    onStartClicked () {
        const name = this.inputPlayerName.getComponent(cc.EditBox).string;
        const roomId = this.inputRoomId.getComponent(cc.EditBox).string;
        const loginMethod = loginMethods.FB_INST_GAMES; // TODO hard code
        const playerId = Math.floor(Math.random() * 99999.0); // TODO facebook instant games uid
        console.log(`name = ${name} roomId = ${roomId}`);
        if (name.length > 0) {
            window.GM.startSpinner();
            window.GM.emit(reqs.LOGIN, {
                name: name,
                roomId: roomId,
                method: loginMethod,
                pid: playerId,
                avatar: "" //  TODO facebook avatar
            });

            window.GM.localMethod = loginMethod;
            window.GM.localPid = playerId;
            window.GM.localName = name;
        } else {
            window.GM.toast("Please enter your name");
        }
    },

    onHelpClicked() {
        this.helpPage.active = true;
    },

    onHelpDismiss() {
        this.helpPage.active = false;
    }

});
