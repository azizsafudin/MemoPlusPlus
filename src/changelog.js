function showChangelog() {
    var version = localStorage.getItem('installed-' + current_version);
    var seen = JSON.parse(localStorage.getItem('seen-update'));
    if (seen === null) {
        seen = false;
        localStorage.setItem('seen-update', seen);
    }
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "positionClass": "toast-bottom-left",
        "hideMethod": "slideUp",
        "preventDuplicates": false,
        "timeOut": "0",
        "extendedTimeOut": "0",
        "allowHtml": true
    }
    toastr.options.onHidden = function() { 
    	localStorage.setItem('seen-update', true);
    	toastr.clear();
	}
    if (version && !seen) {
        toastr.success(changelog, '<b>Memo++ updates (0.5.8)</b>');    
        toastr.info('Suggest features or report bugs by making an issue on Github or contacting me (modulus) on memo/twitter.');
    }
}

const changelog = 
`<ul>
<li>Minor UI fixes for latest memo.cash site updates</li>
<li>Fixed "recent hashtags" not showing</li>
<li>Fixed verify user button not showing correctly.</li>
</ul>
`

// const changelog =
//     `<ul>
//     	<li>Set default font size of posts.</li>
//     	<li>Search posts and topics.</li>
//     	<li>Browse latest hashtags.</li>
//     	<li>Get notified of @mentions (only when tab is open).</li>
//     	<li>More options in settings page.</li>
//     	<li>Minor UI tweaks.</li>
//     </ul>`