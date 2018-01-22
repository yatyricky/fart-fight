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
            this.socket.emit('login', {
                name: this.state.playerName
            })
    
            this.socket.on('login', (data) => {
                console.log(`Received login ${JSON.stringify(data)}`);
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
                console.log('run timer once');
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
            console.log('emit shock');
            
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
                    <div>Player Name</div>
                    <input
                        type="text"
                        ref="inputName"
                        value={this.state.playerName}
                        className="form-control"
                        onChange={this.validateInput}
                    />
                    <div className="btn btn-primary" onClick={this.response}>Start</div>
                </div>
            );
        } else {
            const entries = [];
            for (let i = 0; i < this.state.players.length; i++) {
                const element = this.state.players[i];
                
                let actDOM = element.act;
                if (element.name == this.state.playerName) {
                    if (element.status == 'wait') {
                        actDOM = (<div className="btn btn-primary" onClick={this.actReady}>Ready</div>)
                    } else {
                        actDOM = (
                            <div>
                                <div className="btn btn-success act" onClick={this.actCharge}>Charge</div>
                                <div className="btn btn-warning act" onClick={this.actShock}>Shockwave</div>
                                <div className="btn btn-info act" onClick={this.actBlock}>Block</div>
                                <div className="btn btn-danger act" onClick={this.actNuke}>Nuke</div>
                            </div>
                        )
                    }
                    this.power = element.power
                } else {
                    if (element.act == '' && element.status == 'wait') {
                        actDOM = element.status
                    }
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
                                <th>Player</th>
                                <th>Power</th>
                                <th>Action</th>
                                <th>Score</th>
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