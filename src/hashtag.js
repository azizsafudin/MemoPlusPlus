function hashtagHandler(){
  var skip = 0;
  var per_page = 25;
  var limit = per_page;

  if(location.href.indexOf('/hashtag/') > -1){
    var hashtag = location.pathname.split('/').pop();
    var main = $('div.container:eq(1)');
    var loading_msg = `<div id="memo-loading"><p class="center"><a>Loading posts from ${hashtag === ""?"all hashtags":"#"+hashtag} <span class="glyphicon glyphicon-repeat spinner"></span></a></p></div>`;
    
    main.children().remove();
    main.append('<div class="threads"></div>');
    
    $('div.threads').append(loading_msg);

    getPostsByHashtag(hashtag, skip, limit, function(res){
      $('#memo-loading').remove();
      if(res.confirmed.length > 1){
      for(var i=0; i < res.confirmed.length; i++){
        $('div.threads').append(`<div><p><a href="post/${res.confirmed[i].tx}">${res.confirmed[i].b2}</a></p>Posted on ${timeConverter(res.confirmed[i].block_time)}</div>`);
      }
      skip += per_page;
      limit += per_page;
      }else{
        $('div.threads').append('<div><p class="center">No memos found.</p></div>')
      }
    });
    $(window).on("scroll", function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && $('#memo-end').length === 0) {
        
        if(!triggered){
          main.append(loading_msg);
          triggered = true;
          
          getPostsByHashtag(hashtag, skip, limit, function(res){
            $('#memo-loading').remove();
            if(res.confirmed.length > 1){
            for(var i=0; i < res.confirmed.length; i++){
              $('div.threads').append(`<div><p><a href="post/${res.confirmed[i].tx}">${res.confirmed[i].b2}</a></p>Posted on ${timeConverter(res.confirmed[i].block_time)}</div>`);
            }
            skip += per_page;
            limit += per_page;
            triggered = false;
            }else{
              $('div.threads').append('<div><p class="center" id="memo-end">No more memos found.</p></div>')
            }
          });
        }
      }
    });

  }  
}

function getPostsByHashtag(hashtag, skip, limit, callback){
  var query = {
  "request": {
    "encoding": {
      "b1": "hex"
    },
    "aggregate": [{
        "$match": {
          "b1": "6d02",
          "s2": {"$regex": "#"+hashtag, "$options": "i"}
        }},
        {"$skip": skip},
        {"$limit": limit}
    ],
    "project": {
      "b1": 1, "b2": 1, "tx": 1, "block_index": 1, "block_time": 1, "_id": 0
    }
  },
  "response": {
    "encoding": {
      "b1": "hex", "b2": "utf8"
    }
  }
}
  var b64 = btoa(JSON.stringify(query));
  var url = "https://bitdb.network/q/" + b64;
  var header = {
    headers: { key: "qzyhyxedrslf39v7l9d62f0mnlttwl4tzsd7wawh0t"}
  }
  fetch(url, header).then(function(r) {
    return r.json();
  }).then(function(r) {
    callback(r);
  })
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}