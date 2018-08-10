function notificationPage() {
    if (location.href.indexOf('/notification') > -1) {
        var notifs = getNotifications();
        if (notifs.length > 0) {
            for (var i = 0; i < notifs.length; i++) {
                $('tbody').prepend(`<tr class="memo-notifications">
                    <td style="color:lightblue;">
                        <span class="glyphicon glyphicon-tag" aria-hidden="true"></span>
                    </td>
                    <td>
                    <span class="mini-profile-name" data-profile-hash="${notifs[i].sender}">
                        <a class="profile profile-link" href="profile/${notifs[i].sender}">${trimAddress(notifs[i].sender,6,4)}</a>
                        mentioned you in a
                        <a href="post/${notifs[i].txhash}">post</a>
                        <div class="notify-post">
                            <a href="post/${notifs[i].txhash}">${notifs[i].message}</a>
                        </div>
                    </td>
                </tr>`);
            }
            $('tbody').prepend(`<tr class="memo-notifications">
                <td>
                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                </td>
                <td>
                    <div class="">
                        <a class="btn btn-primary" id="dismiss-btn">Dismiss memo++ notifications</a>
                    </div>
                </td>
            </tr>`);
        }
    }

    $('#dismiss-btn').on('click', function() {
        clearNotifications();
        $('.memo-notifications').remove();
    });
}

function addMentionNotif(sender, txhash, message) {
    notif = {
        "sender": sender,
        "txhash": txhash,
        "message": message,
        "timestamp": new Date(),
    }
    pushNotification(notif);
}

function pushNotification(obj) {
    var notifs = getNotifications();
    notifs.push(obj);
    setNotifications(notifs);
}

function clearNotifications() {
    setNotifications([]);
}

function getNotifications() {
    var notifs = localStorage.getItem('memo-notifications');
    if (!notifs) {
        localStorage.setItem('memo-notifications', JSON.stringify([]));
        return [];
    }
    return JSON.parse(notifs);
}

function setNotifications(notifs) {
    localStorage.setItem('memo-notifications', JSON.stringify(notifs));
}