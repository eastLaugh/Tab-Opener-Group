import { on, off } from './constants.js';
var state = on

chrome.runtime.onInstalled.addListener(function () {
    setBadge()
})

chrome.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    console.log(prevState);
    state = prevState === on ? off : on;
    setBadge()
})

function setBadge() {
    console.log(state)
    chrome.action.setBadgeText({ text: state });
    if (state === on) {
        chrome.action.setBadgeBackgroundColor({ color: "lightblue" })
    } else if (state === off) {
        chrome.action.setBadgeBackgroundColor({ color: "#D3D3D3" })
    }
}

chrome.webNavigation.onCommitted.addListener(function (details) {
    if (state === on) {
        if (details.transitionType === "link") {
            chrome.tabs.get(details.tabId, function (tab) {
                if (tab.openerTabId !== undefined) {
                    chrome.tabs.get(tab.openerTabId, function (openerTab) {
                        if (openerTab.groupId !== -1) {
                            chrome.tabs.group({ tabIds: [tab.id, tab.openerTabId], groupId: openerTab.groupId })
                        } else {
                            chrome.tabs.group({ tabIds: [tab.id, tab.openerTabId] })
                        }
                    })
                }
            })
        } else if (details.transitionType === "auto_bookmark" || details.transitionType === "typed" || details.transitionType === "generated" || details.transitionType === "keyword" || details.transitionType === "keyword_generated") {
            chrome.tabs.ungroup(details.tabId)
        }
    }
})