//后台 这类脚本是运行在浏览器后台的，注意它是与当前浏览页面无关的。
// 输入你想要的网站主页

//  监听前台传过来的命令，mac下如果按了 Ctrl+S 组合键就会被捕捉到，传递过来的值 是 toggle-tags
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-tags') {
        chrome.tabs.create({"url": MainPageUrl, "selected": true});
    }
})

// 监听所有请求
// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         console.log(details.url)
//         chrome.tabs.query({active: true}, function (tab) {
//             // 当前页面的url
//             var pageUrl = tab[0].url;
//             // 在这可以写判断逻辑，将请求cancel掉，或者将请求打印出来
//             //console.log(pageUrl)
//         });
//     },
//     {urls: ["*://*/*"]},  //需要监听页面过滤器,你也可以通过*来匹配。这里是监听了所有的页面
//     ["blocking"]
// );

