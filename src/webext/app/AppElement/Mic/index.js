import React, { Component } from 'react'

const streamText = require('watson-speech/speech-to-text/recognize-microphone');

import { STATUS, startListen, stopListen, authListen, errorListen } from '../../../flows/mic'
import { execCommand } from '../../../flows/commands'

import { getToken } from './WatsonSTT/utils'
import { wordSimilarity } from './utils'

const TOKEN_STATUS = { // short for TOKEN_STATUS
    UNINIT: 'UNINIT',
    EXPIRED: 'EXPIRED',
    FAILED: 'FAILED',
    OK: 'OK'
    // date.now() - time it was set
}

function getTokenStatus(token_status) {
    // token_status is this.state.token
    switch (token_status) {
        case TOKEN_STATUS.UNINIT:
        case TOKEN_STATUS.EXPIRED:
        case TOKEN_STATUS.FAILED:
        case TOKEN_STATUS.OK:
            return token_status;
        default:
            // if FAILED and OK can have suffix of "-Date.now()"
            return token_status.substr(0, token_status.indexOf('-'));
    }
}

class Mic extends Component {
    /* static propTypes = {
        listening
    }*/
    state = {
        token_status: TOKEN_STATUS.UNINIT,
        token: null
    }
    mstream = null // media stream
    tstream = null // text stream
    componentDidUpdate(props_old) {
        console.log('mic updated, this.props:', this.props);
        const { status } = this.props;
        const { status:status_old } = props_old;

        if (status !== status_old) {
            switch (status) {
                case STATUS.AUTH: this.authorize(); break;
                case STATUS.OFF: this.stop(); break;
                case STATUS.ON: this.start(); break;
                // no-default
            }
        }
    }
    async refreshToken() {
        const { token_status } = this.state;

        if (getTokenStatus(token_status) !== TOKEN_STATUS.OK) {
            let token;
            try {
                token = await getToken();
            } catch(ex) {
                console.error('failed to get token ex:', ex);
                this.setState(()=>({ token_status:TOKEN_STATUS.FAILED }));
                throw new Error(`Failed to refesh token. Error: ${ex.message}`)
            }
            this.setState(()=>({ token_status:TOKEN_STATUS.OK, token }));
            return token;
        } else {
            return this.state.token;
        }
    }
    async authorize() {
        const { dispatch } = this.props;

        if (!this.mstream) {
            try {
                this.mstream = await navigator.mediaDevices.getUserMedia({ video:false, audio:true });
            } catch(ex) {
                // TODO: add detailed possible explanations for the error returned
                // if no mic plugged in
                // if mic in use by another application
                dispatch(errorListen(`Failed to get permission to use your microphone. Error returned was: "${ex.message}"`));
            }
            dispatch(startListen());
        } else {
            dispatch(startListen());
        }
    }
    async start() {
        const { dispatch } = this.props;
        console.log('will start watson who will start recording');
        // const token = await this.refreshToken();
        // console.log('token:', token);
        let token;
        try {
            token = await this.refreshToken();
        } catch(ex) {
            dispatch(errorListen(`Failed to get token for IBM Watson servers, please try again. Error returned was: "${ex.message}"`));
            return;
        }

        this.tstream = streamText({
            token,
            mediaStream: this.mstream,
            keepMicrophone: true
        });

        this.tstream.setEncoding('utf-8');
        this.tstream.on('data', this.handleData);
        this.tstream.on('error', this.handleError);
    }
    stop() {
        console.log('will now stop');
        // this.mstream = null;
        if (this.tstream) this.tstream.stop();
    }
    handleData = data => {
        const { commands, dispatch } = this.props;
        console.log('data:', data);


        data = data.replace(/\./g, '');

        extension.notifications.create({
            type: 'basic',
            iconUrl: extension.extension.getURL('images/icon48.png'),
            title: 'You said...',
            message: `"${data}"`
        });

        const similaritys = []; // {id, conf} conf is confidence, similarity id is command id and vaue is similarity
        for (const command of Object.values(commands)) {
            similaritys.push({
                id: command.id,
                conf: wordSimilarity(data, command.trigger)
            });
        }
        similaritys.sort( (sima, simb) => simb.conf - sima.conf );
        console.log('similaritys:', similaritys);

        const most_similar = similaritys[0];
        const MIN_CONF = 0.6;
        if (most_similar.conf >= MIN_CONF) {
            dispatch(execCommand(most_similar.id));
        }
    }
    handleError = err => {
        const { dispatch } = this.props;
        console.error('err:', err);

        dispatch(errorListen(`Listening was stopped due to error. ${err.message.substr(0, 1).toUpperCase() + err.message.substr(1)}`));
        // err.message's:
        // bad token - WebSocket connection error
        //

    }
    componentDidMount() {
        console.log('mic mounted, this.props:', this.props);
    }
    getLabel() {
        const { status } = this.props;
        switch (status) {
            case STATUS.ON: return extension.i18n.getMessage('browseraction_title_on');
            case STATUS.UNINIT:
            case STATUS.OFF: return extension.i18n.getMessage('explain');
            case STATUS.AUTH: return extension.i18n.getMessage('in_auth');
            default: return status;
        }
    }
    getButton() {
        const { status } = this.props;
        switch (status) {
            case STATUS.ON: {
                return (
                    <button onClick={this.handleClick}>
                        {extension.i18n.getMessage('stop_listening')}
                    </button>
                );
            }
            case STATUS.AUTH: return undefined;
            case STATUS.UNINIT:
            case STATUS.OFF: {
                return (
                    <button onClick={this.handleClick}>
                        {extension.i18n.getMessage('start_listening')}
                    </button>
                );
            }
            default: {
                return (
                    <button onClick={this.handleClick}>
                        {extension.i18n.getMessage('start_listening_again')}
                    </button>
                );
            }
        }
    }
    handleClick = () => {
        const { status, dispatch } = this.props;
        switch (status) {
            case STATUS.ON: return dispatch(stopListen());
            case STATUS.AUTH: return undefined;
            case STATUS.UNINIT:
            case STATUS.OFF:  return dispatch(authListen());
            default: return dispatch(authListen());
        }
    }
    render() {
        return (
            <div>
                { this.getLabel() }
                <br/>
                <br/>
                { this.getButton() }
            </div>
        )
    }
}

export default Mic