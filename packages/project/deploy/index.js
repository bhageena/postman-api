const shell = require('shelljs');

async function main(args) {
    if (!shell.which('nim')) {
        console.log('nim not found, installing');
        exec('curl https://raichand-8kehpaun1bf-apigcp.nimbella.io/downloads/nim/nim-install-linux.sh | bash')
    }
    try {
        const plugins = exec('nim plugins')
        if (!plugins.includes('postman')) { console.log('plugin not found, installing'); exec('nim plugin add postman') }
        console.log(`logging in ${args.nimbella_key}`);
        exec(`nim auth login ${args.nimbella_key}`)

        exec(`nim project create -t postman -i ${args.collection_id} -k ${args.postman_key} -d`)
        exec(`nim auth logout --all`)
    } catch (error) {
        console.error(error)
        return error
    }
}

function exec(cmd) {
    const execution = shell.exec(cmd, { silent: true })
    if (execution.code !== 0) {
        console.error(execution.stderr)
    }
    console.log(execution.stdout)
    return execution.stdout
}

module.exports = { main }


