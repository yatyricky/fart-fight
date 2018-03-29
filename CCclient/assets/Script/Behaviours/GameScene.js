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
        battleResultNode: {
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
        faceReady: {
            default: null,
            type: cc.SpriteFrame
        },
        faceDied: {
            default: null,
            type: cc.SpriteFrame
        },
        faceCharge: {
            default: null,
            type: cc.SpriteFrame
        },
        faceShock: {
            default: null,
            type: cc.SpriteFrame
        },
        faceBlock: {
            default: null,
            type: cc.SpriteFrame
        },
        faceNuke: {
            default: null,
            type: cc.SpriteFrame
        },
        tipsShare: {
            default: null,
            type: cc.Node
        }
    },

    onLoad () {
        this.roomIdUpdated = false;
        this.timer = this.timerNode.getComponent('timerBehaviour');
        this.localPlayer = this.localPlayerNode.getComponent('PlayerBehaviour');
        this.localPlayerBehaviour = this.localPlayerNode.getComponent('LocalPlayer');
        this.otherPlayers = [];
        this.otherPlayers.push(this.p1.getComponent('PlayerBehaviour'));
        this.otherPlayers.push(this.p2.getComponent('PlayerBehaviour'));
        this.otherPlayers.push(this.p3.getComponent('PlayerBehaviour'));
        for (let i = 0; i < this.otherPlayers.length; i++) {
            this.otherPlayers[i].node.active = false;
        }

        window.GM.setGameScene(this);
        this.inGamePlayers = 1;
    },
    
    start () {
        this.refreshPlayers();
    },

    refreshPlayers() {
        if (window.GM.playerData != null) {
            console.log(`should update players`);
            console.table(window.GM.playerData.data);
            this.inGamePlayers = window.GM.playerData.data.length;
            let otherIndex = 0;
            for (let i = 0; i < window.GM.playerData.data.length; i++) {
                const element = window.GM.playerData.data[i];
                let playerBehaviourObject;
                if (element.pid == window.GM.localPid && element.loginMethod == window.GM.localMethod) {
                    playerBehaviourObject = this.localPlayer;
                    this.localPlayerBehaviour.updateShockButton(element.power);
                } else {
                    playerBehaviourObject = this.otherPlayers[otherIndex++];
                    if (playerBehaviourObject.node.active == false) {
                        window.GM.playSound('ding');
                    }
                    playerBehaviourObject.node.active = true;
                }
                playerBehaviourObject.setName(element.name);
                playerBehaviourObject.setPower(element.power);
                playerBehaviourObject.setAct(element.act);
                playerBehaviourObject.setState(element.state);
                playerBehaviourObject.setAvatar(element.avatar);
            }
            while (otherIndex < 3) {
                this.otherPlayers[otherIndex++].node.active = false;
            }
            window.GM.playerData = null;
        }
    },

    updateRoomNumber() {
        if (this.roomIdUpdated === false && window.GM.roomId != -1) {
            this.roomIdUpdated = true;
            this.roomId.getComponent(cc.Label).string = window.GM.roomId;
        }
    },

    update (dt) {
        this.refreshPlayers();
        this.updateRoomNumber();
        
        while (window.gameSceneActions.length > 0) {
            window.gameSceneActions.shift()(this);
        }

        // prompt to invite friends
        if (this.inGamePlayers == 1) {
            this.tipsShare.getComponent('TipsShare').show();
        } else if (this.inGamePlayers > 1) {
            this.tipsShare.getComponent('TipsShare').dismiss();
        }
    },

    runTimer() {
        this.timer.countDown();
        this.localPlayerBehaviour.blockNode.getComponent(cc.Toggle).check();
        this.localPlayerBehaviour.blockNode.getComponent('CheckBehaviour').onChecked();
    },

    showBattleResult(data) {
        this.battleResultNode.getComponent('BattleResultBehaviour').show(data);
    }
});
