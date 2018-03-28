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

    start() {
        if (window.GM != null) {
            this.inputPlayerName.getComponent(cc.EditBox).string = window.GM.localName;
        }
    },

    onStartClicked() {
        const name = this.inputPlayerName.getComponent(cc.EditBox).string;
        let roomId = this.inputRoomId.getComponent(cc.EditBox).string;
        if (roomId == "") {
            // auto match
            if (typeof FBInstant != "undefined") {
                if (FBInstant.context.getID() != null) {
                    roomId = FBInstant.context.getID();
                }
            }
        }
        const loginMethod = window.GM.localMethod;
        let playerId = window.GM.localPid;
        if (loginMethod == window.loginMethods.DEVICE) {
            playerId = Math.random().toString(36).slice(2);
        }
        console.log(`name = ${name} roomId = ${roomId}`);
        if (name.length > 0) {
            window.GM.startSpinner();
            window.GM.emit(reqs.LOGIN, {
                name: name,
                roomId: roomId,
                method: loginMethod,
                pid: playerId,
                avatar: window.GM.localAvatar
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
    },

    update(dt) {
        while (window.loginSceneActions.length > 0) {
            window.loginSceneActions.pop()(this);
        }
    },

    onShareClicked() {
        if (typeof (FBInstant) != "undefined") {
            console.log(`FBInstant.context.getID() = ${FBInstant.context.getID()}`);
            console.log(`start to share`);
            FBInstant.shareAsync({
                intent: 'INVITE',
                image: window.shareIcon,
                text: 'X is asking for your help!',
                data: { myReplayData: '123' },
            }).then(() => {
                // continue with the game.
                console.log(`resolved`);

            }, (rejected) => {
                console.log(rejected);

            });
        }
    }

});
