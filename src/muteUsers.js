/*
	Main muteUser method.
*/
function muteUsers(){	
	var list = getMuteList();

	addMuteButton();
	hideMutedUsers();

	$('button.memo-mute').click(function(e) {						//	Handle mute button click.
		e.preventDefault();
		// var addr = getUserAddress($(this).siblings('a.profile'));
		var addr = $(this).siblings('span.mini-profile-name').data('profile-hash');
		mute(addr);
	});	
	
	$('button.memo-unmute').click(function(e) {						//	Handle unmute button click.
		e.preventDefault();
		var addr = getUserAddress($(this).siblings('span.memo-addr').find('a').first());
		unmute(addr);
	});
}

function addMuteButton(){
	const mute_btn = '<button type="button" class="btn btn-danger btn-xs memo-mute" font-size:0.7em;">Mute</button>';
	$('div.name').each(function(index){
		var addr = getUserAddress($(this).find('a.profile, .memo-addr a').first());
		if(!isMuted(addr) && $(this).children('button.memo-mute').length === 0){	//	only add mute button if it doesn't already exist and user not muted.
			$(this).append(mute_btn);
			$(this).find('.memo-mute').attr('title', "Mute address:"+addr);
		}
	});
}

/*
	Get mute list
*/
function getMuteList(){
	var list = localStorage.getItem('memo-mute-list');
	if(!list){
		localStorage.setItem('memo-mute-list', JSON.stringify([]));
		return [];
	}
	return JSON.parse(list);
}

/*
	Set mute list
*/
function setMuteList(list){
	localStorage.setItem('memo-mute-list', JSON.stringify(list));
}

function hideMutedUsers(){
	const hidden_0 = '<div class="post-header memo-muted-user"><p class="name" style="padding:0.5em;"><span class="memo-addr">';
	const hidden_1 = '</span><span> has been muted.</span>';
	const unmute_btn = '<button type="button" class="memo-unmute btn btn-info btn-xs" style="margin-left:1em; font-size:0.7em;">Unmute</button>';
	const hidden_2 = '</p></div>';
	$('div.post, div.feed-item-post').each(function(index) {
		var profile = $(this).find('span.mini-profile-name');
		if(isMuted(profile.first().data('profile-hash')) && $(this).children('span.memo-addr').length === 0){
			var addr = profile.first().data('profile-hash');
			var string = `${hidden_0}<a href="${base_url}/profile/${addr}" title="${addr}">${trimAddress(addr,6,4)}</a>${hidden_1}${unmute_btn}${hidden_2}`;
			$(this).children().not('div.post').not('script').remove();	//delete all child elements except script and div.post
			$(this).prepend(string);
		}
		if(isMuted(profile.eq(1).data('profile-hash')) && $(this).children('span.memo-addr').length === 0){
			var addr = profile.eq(1).data('profile-hash');
			var string = `<span class="memo-addr"><a href="${base_url}/profile/${addr}" title="${addr}">${trimAddress(addr,6,4)}</a> has been muted.</span>${unmute_btn}`;
			$(this).find('div.reply').text('').prepend(string);
		}
	});

	// $('div.reply').each(function(index) {
	// 	var addr = $(this).find('span.mini-profile-name').first().data('profile-hash');
	// 	if(isMuted(addr) && $(this).children('span.memo-addr').length === 0){
	// 		$(this).text('');
	// 		$(this).prepend(`<span class="memo-addr"><a href="${base_url}/profile/${addr}" title="${addr}">${trimAddress(addr,6,4)}</a> has been muted.</span>${unmute_btn}`);
	// 	}
	// });

	$('div.topic-post').each(function(index) {
		var addr = $(this).find('span.mini-profile-name').first().data('profile-hash');
			if(isMuted(addr) && $(this).find('div.memo-muted-user').length === 0){
				$(this).children().remove();
				$(this).append(`<span class="memo-addr"><a href="${base_url}/profile/${addr}" title="${addr}">${trimAddress(addr,6,4)}</a> has been muted.</span>${unmute_btn}`)
			}
	});

	if(location.href.indexOf('/notifications') > -1){
		var hidden = 0;
		$('tr').each(function(index){
			var addr = getUserAddress($(this).find('a').first());
			if(isMuted(addr) && 1){
				var context = $(this).find('a').first();
				context.parent().text('');
				context.siblings().remove();
				$(this).find('td:eq(1)').prepend(`Activity has been hidden from <a href="${base_url}/profile/${addr}" title="${addr}">${trimAddress(addr,6,4)}</a>`);
			}
		});
	}	
}

/*
	Adds user's address to mute list
*/
function mute(addr){
	var list = getMuteList();

	if(!isMuted(addr)) {
		list.push(addr);
		setMuteList(list);
		location.reload();
	}else{
		location.reload();
	}
}

/*
	Removes user's address from mute list
*/
function unmute(addr){
	var list = getMuteList()

	var index = list.indexOf(addr);
	if (index > -1) {
		list.splice(index, 1);
		setMuteList(list);
		location.reload();
	}else{
		location.reload();
	}
}

/*
	Returns whether a user is in mute list.
*/
function isMuted(addr){
	var list = getMuteList();
	return list.indexOf(addr) > -1;
}