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
        playerFace: {
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
        avatarImage: {
            default: null,
            type: cc.Sprite
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
        gameSceneNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.powerNodes = [];
        this.powerNodes.push(this.p1Node);
        this.powerNodes.push(this.p2Node);
        this.powerNodes.push(this.p3Node);
        this.powerNodes.push(this.p4Node);
        this.powerNodes.push(this.p5Node);

        this.power = 0;
        this.actFace = null;
        this.currentAvatar = "";
    },

    setName(val) {
        this.playerName.getComponent(cc.Label).string = val;
    },

    setAct(val) {
        this.actFace = val;
        let act = "";
        switch (val) {
            case 'charge':
                act = 'HOLD IN FART';
                break;
            case 'shock':
                act = 'FART';
                break;
            case 'block':
                act = 'HOLD BREATH';
                break;
            case 'nuke':
                act = 'HUGE STINKY FART';
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

        // set face
        const faceSprite = this.playerFace.getComponent(cc.Sprite);
        const gameSceneBehaviour = this.gameSceneNode.getComponent('GameScene');
        if (state == 'wait' || state == 'ready') {
            faceSprite.spriteFrame = gameSceneBehaviour.faceReady;
        } else if (state == 'died') {
            faceSprite.spriteFrame = gameSceneBehaviour.faceDied;
        } else {
            if (this.actFace == 'charge') {
                faceSprite.spriteFrame = gameSceneBehaviour.faceCharge;
            } else if (this.actFace == 'shock') {
                faceSprite.spriteFrame = gameSceneBehaviour.faceShock;
            } else if (this.actFace == 'block') {
                faceSprite.spriteFrame = gameSceneBehaviour.faceBlock;
            } else if (this.actFace == 'nuke') {
                faceSprite.spriteFrame = gameSceneBehaviour.faceNuke;
            } else {
                faceSprite.spriteFrame = gameSceneBehaviour.faceReady;
            }
        }
    },

    setPower(val) {
        this.power = val;
        let i = 0;
        while (i < val && i < NUKE_POWER) {
            this.powerNodes[i++].active = true;
        }
        while (i < NUKE_POWER) {
            this.powerNodes[i++].active = false;
        }
    },

    setAvatar(url) {
        if (url != "" && this.currentAvatar != url) {
            console.log(`start to load img`);
            this.currentAvatar = url;
            cc.loader.load(url, (err, tex) => {
                if (err) {
                    this.currentAvatar = "";
                } else {
                    this.avatarImage.spriteFrame.setTexture(tex);
                }
            });
        }
    }

});
