cc.Class({
    extends: cc.Component,

    properties: {
        entryNodes: [cc.Node]
    },

    onBackMaskClicked() {
        this.node.active = false;
        const gm = cc.find('GameManager').getComponent('GameManager');
        gm.emit(reqs.CLOSE_RES, gm.localName);
    },

    show(data) {
        let i;
        for (i = 0; i < data.length; i++) {
            const element = data[i];
            const resBehav = this.entryNodes[i].getComponent('resultEntryBehaviour');
            resBehav.nameNode.getComponent(cc.Label).string = element.name;
            resBehav.scoreNode.getComponent(cc.Label).string = element.score;
            this.entryNodes[i].active = true;
        }
        for (; i < this.entryNodes.length; i++) {
            this.entryNodes[i].active = false;
        }
        this.node.active = true;
    }

});
