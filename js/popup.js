document.getElementById('play').addEventListener('click', (e) => {
    chrome.runtime.sendMessage({ msg: "play"});
});

document.getElementById('clear').addEventListener('click', (e) => {
    chrome.runtime.sendMessage({ msg: "clear"});
});
