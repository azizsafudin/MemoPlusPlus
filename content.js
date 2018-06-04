$(document).ready(function() {
	muteUsers();
	fancyPolls();
	generalChanges();
	$("body").fadeIn(100);		//	Fade in.
});

function generalChanges(){
	$('nav.navbar').addClass('navbar-fixed-top');
	$('div.wrapper').css('padding-top', '60px');

	$('a.navbar-brand').attr('href', 'https://memo.cash/posts/personalized?range=24h');

	$('li a:contains("New")').css('font-weight','bold');

	$('a:contains("Dashboard")').hide();

	$('a:contains("Settings")').parent().before('<li><a href="/">Dashboard</a></li>');

	
	var notif = Number($('li.notifications a').first().text().replace(/\s/g,''));
	if(notif != 0){
		var title = $(document).attr('title');
		var favicon = new Favico({animation :'slide'});		//	favico.js is lit.
		title = '('+notif+') '+title;
		$(document).attr('title', title);
		$('li.notifications a').css('color', 'red');
		favicon.badge(notif);
	}
}

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

/*
	Make polls look fancy
*/
function fancyPolls(){
	if(window.location.href.indexOf("/polls") > -1 || window.location.href.indexOf("/posts") > -1 ) {
		$('tbody').each(function(index){
			var totalVotes = 0;
			$(this).children('tr').each(function(index){
				var votes = $(this).children('td').eq(1).text().split(' votes');
				totalVotes += Number(votes[0]);	//get total number of votes
			});
			$(this).children('tr').each(function(index){
				var votes = $(this).children('td').eq(1).text().split(' votes');
				var percentage = totalVotes != 0 ? Math.round((votes[0]/totalVotes)*100) : 0;
				$(this).children('td').css('width', '30%');
				$(this).children('td').eq(0).after(	'<td><div class="progress memo-poll" style="margin: 0.3em;"><div class="progress-bar progress-bar-striped" '+
													'style="width: '+(percentage+6)+'%; text-align:left; padding-left:0.4em; font-weight:bold;">'+percentage+'%</div></div></td>');
				$(this).children('td').css('margin', 'auto');
				$(this).children('td').css('padding', '0.5em');
			});
		});
	}
}