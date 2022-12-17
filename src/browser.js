export let browser = chrome || browser

export function fireMessage(type, payload = "", responseCallback = () => { }) {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            type,
            payload
        }, responseCallback)
    });
}




