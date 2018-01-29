cc.Class({
    extends: cc.Component,

    properties: {
        exitDialogueNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.gm = cc.find('gameManager').getComponent('gameManager');
    },

    onButtonPressed() {
        this.exitDialogueNode.active = true;
    },

    onDialogueDismiss() {
        this.exitDialogueNode.active = false;
    },

    onLeavePressed() {
        this.gm.startSpinner();
        this.gm.playerLeave();
    }

});
