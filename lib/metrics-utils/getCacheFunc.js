function getCacheFunc(func, cacheTime){
    // It is design for cache value returned from `func` to avoid
    // big request amount problem. Function that return promise is
    // also supported.
    var cachedVal = null;
    var res = func();
    var isPromise = false;

    // first run
    if(typeof res.then === 'function'){
        isPromise = true;
        res.then(val =>{
            cachedVal = val;
        })
    }else{
        cachedVal = res;
    }

    
    const loopFun = function(){
        return new Promise((resolve, reject) =>{
            setTimeout(() =>{
                if(isPromise){
                    func().then(res =>{
                        cachedVal = res;
                        resolve()
                    }).catch(err =>{
                        reject(err)
                    })
                }else{
                    cachedVal = func()
                    resolve()
                }
            }, cacheTime)
        }).then(()=>{
            loopFun();
            return;
        })
    }
    loopFun();

    const getCached = function(){
        return cachedVal
    }
    return getCached;
}

module.exports = getCacheFunc