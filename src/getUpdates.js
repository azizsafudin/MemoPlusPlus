function getUpdates() {
    chainfeed.listen(function(res) {
        res.forEach(function(item) {
            if (item.data) {
                let prefix = ab2hex(new Uint8Array(item.data[0].buf.data).buffer);
                if (prefix === '6d02') { //  posts 0x6d02 message(217)
                    if (item.data.length > 1) {
                        let message = ab2str(new Uint8Array(item.data[1].buf.data).buffer)
                        let user = getUser();
                        let regex = new RegExp("@" + user.name, "i"); //get mentions
                        if (message.match(regex)) {
                            let sender = item.sender[0];
                            let txhash = item.tx.hash;
                            addMentionNotif(sender, txhash, message);
                            notification_count++;
                            updateNotifications();
                        }
                    }
                }
                if (prefix === '6d03') { //  replies 0x6d03 txhash(30), message(184)
                    if (item.data.length > 1) {
                        let txhash = ab2hex(new Uint8Array(item.data[1].buf.data.slice().reverse()).buffer);
                        if (transactionExists(txhash)) {
                            notification_count++;
                            updateNotifications();
                        }
                    }
                }
                if (prefix === '6d04') { //  likes/tips 0x6d04 txhash(30)
                    if (item.data.length > 1) {
                        let txhash = ab2hex(new Uint8Array(item.data[1].buf.data.slice().reverse()).buffer);
                        if (transactionExists(txhash)) {
                            notification_count++;
                            updateNotifications();
                        }
                    }
                }
                if (prefix === '6d06') { //  follows 0x6d06 address(35)
                    if (item.data.length > 1) {
                        let followed_addr = ab2hex(new Uint8Array(item.data[1].buf.data.slice().reverse()).buffer);
                        if (getUser().address === followed_addr) {
                            notification_count++;
                            updateNotifications();
                        }
                    }
                }
            }
        });
    });
}

function loadTransactions() {
    var user = getUser();
    if (user) {
        $.get(api_url + '/addr/' + user.address, function(res) {
            setTransactions(res.transactions);
        });
    }
}

function getTransactions() {
    var list = localStorage.getItem('memo-txs');
    if (!list) return [];
    return JSON.parse(list);
}

function setTransactions(txs) {
    localStorage.setItem('memo-txs', JSON.stringify(txs));
}

function transactionExists(tx) {
    var txs = getTransactions();
    return txs.indexOf(tx) > -1;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function ab2hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), x => ('00' + x.toString(16)).slice(-2)).join('');
}