cc.Class({
    extends: cc.Component,

    properties: {
        pageViewNode: {
            default: null,
            type: cc.Node
        },
        leaderboardContainers: [cc.Node],
        scoreEntryPrefab: {
            default: null,
            type: cc.Prefab
        },
        loadingLeaderboard: {
            default: null,
            type: cc.Node
        }
    },

    loadDataIntoPage(board, page) {
        console.log(`start to load ${board} into page ${page}`);
        this.loadingLeaderboard.getComponent('SpinnerBehaviour').startSpin();
        
        FBInstant.getLeaderboardAsync(board).then((leaderboard) => {
            console.log(`leaderboard OK`);
            return leaderboard.getEntriesAsync(10, 0);
        }, (rejected) => {
            console.log(rejected);
        }).then((entries) => {
            console.log(entries);
            for (let i = 0; i < this.leaderboardContainers[page].children.length; i++) {
                this.leaderboardContainers[page].children[i].destroy();
            }
            for (let i = 0; i < entries.length; i++) {
                const element = entries[i];
                const scoreEntry = cc.instantiate(this.scoreEntryPrefab);
                let score = element.getScore();
                scoreEntry.getComponent('ResultEntryBehaviour').setValues(element.getPlayer().getName(), score);
                this.leaderboardContainers[page].addChild(scoreEntry);
            }
            this.loadingLeaderboard.getComponent('SpinnerBehaviour').dismiss();
        }, (rejected) => {
            console.log(rejected);
        });
    },

    onPageTurned(pageView, eventType, customEventData) {
        const pn = this.pageViewNode.getComponent(cc.PageView).getCurrentPageIndex();
        switch (pn) {
            case 0:
                this.loadDataIntoPage(window.fbLeaderboards.TOTAL_GAMES, 0);
                break;
            case 1:
                this.loadDataIntoPage(window.fbLeaderboards.TOTAL_GAMES_WON, 1);
                break;
            default:
                break;
        }
    },

    onLeaderboardClicked() {
        if (typeof (FBInstant) != "undefined") {
            this.node.active = true;
            this.loadDataIntoPage(window.fbLeaderboards.TOTAL_GAMES, 0);
        } else {
            window.GM.toast("Please login");
        }
    },

    onLeaderboardDismiss() {
        this.node.active = false;
    },

});
