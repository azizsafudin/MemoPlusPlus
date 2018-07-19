const verified_icon = '<span class="glyphicon glyphicon-ok memo-verified" title="Verified by you" style="font-size:1.1em;"></span>';

function verifyUsers(){
	if(location.href.indexOf('/profile') > -1)
	{
		var url = location.href;
		var array = url.split('/');
		var address = array[array.length-1];

		addVerifyButton();
		$('.memo-verify').click(function(e){
			e.preventDefault();
			verify(address);
		});
		$('.memo-unverify').click(function(e){
			e.preventDefault();
			unverify(address);
		});
	}

	addVerifiedIcon();

	$('.memo-verified').mouseover(function(e){
		$(this).addClass('text-primary');
	})
	$('.memo-verified').mouseout(function(e){
		$(this).removeClass('text-primary');
	})
}


function addVerifyButton(){
	var url = location.href;
	var array = url.split('/');
	var address = array[array.length-1];

	var context = $('div.title');
	//Only add button if button isn't already there.
	if(!isVerified(address) && context.find('a.memo-verify').length === 0){
	context.children().last().before(`<span><a href="#" class="btn btn-sm btn-success memo-verify" title="This sets user as verified">
										<span class="glyphicon glyphicon-check" aria-hidden="true"></span> 
										Verify User
									</a></span>`);
	}
	else if(isVerified(address) && context.find('a.memo-unverify').length === 0){
	context.children().last().before(`<span><a href="#" class="btn btn-sm btn-danger memo-unverify" title="Unverify user"">
									<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> 
									<span>Unverify User</span>
									</a></span>`);
	}
}

function addVerifiedIcon(){
	var url = location.href;
	var array = url.split('/');
	var address = array[array.length-1];

	$('span.mini-profile-name').each(function(index) {
		var addr = $(this).data('profile-hash');
		if(isVerified(addr) && $(this).find('.memo-verified').length === 0){
			$(this).find('a.profile').after(' '+verified_icon);
		}
	});

	if(location.href.indexOf('/profile/') > - 1){
		if(isVerified(address) && $('td.name').find('.memo-verified').length === 0){
			$('td.name').append(' '+verified_icon);
			$('div.title h3').children().first().before(verified_icon);
		}
	}

	if(location.href.indexOf('/topic/') > -1){
		$('div.name').each(function(index){
			var addr = getUserAddress($(this).find('a').first());
			if(isVerified(addr) && $(this).find('.memo-verified').length === 0){
				$(this).find('a').first().after(verified_icon);
				$('.memo-verified').css('font-size', '0.9em');
			}
		})
	}

	if(location.href.indexOf('/notifications') > -1){
		$('a.name').each(function(index){
			var addr = getUserAddress($(this));
			if(isVerified(addr)){
				$(this).after(' '+verified_icon);
			}
		})
	}
}

/*
	Add address to verified list
*/
function verify(addr){
	var list = getVerifiedList();

	if(!isVerified(addr)) {
		list.push(addr);
		setVerifiedList(list);
		location.reload();
	}
}
/*
	Removes user's address from verified list
*/
function unverify(addr){
	var list = getVerifiedList()

	var index = list.indexOf(addr);
	if (index > -1) {
		list.splice(index, 1);
		setVerifiedList(list);
		location.reload();
	}
}
/*
	Get verify list
*/
function getVerifiedList(){
	var list = localStorage.getItem('memo-verified-list');
	if(!list){
		localStorage.setItem('memo-verified-list', JSON.stringify(default_verified_list));
		return default_verified_list;
	}
	return JSON.parse(list);
}

/*
	Set verify list
*/
function setVerifiedList(list){
	localStorage.setItem('memo-verified-list', JSON.stringify(list));
}

/*
	Returns whether a user is verified.
*/
function isVerified(addr){
	var list = getVerifiedList();
	return list.indexOf(addr) > -1;
}