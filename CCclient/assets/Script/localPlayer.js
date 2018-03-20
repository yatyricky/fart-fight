// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

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
        },
        shockNormalSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        shockPressedSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        nukeNormalSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        nukePressedSprite: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    onLoad () {
        this.gm = cc.find('GameManager').getComponent('GameManager');
    },

    updateShockButton(power) {
        let checkBehaviour = this.shockNode.getComponent('checkBehaviour');
        if (power >= NUKE_POWER) {
            checkBehaviour.normalNode.getComponent(cc.Sprite).spriteFrame = this.nukeNormalSprite;
            checkBehaviour.checkedNode.getComponent(cc.Sprite).spriteFrame = this.nukePressedSprite;
        } else {
            checkBehaviour.normalNode.getComponent(cc.Sprite).spriteFrame = this.shockNormalSprite;
            checkBehaviour.checkedNode.getComponent(cc.Sprite).spriteFrame = this.shockPressedSprite;
        }
    },

    onReadyClicked () {
        console.log(`clicked ready`);
        this.gm.emit(reqs.READY, this.gm.localName);
    },

    onChargeClicked () {
        console.log(`clicked Charge`);
        this.gm.emit(reqs.CHARGE, this.gm.localName);
    },

    onShockClicked () {
        console.log(`clicked Shock`);
        const playerBehaviour = this.node.getComponent('playerBehaviour');
        if (playerBehaviour.power == 0) {
            console.log(`but not enough power, block checked instead`);
            this.scheduleOnce(function() {
                this.blockNode.getComponent(cc.Toggle).check();
            }, 0.3);
        } else if (playerBehaviour.power >= NUKE_POWER) {
            this.gm.emit(reqs.NUKE, this.gm.localName);
        } else {
            this.gm.emit(reqs.SHOCK, this.gm.localName);
        }
    },

    onBlockClicked () {
        console.log(`clicked Block`);
        this.gm.emit(reqs.BLOCK, this.gm.localName);
    }

});
