cc.Class({
    extends: cc.Component,

    properties: {
        inputRoomIdNode: {
            default: null,
            type: cc.Node
        },
        roomIdField: {
            default: null,
            type: cc.Node
        },
        checkAutoMatchNode: {
            default: null,
            type: cc.Node
        }
    },

    onClick() {
        const toggle = this.node.getComponent(cc.Toggle);
        if (toggle.isChecked) {
            this.inputRoomIdNode.active = false;
            this.checkAutoMatchNode.runAction(cc.moveTo(0.3, cc.p(0, -30)));
            this.roomIdField.getComponent(cc.EditBox).string = "";
        } else {
            this.inputRoomIdNode.active = true;
            this.checkAutoMatchNode.runAction(cc.moveTo(0.3, cc.p(0, -160)));
        }
    }

});
