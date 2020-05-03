function mkSvg(width, height){
    // make fake svg figure
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`
    // max width 33554428
}



function pingStr(content){
    // send char list infomation
    res = this;
    res.set('Content-Type', 'image/svg+xml')
    if(res.pingLength){
        res.send(Buffer.from(mkSvg(content.length,1)))
        return
    }
    if(res.pingIndex){
        res.send(Buffer.from(mkSvg(content.charCodeAt(res.pingIndex),1)))
        return
    }
    res.sendStatus(404)
}

function pingCodelist(codeList){
    // send number infomation
    res = this;
    res.set('Content-Type', 'image/svg+xml')
    if(res.pingLength){
        res.send(Buffer.from(mkSvg(codeList[0].length,1)))
        return
    }
    if(res.pingIndex !== undefined){
        res.send(Buffer.from(mkSvg(
            Math.floor(codeList[0][res.pingIndex]),
            Math.floor(codeList[1][res.pingIndex]))))
        return
    }
    res.sendStatus(404)
}

function wxImagePing(req, res, next) {
    res.pingIndex = req.query.__index && parseInt(req.query.__index);
    res.pingLength = req.query.__length && parseInt(req.query.__length);
    res.pingStr = pingStr;
    res.pingCodelist = pingCodelist;
    next();
}

module.exports = wxImagePing