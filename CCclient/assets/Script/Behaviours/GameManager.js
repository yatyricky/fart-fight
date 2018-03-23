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
        this.spinner = this.spinnerNode.getComponent('spinnerBehaviour');

        this.socket = io(serverURL, {
            autoConnect: false,
            transports: ["websocket"]
        });
        this.playerData = null;
        this.roomId = -1;
        this.localPid = "";
        this.localMethod = window.loginMethods.DEVICE;
        this.localName = "";
        this.localAvatar = "";

        this.gameScene = null;

        this.socket.on(recs.LINK_ESTABLISHED, (data) => {
            console.log('>> Link Established');
            this.stopSpinner();
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
                let isWinner = false;
                if (data.winner.loginMethod == this.localMethod && data.winner.pid == this.localPid) {
                    isWinner = true;
                }
                // update leaderboard for winner
                const promiseGamesWonLeaderboard = FBInstant.getLeaderboardAsync(window.fbLeaderboards.TOTAL_GAMES_WON);
                const promiseGamesWonLeaderboardEntry = promiseGamesWonLeaderboard.then((leaderboard) => {
                    return leaderboard.getPlayerEntryAsync();
                }, (rejected) => {
                    console.log(rejected);
                    this.toast(`Please report this error: NL-3`);
                });
                const promiseGamesWonLeaderboardPost = Promise.all([promiseGamesWonLeaderboard, promiseGamesWonLeaderboardEntry]).then(([leaderboard, entry]) => {
                    let win;
                    if (entry == null) {
                        win = 0;
                    } else {
                        win = entry.getScore();
                    }
                    if (isWinner) {
                        win = win + 1;
                        leaderboard.setScoreAsync(win).then(() => {
                            console.log(`${window.fbLeaderboards.TOTAL_GAMES_WON} score saved ${win}`);
                        });
                    }
                    return new Promise((resolve, reject) => {
                        resolve(win);
                    });
                });
                const promiseTotalGamesLeaderboard = FBInstant.getLeaderboardAsync(window.fbLeaderboards.TOTAL_GAMES);
                const promiseTotalGamesLeaderboardEntry = promiseTotalGamesLeaderboard.then((leaderboard) => {
                    return leaderboard.getPlayerEntryAsync();
                }, (rejected) => {
                    console.log(rejected);
                    this.toast(`Please report this error: NL-4`);
                });
                const promiseTotalGamesPost = Promise.all([promiseTotalGamesLeaderboard, promiseTotalGamesLeaderboardEntry]).then(([leaderboard, entry]) => {
                    let total;
                    if (entry == null) {
                        total = 0;
                    } else {
                        total = entry.getScore();
                    }
                    total = total + 1;
                    leaderboard.setScoreAsync(total).then(() => {
                        console.log(`${window.fbLeaderboards.TOTAL_GAMES} score saved ${total}`);
                    });
                    return new Promise((resolve, reject) => {
                        resolve(total);
                    })
                });
                Promise.all([promiseGamesWonLeaderboardPost, promiseTotalGamesPost]).then(([win, total]) => {
                    FBInstant.getLeaderboardAsync(window.fbLeaderboards.WIN_RATE).then((leaderboard) => {
                        const rate = Math.floor(win / total * 10000);
                        console.log(`win = ${win} total = ${total}`);
                        leaderboard.setScoreAsync(rate).then(() => {
                            console.log(`${window.fbLeaderboards.WIN_RATE} score saved ${rate}`);
                        }, (rejected) => {
                            console.log(`${window.fbLeaderboards.WIN_RATE} faled, rate = ${rate}`);
                            console.log(rejected);
                        });
                    }).catch((rejected) => {
                        console.log(rejected);
                        this.toast(`Please report this error: NL-2`);
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
            this.socket.open();
            console.log('socket open');

        }
        console.log(`emit ${ename} ${JSON.stringify(payload)}`);
        this.socket.emit(ename, payload);
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
    }

});
