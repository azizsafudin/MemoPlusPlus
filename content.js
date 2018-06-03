$(document).ready(function() {
	main();
	$("body").fadeIn(100);

});

var mute_btn = 	'<button type="button" class="btn btn-danger btn-sm memo-mute">Mute</button>';
var hidden_0 = 	'<div class="post rounded box-shadow" style="padding:0px;">'+
				'<div class="post-header">' +
				'<p class="name" style="padding:0.5em;">' +
				'<span class="memo-name">';
var hidden_1 = 	'</span><span> has been muted.</span>'+
				'<button type="button" class="memo-unmute btn btn-info btn-sm" style="margin-left:1em;">Unmute</button>'+
				'</p></div></div>';

function main(){
	var list = localStorage.getItem('memo-list');

	if(list === null || list === undefined){
		localStorage.setItem('memo-list', JSON.stringify([]));
	}

	$(document).attr('title', 'Memo++');

	$('p.name').append(mute_btn);

	$('button.memo-mute').click(function(e) {
		e.preventDefault();
		var name = $(this).siblings('a.profile').text();
		mute(name);
	});	

	$(document).on('click', 'button.memo-unmute',function(e) {
		e.preventDefault();
		var name = $(this).siblings('span.memo-name').text();
		unmute(name);
	});	

	$('a.profile').each(function(index) {
		var name = $(this).text();
		if(isMuted(name)){
			var string = hidden_0 + name + hidden_1;
			$(this).parents('div.post').replaceWith(string);
		}
	});
}


function mute(name){
	var list = localStorage.getItem('memo-list');
	if(list === undefined || list === null){
		list = [];
	}else{
		list = JSON.parse(list);
	}
	if(!isMuted(name)) {
		list.push(name);
		localStorage.setItem('memo-list', JSON.stringify(list));
		alert(name + ' muted.');
		location.reload();
	}else{
		alert(name + ' is already muted.');
	}	
}

function unmute(name){
	var list = localStorage.getItem('memo-list');
	if(list !== null || list !== undefined){
		list = JSON.parse(list);
		var index = list.indexOf(name);
		if (index > -1) {
			list.splice(index, 1);
			localStorage.setItem('memo-list', JSON.stringify(list));
			alert(name + ' is unmuted.');
			location.reload();
		}
	}
}

function isMuted(name){
	var list = localStorage.getItem('memo-list');	
	list = JSON.parse(list);
	return list.indexOf(name) > -1;
}