function neverEndingMemo(){
	var triggered = false;
	if(window.location.href.indexOf('/posts') > -1 || window.location.href.indexOf('/polls') > -1 || window.location.href.indexOf('/profile/') > -1){

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
						if(window.location.href.indexOf('/profile/') > -1){
							feed.siblings('table, p, div.center').remove();				//	remove other profile page stuff
						}

						$('div.container').eq(1).append(feed.parent().clone().html());	//	clone the parent of the .message nodes.

						muteUsers();													//	reapply muteUsers
						verifyUsers();													//	reapply verifyUsers
						parseMemos();
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