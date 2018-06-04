$(document).ready(function() {
	muteUsers();
	$("body").fadeIn(100);		//	Fade in.
});

/*
	Main muteUser method.
*/
function muteUsers(){
	const mute_btn = '<button type="button" class="btn btn-danger btn-sm memo-mute">Mute</button>';
	const hidden_0 = '<div class="post-header"><p class="name" style="padding:0.5em;"><span class="memo-name">';
	const hidden_1 = '</span><span> has been muted.</span><button type="button" class="memo-unmute btn btn-info btn-sm" style="margin-left:1em;">Unmute</button></p></div>';
	
	var list = localStorage.getItem('memo-list');

	if(list === null || list === undefined)	localStorage.setItem('memo-list', JSON.stringify([]));

	$('p.name').append(mute_btn);									//	Add mute button.

	$('button.memo-mute').click(function(e) {						//	Handle mute button click.
		e.preventDefault();
		var name = $(this).siblings('a.profile').text();
		mute(name);
	});	

	$(document).on('click', 'button.memo-unmute',function(e) {		//	Handle unmute button click.
		e.preventDefault();
		var name = $(this).siblings('span.memo-name').text();
		unmute(name);
	});	

	$('div.post').each(function(index) {
		var name = $(this).find('a.profile').first().text();
		if(isMuted(name)){
			var string = hidden_0 + name + hidden_1;
			$(this).children().not('div.post').not('script').remove();	//delete all child elements except script and div.post
			$(this).prepend(string);
		}
	});	
}

/*
	Adds user's name to mute list
*/
function mute(name){
	var list = localStorage.getItem('memo-list');
	if(list === undefined || list === null){
		list = [];
	}else{
		list = JSON.parse(list);
	}
	if(!isMuted(name)) {
		list.push(name);
		localStorage.setItem('memo-list', JSON.stringify(list));
		// alert(name + ' muted.');
		location.reload();
	}else{
		alert(name + ' is already muted.');
	}	
}

/*
	Removes user's name from mute list
*/
function unmute(name){
	var list = localStorage.getItem('memo-list');
	if(list !== null || list !== undefined){
		list = JSON.parse(list);
		var index = list.indexOf(name);
		if (index > -1) {
			list.splice(index, 1);
			localStorage.setItem('memo-list', JSON.stringify(list));
			// alert(name + ' is unmuted.');
			location.reload();
		}
	}
}

/*
	Returns whether a user is in mute list.
*/
function isMuted(name){
	var list = localStorage.getItem('memo-list');	
	list = JSON.parse(list);
	return list.indexOf(name) > -1;
}