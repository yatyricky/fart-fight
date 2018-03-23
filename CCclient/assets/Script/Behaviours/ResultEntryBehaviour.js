cc.Class({
    extends: cc.Component,

    properties: {
        nameNode: {
            default: null,
            type: cc.Node
        },
        scoreNode: {
            default: null,
            type: cc.Node
        }
    },

    setValues(name, score) {
        this.nameNode.getComponent(cc.Label).string = name;
        this.scoreNode.getComponent(cc.Label).string = score;
    }

});
