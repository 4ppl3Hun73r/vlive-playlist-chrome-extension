const videoBtnArea = document.querySelector('#content > div.vlive_section > div > div.vlive_cont > div.vlive_area > div.vlive_info > div.btn_area');

// 버튼 이미지 가져오기
const spIconImgUrl = chrome.runtime.getURL('img/sp_icon.png');

// PIP 버튼 달기
const togglePipBtn = document.createElement('a');
togglePipBtn.className = 'btn_share';
togglePipBtn.href = '#'
togglePipBtn.onclick = function(event) {
    // 클릭시 PIP Mode 전환
    fnTogglePipMode();
    return false;
}
togglePipBtn.className = togglePipBtn.className + ' v-ex-pip-btn';
videoBtnArea.appendChild(togglePipBtn);
//--PIP 버튼 달기

// 플레이리스트 팝업 버튼 달기
const playlistLayerBtn = document.createElement('a');
playlistLayerBtn.className = 'btn_share';
playlistLayerBtn.href = '#'
playlistLayerBtn.onclick = function(event) {
    // 클릭시 layer 전환
    console.log(event);
    fnTogglePlaylistLayer(event.srcElement);
    return false;
}
playlistLayerBtn.className = playlistLayerBtn.className + ' v-ex-list-btn';
videoBtnArea.appendChild(playlistLayerBtn);
//--플레이 리스트 팝업 버튼 달기

let testVal = true;
const fnSaveVideo = function() {
    if (testVal) {
        chrome.storage.sync.set({'url': location.href}, function() {
            console.log('Value is set to ' + location.href);
        });
        chrome.storage.sync.set({'test': "test"}, function() {
            console.log('Value is set to test');
        });
    } else {
        chrome.storage.sync.get(['url'], function(result) {
            console.log(result);
            console.log('Value currently is ' + result.url);
        });
        chrome.storage.sync.get(['test'], function(result) {
            console.log(result);
            console.log('Value currently is ' + result.test);
        });
    }
    testVal = !testVal;
}

let data = null;
chrome.storage.sync.get(null, (result) => {
    data = result;
    console.log(data);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    alert(changes);
    console.log(changes);
});

/* storage data struct
{
    'playlist': [
        {
            'name' : 'default',
            'videoList' : [{
                videSeq: 12345,
                title: 'title',
                startAt: '', // null is 00
                endat: '' // null is end
            }]
        }
    ],
    'lastplayInfo': {
        'playlist': 'defualt',
        'index': 0
    }
}
*/