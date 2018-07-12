const https = require('https')
const cheerio = require('cheerio')

const paginations = (new Array(50)).fill(0)
const keyWords = ['金融港', '森林小镇', '当代国际']
// const keyWords = ['铁机路']
const groups = ['134539', '551524']

function filterKeyWords(title) {
    var reg = new RegExp(keyWords.join('|'))
    if(title.search(reg) > -1) return true
}

function parserPage(html) {
    var $ = cheerio.load(html)
    var table = $('#wrapper table')
    var lists = table.find('tr td.title')
    
    lists.each((index, item) => {
        var target = $(item).find('a')[0]
        var title = target.attribs.title
        
        if(!filterKeyWords(title)) return true

        var id = target.attribs.href.split('/').slice(-2, -1)[0]
        console.log(`[${id}] ${title}`)
    })
}

function crawlPage(id, pagination) {
    https.get({
        host: 'www.douban.com',
        path: `/group/${id}/discussion?start=${pagination * 25}`,
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
            cookie: 'bid=t3f8KkwkmS4; __yadk_uid=HS9FpNYeFvksa6opDRMyRO3RyZ68ahdw; __utmv=30149280.8520; ll="118254"; _vwo_uuid_v2=D5BAEF5CDF90DDE17A468D91E6A90A818|ee8ac75ab079dd746560b9e9248a5cf4; ct=y; _ga=GA1.2.1818782718.1524018106; push_noty_num=0; push_doumail_num=0; ap=1; __utmc=30149280; __utmz=30149280.1531358555.13.8.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _gid=GA1.2.1693543352.1531358555; dbcl2="85203962:mMql73wuv/Y"; ck=nYpg; douban-profile-remind=1; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1531365376%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1818782718.1524018106.1531358555.1531365376.14; __utmt=1; _pk_id.100001.8cb4=f748d85529ad45b4.1524018106.12.1531367484.1531360922.; __utmb=30149280.104.4.1531367484671'
        }
    }, function(res){  //发送get请求
        var html=''
        res.on('data',function(data){
            html += data  //字符串的拼接
        })
        res.on('end',function(){
            parserPage(html)
        })
    
        res.on('error',function(){
            console.log('获取资源出错！')
        })
    })
}

console.log('关键词: ' + keyWords.join(',') + 'https://www.douban.com/group/topic/?id\n')

groups.forEach(id => {
    paginations.forEach((item, pagination) => {
        crawlPage(id, pagination)
    })
})
