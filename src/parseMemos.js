/*
	General method that loops through all memos on the page.
*/
function parseMemos(){
	$('.message, .reply').each(function(){
		var context = $(this);
		nameTag(context);
		hashtag(context);
	});

	//	searching through all links
	$('.message').find('a').each(function(){
		var context = $(this);
		// twitterEmbed(context);
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

function hashtag(context){
	var text = context.html();
	out = text.replace(/#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/g, ' <a href="#">#$1</a>');
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