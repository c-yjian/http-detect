//会将这个js中的逻辑注入到访问的页面中去
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if(request.cmd == 'test') {
        console.log(request.value);
        location.reload();
    };
    sendResponse('我收到了你的消息！');
});
