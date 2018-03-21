cc.Class({
    extends: cc.Component,

    properties: {
        chargeNode: {
            default: null,
            type: cc.Node
        },
        shockNode: {
            default: null,
            type: cc.Node
        },
        blockNode: {
            default: null,
            type: cc.Node
        }
    },

    updateShockButton(power) {
        let checkBehaviour = this.shockNode.getComponent('CheckBehaviour');
        if (power >= NUKE_POWER) {
            checkBehaviour.textLabel.getComponent(cc.Label).string = "HUGE STINKY\nFART";
        } else {
            checkBehaviour.textLabel.getComponent(cc.Label).string = "FART";
        }
    },

    onReadyClicked () {
        console.log(`clicked ready`);
        window.GM.emit(reqs.READY, {
            pid: window.GM.localPid,
            method: window.GM.localMethod
        });
    },

    onChargeClicked () {
        console.log(`clicked Charge`);
        window.GM.emit(reqs.CHARGE, {
            pid: window.GM.localPid,
            method: window.GM.localMethod
        });
    },

    onShockClicked () {
        console.log(`clicked Shock`);
        const playerBehaviour = this.node.getComponent('PlayerBehaviour');
        if (playerBehaviour.power == 0) {
            console.log(`but not enough power, block checked instead`);
            this.scheduleOnce(function() {
                this.blockNode.getComponent(cc.Toggle).check();
            }, 0.3);
        } else if (playerBehaviour.power >= NUKE_POWER) {
            window.GM.emit(reqs.NUKE, {
                pid: window.GM.localPid,
                method: window.GM.localMethod
            });
        } else {
            window.GM.emit(reqs.SHOCK, {
                pid: window.GM.localPid,
                method: window.GM.localMethod
            });
        }
    },

    onBlockClicked () {
        console.log(`clicked Block`);
        window.GM.emit(reqs.BLOCK, {
            pid: window.GM.localPid,
            method: window.GM.localMethod
        });
    }

});
