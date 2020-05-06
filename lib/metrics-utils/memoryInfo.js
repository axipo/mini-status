const fs = require('fs');

const meminfo = '/proc/meminfo';

function getMem(){
    // get memory info from /proc/meminfo
    return new Promise((resolve, reject) =>{
        fs.readFile(meminfo, 'utf8', (err, data) =>{
            if(err){
                reject(err)
                return
            }
            resolve(data)
        })
    }).then(data =>{
        // parse data
        // reference: https://stackoverflow.com/questions/41224738/how-to-calculate-system-memory-usage-from-proc-meminfo-like-htop
        var lines = data.split('\n');
        var totalMem = parseInt(lines.filter(line => /MemTotal/.test(line))[0].match(/\d+/)[0]);
        var freeMem = parseInt(lines.filter(line => /MemFree/.test(line))[0].match(/\d+/)[0]);
        var BuffersMem = parseInt(lines.filter(line => /Buffers/.test(line))[0].match(/\d+/)[0]);
        var cachedMem = parseInt(lines.filter(line => /^Cached/.test(line))[0].match(/\d+/)[0]);
        var SReclaimable = parseInt(lines.filter(line => /^SReclaimable/.test(line))[0].match(/\d+/)[0]);
        var Shmem = parseInt(lines.filter(line => /^Shmem:/.test(line))[0].match(/\d+/)[0]);
        var swapTotal = parseInt(lines.filter(line => /SwapTotal/.test(line))[0].match(/\d+/)[0]);
        var swapFree = parseInt(lines.filter(line => /SwapFree/.test(line))[0].match(/\d+/)[0]);
        
        //
        return {//unit: kB
            'total':totalMem, 
            'used':totalMem - freeMem - BuffersMem -(cachedMem + SReclaimable - Shmem),
            swapTotal,
            'swapUsed':swapTotal - swapFree
        }
    })
}

module.exports = {
    getMem
}