chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.msg === "play") {
        let iframe = document.getElementById('iframe1');
        alert(iframe.innerHTML);
    }
    if (request.msg === 'clear') {
        chrome.storage.sync.clear();
    }
});