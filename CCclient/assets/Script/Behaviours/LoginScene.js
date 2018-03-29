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
        const loginMethod = window.GM.localMethod;
        let playerId = window.GM.localPid;
        const postAction = () => {
            if (name.length > 0) {
                this.startGame({
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
        };
        if (loginMethod == window.loginMethods.DEVICE) {
            playerId = Math.random().toString(36).slice(2);
            postAction();
        } else if (loginMethod == window.loginMethods.FB_INST_GAMES) {
            if (roomId == "") {
                // auto match
                if (typeof FBInstant != "undefined") {
                    if (FBInstant.context.getID() != null) {
                        roomId = FBInstant.context.getID();
                        postAction();
                    } else {
                        if (window.GM.fbIgnoreMatch == true) {
                            postAction();
                        } else {
                            FBInstant.matchPlayerAsync(null, true).then(() => {
                                roomId = FBInstant.context.getID();
                                FBInstant.updateAsync({
                                    action: 'CUSTOM',
                                    cta: 'Play',
                                    image: window.shareIcon,
                                    text: "",
                                    template: 'play_turn',
                                    data: { myReplayData: '123' },
                                    strategy: 'IMMEDIATE',
                                    notification: 'NO_PUSH',
                                }, (rejected) => {
                                    Logger.i(rejected);
                                });
                                postAction();
                            }, (rejected) => {
                                window.GM.toast("Unable to find a match, please share this game to your friends and play :)");
                                window.GM.stopSpinner();
                                window.GM.fbIgnoreMatch = true;
                            });
                            window.GM.startSpinner();
                        }
                    }
                } else {
                    window.GM.toast("Please restart the game.");
                }
            } else {
                postAction();
            }
        }
    },

    startGame(options) {
        window.GM.startSpinner();
        window.GM.emit(reqs.LOGIN, options);
    },

    onHelpClicked() {
        this.helpPage.active = true;
    },

    onHelpDismiss() {
        this.helpPage.active = false;
    },

    update(dt) {
        while (window.loginSceneActions.length > 0) {
            window.loginSceneActions.shift()(this);
        }
    },

    onShareClicked() {
        if (typeof (FBInstant) != "undefined") {
            FBInstant.shareAsync({
                intent: 'SHARE',
                image: window.shareIcon,
                text: 'Play Fart Fight with me!',
                data: { myReplayData: '123' },
            }).then(() => {
                // continue with the game.
                console.log(`share resolved`);

            }, (rejected) => {
                console.log(rejected);

            });
        }
    }

});
