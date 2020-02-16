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
    // alert(changes);
    console.log(changes);
});

// event attach
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/page.js');
(document.head || document.documentElement).appendChild(s);

setTimeout(() => {
    let event = new CustomEvent('ADD_EVENT');
    window.dispatchEvent(event);
}, 500);

window.addEventListener('PLAY_END', (event) => {
    console.log(event);
    chrome.runtime.sendMessage({
        msg: "playend"
    });
}, false);

// cont_section 영역에 playlist 정보로 목록 표시하기
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.msg === 'contentPlaylistInfoCallback') {
        const elCont = document.querySelector('.cont_section');
        console.log(request.oVExInfo);
            let videoArea = `
            <div class="video_area suggest">
                <h3 class="tit">플레이 리스트</h3>
                <div class="inner">
                    <ul class="video_list _extension_playlist">`;
            const videoList = request.oVExInfo.videoList;
            videoList.forEach(video => {
                videoArea += `
                <li class="video_list_cont _suggest_page_1" style="display: inline-block;">
                    <a href="/video/${video.videoSeq}" class="thumb_area" title="${video.title}">
                        <div class="icon_box">	
                        </div>
                        <img class="" width="228" height="128" alt="" src="${video.thumbnail}?type=f228_128">
                        <span class="thumb_border"></span>
                    </a>
                    <a href="/video/${video.videoSeq}" class="video_tit" title="${video.title}">${video.title}</a>
                </li>
                `;
            });
            videoArea += `</ul>
                </div>
            </div>`;
        
            elCont.innerHTML = videoArea + elCont.innerHTML;
    }
});
chrome.runtime.sendMessage({msg: "getCurrentPlaylistInfo"}, (response) => {
    console.log(response);
    const elCont = document.querySelector('.cont_section');
    console.log(response.oVExInfo);
    let videoSeq = fnGetVideoSeq();
    let videoArea = `
    <div class="video_area suggest">
        <h3 class="tit">${response.oVExInfo.playlistName}</h3>
        <div class="inner">
            <ul class="video_list _extension_playlist">`;
    const videoList = response.oVExInfo.videoList;
    videoList.forEach(video => {
        const isOnAir = videoSeq === video.videoSeq;
        videoArea += `
        <li class="video_list_cont ${isOnAir ? 'onair' : ''} _suggest_page_1" style="display: inline-block;">
            <a href="/video/${video.videoSeq}" class="thumb_area" title="${video.title}">
                <div class="icon_box">	
                </div>
                <img class="" width="228" height="128" alt="" src="${video.thumbnail}?type=f228_128">
                <span class="thumb_border"></span>
            </a>
            <a href="/video/${video.videoSeq}" class="video_tit" title="${video.title}">${video.title}</a>
        </li>
        `;
    });
    videoArea += `</ul>
        </div>
    </div>`;

    elCont.innerHTML = videoArea + elCont.innerHTML;
});



// 현재 playlist가 플래이 중인지 확인하고 플레이 중이면 아이콘을 변경해야 한다.
// playlist play 여부는 background에 데이터를 넣는걸로 체크하면 될듯 하다.
// 현재 화면이 close 될때 background 데이터도 같이 없애는 걸로 하면 되지 않을까?

// lastplayInfo


// chrome.runtime.sendMessage({ msg: "change_icon"});

//_playlist.addPlaylist('default');
// saveVideo('stay');

/* storage data struct
{
    'playlist': {
        'default' : {  // map 형태로 변경
            'videoList' : [{
                videSeq: 12345,
                title: 'title',
                startAt: '', // null is 00
                endat: '' // null is end
                thumbnail: '' // thumbnail 필요한가?
            }]
        }
    },
    'lastplayInfo': {
        'playlist': 'defualt',
        'index': 0
    }
}
*/