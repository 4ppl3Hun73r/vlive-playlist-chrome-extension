document.getElementById('play').addEventListener('click', (e) => {
    let elPlayList = document.getElementById("playlist");
    chrome.runtime.sendMessage({ msg: "play", playlist: elPlayList.value});
});

document.getElementById('clear').addEventListener('click', (e) => {
    chrome.runtime.sendMessage({ msg: "clear"});
});


// playlist 목록 가져와서 selectbox에 붙이기
document.body.onload = function() {
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

    // 현재 재생중인 playlist 정보를 가져와서 뿌려주기
    // 그런데 popup에 뿌려 주려니까 여러 playlist tab을 운영할때 복잡함이 생김
    // 여러 tab을 재생하지 않는 다고 가정하고 해야 할듯
    chrome.runtime.getBackgroundPage(function (bg) {
        console.log(bg);
        let oVExInfo = bg.fnGetVExInfo();
        console.log(oVExInfo);
        if (oVExInfo) {
            // 재생중인 정보로 목록 만들기
            const elVideoList = document.getElementById('videoList');
            if (oVExInfo.videoList) {
                let sHtml = '';
                for (let i = 0; i < oVExInfo.videoList.length; i++) {
                    const oVideo = oVExInfo.videoList[i];
                    sHtml += `<div><img src="${oVideo.thumbnail}" width="30" height="30"> ${oVideo.title} </div>`;
                }
                elVideoList.innerHTML = sHtml;
            }
        }
    });
}




// playlist 1번 videoList를 가지고 목록 구성하기

// 구성된 목록을 가지고 play 시키기