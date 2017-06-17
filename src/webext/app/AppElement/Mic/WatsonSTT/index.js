import React, { Component } from 'react'

import { getToken } from './utils'

class WatsonSTT extends Component {
    /* static propTypes = {
        listening
    }*/
    websocket = null
    async start() {
        console.log('will now start watson')
        // https://sundayschoolonline.org/voicecontrol/token.php
        const token = await getToken();

        const websocket = this.websocket = new WebSocket(`wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=${token}`);
        websocket.onopen = this.handleOpen;
        websocket.onclose = this.handleClose;
        websocket.onmessage = this.handleMessage;
        websocket.onerror = this.handleError;

        console.log('started watson');
    }
    handleOpen = e => {
        console.log('watson websocket opened, e:', e);
        // watson websocket opened, e: open { target: WebSocket, isTrusted: true, currentTarget: WebSocket, eventPhase: 2, bubbles: false, cancelable: false, defaultPrevented: false, composed: false, timeStamp: 2447.905853517878, cancelBubble: false, originalTarget: WebSocket }
        this.websocket.send(JSON.stringify({
            'action': 'start',
            'content-type': 'audio/ogg;codecs=opus'
        }));
    }
    handleClose = e => {
        console.log('watson websocket closed, e:', e);
        // watson websocket closed, e: close { target: WebSocket, isTrusted: true, wasClean: true, code: 1011, reason: "see the previous message for the error details.", currentTarget: WebSocket, eventPhase: 2, bubbles: false, cancelable: false, defaultPrevented: false, composed: false }
    }
    handleMessage = e => {
        console.log('watson websocket got message, e:', e);
        // watson websocket got message, e: message { target: WebSocket, isTrusted: true, data: "{"state": "listening" }", origin: "wss://stream.watsonplatform.net", lastEventId: "", ports: Object, currentTarget: WebSocket, eventPhase: 2, bubbles: false, cancelable: false, defaultPrevented: false }
        // watson websocket got message, e: message { target: WebSocket, isTrusted: true, data: "{"error": "Session timed out." }", origin: "wss://stream.watsonplatform.net", lastEventId: "", ports: Object, currentTarget: WebSocket, eventPhase: 2, bubbles: false, cancelable: false, defaultPrevented: false }

    }
    handleError = e => {
        console.warn('watson websocket got error, e:', e);
    }
    stop() {
        console.log('will now stop watson');
        this.websocket.close();
        // this.websocket.send(JSON.stringify({
        //     'action': 'stop'
        // }));
        console.log('stopped watson');
    }
    componentDidMount() {
        this.start();
    }
    componentWillUnmount() {
        this.stop();
    }
    render() {
        return <div />;
    }
}

export default WatsonSTT