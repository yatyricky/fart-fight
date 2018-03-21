cc.Class({
    extends: cc.Component,

    properties: {
        exitDialogueNode: {
            default: null,
            type: cc.Node
        }
    },

    onButtonPressed() {
        this.exitDialogueNode.active = true;
    },

    onDialogueDismiss() {
        this.exitDialogueNode.active = false;
    },

    onLeavePressed() {
        window.GM.startSpinner();
        window.GM.playerLeave();
    }

});
