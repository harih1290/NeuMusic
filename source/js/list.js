/* 
<div class="item">
    <div class="item_info">
        <span class="item_name" href = "song" pro = "play" id = item.id  name =  i></span>
        </br>
        <div class="song_SA">
            <a class="singer" id= item.ar[0].id> item.ar[0].name + '-'</a> <a class="album" id= item.al.id > item.al.name </a>
        </div>
    </div>
    <div class="process">
        <i class="fas fa-play"  href = "song" pro = "play" id = item.id  name = i > item.name </i>
        <i class="fas fa-plus"  href = "song" pro = "plus" id = item.id  name = i></i>
        <i class="fas fa-heart"  href = "song" pro = "heart"' id = item.id  name = i" style ="color : #000000/#E79796"></i>
    </div>
</div>
*/

//将歌曲添加到列表
function appendSongList(item, i) {
    let itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href = "song" pro = "play"' + ' id = "' + item.id + '" name = "' + i + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="song_SA"><a class="singer" id= "' + item.ar[0].id + '">';
    itemHtml = itemHtml + item.ar[0].name + '</a> - <a class="album" id="' + item.al.id + '">' + item.al.name + '</a></div></div><div class="process"><i class="fas fa-play"  href = "song" pro = "play"' + ' id = "' + item.id + '" name = "' + i + '">' + '</i><i class="fas fa-plus"  href = "song" pro = "plus"' + ' id = "' + item.id + '" name = "' + i + '">' + '</i>';
    if (likeList.indexOf(item.id) >= 0) itemHtml = itemHtml + '<i class="fas fa-heart"  href = "song" pro = "heart"' + ' id = "' + item.id + '" name = "' + i + '" style ="color : #E79796">' + '</i></div></div>';
    else itemHtml = itemHtml + '<i class="fas fa-heart"  href = "song" pro = "heart"' + ' id = "' + item.id + '" name = "' + i + '" style ="color : #000000">' + '</i></div></div>';
    listId[i] = item.id;
    $(itemHtml).appendTo($(".list"));
    initItem();
}

//将播放列表添加到列表
function appendPlayList(item) {
    let itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href="playlist"' + ' id = "' + item.id + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="playlist_author"><a class="author">';
    //<i class="fas fa-plus" href = "playlist" pro = "plus"' + ' id = "' + item.id + '">' + '</i>
    itemHtml = itemHtml + item.author + '</a></div></div><div class="process"><i class="fas fa-play" href="playlist" href = "playlist" pro = "play"' + ' id = " ' + item.id + '">' + '</i>';
    if (item.subscribed == -1) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #00000050" href="playlist"' + ' id = "' + item.id + '" href = "playlist" pro = "star">' + '</i></div></div>';
    else if (item.subscribed) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #E79796" href="playlist"' + ' id = "' + item.id + '"  href = "playlist" pro = "star">' + '</i></div></div>';
    else itemHtml = itemHtml + '<i class="fas fa-star" href="playlist"' + ' id = "' + item.id + '"  href = "playlist" pro = "star">' + '</i></div></div>';
    console.log(itemHtml);
    $(itemHtml).appendTo($(".list"));
    initItem();
}

//更改列表
function changeList(list_info, items, type) {
    $(".list").html('<div class="list_info">播放列表</div>');
    listId = [];
    $(".list_info").html(list_info);
    console.log(items);
    if (type == "playlist") items.forEach(appendPlayList);
    else if (type == "song") items.forEach(appendSongList);
}

//为列表里的item绑定点击事件
function initItem() {
    $(".item_name").unbind('click').click(function () {
        itemClick($(this));
    });
    $(".process i").unbind('click').click(function () {
        itemClick($(this));
    })
}

//列表item点击事件
function itemClick(el) {
    let id = el.attr('id');
    let type = el.attr('href');
    let pro = el.attr('pro');
    console.log(pro);
    if (type == "playlist") {
        let api_adr = "http://csgo.itstim.xyz:3000/playlist/detail?" + cookieStr + "&id=" + id;
        let data;
        if (data = ajaxGet(api_adr)) {
            changeList(data.playlist.name, data.playlist.tracks, "song");
            if (pro == "play") {
                playSongFromId(data.playlist.trackIds[0].id, true);
                localStorage.playingListId = JSON.stringify(playingListId = listId);
                localStorage.playingIndex = playingIndex = 0;
                if (playMethod == 2) shuffle();
            } else if (pro == "star") {
                let t = starAList(id);
                $(this).attr("style", ((t == 2) ? "color: #000000" : "color: #E79796"));
            }
        }
    } else if (type == "song") {
        if (pro == "play") {
            playSongFromId(id, true);
            localStorage.playingListId = JSON.stringify(playingListId = listId);
            localStorage.playingIndex = playingIndex = el.attr('name');
            if (playMethod == 2) shuffle();
        } else if (pro == "plus") {
            playAtNext(id);
        } else if (pro == "heart") {
            let fl = likeASong(id);
            $(this).attr("style", (fl ? "color: #000000" : "color: #E79796"));
        }

    }
}

//下一首播放
function playAtNext(id) {
    if (playMethod == 2) {
        let ori = playingListId.indexOf(parseInt(id), 0);
        let des = shuffledPlayingIndexs[parseInt(playingIndex)] + 1;
        if (id == shuffledPlayingIndexs[playingIndex] || (ori == des && shuffledPlayingIndexs[playingIndex + 1] == ori)) return;
        if (ori) {
            playingListId.splice(ori, 1);
            playingListId.splice(des, 0, parseInt(id));
            if (shuffledPlayingIndexs.indexOf(ori) < parseInt(playingIndex)) playingIndex = parseInt(playingIndex) - 1;
            shuffledPlayingIndexs.splice(shuffledPlayingIndexs.indexOf(ori), 1);
            if (ori > des) {
                for (let i = 0; i < shuffledPlayingIndexs.length; i++) {
                    if (shuffledPlayingIndexs[i] >= des && shuffledPlayingIndexs[i] < ori)
                        shuffledPlayingIndexs[i]++;
                }
            } else if (ori < des) {
                for (let i = 0; i < shuffledPlayingIndexs.length; i++) {
                    if (shuffledPlayingIndexs[i] < des && shuffledPlayingIndexs[i] > ori)
                        shuffledPlayingIndexs[i]--;
                }
                des--;
            }
        } else {
            playingListId.splice(des, 0, parseInt(id));
            for (let i = 0; i < shuffledPlayingIndexs.length; i++) {
                if (shuffledPlayingIndexs[i] >= des)
                    shuffledPlayingIndexs[i]++;
            }
        }
        shuffledPlayingIndexs.splice(parseInt(playingIndex) + 1, 0, des);
    } else {
        if (id == playingListId[playingIndex]) return;
        let ind = playingListId.indexOf(parseInt(id), 0);
        if (ind) playingListId.splice(ind, 1);
        playingListId.splice(playingIndex + 1, 0, parseInt(id));
    }
}

//从id获取歌曲
function getSongsFromTrackIds(ids) {
    let api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + ids;
    let data;
    if (data = ajaxGet(api_adr)) listSongs = data.songs;
}