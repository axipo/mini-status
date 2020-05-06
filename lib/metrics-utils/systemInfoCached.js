const getCacheFunc = require('./getCacheFunc')
const systemInfo = require('./systemInfo')

//get the cache version of systemInfo function
const cacheTime = 500; //ms
systemInfoCached = {};
for (key in systemInfo) {
    //cached version of systemInfo function
    systemInfoCached[key] = getCacheFunc(systemInfo[key], cacheTime);
}


function getSystemInfoCachedObj(){
    // return a bundle object of system infomation
    var mem = systemInfoCached.getMem();
    return {
        "uptime": systemInfoCached.getUptime(),
        "load": systemInfoCached.getLoad(),
        "network_rx": systemInfoCached.getNetworkSpeed().rx,
        "network_tx": systemInfoCached.getNetworkSpeed().tx,
        "network_in": systemInfoCached.getNetworkTransfer().rx,
        "network_out": systemInfoCached.getNetworkTransfer().tx,
        "cpu": systemInfoCached.getCpuUsage(),
        "memory_total": mem['total'],
        "memory_used": mem['used'],
        "swap_total": mem['swapTotal'],
        "swap_used": mem['swapUsed'],
        "hdd_total": systemInfoCached.getDiskusage().total,
        "hdd_used": systemInfoCached.getDiskusage().used,
    }
}

module.exports = {
    systemInfoCached,
    getSystemInfoCachedObj
}