cc.Class({
    extends: cc.Component,

    properties: {
        spinnerNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.spinner = this.spinnerNode.getComponent('spinnerBehaviour');
        
        this.socket = io(serverURL, {
            autoConnect: false
        });
        this.playerData = null;
        this.roomId = -1;
        this.localName = "";

        this.gameScene = null;

        this.socket.on(recs.CORRECT_NAME, (data) => {
            this.localName = data;
        });

        this.socket.on(recs.UPDATE_PLAYERS, (data) => {
            this.playerData = data;
        });

        this.socket.on(recs.LOGIN_RESULT, (data) => {
            if (data.res == 'success') {
                console.log(`login success`);
                this.roomId = data.roomId;
                cc.director.loadScene("game", () => {
                    this.stopSpinner();
                });
            } else {
                if (data.reason == 'room is full') {
                    console.log(`room full`);

                } else if (data.reason == 'no such room') {
                    console.log(`no such room`);
                }
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
        }
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
        this.emit(reqs.LEAVE, this.localName);
    },

    startSpinner() {
        this.spinner.startSpin();
    },

    stopSpinner() {
        this.spinner.dismiss();
    }

});
