import '../../common/extension-polyfill'

import React, { Component } from 'react'

import Mic from './Mic'
import Commands from './Commands'

class AppElement extends Component {
    /* props
        core,
        mic,
        commands,
        dispatch - func
    */
    render() {
        console.log('this.props:', this.props);
        const { mic, dispatch, commands:{ history, ...commands }} = this.props;
        return (
            <div>
                <Mic {...mic} dispatch={dispatch} commands={commands} />
                <Commands commands={commands} history={history} />
            </div>
        )
    }
}

export default AppElement