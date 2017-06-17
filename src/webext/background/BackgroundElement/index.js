import React, { Component } from 'react'

import { escapeRegex } from '../../common/all'
import { stopListen, startListen, STATUS as MIC } from '../../flows/mic'

import BrowserAction from './BrowserAction'

export default class BackgroundElement extends Component {
    /* props
        core
        mic: {status}
        dispatch: PropTypes.func.isRequired
    */
    render() {
        console.log('in renderof BackgroundElement');
        const {mic:{ status }} = this.props;
        return (
            <div>
                <BrowserAction onClick={this.handleClickBrowserAction} badgetxt={status === MIC.ON ? extension.i18n.getMessage('browseraction_badge_on') : undefined} title={status === MIC.ON ? extension.i18n.getMessage('browseraction_title_on') : extension.i18n.getMessage('browseraction_title')} />
            </div>
        )
    }
    handleClickBrowserAction = async () => {
        const {mic:{ status }, dispatch } = this.props;

        if (status === MIC.ON) {
            dispatch(stopListen());
        } else if (status === MIC.OFF) {
            const tab = await findTab(extension.extension.getURL(''))
            if (tab) dispatch(startListen()); // if tab is open, start listening
            else extension.tabs.create({ url:'/app/index.html' }); // else open the tab
        } else {
            // uninit, or error - always show the tab
            const tab = await findTab(extension.extension.getURL(''))
            if (tab) tab.focus();
            else extension.tabs.create({ url:'/app/index.html' });
        }
    }
}

async function findTab(url_patt_str) {
    // finds first tab that matches this url_patt_str (which is a pattern as a string)
    /* returns tab with an aditional focus method in it
        ...Tab - https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/Tab
        focus - focuses window and the tab
    }*/
    /*
    getTabFocuser(extension.extension.getURL(''))

    chrome:
    url_patt_str: chrome-extension://ekfmdkcnlpcaokgedlgmjchacaefikgo/
    index.js:48 url: chrome://extensions/
    index.js:48 url: chrome-extension://ekfmdkcnlpcaokgedlgmjchacaefikgo/app/index.html
    index.js:50 matched!!!

    firefox:
    url_patt_str: moz-extension://cc46a837-3939-4f51-83da-85e11ff9e260/  index.bundle.js:29937:25
    url: about:debugging  index.bundle.js:29956:29
    url: moz-extension://cc46a837-3939-4f51-83da-85e11ff9e260/app/index.html  index.bundle.js:29956:29
    matched!!!
    */

    // console.log('url_patt_str:', url_patt_str);
    const url_patt = new RegExp(escapeRegex(url_patt_str), 'mi');
    // returns a function that can be run to focus tab if that tab is found. else returns undefined
    const tabs = await extensiona('tabs.query', {}); // https://stackoverflow.com/a/38733159/1828637 // as using url:'<all_urls>' was not getting me about:debugging or my moz-etension pages in firefox, i had to use empty object
    for (const tab of tabs) {
        const { id:tabid, windowId:windowid, url } = tab;
        // console.log('url:', url);
        if (url_patt.test(url)) {
            // console.log('matched!!!');
            return {
                ...tab,
                focus: async () => {
                    await extensiona('windows.update', windowid, { focused:true });
                    await extensiona('tabs.update', tabid, { active:true });
                }
            }
        }
    }
}