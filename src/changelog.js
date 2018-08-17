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
    }
}

const changelog =
    `<ul>
    	<li>Set font size of posts and topics!</li>
    	<li>Search posts and topics!</li>
    	<li>More options in the settings page!</li>
    </ul>`