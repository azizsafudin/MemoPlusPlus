$(document).ready(function() {
	migrate();					//	migrate localStorage defaults/changes
	settings();					//	prepare settings page, load settings
	setupPage();				//	UI changes to be done only once
	loadTransactions();			//	get all txhash belonging to current user

	//	Everything here can be called more than once, to reapply the changes.
	muteUsers();				//	main entry for preparing muting feature
	verifyUsers();				//	main entry for verifying user feature
	fancyPolls();				//	Applies fancy poll UI
	generalChanges();			//	Applies general UI changes
	parseMemos();				//	Embeds stuff like twitter/instagram links found in memo
	updateNotifications();		//	Applies notifications stuff
	
	getUpdates();				//	sets up chainfeed.listen

	neverEndingMemo();			//	Loads new memo once the bottom is reached
	mutationHandler();			//	Reapplies extension when DOM changes
	$("body").show();
	
	console.log('Memo++ loaded');
});

var notification_count = Number($('li.notifications a').first().text().replace(/\s/g,''));        //    global var to handle notifications
var title = $(document).attr('title');

function migrate(){
	var old_mute_list = localStorage.getItem('memo-list');
	localStorage.removeItem('memo-list');
	if(old_mute_list) localStorage.setItem('memo-mute-list', old_mute_list);

	var old_settings = getSettings();
	var new_settings = Object.assign({}, default_prefs, old_settings);
	setSettings(new_settings);
}
/*
	Sets up UI changes and any other required changes
*/
function setupPage(){
	var settings = getSettings();
	
	$('head').prepend('<link href="'+settings.font.url+'" rel="stylesheet">');	//	Allow users to import fonts from google fonts
	$('body').css('font-family', '"'+settings.font.name+'", Muli, "Helvetica Neue", Helvetica, Arial, sans-serif');
	
	//	Footer control stuff
	$('body').prepend(	`<div class="footer-control">
							<button id="toTop" class="btn btn-success" title="Go to top">Back to top</button>
							<button id="showFooter" class="btn btn-primary" title="Show footer">
								<span class="glyphicon glyphicon-menu-hamburger"></span>
							</button></div>`);

	$('#toTop').click(function () {
		$('html, body').animate({scrollTop: 0}, 1000);
	});
	$('#showFooter').click(function () {
		var footer = $('div.footer');
		footer.toggleClass('showFooter');
		footer.prev().toggleClass('bottom-margin');
	});

	//	navbar stuff
	var c, currentScrollTop = 0, navbar = $('nav');
   	$(window).scroll(function () {
		var a = $(window).scrollTop();
		var b = navbar.height();
		currentScrollTop = a;

		if (c < currentScrollTop && a > b + b) {
		navbar.addClass("scrollUp");
		if(settings.general.show_footer_control) $('.footer-control').fadeIn(500);
		} else if (c > currentScrollTop && !(a <= b)) {
		navbar.removeClass("scrollUp");
		}
		c = currentScrollTop;
 	});

	$('.container').not(':eq(0)')
		.css('padding-right', '4em')
		.css('padding-left', '4em');
	//dark mode changes
	$('body.dark').css('background', '#'+dark_palette[0]);
	$('body.dark nav.navbar').css('background', `linear-gradient(#${dark_palette[1]},#${dark_palette[2]})`);

	$('.navbar-right').append(`<li class="nav-item btn">
		<button class="btn btn-info" id="memo-new" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
									<span class="glyphicon glyphicon-pencil"></span></button>
									<ul class="dropdown-menu dropdown-menu-left">
				                        <li><a href="memo/new">Memo</a></li>
				                        <li><a href="poll/create">Poll</a></li>
				                    </ul></li>`);

	var dashboard = $('div.navbar-collapse ul.nav.navbar-nav li a').first().text();
	$('div.navbar-collapse ul.nav.navbar-nav li a').slice(0,2).remove();		//	hide dashboard and new

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

	//	Make changes to UI based on settings.
	$('nav a[href*="posts"]').first().attr('href', base_url + urls.posts[settings.default_posts] );
	$('nav a[href*="topics"]').first().attr('href', base_url + urls.topics[settings.default_topics] );
}

/*
	Applies general UI changes. Can be reapplied more than once.
*/
function generalChanges(){
	$('.btn')
		.not('#memo-new')
		.not('p.posts-nav a')
		.not('.pagination a')
		.not('div.dashboard-actions a')
		.css('border-radius', '1.5em')
		.css('outline', 'none');										//	make all buttons cute and rounded
	$('input, select').css('border-radius', '1.5em');					//	make all inputs rounded and cute
	$('textarea').css('border-radius', '1em');							//	make all textareas slightly rounded and cute
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

function getUser(){
    if(!!localStorage.WalletPassword){
        var address = getUserAddress($('a[href*="profile/"]').first());
        return {
            'address' : address
        };
    }
    return false;
}