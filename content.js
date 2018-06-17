$(document).ready(function() {
	migrate();
	muteUsers();
	fancyPolls();
	settings();
	generalChanges();
	parseMemos();
	neverEndingMemo();
	$("body").show();
});

const base_url = 'https://memo.cash';
const urls = 	{
					'posts' : {
						'ranked': '/posts/ranked',
						'top': '/posts/top',
						'personalized': '/posts/personalized',
						'new': '/posts/new'
					},
					'topics' : {
						'following': '/topics',
						'all': '/topics/all',
						'most-followed': '/topics/most-followed',
						'most-posts': '/topics/most-posts',
					},
				}
const default_prefs =  	{
							'default_posts' : 'ranked',
							'default_topics' : 'all',
						}

function migrate(){
	localStorage.removeItem('memo-list');
	if(!localStorage.getItem('memo-mute-list')){
		localStorage.setItem('memo-mute-list', JSON.stringify([]));
	}
}

/*
	Main function applying general UI changes.
*/
function generalChanges(){
	var settings = getSettings();

	$('li a:contains("New")').css('font-weight','bold');

	$('a:contains("Dashboard")').hide();	//move dashboard into dropdown menu
	$('a:contains("Settings")').parent().before('<li><a href="/">Dashboard</a></li>');

	
	var notif = Number($('li.notifications a').first().text().replace(/\s/g,''));
	if(notif != 0){
		var title = $(document).attr('title');
		var favicon = new Favico();							//	favico.js is lit.
		title = '('+notif+') ' + title;						//	set notification in title
		$(document).attr('title', title);
		$('li.notifications a').css('color', 'red');
		favicon.badge(notif);
	}

	//	Make changes to UI based on settings.
	$('nav').find('a:contains("Posts")').attr('href', base_url + urls.posts[settings.default_posts] );
	$('nav').find('a:contains("Topics")').attr('href', base_url + urls.topics[settings.default_topics] );
}

/*
	Get user settings
*/
function getSettings(){
	var settings = localStorage.getItem('memo-settings');

	if(!settings){
		var default_settings = default_prefs;
		localStorage.setItem('memo-settings', JSON.stringify(default_settings));
		return default_settings;
	}
	return JSON.parse(settings);
}

/*
	Set user settings form in the settings page.
*/
function settings(){
	var settings = getSettings();

	if(window.location.href.indexOf("/settings") > -1) {

	//	Just hard code this. No biggie.
	var template_start =	'<h2>Memo++ settings</h2><br><form id="memo-settings-form" class="form-horizontal">';
	var settings_0 =		'<div class="form-group row">' +
							'<label class="col-form-label col-sm-3">Default Posts Tab</label>' +
							'<div class="col-sm-9">' +
							'<div class="checkbox"><input id="posts-ranked" type="radio" name="default-posts" class="form-check-input" value="ranked"/>' +
							'<label for="posts-ranked" class="form-check-label">' +
									'Ranked' +
							'</label></div>' +
							'<div class="checkbox"><input id="posts-top" type="radio" name="default-posts" class="form-check-input" value="top" />' +
							'<label for="posts-top" class="form-check-label">' +
									'Top' +
							'</label></div>' +
							'<div class="checkbox"><input id="posts-personalized" type="radio" name="default-posts" class="form-check-input" value="personalized" />' +
							'<label for="posts-personalized" class="form-check-label">' +
									'Personalized' +
							'</label></div>' +
							'<div class="checkbox"><input id="posts-new" type="radio" name="default-posts" class="form-check-input" value="new"/>' +
							'<label for="posts-new" class="form-check-label">' +
									'New' +
							'</label></div></div></div>';
	var settings_1 =		'<div class="form-group row">' +
							'<label class="col-form-label col-sm-3">Default Topics Tab</label>' +
							'<div class="col-sm-9">' +
							'<div class="checkbox"><input id="topics-following" type="radio" name="default-topics" class="form-check-input" value="following"/>' +
							'<label for="topics-following" class="form-check-label">' +
									'Following' +
							'</label></div>' +
							'<div class="checkbox"><input id="topics-all" type="radio" name="default-topics" class="form-check-input" value="all"/>' +
							'<label for="topics-all" class="form-check-label">' +
									'All' +
							'</label></div>' +
							'<div class="checkbox"><input id="topics-most-followed" type="radio" name="default-topics" class="form-check-input" value="most-followed"/>' +
							'<label for="topics-most-followed" class="form-check-label">' +
									'Most Followed' +
							'</label></div>' +
							'<div class="checkbox"><input id="topics-most-posts" type="radio" name="default-topics" class="form-check-input" value="most-posts"/>' +
							'<label for="topics-most-posts" class="form-check-label">' +
							'Most Posts' +
							'</label></div></div></div>';
	var save_btn =			'<br><div class="form-group"><div class="col-sm-3"></div><div class="col-sm-9"><input type="button" id="memo-save" class="btn btn-success" value="Save memo++ settings"></div></div>'						
	var template_end =		'</form>';

	var template = template_start + settings_0 + settings_1 + save_btn + template_end;

	$('#settings-form').after(template);									//	add form after memo's default form
		
	$('[value="'+settings.default_posts+'"]').prop('checked', true);		//	set checked based on current settings
	$('[value="'+settings.default_topics+'"]').prop('checked', true);


	$('#memo-save').on('click', function(e) {								//	Save settings to localStorage.
		e.preventDefault();

		var posts = $('[name="default-posts"]:checked').val();				//	Get values from form.
		var topics = $('[name="default-topics"]:checked').val();

		settings.default_posts = posts;
		settings.default_topics = topics;
		localStorage.setItem('memo-settings', JSON.stringify(settings));

		alert('Settings updated!');
		location.reload();
	})

	}
}

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


/*
	Gets user address from element containing href to profile page.
*/
function getUserAddress(context){
	if(context.attr('href')){
		var url = context.attr('href');
		array = url.split('/');
		address = array[array.length-1];
		return address;
	}
}

/*
	Make polls look fancy
*/
function fancyPolls(){
	if(window.location.href.indexOf("/poll") > -1 || window.location.href.indexOf("/post") > -1 ) {
		$('tbody').each(function(index){
			var totalVotes = 0;
			$(this).children('tr').each(function(index){
				var votes = $(this).children('td').eq(1).text().split(' votes');
				totalVotes += Number(votes[0]);											//	get total number of votes
			});
			$(this).children('tr').each(function(index){
				var votes = $(this).children('td').eq(1).text().split(' votes');
				var percentage = totalVotes != 0 ? Math.round((votes[0]/totalVotes)*100) : 0;
				var barwidth = totalVotes != 0 ? Math.round((votes[0]/totalVotes)*94) : 0;

				$(this).children('td').css('width', '30%');
				$(this).children('td').eq(0).after(	'<td><div class="progress memo-poll" style="margin: 0.3em;"><div class="progress-bar progress-bar-striped" '+
													'style="width: '+(barwidth+6)+'%; text-align:left; padding-left:0.4em; font-weight:bold;">'+percentage+'%</div></div></td>');
				$(this).children('td').css('margin', 'auto');
				$(this).children('td').css('padding', '0.5em');
			});
		});
	}
}

/*
	General method that loops through all memos on the page.
*/
function parseMemos(){
	// $('.message').each(function(){
	// 	var context = $(this);
	// 	nameTag(context);
	// });

	//	searching through all links
	$('.message').find('a').each(function(){
		var context = $(this);
		twitterEmbed(context);
		instagramEmbed(context);
		directImageEmbed(context);
	})
}


/*
	Converts @handles to links that go to the profile search page.
*/
function nameTag(context){
	var text = context.html();
    out = text.replace(/@([a-z\d_]+)/ig, '<a href="https://memo.cash/profiles?s=$1">@$1</a>'); 
    context.html(out); 
}

/*
	Embeds tweet when twitter URL is detected.
*/
function twitterEmbed(context){
	var text = context.html();
	var regex = /(^|[^'"])(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+))/;
	var matched = text.match(regex);
	if(matched) {
		context.text('Loading Tweet...');
		$.get('https://publish.twitter.com/oembed?link-color=487521&cards=hidden&url='+matched[2], function(res) {
			var out = text.replace(regex, res.html); 
			context.replaceWith(out);
		});
	}
};

/*
	Embeds Instagram post when instagram URL is detected.
*/
function instagramEmbed(context){
	var text = context.html();
	var regex = /(https?:\/\/www\.)?instagram\.com(\/p\/\w+\/?)/
	var matched = text.match(regex);
	if(matched) {
		context.text('Loading Instagram post...');
		$.get('https://api.instagram.com/oembed?maxwidth=500&url='+matched[0], function(res) {
			var out = text.replace(regex, res.html); 
			context.replaceWith(out);
		});
	}
}

/*
	Embeds image when direct img link is posted.
*/
function directImageEmbed(context){
	var text = context.text();
	var regex = /(?:\.jpg|\.gif|\.png|\.jpeg|\.bmp)/;
	var matched = text.match(regex);
	if(matched) {
		context.text('Loading image...');
		text = '<img class="imgur" src="'+text+'">'; 
		context.replaceWith(text);
	}
}

function neverEndingMemo(){
	var triggered = false;
	if(window.location.href.indexOf('/posts') > -1 || window.location.href.indexOf('/polls') > -1 ){

		$('p.pagination').last().remove();					//	remove bottom pagination menu.

		var url = new URL(location.href);					//	construct URL for get request.

		var offset = url.searchParams.get('offset');		//	get current offset from URL
		if(!offset) offset = 0;								//	set offset to 0 if URL does not have the offset.
		else offset = Number(offset);						//	set offset to int.
		
		$(window).on("scroll", function() {
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).scrollTop();
			if ((scrollHeight - scrollPosition) < 800) {		//	this is the only thing that worked for me. 800 is arbitrary. Can't be less than 400.
				if(!triggered){
					triggered = true; 							//	prevent this from running more than once each time it reaches the bottom.
					
					url.searchParams.set('offset', (offset+25));		//	set offset parameter for get request

					$.get(url, function(res){
						offset += 25;													//	only increment the offset proper when get request succeeds.
						var html = $($.parseHTML(res, document, true));					//	parse the response

						var feed = html.find('div.container').eq(1).children();			//	select children elements of main feed

						feed.siblings('.posts-nav, .pagination, br').remove();			//	remove pagination and menu items.

						$('div.container').eq(1).append(feed.parent().clone().html());	//	clone the parent of the .message nodes.

						muteUsers();													//	reapply muteUsers
						triggered = false;
					}).fail(function() {
				    	alert('Unable to load never ending memos');
				    	setTimeout(function() {											//	allow to try again after 1 second
						    triggered = false;											//	so it doesn't spam the user
						}, 1000);
				 	});
				}
			}
		});
	}
}