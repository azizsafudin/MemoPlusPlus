$(document).ready(function() {
	migrate();					//	migrate localStorage defaults/changes
	settings();					//	prepare settings page, load settings

	muteUsers();				//	main entry for preparing muting feature
	verifyUsers();				//	main entry for verifying user feature

	fancyPolls();				//	Applies fancy poll UI
	generalChanges();			//	Applies general UI changes
	parseMemos();				//	Embeds stuff like twitter/instagram links found in memo

	neverEndingMemo();			//	Loads new memo once the bottom is reached
	mutationHandler();			//	Reapplies extension when DOM changes
	refresh();					//	Refreshes the page to update notifications

	$("body").show();
});


function migrate(){
	localStorage.removeItem('memo-list');
	getMuteList();
	var old_settings = getSettings();
	var new_settings = Object.assign({}, default_prefs, old_settings);
	setSettings(new_settings);
}

/*
	Main function applying general UI changes.
*/
function generalChanges(){
	var settings = getSettings();

	$('li a:contains("New")').css('font-weight','bold');

	$('a:contains("Dashboard")').hide();					//	move dashboard into dropdown menu
	$('a:contains("Settings")').parent().before('<li><a href="/">Dashboard</a></li>');

	$('.btn').css('border-radius', '1.5em');				//	make all buttons cute and rounded
	$('input, select').css('border-radius', '1.5em');
	$('textarea').css('border-radius', '1em');

	$('.post.rounded').find('.btn').removeClass('btn-default');
	$('.post.rounded').find('.btn').mouseover(function(e){
		$(this).addClass('btn-default');
	});
	$('.post.rounded').find('.btn').mouseout(function(e){
		$(this).removeClass('btn-default');
	});
	// $('.post.rounded').css('padding','0.6em 1em 0 1em');


	//dark mode changes
	$('body.dark').css('background', '#'+dark_palette[0]);
	$('body.dark nav.navbar').css('background', `linear-gradient(#${dark_palette[1]},#${dark_palette[2]})`);
	// $('body.dark a').css('color', '#'+dark_palette[3]);
	// $('body.dark .navbar-default .navbar-nav>.active>a').css('border-color','#'+dark_palette[3]);
	$('.post-header').css('margin-bottom','1em');	


	var notif = Number($('li.notifications a').first().text().replace(/\s/g,''));
	if(notif != 0){
		var title = $(document).attr('title');
		var favicon = new Favico();							//	favico.js is lit.
		title = '('+notif+') ' + title;						//	set notification in title
		$(document).attr('title', title);
		$('li.notifications a').css('color', 'red');
		favicon.badge(notif);
	}

	//changes on profile page
	if(location.href.indexOf('/profile') > -1){
		var img = $('td.name').find('img.profile-pic').first();
		img.css('height', '2em');
		img.mouseover(function(e){
			$(this).css('height', '6em');
		});
		img.mouseout(function(e){
			$(this).css('height', '2em');
		});
	}

	//	Make changes to UI based on settings.
	$('nav').find('a:contains("Posts")').attr('href', base_url + urls.posts[settings.default_posts] );
	$('nav').find('a:contains("Topics")').attr('href', base_url + urls.topics[settings.default_topics] );
}
/*
	Gets user address from element containing href to profile page.
*/
function getUserAddress(context){
	if(context.attr('href')){
		var url = context.attr('href');
		var array = url.split('/');
		var address = array[array.length-1];
		return address;
	}
}

function trimAddress(addr, firstN, lastN){
	var firstN = addr.substring(0,firstN);
	var lastN = addr.substr(addr.length - lastN);
	return firstN+'...'+lastN;
}

function mutationHandler(){
	var config = {
		attributes: true, 
		childList: true, 
		characterData: true 
	};
	if(location.href.indexOf('/topic/') > -1){
		var target = $('#all-posts')[0];
		var observer = new WebKitMutationObserver(function(mutations) {
			verifyUsers();
		});
		observer.observe(target, config);
	}
}

function refresh(){
	var settings = getSettings();
	var refresh_rate = settings.refresh_rate;
	if(settings.refresh_enabled){
		setTimeout(function(){
			location.reload(true);
		}, refresh_rate);
	}
}