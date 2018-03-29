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
            FBInstant.matchPlayerAsync(null, true).then(() => {
                const roomId = FBInstant.context.getID();
                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    cta: 'Play',
                    image: window.shareIcon,
                    text: "",
                    template: 'play_turn',
                    data: { myReplayData: '123' },
                    strategy: 'IMMEDIATE',
                    notification: 'NO_PUSH',
                }, (rejected) => {
                    Logger.i(rejected);
                });
                window.GM.playerSwitch(roomId);
            }, (rejected) => {
                window.GM.toast("Unable to find a match, please share this game to your friends and play :)");
                window.GM.stopSpinner();
                window.GM.fbIgnoreMatch = true;
            });
            window.GM.startSpinner();
        }
    }

});
