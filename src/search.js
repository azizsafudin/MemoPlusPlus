function searchHandler() {
    addSearchBar();
    var skip = 0;
    var limit = 25;
    var isSearchPage = location.href.indexOf('/search') > -1;
    var isHashtagPage = location.href.indexOf('/hashtag/') > -1;
    var title = '';
    if (isSearchPage) {
        var url = new URL(location.href);
        var query = url.searchParams.get('q');
        title = 'Showing memos containing: "' + query + '"';
    }
    if (isHashtagPage) {
        var query = "#" + location.pathname.split('/').pop();
        title = 'Showing memos with hashtag: ' + query;
    }
    if (query !== null && (isSearchPage || isHashtagPage)) {
        var main = $('div.container:eq(1)');
        var loading_msg = `<div id="memo-loading"><p class="center"><a>Loading memos containing "${query}" <span class="glyphicon glyphicon-repeat spinner"></span></a></p></div>`;
        var regexq = query.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, "\\$&")

        main.children().remove();
        main.append('<div class="threads"></div>');
        main.prepend('<div><h2 class="center" style="margin-bottom:1em;">' + title + '</h2></div>');
        $('div.threads').append(loading_msg);

        getRecentHashtags(30, function(tags) {
            var list = '';
            for (var i = 0; i < tags.length; i++) {
                list += `<a href="/hashtag/${tags[i].substring(1)}">${tags[i]}</a> `;
            }
            $('div.threads').prepend('<h4>Recent Hashtags: ' + list + '</h4> ');
        });

        getPostsBySearch(regexq, skip, limit, function(res) {
            $('#memo-loading').remove();
            if (res.confirmed.length > 1) {
                for (var i = 0; i < res.confirmed.length; i++) {
                    if (res.confirmed[i].b1 === '6d0c') {
                        $('div.threads').append(`<div><p><a href="post/${res.confirmed[i].tx}">${res.confirmed[i].b3}</a></p>Posted at ${timeConverter(res.confirmed[i].block_time)} in <a href="topic/${res.confirmed[i].b2}">${res.confirmed[i].b2}</a></div>`);
                    } else {
                        $('div.threads').append(`<div><p><a href="post/${res.confirmed[i].tx}">${res.confirmed[i].b2}</a></p>Posted at ${timeConverter(res.confirmed[i].block_time)}</div>`);
                    }
                }
                skip += limit;
            } else {
                $('div.threads').append('<div><p class="center">No memos found.</p></div>')
            }
        });
        $(window).on("scroll", function() {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {

                if (!triggered) {
                    main.append(loading_msg);
                    triggered = true;

                    getPostsBySearch(regexq, skip, limit, function(res) {
                        $('#memo-loading').remove();
                        if (res.confirmed.length > 1) {
                            for (var i = 0; i < res.confirmed.length; i++) {
                                if (res.confirmed[i].b1 === '6d0c') {
                                    $('div.threads').append(`<div><p><a href="post/${res.confirmed[i].tx}">${res.confirmed[i].b3}</a></p>Posted at ${timeConverter(res.confirmed[i].block_time)} in <a href="topic/${res.confirmed[i].b2}">${res.confirmed[i].b2}</a></div>`);
                                } else {
                                    $('div.threads').append(`<div><p><a href="post/${res.confirmed[i].tx}">${res.confirmed[i].b2}</a></p>Posted at ${timeConverter(res.confirmed[i].block_time)}</div>`);
                                }
                            }
                            skip += limit;
                            triggered = false;
                        } else {
                            $('div.threads').append('<div><p class="center">No more memos found.</p></div>')
                        }
                    });
                }
            }
        });
    }


}

function addSearchBar() {
    const bar = `<form class="navbar-form navbar-right">
                <div class="form-group input-group-sm">
                <input type="text" class="form-control" placeholder="Search memo" id="search-bar">
                </div></form>`
    $('div.navbar-collapse').append(bar);
    $('#search-bar').on('keyup', function(e) {
        var q = $('#search-bar').val();
        if (e.keyCode == 13) {
            location.href = '/search?q=' + encodeURIComponent(q);
        }
    });
}

function getPostsBySearch(query, skip, limit, callback) {
    var query = {
        "request": {
            "encoding": {
                "b1": "hex"
            },
            "aggregate": [{
                    "$match": {
                        "$or": [{
                                "b1": "6d0c",
                                "s2": { "$regex": query, "$options": "i" },
                                "s3": { "$regex": query, "$options": "i" }
                            },
                            {
                                "b1": "6d02",
                                "s2": { "$regex": query, "$options": "i" }
                            }
                        ]
                    }
                },
                { "$sort": { "block_time": -1 } },
                { "$skip": skip },
                { "$limit": limit }
            ],
            "project": {
                "b1": 1,
                "b2": 1,
                "b3": 1,
                "tx": 1,
                "block_index": 1,
                "block_time": 1,
                "_id": 0
            }
        },
        "response": {
            "encoding": {
                "b1": "hex",
                "b2": "utf8",
                "b3": "utf8"
            }
        }
    }
    var b64 = btoa(JSON.stringify(query));
    var url = "https://bitdb.network/q/" + b64;
    var header = {
        headers: { key: "qzyhyxedrslf39v7l9d62f0mnlttwl4tzsd7wawh0t" }
    }
    fetch(url, header).then(function(r) {
        return r.json();
    }).then(function(r) {
        callback(r);
    }).catch(function(err) {
        alert('Search error');
        console.error(err);
    });
}

function getRecentHashtags(count, callback) {
    var query = {
        "request": {
            "encoding": {
                "b1": "hex"
            },
            "aggregate": [{
                    "$match": {
                        "b1": "6d02",
                        "s2": { "$regex": "\\#", "$options": "i" }
                    }
                },
                { "$sort": { "block_time": -1 } },
                { "$limit": count }
            ],
            "project": {
                "b1": 1,
                "b2": 1,
                "tx": 1,
                "block_index": 1,
                "block_time": 1,
                "_id": 0
            }
        },
        "response": {
            "encoding": {
                "b1": "hex",
                "b2": "utf8"
            }
        }
    }
    var b64 = btoa(JSON.stringify(query));
    var url = "https://bitdb.network/q/" + b64;
    var header = {
        headers: { key: "qzyhyxedrslf39v7l9d62f0mnlttwl4tzsd7wawh0t" }
    }
    fetch(url, header).then(function(r) {
        return r.json();
    }).then(function(r) {
        var array = [];
        for (var i = 0; i < r.confirmed.length; i++) {
            var result = r.confirmed[i].b2.match(/#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/g)
            if(result !== null){
                // array.push(...result);
                array = [...new Set([...array ,...result])];
                // var array = array.concat(result.filter(function (item) {
                //     return array.indexOf(item) < 0;
                // }));
            }
            if (array.length > count) {
                array.slice(0, count);
                break;
            }
        }
        callback(array);
    }).catch(function(err) {
        alert('Error getting memos');
        console.error(err);
    });
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}