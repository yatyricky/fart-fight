cc.Class({
    extends: cc.Component,

    properties: {
        showTipsRunning: false
    },

    show() {
        if (this.showTipsRunning == false && this.node.active == false) {
            this.scheduleOnce(this.showTips, window.TIPS_SHARE_TIMEOUT);
            this.showTipsRunning = true;
        }
    },

    dismiss() {
        this.node.active = false;
        if (this.showTipsRunning == true) {
            this.unschedule(this.showTips);
            this.showTipsRunning = false;
        }
    },

    showTips() {
        this.node.active = true;
        this.showTipsRunning = false;
    },

    onShareButtonClicked() {
        if (typeof FBInstant != "undefined") {
            console.log(FBInstant.context.getID());
            
            FBInstant.context.chooseAsync().then(() => {
                console.log(FBInstant.context.getID());
            });
        }
    }

});
