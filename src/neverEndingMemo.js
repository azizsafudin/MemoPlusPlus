var triggered = false;

function neverEndingMemo() {
    if (
        location.href.indexOf('/posts') > -1 ||
        location.href.indexOf('/polls') > -1 ||
        location.href.indexOf('/feed') > -1 ||
        location.href === 'https://memo.cash/' ||
        location.href === 'https://memo.cash/all' ||
        location.href.indexOf('/activity') > -1
    ) {

        $('p.pagination').last().remove(); //	remove bottom pagination menu.
        var url = new URL(location.href); //	construct URL for get request.

        var offset = url.searchParams.get('offset'); //	get current offset from URL
        if (!offset) offset = 0; //	set offset to 0 if URL does not have the offset.
        else offset = Number(offset); //	set offset to int.

        $(window).on("scroll", function() {
            // if(($(window).scrollTop() + document.body.clientHeight) > $('.footer').position().top){
            // if(($(window).scrollTop() + $(window).height()) > $('.footer').position().top){
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                $('.footer-control').fadeIn(1000);
                $('p#load-more-wrapper, br:last').remove();
                if (!triggered) {
                    $('div.container').eq(1)
                        .append('<div class="post rounded box-shadow" id="memo-loading"><p class="center">Loading Never Ending Memo <span class="glyphicon glyphicon-repeat spinner"></span></p></div>');

                    triggered = true; //	prevent this from running more than once each time it reaches the bottom.

                    url.searchParams.set('offset', (offset + 25)); //	set offset parameter for get request

                    $.get(url, function(res) {
                        offset += 25; //	only increment the offset proper when get request succeeds.
                        var html = $($.parseHTML(res, document, true)); //	parse the response

                        var feed = html.find('div.container').eq(1).children(); //	select children elements of main feed

                        if (feed.siblings('.post, .threads').length === 0) { //	if end of feed
                            //triggered = true; 
                            $('#memo-loading p.center').text('End of feed'); //	Remove loading message
                            return;
                        }

                        feed.siblings('.posts-nav, .pagination, br, div.center, p#load-more-wrapper, div.row').remove(); //	remove pagination and menu items.

                        $('div.container').eq(1).append(feed.parent().clone().html()); //	clone the parent of the .message nodes.

                        updateView();
                        $('#memo-loading').remove(); //	Remove loading message
                        triggered = false;

                    }).fail(function() {
                        alert('Unable to load new memos.');
                        $('#memo-loading').remove();
                        setTimeout(function() { //	allow to try again after 1 second
                            triggered = false; //	so it doesn't spam the user
                        }, 1000);
                    });
                }
            }
        });
    }
}