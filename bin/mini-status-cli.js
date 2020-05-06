const getServer = require('../index')
const getArgs = require('../lib/getArgs')

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