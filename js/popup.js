document.getElementById('play').addEventListener('click', (e) => {
    let elPlayList = document.getElementById("playlist");
    chrome.runtime.sendMessage({ msg: "play", playlist: elPlayList.value});
});

document.getElementById('clear').addEventListener('click', (e) => {
    chrome.runtime.sendMessage({ msg: "clear"});
});


// playlist 목록 가져와서 selectbox에 붙이기
document.body.onload = function() {
    _playlist.getLastPlayInfo(function(oData) {
        let lastplayInfo = oData.lastplayInfo;
        if (!lastplayInfo) {
            lastplayInfo = {
                'playlist': 'defualt',
                'index': 0
            };
            _playlist.setLastPlayInfo(lastplayInfo);
        }
        _playlist.getPlaylist(function(oResult) {
            // const videoSeq = fnGetVideoSeq();
            let oPlaylist = oResult.playlist;
            if (oPlaylist) {
                let keyList = Object.keys(oPlaylist);
                let elPlayList = document.getElementById("playlist");
                let sHtml = '';
                keyList.forEach((str, index, strings) => {
                    const playlist = oPlaylist[str];
                    // const bInclude = checkVideoInArr(videoSeq, playlist.videoList);
                    sHtml += `<option value="${str}">${str}</option>`;
                }, this);
                elPlayList.innerHTML = sHtml;
            }
        });
    });
}


// playlist 1번 videoList를 가지고 목록 구성하기

// 구성된 목록을 가지고 play 시키기