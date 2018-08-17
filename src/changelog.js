function showChangelog() {
    var isLatest = localStorage.getItem('installed-' + current_version);
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
    toastr.options.onHidden = function() { localStorage.setItem('seen-update', true) }
    if (isLatest && !seen) {
        toastr.success(changelog, '<b>New memo++ features!</b>');
        toastr.info('FYI: Proofs of default verified accounts can be found on Github!');
    }
}

const changelog =
    `<ul>
    	<li>Set default font size of posts.</li>
    	<li>Search posts and topics.</li>
    	<li>Browse hashtags latest hashtags.</li>
    	<li>Get notified of @mentions (only when tab is open).</li>
    	<li>More options in settings page.</li>
    	<li>Minor UI tweaks.</li>
    </ul>`