chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get("memo-mutelist", function(items) {
    if(items === null || items === undefined){
    	chrome.storage.sync.set({"memo-mutelist": []}, function() {
    		console.log("Loaded new empty list.");
  		});
    }
  });
});