import React, { Component } from 'react'

import Mic from './Mic'

class AppElement extends Component {
    /* props
        core,
        mic,
        dispatch - func
    */
    render() {
        const { mic, dispatch } = this.props;
        return (
            <div>
                <Mic {...mic} dispatch={dispatch} />
            </div>
        )
    }
}

export default AppElement