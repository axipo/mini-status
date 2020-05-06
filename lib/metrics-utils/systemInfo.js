const { getNetworkSpeed, getNetworkTransfer } = require('./networkInfo');
const { getCurrentCpuUsage } = require('./cpuInfo')
const { getMem } = require('./memoryInfo')
const getDisk = require('./diskInfo')
const os = require('os');
const fs = require('fs')

function getUptime(){
    // get uptime from /proc/uptime
    var uptimeFile = '/proc/uptime'
    return new Promise((resolve, reject) => {
        fs.readFile(uptimeFile,'utf-8', (err, data) => {
            if(err){
                reject(err);
                return
            }
            resolve(parseInt(data.match(/\d+/)[0]))
        })
    })
}



module.exports = {
    getNetworkSpeed: () => getNetworkSpeed(1),
    getNetworkTransfer,
    getCpuUsage:() => getCurrentCpuUsage(1),
    getLoad:() => os.loadavg(),
    getMem,
    getUptime,
    getDiskusage:getDisk
}