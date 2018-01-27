cc.Class({
    extends: cc.Component,

    properties: {
        pointerNode: {
            default: null,
            type: cc.Node
        },
        maskNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad () {
        this.mask = this.maskNode.getComponent(cc.Sprite);
        this.node.active = false;
    },

    countDown () {
        this.mask.fillRange = 1;
        this.pointerNode.rotation = 0;
        this.time = INTERVAL;
        this.node.active = true;
    },

    update (dt) {
        if (this.time >= 0) {
            this.time -= dt;
            this.mask.fillRange = this.time / INTERVAL;
            this.pointerNode.rotation = (1 - this.mask.fillRange) * 360;
        } else {
            this.node.active = false;
        }
    }
});
