const os = require('os')

const maxLogCount = 60 * 10; //max log: 10 min data
const timePerLog = 1000; //ms
var cpuSeq = [];

function getCpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for(type in cpu.times) {
      totalTick += cpu.times[type];
   }     

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

function updateCpuSeq(){
    // get cpu seq every timePerLog, record it
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            var count = getCpuAverage();
            if(cpuSeq.length === maxLogCount){
                cpuSeq.shift()
            }
            cpuSeq.push(count)
            resolve()
        }, timePerLog)
    })
}

const updateLoop = () => updateCpuSeq().then(updateLoop)
updateLoop()



function getCurrentCpuUsage(duration){
    // duration unit: s
    if(cpuSeq.length === 0){
        return 0
    }

    if(duration > cpuSeq.length - 1){
        duration = cpuSeq.length - 1
    }
    tailCount = cpuSeq[cpuSeq.length - 1]
    headCount = cpuSeq[cpuSeq.length - 1 - duration]
    return 100 - Math.round(
        100 *(tailCount.idle - headCount.idle) /
             (tailCount.total - headCount.total))
}



module.exports = {
    getCurrentCpuUsage,
}
