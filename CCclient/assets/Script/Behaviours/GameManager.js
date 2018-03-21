window.GM = null;

cc.Class({
    extends: cc.Component,

    properties: {
        spinnerNode: {
            default: null,
            type: cc.Node
        },
        toastNode: {
            default: null,
            type: cc.Node
        },
        backgroundMusic: {
            default: null,
            type: cc.AudioSource
        },
        soundDing: {
            url: cc.AudioClip,
            default: null
        }
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        window.GM = this;
        this.backgroundMusic.play();
        this.spinner = this.spinnerNode.getComponent('spinnerBehaviour');
        
        this.socket = io(serverURL, {
            autoConnect: false,
            transports: ["websocket"]
        });
        this.playerData = null;
        this.roomId = -1;
        this.localPid = "";
        this.localMethod = "";
        this.localName = "";

        this.gameScene = null;

        this.socket.on(recs.LINK_ESTABLISHED, (data) => {
            console.log('>> Link Established');
            this.stopSpinner();
        });

        this.socket.on(recs.UPDATE_PLAYERS, (data) => {
            this.playerData = data;
        });

        this.socket.on(recs.LOGIN_RESULT, (data) => {
            console.log(">> login result: ");
            console.log(data);
            if (data.res == 'success') {
                console.log(`login success`);
                this.roomId = data.roomId;
                cc.director.loadScene("game", () => {
                    this.stopSpinner();
                });
            } else {
                if (data.reason == 'room is full') {
                    console.log(`room full`);
                    this.toast("Room is full");
                } else if (data.reason == 'no such room') {
                    console.log(`no such room`);
                    this.toast("No such room");
                }
                this.stopSpinner();
            }
        });

        this.socket.on(recs.RUN_TIMER, (data) => {
            if (this.gameScene != null) {
                this.gameScene.runTimer();
            }
        });

        this.socket.on(recs.GAME_END, (data) => {
            console.log(`>>game end received`);
            if (this.gameScene != null) {
                this.gameScene.showBattleResult(data);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('disconnected, trying to reconnect');
            this.socket.open();
        });
    },

    emit (ename, payload) {
        if (this.socket.connected == false) {
            this.socket.open();
            console.log('socket open');
            
        }
        console.log(`emit ${ename} ${JSON.stringify(payload)}`);
        this.socket.emit(ename, payload);
    },

    setGameScene (gameScene) {
        this.gameScene = gameScene;
    },

    playerLeave() {
        this.roomId = -1;
        this.gameScene = null;
        cc.director.loadScene("login", () => {
            this.stopSpinner();
        });
        this.emit(reqs.LEAVE, {
            pid: this.localPid,
            method: this.localMethod
        });
    },

    startSpinner() {
        this.spinner.startSpin();
    },

    stopSpinner() {
        this.spinner.dismiss();
    },

    toast(message) {
        this.toastNode.getComponent("Toast").toast(message);
    },

    playSound(whichSound) {
        switch (whichSound) {
            case 'ding':
                cc.audioEngine.play(this.soundDing, false, 1);
                break;
            default:
                break;
        }
    }

});
