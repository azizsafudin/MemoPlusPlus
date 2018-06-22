$(document).ready(function() {
	migrate();					//	migrate localStorage defaults/changes
	settings();					//	prepare settings page, load settings
	setupPage();				//	UI changes to be done only once

	muteUsers();				//	main entry for preparing muting feature
	verifyUsers();				//	main entry for verifying user feature

	fancyPolls();				//	Applies fancy poll UI
	generalChanges();			//	Applies general UI changes
	parseMemos();				//	Embeds stuff like twitter/instagram links found in memo
	updateNotifications();		//	Applies notifications stuff

	neverEndingMemo();			//	Loads new memo once the bottom is reached
	mutationHandler();			//	Reapplies extension when DOM changes

	$("body").show();
});

var notification_count = Number($('li.notifications a').first().text().replace(/\s/g,''));        //    global var to handle notifications
var title = '';

function migrate(){
	var old_mute_list = localStorage.getItem('memo-list');
	localStorage.removeItem('memo-list');
	if(old_mute_list) localStorage.setItem('memo-mute-list', old_mute_list);

	var old_settings = getSettings();
	var new_settings = Object.assign({}, default_prefs, old_settings);
	setSettings(new_settings);
}

/*
	Main function applying general UI changes.
*/
function generalChanges(){
	$('.btn')
		.not('p.posts-nav a')
		.not('.pagination a')
		.not('div.dashboard-actions a')
		.css('border-radius', '1.5em');									//	make all buttons cute and rounded
	$('input, select').css('border-radius', '1.5em');					//	make all inputs rounded and cute
	$('textarea').css('border-radius', '1em');							//	make all textareas slightly rounded and cute

	if(location.href.indexOf('/topic') < 0){
		$('.post-header').css('margin-bottom','1em');	
	}
}

function setupPage(){
	var settings = getSettings();
	title = $(document).attr('title');
	
	$('head').prepend('<link href="'+settings.font.url+'" rel="stylesheet">');	//	Allow users to import fonts from google fonts
	$('body').css('font-family', '"'+settings.font.name+'", Muli, "Helvetica Neue", Helvetica, Arial, sans-serif');
	
	$('.container').not(':eq(0)')
		.css('padding-right', '4em')
		.css('padding-left', '4em');
	//dark mode changes
	$('body.dark').css('background', '#'+dark_palette[0]);
	$('body.dark nav.navbar').css('background', `linear-gradient(#${dark_palette[1]},#${dark_palette[2]})`);
	// $('body.dark a').css('color', '#'+dark_palette[3]);
	// $('body.dark .navbar-default .navbar-nav>.active>a').css('border-color','#'+dark_palette[3]);
	$('.navbar-brand.navbar-left').attr('href', base_url+'/feed')

	if($('#memo-plus-icon').length === 0){
		$('#navbarDropdown')
			.css('font-weight','700')
			.append(' <span class="glyphicon glyphicon-plus" id="memo-plus-icon" style="font-size:0.8em" title="New memo"></span>');
		}

	var dashboard = $('div.navbar-collapse ul.nav.navbar-nav li a').first().text();
	$('div.navbar-collapse ul.nav.navbar-nav li a').first().hide();		//	move dashboard into dropdown menu
	$('a[href$="settings"]').parent()
			.before(`<li><a href="/">${dashboard}</a></li>`);
	
	// Nav displaying "ranked", "all", "personalized", etc.
	$('p.posts-nav a')
		.addClass('btn btn-default btn-md')								//	make nav links into buttons
		.css('text-decoration', 'none')
		.css('margin', 0);
	$('p.posts-nav a, div.dashboard-actions a')
		.wrapAll('<div class="btn-group">')
	$('p.posts-nav a, div.dashboard-actions a').first()
		.css('border-bottom-left-radius','1.5em')						//	make the first and last buttons rounded on the edges
		.css('border-top-left-radius','1.5em');
	$('p.posts-nav a, div.dashboard-actions a').last()
		.css('border-bottom-right-radius','1.5em')
		.css('border-top-right-radius','1.5em');
	$('p.posts-nav a.sel')
		.addClass('btn-primary')
		.removeClass('btn-default');
	$('p.posts-nav a').not('.sel')
		.css('font-weight', '200')
		.mouseover(function(e){											//	mouseover effect on posts-nav bar
			$(this).toggleClass('btn-primary btn-default');
		})
		.mouseout(function(e){
			$(this).toggleClass('btn-default btn-primary');
		});
	$('div.pagination a')
		.css('text-decoration', 'none')
		.addClass('btn btn-sm')
		.css('margin', 0)
	.not('.sel')
		.mouseover(function(e){											//	set mouseover to highlight buttons
			$(this).addClass('btn-default');
		})
		.mouseout(function(e){
			$(this).removeClass('btn-default');
		});
	$('div.pagination a.sel')
		.css('font-weight','700')
		.addClass('btn-default')
	
	$('.post.rounded, .post').find('.btn')
		.removeClass('btn-default')										//	make all buttons not have an outline
		.mouseover(function(e){											//	set mouseover to highlight buttons in posts
			$(this).addClass('btn-default');
		})
		.mouseout(function(e){
			$(this).removeClass('btn-default');
		});

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
	$('nav a[href*="posts"]').first().attr('href', base_url + urls.posts[settings.default_posts] );
	$('nav a[href*="topics"]').first().attr('href', base_url + urls.topics[settings.default_topics] );
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
			updateView();
		});
		observer.observe(target, config);
	}
}

function updateView(){		//	reapplies all UI changes
	muteUsers();													//	reapply muteUsers
	verifyUsers();													//	reapply verifyUsers
	parseMemos();
	generalChanges();
}

function updateNotifications(){
	var favicon = new Favico();										//	favico.js is lit.

	if(location.href.indexOf('/notifications') > -1){
		notification_count = 0;
		$(document).attr('title', title);
		favicon.reset();
	}

	if(notification_count != 0){
		var new_title = '('+notification_count+') ' + title;		//	set notification in title
		$(document).attr('title', new_title);
		favicon.badge(notification_count);
		$('li.notifications a').css('color', 'red');
	}

	$('li.notifications a')
		.text(notification_count+' ')
		.append('<span class="glyphicon glyphicon-bell" aria-hidden="true"></span>')
}