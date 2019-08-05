"use strict";
let httpCount = 0;
const $httpWrap = $('.http-wrap');
const $noHttpWrap = $('.no-http-txt');
let pageUrl = '';
let pageTitle = '';
let httpArr = [];


$('.copy').click(() => {
    copy();
});

$('.excel').click(() => {
    exportExcel();
});

function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}
sendMessageToContentScript({cmd:'test', value:'你好，我是popup！'}, function(response)
{
    console.log('来自content的回复：'+response);
});

//监听所有请求
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log(details.url)
        showHttpUrl(details.url)
    },
    {urls: ["*://*/*"]},  //需要监听页面过滤器,你也可以通过*来匹配。这里是监听了所有的页面
    ["blocking"]
);

// 获取当前页面的 url && title
chrome.tabs.getSelected(null,function(w){
    pageUrl = w.url;
    pageTitle = w.title;
});

// get url to dom
const showHttpUrl = (url) =>{
    const isHs = url.indexOf('https');
    if(isHs > -1) return
    httpCount ++;
    httpArr.push(url);
    (httpCount === 1) && $('.btn-container').removeClass('hide');
    !$noHttpWrap.hasClass('hide') && $noHttpWrap.addClass('hide');
    const httpItem = `<a class="http-item" href=${url} title=${url} target="_blank">${url}</a>`;
    $httpWrap.append(httpItem);
    $('.http-count').text(httpCount);
};

// copy to ceil bord
function copy()
{
    const oInput = document.createElement('input');
    oInput.value = JSON.stringify(httpArr);
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display='none';
    alert('复制成功');
}

// export excel
function exportExcel() {
    let excelArr = [['page title','page url', 'page http request']]
    httpArr.map((httpUrl) => {
        excelArr.push([pageTitle, pageUrl, httpUrl])
    });
    exportListToXlsx(excelArr);
}

function exportListToXlsx (dataList, filename = 'http.xlsx', sheetName = 'sheet1') {
    const utils = XLSX.utils;
    const write = XLSX.write;
    const ws = utils.aoa_to_sheet(dataList);
    const wb = utils.book_new();

    utils.book_append_sheet(wb, ws, sheetName);

    const wbout = write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

    downloadBlob(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), filename);
}

function downloadBlob (blob, filename) {
    let a = document.createElement('a');
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = filename;
    a.click();

    // don't forget to free memory up when you're done (you can do this as soon as image is drawn to canvas)
    URL.revokeObjectURL(url);
    a = null;
}

function s2ab (s) {
    /* eslint-disable */
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);

    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;

    return buf;
}

