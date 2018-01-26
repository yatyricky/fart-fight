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
        this.gm = cc.find('gameManager').getComponent('gameManager');
    },

    onStartClicked () {
        var name = this.inputPlayerName.getComponent(cc.EditBox).string;
        var roomId = this.inputRoomId.getComponent(cc.EditBox).string;
        console.log(`name = ${name} roomId = ${roomId}`);
        if (name.length > 0) {
            this.gm.emit(reqs.LOGIN, {
                name: name,
                roomId: roomId
            });
        } else {
            // toast 
            // please enter name
        }
    }

});
