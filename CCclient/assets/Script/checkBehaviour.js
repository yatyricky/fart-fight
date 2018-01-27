cc.Class({
    extends: cc.Component,

    properties: {
        normalNode: {
            default: null,
            type: cc.Node
        },
        checkedNode: {
            default: null,
            type: cc.Node
        },
        otherNodes: [cc.Node]
    },

    onLoad() {
        if (this.node.getComponent(cc.Toggle).isChecked == true) {
            this.normalNode.active = false;
        }
    },

    uncheck () {
        this.normalNode.active = true;
        this.checkedNode.active = false;
    },

    onChecked () {
        this.normalNode.active = false;
        for (let i = 0; i < this.otherNodes.length; i++) {
            this.otherNodes[i].getComponent('checkBehaviour').uncheck();
        }
    }

});
