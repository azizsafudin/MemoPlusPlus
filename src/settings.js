
/*
	Get user settings
*/
function getSettings(){
	var settings = localStorage.getItem('memo-settings');

	if(!settings){
		localStorage.setItem('memo-settings', JSON.stringify(default_prefs));
		return default_prefs;
	}
	return JSON.parse(settings);
}

function setSettings(settings){
	localStorage.setItem('memo-settings', JSON.stringify(settings));
}

/*
	Set user settings form in the settings page.
*/
function settings(){
	var settings = getSettings();

	if(window.location.href.indexOf("/settings") > -1) {

	var template_start =	'<h2>Memo++ settings</h2><br><form id="memo-settings-form" class="form-horizontal">';
	var settings_0	=		
						`<div class="form-group row">
							<label class="col-form-label col-sm-3">Default Posts Tab</label>
							<div class="col-sm-9">
								<div class="checkbox">
									<input id="posts-ranked" type="radio" name="default-posts" class="form-check-input" value="ranked"/>
									<label for="posts-ranked" class="form-check-label">
											Ranked
									</label>
								</div>
								<div class="checkbox">
									<input id="posts-top" type="radio" name="default-posts" class="form-check-input" value="top" />
									<label for="posts-top" class="form-check-label">
											Top
									</label>
								</div>
								<div class="checkbox">
									<input id="posts-personalized" type="radio" name="default-posts" class="form-check-input" value="personalized" />
									<label for="posts-personalized" class="form-check-label">
											Personalized
									</label>
								</div>
								<div class="checkbox">
									<input id="posts-new" type="radio" name="default-posts" class="form-check-input" value="new"/>
									<label for="posts-new" class="form-check-label">
											New
									</label>
								</div>
								<div class="checkbox">
									<input id="posts-threads" type="radio" name="default-posts" class="form-check-input" value="threads"/>
									<label for="posts-threads" class="form-check-label">
											Threads
									</label>
								</div>
								<div class="checkbox">
									<input id="posts-polls" type="radio" name="default-posts" class="form-check-input" value="polls"/>
									<label for="posts-polls" class="form-check-label">
											Polls
									</label>
								</div>
							</div>
						</div>`
	var settings_1	=		
						`<div class="form-group row">
							<label class="col-form-label col-sm-3">Default Topics Tab</label>
							<div class="col-sm-9">
								<div class="checkbox">
									<input id="topics-following" type="radio" name="default-topics" class="form-check-input" value="following"/>
									<label for="topics-following" class="form-check-label">
										Following
									</label>
								</div>
								<div class="checkbox">
									<input id="topics-all" type="radio" name="default-topics" class="form-check-input" value="all"/>
									<label for="topics-all" class="form-check-label">
										All
									</label>
								</div>
								<div class="checkbox">
									<input id="topics-most-followed" type="radio" name="default-topics" class="form-check-input" value="most-followed"/>
									<label for="topics-most-followed" class="form-check-label">
										Most Followed
									</label>
								</div>
								<div class="checkbox">
									<input id="topics-most-posts" type="radio" name="default-topics" class="form-check-input" value="most-posts"/>
									<label for="topics-most-posts" class="form-check-label">
										Most Posts
									</label>
								</div>
							</div>
						</div>`
	var settings_2	=		
						`<div class="form-group row">
							<label class="col-form-label col-sm-3">General Settings</label>
							<div class="col-sm-9">
								<div class="checkbox">
									<input id="show-footer-control" type="checkbox" name="general" class="form-check-input"/>
									<label for="show-footer-control" class="form-check-label">
										Show footer control (The "back to top" button)
									</label>
								</div>
								<div class="checkbox">
									<input id="enable-hashtags" type="checkbox" name="general" class="form-check-input"/>
									<label for="enable-hashtags" class="form-check-label">
										Enable #hashtags (Breaks twitter embeds)
									</label>
								</div>
								<div class="checkbox">
									<input id="enable-usertags" type="checkbox" name="general" class="form-check-input"/>
									<label for="enable-usertags" class="form-check-label">
										Enable @usertag (Breaks twitter embeds)
									</label>
								</div>
							</div>
						</div>`
	var save_btn =			
						`<br>
						<div class="form-group">
						<div class="col-sm-3"></div>
						<div class="col-sm-9">
							<input type="button" id="memo-save" class="btn btn-success" value="Save memo++ settings">
							<span id="memo-saved" style="display:none;">Saved!</span>
						</div>
						</div>`						
	var template_end =	'</form>';

	var template = template_start + settings_2 + settings_0 + settings_1 + save_btn + template_end;

	$('#settings-form').after(template);									//	add form after memo's default form
		
	$('[value="'+settings.default_posts+'"]').prop('checked', true);		//	set checked based on current settings
	$('[value="'+settings.default_topics+'"]').prop('checked', true);
	$('#show-footer-control').prop('checked', settings.general.show_footer_control);
	$('#enable-hashtags').prop('checked', settings.tags.enable_hashtags);
	$('#enable-usertags').prop('checked', settings.tags.enable_usertags);


	$('#memo-save').on('click', function(e) {								//	Save settings to localStorage.
		e.preventDefault();

		var posts = $('[name="default-posts"]:checked').val();				//	Get values from form.
		var topics = $('[name="default-topics"]:checked').val();

		settings.default_posts = posts;
		settings.default_topics = topics;
		settings.general.show_footer_control = $('#show-footer-control').prop('checked');
		settings.tags.enable_hashtags = $('#enable-hashtags').prop('checked');
		settings.tags.enable_usertags = $('#enable-usertags').prop('checked');

		setSettings(settings);

		$('span#memo-saved').show();
		location.reload();
	})

	}
}
