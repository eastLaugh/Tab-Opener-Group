chrome.webNavigation.onCommitted.addListener(function (details) {
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
    }
})