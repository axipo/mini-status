const express = require('express')
const wxImagePing = require('./lib/wxImagePing')
const {systemInfoCached} = require('./lib/metrics-utils/systemInfoCached')


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
            (systemInfoCached.getDiskusage().used), // MB
            systemInfoCached.getNetworkSpeed().rx / 1024, // KB/s
            systemInfoCached.getNetworkTransfer().rx / 1024 ** 2, // MB
            Math.floor(systemInfoCached.getUptime() / 60)], // min
            [1, 
            mem.total / 1024, 
            systemInfoCached.getDiskusage().total,
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


module.exports = getServer