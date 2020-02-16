/**
 * PIP Mode 전환
 */
const fnTogglePipMode = function() {
    try {
        if(!document.pictureInPictureElement){
            if(document.getElementsByTagName('video')[0].disablePictureInPicture){
                document.getElementsByTagName('video')[0].disablePictureInPicture = false;
                    setTimeout(()=>{
                        document.getElementsByTagName('video')[0].requestPictureInPicture();
                    },150);
            } else {
                document.getElementsByTagName('video')[0].requestPictureInPicture();
            }
        } else {
            document.exitPictureInPicture();
        } 
    } catch (e) {
        console.log(e);
    }
}

const _playlist = {
    getPlaylist: function (callback) {
        chrome.storage.sync.get(['playlist'], callback);
    },
    getPlaylistVideo: function (playlistName, callback) {
        chrome.storage.sync.get(['playlist'], (oResult) => {
            let playlist = oResult.playlist;
            if (!playlist) {
                playlist = {};
            }
            let list = playlist[playlistName];
            if (!list) {
                list = {
                    'videoList': []
                };
                playlist[playlistName] = list;
            }
            if (typeof callback === 'function') {
                callback.apply(null, [list.videoList]);
            }
        });
    }, 
    setPlaylist: function (playlist, callback) {
        chrome.storage.sync.set({'playlist': playlist}, callback);
    },
    getLastPlayInfo: function (callback) {
    /*
        'lastplayInfo': {
            'playlist': 'defualt',
            'index': 0
        }
    */
        chrome.storage.sync.get(['lastplayInfo'], callback);
    },
    setLastPlayInfo: function (oLastPlayInfo, callback) {
        chrome.storage.sync.set({'lastplayInfo': oLastPlayInfo}, callback);
    },
    /**
     * playlistName에 현재 페이지 video 정보 저장
     * @param {string} playlistName 
     */
    addPlaylist: function(playlistName) {
        const videoSeq = fnGetVideoSeq();
        const title = document.querySelector('#content > div.vlive_section > div > div.vlive_cont > div.vlive_area > div.vlive_info > strong').innerText;
        const startAt = null;
        const endAt = null;
        const thumbnail = document.querySelectorAll('meta[property="og:image"]')[0].content.split('?')[0];
    
        const newVideoInfo = {
            videoSeq, title, startAt, endAt, thumbnail
        };
    
        _playlist.getPlaylist(function(oResult) {
            let playlist = oResult.playlist;
            if (!playlist) {
                playlist = {};
            }
            let list = playlist[playlistName];
            if (!list) {
                list = {
                    'videoList': []
                };
                playlist[playlistName] = list;
            }
            let videoList = list.videoList;
            let exists = false;
            for (let i = 0; i < videoList.length; i++) {
                let videoInfo = videoList[i];
                if (videoInfo.videoSeq === videoSeq) {
                    videoList[i] = newVideoInfo;
                    exists = true;
                }
            }
            if (!exists) {
                videoList.push(newVideoInfo);
            }
    
            _playlist.setPlaylist(playlist, null);
        });
    },
    removePlaylist: function(playlistName) {
        const videoSeq = fnGetVideoSeq();
    
        _playlist.getPlaylist(function(oResult) {
            let playlist = oResult.playlist;
            let list = playlist[playlistName];
            let videoList = list.videoList;
            for (let i = 0; i < videoList.length; i++) {
                let videoInfo = videoList[i];
                if (videoInfo.videoSeq === videoSeq) {
                    videoList.splice(i, 1);
                    break;
                }
            }
    
            _playlist.setPlaylist(playlist, null);
        });
    }
};

const videoSeqRegx = /.*(\/video\/)([0-9].*).*/;
const fnGetVideoSeq = function () {
    const url = document.querySelectorAll('meta[property="og:url"]')[0].content;
    return videoSeqRegx.exec(url)[2];
}

const fnGetPlayList = function(fnCallback) {
    chrome.storage.sync.get(null, (result) => {
        fnCallback(result.playlist);
    });
};

const isPlaying = function() {
    let rmcBtn = document.querySelector('._accessibility_btn.u_rmc_btn');
    if (rmcBtn) {
        return rmcBtn.className.indexOf('u_rmc_pause_btn') > -1;
    }
    return false;
};

const isVideoEnd = function() {
    let rmcBtn = document.querySelector('._accessibility_btn.u_rmc_btn');
    if (rmcBtn) {
        return rmcBtn.className.indexOf('u_rmc_replay_btn') > -1;
    }
    return false;
};

const isPause = function() {
    let rmcBtn = document.querySelector('._accessibility_btn.u_rmc_btn');
    if (rmcBtn) {
        return rmcBtn.className.indexOf('u_rmc_play_btn') > -1;
    }
    return false;
};