const fnOnClickPlaylistLayer = function(e) {
    console.log(e);
    console.log(e.toElement);

    const targetElement = e.toElement;
    if (targetElement.className.indexOf('v-ex-playlist-checkbox') > -1) {
        const playlistName = targetElement.getAttribute('data-name');
        const bChecked = targetElement.checked;
        
        if (bChecked) {
            _playlist.addPlaylist(playlistName);
        } else {
            _playlist.removePlaylist(playlistName);
        }
    }
}

// layer를 만들어서 숨김 처리 해 놓기
const elBody = document.body;
const elPlaylistLayer = document.createElement('div');
elPlaylistLayer.className = 'v-ex-playlist-layer';
elPlaylistLayer.style.display = 'none';
elPlaylistLayer.onclick = fnOnClickPlaylistLayer;
elBody.appendChild(elPlaylistLayer);

elPlaylistLayer.innerHTML = `
<div class="v-ex-playlist-head">
    <input type="text" id="v-ex-newplaylist"/>
    <input type="button" id="v-ex-newplaylist-button"/>
</div>
<div class="v-ex-playlist">
    <div class="v-ex-list">
    </div>
</div>
`;


const fnLoadPlaylist = function() {

};
fnLoadPlaylist();


const fnTogglePlaylistLayer = function(el) {
    if (elPlaylistLayer.style.display === 'none') {
        // 데이터 가져오기
        _playlist.getPlaylist(function(oResult) {
            const videoSeq = fnGetVideoSeq();
            let oPlaylist = oResult.playlist;
            if (oPlaylist) {
                let keyList = Object.keys(oPlaylist);
                let oList = document.querySelector('.v-ex-list');
                let sHtml = '';
                keyList.forEach((str, index, strings) => {
                    const playlist = oPlaylist[str];
                    const bInclude = checkVideoInArr(videoSeq, playlist.videoList);
                    sHtml += `<div><input type="checkbox" class="v-ex-playlist-checkbox" data-name="${str}" ${bInclude ? 'checked' : '' }  /> ${str}</div>`;
                }, this);
                oList.innerHTML = sHtml;
                fnShowLayer(el);
            }
        });
    } else {
        fnHideLayer();
    }
}

const checkVideoInArr = function(videoSeq, arrVideoList) {
    for (let i = 0; i < arrVideoList.length; i++) {
        if (videoSeq == arrVideoList[i].videoSeq) {
            return true;
        }
    }
    return false;
}

const fnShowLayer = function(el) {
    const bodyRect = elBody.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const top = elRect.top - bodyRect.top;
    const left = elRect.left - bodyRect.left;

    elPlaylistLayer.style.display = 'block';
    elPlaylistLayer.style.top = (top) + 'px';
    elPlaylistLayer.style.top = (top + 120) + 'px';
    elPlaylistLayer.style.left = left + 'px';
}

const fnHideLayer = function() {
    elPlaylistLayer.style.display = 'none';
}


// css link
const elLink = document.createElement('link');
elLink.type = "text/css";
elLink.rel = "stylesheet";
const sPlaylistLayerCss = chrome.runtime.getURL('css/playlistLayer.css');
elLink.href = sPlaylistLayerCss;

document.head.appendChild(elLink);