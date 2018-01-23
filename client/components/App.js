import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

    constructor() {
        super();
        // this.socket = io();
        this.response = this.response.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.actCharge = this.actCharge.bind(this)
        this.actShock = this.actShock.bind(this)
        this.actBlock = this.actBlock.bind(this)
        this.actNuke = this.actNuke.bind(this)
        this.runTimer = this.runTimer.bind(this)
        this.actReady = this.actReady.bind(this)
        this.timeoutCallback = this.timeoutCallback.bind(this)
        this.socket = null;
        this.power = 0;

        this.state = {
            playerName: "",
            players: [],
            timer: 0
        }
    }

    timeoutCallback() {
        if (this.state.timer > 0) {
            this.setState({
                timer: this.state.timer - 1
            })
            this.runTimer()
        }
    }

    runTimer() {
        setTimeout(this.timeoutCallback, 40);
    }

    response() {
        if (this.socket == null) {
            this.socket = io();

            let sendName = this.state.playerName
            if (sendName == "") {
                sendName = "玩家"
            }
            this.socket.emit('login', {
                name: sendName
            })
    
            this.socket.on('login', (data) => {
                this.setState({
                    players: data
                })
            })

            this.socket.on('correct name', (data) => {
                this.setState({
                    playerName: data
                })
            })

            this.socket.on('game start', (data) => {
                this.setState({
                    timer: 125
                })
                if (data.loop == false) {
                    this.runTimer()
                }
            })
        }
    }

    actReady() {
        this.socket.emit('ready', {
            name: this.state.playerName
        })
    }

    actCharge() {
        this.socket.emit('charge', {
            name: this.state.playerName
        })
    }

    actShock() {
        if (this.power > 0) {
            this.socket.emit('shock', {
                name: this.state.playerName
            })
        }
    }

    actBlock() {
        this.socket.emit('block', {
            name: this.state.playerName
        })
    }

    actNuke() {
        if (this.power > 4) {
            this.socket.emit('nuke', {
                name: this.state.playerName
            })
        }
    }


    validateInput() {
        this.setState({
            playerName: this.refs.inputName.value
        })
    }

    render() {
        if (this.state.players.length == 0) {
            return (
                <div className="container">
                    <div>输入名字</div>
                    <input
                        type="text"
                        ref="inputName"
                        value={this.state.playerName}
                        className="form-control"
                        onChange={this.validateInput}
                    />
                    <div className="btn btn-primary" onClick={this.response}>开始</div>
                </div>
            );
        } else {
            const entries = [];
            for (let i = 0; i < this.state.players.length; i++) {
                const element = this.state.players[i];
                
                let actDOM = element.act;
                if (element.act == 'charge') {
                    actDOM = "蓄"
                } else if (element.act == 'shock') {
                    actDOM = "波"
                } else if (element.act == 'block') {
                    actDOM = "挡"
                } else if (element.act == 'nuke') {
                    actDOM = "元气弹"
                }
                if (element.name == this.state.playerName) {
                    if (element.status == 'wait') {
                        actDOM = (<div className="btn btn-primary" onClick={this.actReady}>准备</div>)
                    } else {
                        actDOM = (
                            <div>
                                <div className="btn btn-success act" onClick={this.actCharge}>蓄</div>
                                <div className="btn btn-warning act" onClick={this.actShock}>波</div>
                                <div className="btn btn-info act" onClick={this.actBlock}>挡</div>
                                <div className="btn btn-danger act" onClick={this.actNuke}>元气弹</div>
                            </div>
                        )
                    }
                    this.power = element.power
                } else {
                    if (element.act == '' && element.status == 'wait') {
                        actDOM = element.status
                    }
                }

                if (element.face == 'died' && element.status != 'wait') {
                    actDOM = '你死了'
                }

                let face = null;
                switch (element.face) {
                    case 'alive':
                        face = "😄";
                        break;
                    case 'evil':
                        face = "👿";
                        break;
                    case 'died':
                        face = "☠";
                        break;
                    default:
                        face = "😄";
                        break;
                }
                entries.push(
                    <tr key={i}>
                        <td>{face}</td>
                        <td>{element.name}</td>
                        <td>{element.power}</td>
                        <td>{actDOM}</td>
                        <td>{element.score}</td>
                    </tr>
                )
            }
            const red = (125 - this.state.timer) / 125 * 255;
            const green = this.state.timer / 125 * 255;
            const style = {
                backgroundColor: `rgba(${red},${green},0,255)`,
                width: Math.floor(this.state.timer / 125 * 100) + '%',
                height: '12px'
            }
            return (
                <div className="container">
                    <div style={style}></div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th>玩家</th>
                                <th>力</th>
                                <th>动作</th>
                                <th>得分</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
}

export default App;