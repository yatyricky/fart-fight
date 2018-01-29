cc.Class({
    extends: cc.Component,

    properties: {
        playerNameNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.gm = cc.find('gameManager').getComponent('gameManager');
        this.playerNameEditBox = this.playerNameNode.getComponent(cc.EditBox);
    },

    start () {
        this.playerNameEditBox.string = this.gm.localName;
    }

});
