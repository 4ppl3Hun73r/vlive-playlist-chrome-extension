let oStatus = {};

const clearStatus = function(tabId) {
    console.log(tabId, oStatus);
    delete oStatus[tabId];
    console.log(oStatus);
}
console.log(oStatus);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.msg === "play") {
        // let iframe = document.getElementById('iframe1');
        // alert(iframe.innerHTML);
        const playlistName = request.playlist;
        _playlist.getPlaylistVideo(playlistName, (videoList) => {
            // 목록 순서대로 영상을 재생한다.
            if (videoList.length > 0) {
                chrome.tabs.create({
                    url: 'https://www.vlive.tv/video/' + videoList[0].videoSeq
                }, (playtab) => {
                    oStatus[playtab.id] = {};
                    oStatus[playtab.id].playlistName = playlistName;
                    oStatus[playtab.id].videoList = videoList;
                    oStatus[playtab.id].tabId = playtab.id;
                    oStatus[playtab.id].videoIndex = 0;
                });
            }
        });
    }
    if (request.msg === 'clear') {
        chrome.storage.sync.clear();
    }
    if (request.msg === 'change_icon') {
        /*
        chrome.browserAction.setIcon({
            path : '/icon2_128.png'
        });*/        
    }
    if (request.msg === 'playend') {
        const tabId = sender.tab.id;
        const _oStatus = oStatus[tabId];
        if (_oStatus) {
            _oStatus.videoIndex++;
            if (_oStatus.videoList[_oStatus.videoIndex]) {
                let oVideo = _oStatus.videoList[_oStatus.videoIndex];
                chrome.tabs.update(tabId, {url: 'https://www.vlive.tv/video/' + oVideo.videoSeq }
                , (playtab) => {
                    // console.log(playtab);
                })
            } else {
                clearStatus(tabId);
            }
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (oStatus[tabId]) {
        if (oStatus[tabId].tabId === tabId) {
            if (changeInfo.url) {
                if (changeInfo.url.indexOf("vlive.tv/video") > 0) {
                    // 영상으로 변경
                    // playlist 안 영상인지 클릭해서 넘어간건지 확인이 필요함
                    const newVideoSeq = videoSeqRegx.exec(changeInfo.url)[2];
                    let exist = false;
                    for (let i = 0; i < oStatus[tabId].videoList.length; i++) {
                        if (oStatus[tabId].videoList[i].videoSeq === newVideoSeq) {
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        clearStatus(tabId);
                    }
                } else {
                    // 다른 주소로 변경됨
                    clearStatus(tabId);
                }
            }
        }
    }
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (oStatus[tabId]) {
        clearStatus(tabId);
    }
});

// document.querySelector(".u_rmcplayer").addEventListener
// vlive.video.webPlayer.on

// icon 변경은 좀더 생각해보고 해야겠음
// pip 모드 유지(?)