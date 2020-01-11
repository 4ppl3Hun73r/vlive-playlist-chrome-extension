let init = false;
window.addEventListener('ADD_EVENT', (event) => {
    if (!init) {
        vlive.video.webPlayer.on('contentended', function(e) { 
            let event = new CustomEvent('PLAY_END');
            window.dispatchEvent(event);
            console.log(e);
        });
        vlive.video.webPlayer.on('suspend', function(e) { console.log(e); alert('suspend'); });
        init = true;
    }
 }, false);