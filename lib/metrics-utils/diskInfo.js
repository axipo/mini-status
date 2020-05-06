const { exec } = require('child_process');

function getDisk(){
    return new Promise((resolve, reject) =>{
        exec('df -BM', (error, stdout, stderr) => {
            if (error) {
                reject(stderr)
                return;
            }
            resolve(stdout)
        }); 
    }).then(stdout =>{
        var result = null
        var lines = stdout.split('\n');
        lines.forEach(line => {
            var seps = line.split(/\s+/);
            if(seps[seps.length - 1] === '/'){
                result = {
                    'used':parseInt(seps[2].slice(0,-1)), //MB
                    'total':parseInt(seps[2].slice(0,-1)) + parseInt(seps[3].slice(0,-1))  //MB
                }
            }
        });
        return result
    })
}

module.exports = getDisk