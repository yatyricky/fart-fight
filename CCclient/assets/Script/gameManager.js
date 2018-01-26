cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {
        cc.game.addPersistRootNode(this.node);

        this.socket = io('ws://192.168.3.22:3000');
        this.playerData = null;
        this.roomId = -1;
        this.localName = "";

        this.updatePlayerCallbacks = [];

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
                cc.director.loadScene("game");
            } else {
                if (data.reason == 'room is full') {
                    console.log(`room full`);

                } else if (data.reason == 'no such room') {
                    console.log(`no such room`);
                }
            }
        });
    },

    emit (ename, payload) {
        this.socket.emit(ename, payload);
    },

});
