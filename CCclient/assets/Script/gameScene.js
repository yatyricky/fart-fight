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
        playerPrefab: {
            default: null,
            type: cc.Prefab
        },
        roomId: {
            default: null,
            type: cc.Node
        },
        timerNode: {
            default: null,
            type: cc.Node
        },
        localPlayerNode: {
            default: null,
            type: cc.Node
        },
        p1: {
            default: null,
            type: cc.Node
        },
        p2: {
            default: null,
            type: cc.Node
        },
        p3: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gm = cc.find('gameManager').getComponent('gameManager');
        this.roomIdUpdated = false;
        this.timer = this.timerNode.getComponent('timerBehaviour');
        this.localPlayer = this.localPlayerNode.getComponent('playerBehaviour');
        this.localPlayerBehaviour = this.localPlayerNode.getComponent('localPlayer');
        this.otherPlayers = [];
        this.otherPlayers.push(this.p1.getComponent('playerBehaviour'));
        this.otherPlayers.push(this.p2.getComponent('playerBehaviour'));
        this.otherPlayers.push(this.p3.getComponent('playerBehaviour'));
        for (let i = 0; i < this.otherPlayers.length; i++) {
            this.otherPlayers[i].node.active = false;
        }

        this.gm.setGameScene(this);
    },
    
    start () {
        this.refreshPlayers();
    },

    refreshPlayers() {
        if (this.gm.playerData != null) {
            console.log(`should update players`);
            console.table(this.gm.playerData);
            let otherIndex = 0;
            for (let i = 0; i < this.gm.playerData.length; i++) {
                const element = this.gm.playerData[i];
                let playerBehaviourObject;
                if (element.name == this.gm.localName) {
                    playerBehaviourObject = this.localPlayer;
                    this.localPlayerBehaviour.updateShockButton(element.power);
                } else {
                    playerBehaviourObject = this.otherPlayers[otherIndex++];
                    playerBehaviourObject.node.active = true;
                }
                playerBehaviourObject.setName(element.name);
                playerBehaviourObject.setAct(element.act);
                playerBehaviourObject.setState(element.state);
                playerBehaviourObject.setPower(element.power);
            }
            while (otherIndex < 3) {
                this.otherPlayers[otherIndex++].node.active = false;
            }
            this.gm.playerData = null;
        }
    },

    updateRoomNumber() {
        if (this.roomIdUpdated === false && this.gm.roomId != -1) {
            this.roomIdUpdated = true;
            this.roomId.getComponent(cc.Label).string = this.gm.roomId;
        }
    },

    update (dt) {
        this.refreshPlayers();
        this.updateRoomNumber();
    },

    runTimer() {
        this.timer.countDown();
        this.localPlayerBehaviour.blockNode.getComponent(cc.Toggle).check();
    }
});
