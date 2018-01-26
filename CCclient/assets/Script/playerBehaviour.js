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
        playerName: {
            default: null,
            type: cc.Node
        },
        playerAct: {
            default: null,
            type: cc.Node
        },
        waitNode: {
            default: null,
            type: cc.Node
        },
        readyNode: {
            default: null,
            type: cc.Node
        },
        playNode: {
            default: null,
            type: cc.Node
        },
        diedNode: {
            default: null,
            type: cc.Node
        },
        p1Node: {
            default: null,
            type: cc.Node
        },
        p2Node: {
            default: null,
            type: cc.Node
        },
        p3Node: {
            default: null,
            type: cc.Node
        },
        p4Node: {
            default: null,
            type: cc.Node
        },
        p5Node: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gm = cc.find('gameManager').getComponent('gameManager');
        this.powerNodes = [];
        this.powerNodes.push(this.p1Node);
        this.powerNodes.push(this.p2Node);
        this.powerNodes.push(this.p3Node);
        this.powerNodes.push(this.p4Node);
        this.powerNodes.push(this.p5Node);
    },

    setName (val) {
        this.playerName.getComponent(cc.Label).string = val;
    },

    setAct(val) {
        let act = "";
        switch (val) {
            case 'charge':
                act = '酝酿';
                break;
            case 'shock':
                act = '放屁';
                break;
            case 'block':
                act = '憋气';
                break;
            case 'nuke':
                act = '大臭屁';
                break;
            default:
                break;
        }
        this.playerAct.getComponent(cc.Label).string = act;
    },

    setState(state) {
        switch (state) {
            case 'wait':
                this.readyNode.active = false;
                this.playNode.active = false;
                this.diedNode.active = false;
                this.waitNode.active = true;
                break;
            case 'ready':
                this.waitNode.active = false;
                this.playNode.active = false;
                this.diedNode.active = false;
                this.readyNode.active = true;
                break;
            case 'game':
                this.waitNode.active = false;
                this.readyNode.active = false;
                this.diedNode.active = false;
                this.playNode.active = true;
                break;
            case 'died':
                this.waitNode.active = false;
                this.readyNode.active = false;
                this.playNode.active = false;
                this.diedNode.active = true;
                break;
            default:
                break;
        }
    },

    setPower(val) {
        let i = 0;
        while (i < val) {
            this.powerNodes[i++].active = true;
        }
        while (i < 5) {
            this.powerNodes[i++].active = false;
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
        this.gm.emit(reqs.SHOCK, this.gm.localName);
    },

    onBlockClicked () {
        console.log(`clicked Block`);
        this.gm.emit(reqs.BLOCK, this.gm.localName);
    },

    onNukeClicked () {
        console.log(`clicked Nuke`);
        this.gm.emit(reqs.NUKE, this.gm.localName);
    }

});
