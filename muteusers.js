/*
	Main muteUser method.
*/
function muteUsers(){	
	var list = getMuteList();

	addMuteButton();
	hideMutedUsers();

	$('button.memo-mute').click(function(e) {						//	Handle mute button click.
		e.preventDefault();
		var addr = getUserAddress($(this).siblings('a.profile'));
		mute(addr);
	});	
	
	$('button.memo-unmute').click(function(e) {						//	Handle unmute button click.
		e.preventDefault();
		var addr = getUserAddress($(this).siblings('span.memo-addr').find('a').first());
		unmute(addr);
	});
}

function addMuteButton(){
	const mute_btn = '<button type="button" class="btn btn-danger btn-sm memo-mute" style="border-radius: 2em;">Mute</button>';
	$('p.name').each(function(index){
		var addr = getUserAddress($(this).find('a.profile, .memo-addr').first());
		if(!isMuted(addr) && $(this).children('button.memo-mute').length === 0){	//	only add mute button if it doesn't already exist and user not muted.
			$(this).append(mute_btn);
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
	const hidden_1 = '</span><span> has been muted.</span><button type="button" class="memo-unmute btn btn-info btn-sm" style="margin-left:1em; border-radius:2em;">Unmute</button></p></div>';

	$('div.post').each(function(index) {
		var addr = getUserAddress($(this).find('a.profile').first());
		if(isMuted(addr) && $(this).children('div.memo-muted-user').length === 0){
			var string = hidden_0 +`<a href="${base_url}/profile/${addr}">${addr}</a>`+ hidden_1;
			$(this).children().not('div.post').not('script').remove();	//delete all child elements except script and div.post
			$(this).prepend(string);
		}
	});		
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
	}
}

/*
	Returns whether a user is in mute list.
*/
function isMuted(addr){
	var list = getMuteList();
	return list.indexOf(addr) > -1;
}