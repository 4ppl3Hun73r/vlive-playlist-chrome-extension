// layer를 만들어서 숨김 처리 해 놓기
const elBody = document.body;
const elPlaylistLayer = document.createElement('div');
elPlaylistLayer.className = 'v-ex-playlist-layer';
elPlaylistLayer.style.display = 'none';
elBody.appendChild(elPlaylistLayer);

elPlaylistLayer.innerHTML = `
<div class="v-ex-playlist-head">
    <input type="text" id="v-ex-newplaylist"/>
    <input type="checkbox" id="v-ex-newplaylist-checkbox"/>
</div>
<div class="v-ex-playlist">
    <ui class="v-ex-list">
    </ui>
</div>
`;


const fnLoadPlaylist = function() {

};
fnLoadPlaylist();


const fnTogglePlaylistLayer = function(el) {
    if (elPlaylistLayer.style.display === 'none') {
        fnShowLayer(el);
    } else {
        fnHideLayer();
    }
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