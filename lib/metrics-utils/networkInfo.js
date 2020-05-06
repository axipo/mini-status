const fs = require('fs');

const netdev = '/proc/net/dev';
const maxLogCount = 60 * 10; //max log: 10 min data
const timePerLog = 1000; //ms
var timeSeq = [];
var transferSeq = [];
var originCount = null;

function getNetwork(){
    // get network infomation from /proc/net/dev
    return new Promise((resolve, reject) =>{
        fs.readFile(netdev, 'utf8', (err, data) =>{
            if(err){
                reject(err)
                return
            }
            resolve(data)
        })
    }).then(data =>{
        //parse data
        var lines = data.split('\n');
        var targetLine = lines.filter(line => {
            return (line.indexOf(':') !== -1 &&
               line.indexOf('lo:') === -1 &&
               line.indexOf('tun') === -1)
        })[0];
        var extractReg = /\S+ (\d+)\D+\d+\D+\d+\D+\d+\D+\d+\D+\d+\D+\d+\D+\d+\D+(\d+)/;
        var match = extractReg.exec(targetLine);
        if(match){
            return {
                'rx':parseInt(match[1]),
                'tx':parseInt(match[2])
            }
        }
    })
}

function updateNetworkSeq(){
    // run getNetwork every `timePerLog`, then record data and time
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            getNetwork().then(count =>{
                var currentTime = Date.now();
                if(timeSeq.length === maxLogCount){
                    timeSeq.shift()
                    transferSeq.shift()
                }
                timeSeq.push(currentTime);
                transferSeq.push(count)
                resolve()
            })
        }, timePerLog)
    })
}

// start log work
getNetwork().then(count =>{
    originCount = count;
})
const updateLoop = () => updateNetworkSeq().then(updateLoop)
updateLoop()


function getNetworkTransfer(){
    // get traffic infomation
    if(transferSeq.length === 0){
        return {
            'rx':null,
            'tx':null
        }
    }

    var lastCount = transferSeq[transferSeq.length - 1];
    return {
        'rx':(lastCount.rx - originCount.rx), // unit: bytes
        'tx':(lastCount.tx - originCount.tx)
    }
}

function getNetworkSpeed(duration){
    // get network speed infomation
    // duration unit: s
    if(transferSeq.length === 0){
        return {
            'rx':null,
            'tx':null
        }
    }

    if(duration > transferSeq.length - 1){
        duration = transferSeq.length - 1
    }
    tailCount = transferSeq[transferSeq.length - 1]
    headCount = transferSeq[transferSeq.length - 1 - duration]
    
    tailTime = timeSeq[timeSeq.length - 1]
    headTime = timeSeq[timeSeq.length - 1 - duration]
    // time may not be timePerLog due to async reason, here is the real time duration
    realDuration = (tailTime - headTime) / 1000 //unit: s
    return {
        'rx':(tailCount.rx - headCount.rx) / realDuration,
        'tx':(tailCount.tx - headCount.tx) / realDuration
    }
}



module.exports = {
    getNetworkSpeed,
    getNetworkTransfer
}
