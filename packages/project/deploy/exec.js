const execute = require('child_process').exec;

async function main(args) {
    const nim = exec('nim')
    if (nim)
        exec('curl https://apigcp.nimbella.io/downloads/nim/nim-install-linux.sh | sudo bash')

    const plugins = exec('nim plugins')   
    exec(`nim auth login ${args.nimbella_key}`)
    try {
        const cmd = `nim project create -t postman -i ${args.collection_id} -k ${args.postman_key} -d`
        exec(cmd)
    } catch (error) {
        console.error(error)
        return error
    }
}

function exec(command, callback){
    execute(command, function(error, stdout, stderr){ return stdout });
};


module.exports = { main }
