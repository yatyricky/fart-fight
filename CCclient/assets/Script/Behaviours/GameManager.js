window.GM = null;
window.loginSceneActions = [];
window.gameSceneActions = [];

cc.Class({
    extends: cc.Component,

    properties: {
        spinnerNode: {
            default: null,
            type: cc.Node
        },
        toastNode: {
            default: null,
            type: cc.Node
        },
        backgroundMusic: {
            default: null,
            type: cc.AudioSource
        },
        soundDing: {
            url: cc.AudioClip,
            default: null
        }
    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        window.GM = this;
        this.backgroundMusic.play();
        this.spinner = this.spinnerNode.getComponent('SpinnerBehaviour');

        this.socket = io(serverURL, {
            autoConnect: false,
            transports: ["websocket"]
        });
        this.socketQueue = [];

        this.playerData = null;
        this.roomId = -1;
        this.localPid = "";
        this.localMethod = window.loginMethods.DEVICE;
        this.localName = "";
        this.localAvatar = "";

        this.gameScene = null;

        this.socket.on(recs.LINK_ESTABLISHED, (data) => {
            console.log('>> Link Established');
            // this.stopSpinner();
            while (this.socketQueue.length > 0) {
                const obj = this.socketQueue.shift();
                this.socket.emit(obj.ename, obj.payload);
            }
        });

        this.socket.on(recs.UPDATE_PLAYERS, (data) => {
            this.playerData = data;
        });

        this.socket.on(recs.LOGIN_RESULT, (data) => {
            console.log(">> login result: ");
            console.log(data);
            if (data.res == 'success') {
                console.log(`login success`);
                this.roomId = data.roomId;
                cc.director.loadScene("game", () => {
                    this.stopSpinner();
                });
            } else {
                if (data.reason == 'room is full') {
                    console.log(`room full`);
                    this.toast("Room is full");
                } else if (data.reason == 'no such room') {
                    console.log(`no such room`);
                    this.toast("No such room");
                } else if (data.reason == 'bad player') {
                    console.log(`bad player`);
                    this.toast("Please try again");
                }
                this.stopSpinner();
            }
        });

        this.socket.on(recs.RUN_TIMER, (data) => {
            window.gameSceneActions.push((scene) => {
                scene.runTimer();
            });
        });

        this.socket.on(recs.GAME_END, (data) => {
            console.log(`>>game end received`);
            window.gameSceneActions.push((scene) => {
                scene.showBattleResult(data.data);
            });
            if (typeof (FBInstant) != "undefined") {
                if (data.winner.loginMethod == this.localMethod && data.winner.pid == this.localPid) {
                    // update leaderboard for winner
                    const lb1 = FBInstant.getLeaderboardAsync(window.fbLeaderboards.TOTAL_GAMES_WON);
                    const lb1Entry = lb1.then((leaderboard) => {
                        return leaderboard.getPlayerEntryAsync();
                    }, (rejected) => {
                        console.log(rejected);
                    });
                    Promise.all([lb1, lb1Entry]).then(([leaderboard, entry]) => {
                        let win = 1;
                        if (entry != null) {
                            win += entry.getScore();
                        }
                        leaderboard.setScoreAsync(win).then(() => {
                            console.log(`${window.fbLeaderboards.TOTAL_GAMES_WON} score saved ${win}`);
                        });
                    });
                }
                // update total played
                const lb2 = FBInstant.getLeaderboardAsync(window.fbLeaderboards.TOTAL_GAMES);
                const lb2Entry = lb2.then((leaderboard) => {
                    return leaderboard.getPlayerEntryAsync();
                }, (rejected) => {
                    console.log(rejected);
                });
                Promise.all([lb2, lb2Entry]).then(([leaderboard, entry]) => {
                    let total = 1;
                    if (entry != null) {
                        total += entry.getScore();
                    }
                    leaderboard.setScoreAsync(total).then(() => {
                        console.log(`${window.fbLeaderboards.TOTAL_GAMES} score saved ${total}`);
                    });
                });
            }
        });

        this.socket.on('disconnect', () => {
            console.log('disconnected, trying to reconnect');
            this.socket.open();
        });
    },

    emit(ename, payload) {
        if (this.socket.connected == false) {
            this.startSpinner();
            this.socket.open();
            this.socketQueue.push({
                ename: ename,
                payload: payload
            });
        } else {
            this.socket.emit(ename, payload);
        }
        console.log(`emit ${ename} ${JSON.stringify(payload)}`);
    },

    setGameScene(gameScene) {
        this.gameScene = gameScene;
    },

    playerLeave() {
        this.roomId = -1;
        this.gameScene = null;
        cc.director.loadScene("login", () => {
            this.stopSpinner();
        });
        this.emit(reqs.LEAVE, {
            pid: this.localPid,
            method: this.localMethod
        });
    },

    startSpinner() {
        this.spinner.startSpin();
    },

    stopSpinner() {
        this.spinner.dismiss();
    },

    toast(message) {
        this.toastNode.getComponent("Toast").toast(message);
    },

    playSound(whichSound) {
        switch (whichSound) {
            case 'ding':
                cc.audioEngine.play(this.soundDing, false, 1);
                break;
            default:
                break;
        }
    },

    start() {
        if (typeof (FBInstant) != "undefined") {
            // Facebook Instant Games
            this.initWithFBInstant();
        }
    },

    initWithFBInstant() {
        this.localMethod = window.loginMethods.FB_INST_GAMES;
        this.localPid = FBInstant.player.getID();
        this.localName = FBInstant.player.getName();
        this.localAvatar = FBInstant.player.getPhoto();
        window.loginSceneActions.push((scene) => {
            scene.inputPlayerName.getComponent(cc.EditBox).string = this.localName;
        });
    },

    fbPlayInterstitialAd() {
        if (typeof (FBInstant) != "undefined") {
            let ad = null;
            FBInstant.getInterstitialAdAsync(window.fbAdIds.INT_END_GAME).then((interstitial) => {
                Logger.i(interstitial.getPlacementID());
                ad = interstitial;
                return interstitial.loadAsync();
            }, (rejected) => {
                Logger.i(`get ad failed`);
                Logger.i(rejected);
            }).then(() => {
                return ad.showAsync();
            }, (rejected) => {
                Logger.i(`load ad failed`);
                Logger.i(rejected);
            }).then(() => {
                Logger.i(`ad watched`);
            }, (rejected) => {
                Logger.i(`watch ad failed`);
                Logger.i(rejected);
            });
        }
    }

});
