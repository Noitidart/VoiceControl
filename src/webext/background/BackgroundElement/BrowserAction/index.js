import React, { Component } from 'react'

class BrowserAction extends Component {
    /* static propTypes = {
        tabid: PropTypes.number, // optional, if leave out, then it sets on default // TODO: not yet supported
        title: PropTypes.string.isRequired,
        badgecolor: PropTypes.string,
        badgetxt: PropTypes.string
        onClick
    }*/
    static setTitle(title, tabid) {
        extension.browserAction.setTitle({ title, tabId:tabid })
    }
    static setBadgetxt(text='', tabid) {
        extension.browserAction.setBadgeText({ text, tabId:tabid })
    }
    static setBadgecolor(color, tabid) {
        extension.browserAction.setBadgeBackgroundColor({ color, tabId:tabid })
    }
    handleClick = tab => {
        if (this.props.onClick) {
            this.props.onClick(tab);
        }
    }
    componentDidUpdate(propsold) {
        let { tabid, ...props } = this.props; // ...props are api setable props
        console.log('in componentDidUpdate of BrowserAction');
        for (let [prop, value] of Object.entries(props)) {
            let settername = 'set' + prop[0].toUpperCase() + prop.substr(1);
            if (settername in BrowserAction) {
                // it is an api settable prop
                let valueold = propsold[prop];
                if (valueold !== value) {
                    BrowserAction[settername](value, tabid);
                }
            } // else it is NOT an api settable prop
        }
    }
    componentDidMount() {
        extension.browserAction.onClicked.addListener(this.handleClick);

        this.componentDidUpdate({});
    }
    render() {
        return <div />;
    }
}

export default BrowserAction