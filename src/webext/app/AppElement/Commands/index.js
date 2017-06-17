import React, { Component } from 'react'

import './index.css'

class Commands extends Component {
    /* props
    commands
    history
    */
    render() {
        console.log('thisprops:', this.props);
        const { history, commands } = this.props;

        return (
            <div className="commands-gui">
                <div className="history">
                    History
                    { history.map( (command, ix) =>
                        <div className="history-item" key={ix}>
                            ID: {command.id}
                        </div>
                    )}
                </div>
                <div className="commands-list">
                    Available Commands
                    { Object.values(commands).map( command =>
                        <div className="command-item" key={command.id}>
                            <div>
                                ID: {command.id}
                            </div>
                            <div>
                                Description: {command.desc}
                            </div>
                            <div>
                                Trigger Phrase: {command.trigger}
                            </div>
                            <div>
                                Enabled: {command.enabled}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Commands