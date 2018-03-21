cc.Class({
    extends: cc.Component,

    properties: {
        textLabel: {
            default: null,
            type: cc.Node
        },
        sound: {
            url: cc.AudioClip,
            default: null
        },
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
        this.textLabel.x = 0;
        this.textLabel.y = 8;
    },

    onChecked () {
        this.normalNode.active = false;
        this.checkedNode.active = true;
        cc.audioEngine.play(this.sound, false, 1);
        this.textLabel.x = 3;
        this.textLabel.y = -5;
        for (let i = 0; i < this.otherNodes.length; i++) {
            this.otherNodes[i].getComponent('CheckBehaviour').uncheck();
        }
    }

});
