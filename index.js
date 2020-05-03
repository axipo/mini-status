const express = require('express')
const wxImagePing = require('./wxImagePing')
const {systemInfoCached} = require('./metrics-utils/systemInfoCached')
const getArgs = require('./getArgs')


function getServer(address, port, uri, password){
    var app = express()
    app.use(wxImagePing)

    app.get(uri, (req,res) =>{
        // check key
        if(req.query.key !== password){
            res.status(404).json({
                success:false,
                msg:'not valid key'
            })
            return
        }

        //send metrics
        var mem = systemInfoCached.getMem();
        res.pingCodelist([
            [systemInfoCached.getCpuUsage(), 
            mem.used / 1024, //MB
            (systemInfoCached.getDiskusage().total - systemInfoCached.getDiskusage().free) / 1024 ** 2,
            systemInfoCached.getNetworkSpeed().rx / 1024, // KB/s
            systemInfoCached.getNetworkTransfer().rx / 1024 ** 2, // MB
            Math.floor(systemInfoCached.getUptime())], // min
            [1, 
            mem.total / 1024, 
            systemInfoCached.getDiskusage().total / 1024 ** 2,
            systemInfoCached.getNetworkSpeed().tx / 1024, // KB/s
            systemInfoCached.getNetworkTransfer().tx / 1024 ** 2,// MB
            1]
        ])
    })

    // listen
    app.listen(port, address, () =>{
        console.log(`app listen at ${address}:${port}${uri}`)
    })
    return app
}


// get arguments
var args = getArgs()
var address = args.address
var address = address.split(':')
var port
if(address.length === 1){
    port = parseInt(address[0])
    address = '0.0.0.0'
}else if(address.length === 2){
    port = parseInt(address[1])
    address = address[0]
}else {
    console.error('error while parse address')
    return
}

app = getServer(address, port, args.uri, args.password)