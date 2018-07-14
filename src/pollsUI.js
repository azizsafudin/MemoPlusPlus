/*
	Make polls look fancy
*/
function fancyPolls(){
	if(window.location.href.indexOf("/poll") > -1 || window.location.href.indexOf("/post") > -1 ) {
		$('tbody').each(function(index){
			var totalVotes = 0;
			$(this).children('tr').each(function(index){
				var votes = $(this).children('td').eq(1).text().split(' votes');
				totalVotes += Number(votes[0]);											//	get total number of votes
			});
			$(this).children('tr').each(function(index){
				var votes = $(this).children('td').eq(1).text().split(' votes');
				var percentage = totalVotes != 0 ? Math.round((votes[0]/totalVotes)*100) : 0;
				var barwidth = totalVotes != 0 ? Math.round((votes[0]/totalVotes)*94) : 0;

				$(this).children('td').css('width', '30%');
				$(this).children('td').eq(0).after(	'<td><div class="progress memo-poll" style="margin: 0.3em;"><div class="progress-bar progress-bar-striped" '+
													'style="width: '+(barwidth+6)+'%; text-align:left; padding-left:0.4em; font-weight:bold;">'+percentage+'%</div></div></td>');
				$(this).children('td').css('margin', 'auto');
				$(this).children('td').css('padding', '0.5em');
			});
		});
	}
}