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