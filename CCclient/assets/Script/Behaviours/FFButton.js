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
        }
    },

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onKeyPressed, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onKeyReleased, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onKeyReleased, this);
    },

    onKeyPressed(e) {
        cc.audioEngine.play(this.sound, false, 1);
        if (this.textLabel != null) {
            this.textLabel.x += 3;
            this.textLabel.y -= 13;
        }
    },

    onKeyReleased(e) {
        if (this.textLabel != null) {
            this.textLabel.x = 3;
            this.textLabel.y = 10;
        }
    }
});
