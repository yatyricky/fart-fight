cc.Class({
    extends: cc.Component,

    properties: {
        textLabel: {
            default: null,
            type: cc.Node
        }
    },

    toast(message) {
        // -710 -> -250
        this.textLabel.getComponent(cc.Label).string = message;
        this.node.y = -710;
        this.node.active = true;
        const moveIn = cc.moveTo(1, cc.p(0, -250)).easing(cc.easeExponentialOut(1));
        const delay = cc.delayTime(2.5);
        const moveOut = cc.moveTo(0.6, cc.p(0, -710)).easing(cc.easeExponentialOut(0.6));
        this.node.runAction(cc.sequence(moveIn, delay, moveOut));
    },

    onClicked() {
        this.node.active = false;
    }

});
