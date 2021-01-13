import { default as Generate } from '@nimbella/postman-api/lib/invoker'
import { join } from 'path'
import { runNimCommand } from 'nimbella-cli'
// import { initializeAPI, Flags, deployProject, readAndPrepare, fileSystemPersister, wipePackage, buildProject, deploy, getCurrentNamespace, Credentials, OWOptions, getCredentialsFromEnvironment } from 'nimbella-deployer'

import { Flags, deployProject, fileSystemPersister, getCredentialsFromEnvironment } from 'nimbella-cli/lib/deployer'

async function main(args: any) {
  try {
    console.log(args);
    console.log(args.__ow_headers);
    await nimGenerate(args.collection, args.pm_key)
    await nimProjectDeploy(args.collection, args.nim_token)
  } catch (error) {
    console.error(error)
    return error
  }
}

async function nimGenerate(collection: string, pm_key: string) {
  const generator = new Generate({
    id: collection,
    key: pm_key,
    language: 'ts',
    overwrite: false,
    deploy: false,
    deployForce: false,
    updateSource: false,
    clientCode: false,
    update: false,
    init: false,
  })
  generator.generate()
    .catch((error) => {
      console.log('Oops! Some Error Occurred, Please Try Again')
      console.error(error)
    })
}

async function nimProjectDeploy(collection_id: string, nim_token: string) {
  const projPath = join(process.cwd(), collection_id)
  // const owOptions: OWOptions = {
  //   apihost: process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
  //   api_key: nim_auth_key,
  // }
  const flags: Flags = {
    verboseBuild: false,
    verboseZip: false,
    production: false,
    incremental: false,
    yarn: false,
    env: undefined,
    webLocal: undefined,
    include: undefined,
    exclude: undefined,
    remoteBuild: false
  }
  // const cred: Credentials = {
  //   namespace: await getCurrentNamespace(fileSystemPersister),
  //   ow: owOptions,
  //   storageKey: undefined,
  //   redis: false
  // }
  // const pj = require('package.json')
  await loginUsingToken(nim_token)
  // initializeAPI(userAgent)
  const cred = getCredentialsFromEnvironment()
  deployProject(projPath, cred.ow, cred, fileSystemPersister, flags)
}

async function loginUsingToken(token: string) {
  await runNimCommand('auth/login', [token]);
}
async function getNamespace() {
  try {
    const res = await runNimCommand('auth/current',[]);
    return res.captured[0];
  } catch (e) {
    console.log('getNamespace Error:', e.message);
    return { error: e.message };
  }
}

module.exports = { main }
 
  