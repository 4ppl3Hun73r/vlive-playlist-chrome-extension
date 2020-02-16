// 현재 플레이리스트 재생 정보를 가지고 있음.
let oVExInfo = null;
const clearStatus = function(tabId) {
    oVExInfo = null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // popup에서 플레이리스트 재생 요청
	if (request.msg === "play") {
        const playlistName = request.playlist;
        _playlist.getPlaylistVideo(playlistName, (videoList) => {
            // 영상 목록이 존재 하면 영상을 순차적으로 재생한다.
            if (videoList.length > 0) {
                // 영상 재생 tab은 하나만 유지할 생각인데. 만약 기존에 재생중이던 탭이 있으면 해당 탭에서 동작하게 할 예정이다.
                const videoUrl = 'https://www.vlive.tv/video/' + videoList[0].videoSeq;
                const fnCreateTab = () => {
                    chrome.tabs.create({
                        url: videoUrl
                    }, (playtab) => {
                        oVExInfo = {};
                        oVExInfo.playlistName = playlistName;
                        oVExInfo.videoList = videoList;
                        oVExInfo.tabId = playtab.id;
                        oVExInfo.videoIndex = 0;
                    });
                };
                if (oVExInfo) {
                    const iTabId = oVExInfo.tabId;
                    chrome.tabs.get(iTabId, (tab) => {
                        // 사용했던 tab이 존재하고 url이 vlive/video일때만 페이지 변경하고 없으면 새로운 탭을 만든다.
                        if (tab && tab.url.indexOf("vlive.tv/video") > 0) {
                            chrome.tabs.update(iTabId, {url: videoUrl }
                            , (playtab) => {
                                oVExInfo.playlistName = playlistName;
                                oVExInfo.videoList = videoList;
                                oVExInfo.videoIndex = 0;
                            })
                        } else {
                            // 기존 정보 삭제후
                            clearStatus();
                            // 신규 탭 생성
                            fnCreateTab();
                        }
                    });
                } else {
                    // 탭이 없으면 신규 탭을 생성한다.
                    fnCreateTab();
                }
            }
        });
    }
    if (request.msg === 'clear') {
        chrome.storage.sync.clear();
        _playlist.setPlaylist({'default':{'videoList':[]}});
    }
    if (request.msg === 'change_icon') {
        /*
        chrome.browserAction.setIcon({
            path : '/icon2_128.png'
        });*/        
    }
    if (request.msg === 'playend') {
        const tabId = sender.tab.id;
        if (oVExInfo && oVExInfo.tabId === tabId) {
            oVExInfo.videoIndex++;
            if (oVExInfo.videoList[oVExInfo.videoIndex]) {
                let oVideo = oVExInfo.videoList[oVExInfo.videoIndex];
                chrome.tabs.update(tabId, {url: 'https://www.vlive.tv/video/' + oVideo.videoSeq }
                , (playtab) => {
                    // console.log(playtab);
                })
            } else {
                clearStatus();
            }
        }
    }
    if (request.msg === 'getCurrentPlaylistInfo') {
        if (sender.tab.id === oVExInfo.tabId) {
            sendResponse({
                msg: request.callbackMsgKey,
                oVExInfo: oVExInfo
            });
        };
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (oVExInfo && oVExInfo.tabId === tabId) {
        if (changeInfo.url) {
            if (changeInfo.url.indexOf("vlive.tv/video") > 0) {
                // 영상으로 변경
                // playlist 안 영상인지 클릭해서 넘어간건지 확인이 필요함
                const newVideoSeq = videoSeqRegx.exec(changeInfo.url)[2];
                let exist = false;
                for (let i = 0; i < oVExInfo.videoList.length; i++) {
                    if (oVExInfo.videoList[i].videoSeq === newVideoSeq) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    clearStatus();
                }
            } else {
                // 다른 주소로 변경됨
                clearStatus();
            }
        }
    }
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (oVExInfo && oVExInfo.tabId === tabId) {
        clearStatus();
    }
});

// document.querySelector(".u_rmcplayer").addEventListener
// vlive.video.webPlayer.on

// icon 변경은 좀더 생각해보고 해야겠음
// pip 모드 유지(?)
window.fnGetVExInfo = function() {
    this.console.log(oVExInfo);
    return oVExInfo;
};