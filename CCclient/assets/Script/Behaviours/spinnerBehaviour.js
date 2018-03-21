cc.Class({
    extends: cc.Component,

    properties: {
        pointerNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.running = false;
        this.time = 0;
    },

    update(dt) {
        if (this.running == true) {
            this.time += dt;
            this.pointerNode.rotation = (this.time % 5.0) * 72;
            if (this.time >= TIME_OUT) {
                
            }
        }
    },

    startSpin() {
        this.node.active = true;
        this.running = true;
        this.time = 0;
    },

    dismiss() {
        this.node.active = false;
        this.running = false;
    }

});
