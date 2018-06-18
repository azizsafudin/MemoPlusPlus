$(document).ready(function() {
	migrate();
	muteUsers();
	verifyUsers();
	fancyPolls();
	settings();
	generalChanges();
	parseMemos();
	neverEndingMemo();
	mutationHandler();
	$("body").show();
});


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