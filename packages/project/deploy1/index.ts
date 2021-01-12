import { initializeAPI, Flags, deployProject, readAndPrepare, fileSystemPersister, wipePackage, buildProject, deploy, getCurrentNamespace, Credentials, OWOptions } from 'nimbella-deployer'
import { default as Generate } from '@nimbella/postman-api/lib/invoker'
import { existsSync, rmdirSync } from 'fs'
import { join, dirname } from 'path'

async function main(args: any) {
  try {
    await nimGenerate(args.collection_id, args.postman_key)
    await nimProjectDeploy(args.collection_id, args.nimbella_key, await getCurrentNamespace(fileSystemPersister))
  } catch (error) {
    console.error(error)
    return error
  }
}

async function nimGenerate(collection_id: string, postman_key: string) {
  const generator = new Generate({
    id: collection_id,
    key: postman_key,
    language: 'ts',
    overwrite: false,
    deploy: true,
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

async function nimDeploy(collection_id: string, nim_auth_key: string, namespace: string) {
  const prepare: any = await readAndPrepare(
    dirname(join(process.cwd(), collection_id, 'project.yml')),
    {
    }, {
    namespace: await getCurrentNamespace(fileSystemPersister),
    ow: {
      apihost: process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
      api_key: nim_auth_key,
    },
    storageKey: undefined,
    redis: false
  },
    fileSystemPersister,
    {
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
    }, ""
  );

  const build: any = await buildProject(prepare);
  if (!build) {
    Object.assign(process.env, { __OW_NAMESPACE: namespace });
    existsSync(join(process.cwd(), collection_id)) && rmdirSync(join(process.cwd(), collection_id), { recursive: true });
    throw new Error(`${collection_id} Couldn't build project.`);
  }

  const deployResponse = await deploy(build);
  if (deployResponse.failures && deployResponse.failures.length > 0) {
    await wipePackage(collection_id, process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
      nim_auth_key);
    throw new Error(`${collection_id} Couldn't deploy.`);
  }
  Object.assign(process.env, { __OW_NAMESPACE: namespace });
  if (collection_id && existsSync(join(process.cwd(), collection_id))) {
    rmdirSync(join(process.cwd(), collection_id), { recursive: true });
  }
}

async function nimProjectDeploy(collection_id: string, nim_auth_key: string, namespace: string) {
  const projPath = join(process.cwd(), collection_id)
  const owOptions: OWOptions = {
    apihost: process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
    api_key: nim_auth_key,
  }
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
  const cred: Credentials = {
    namespace: await getCurrentNamespace(fileSystemPersister),
    ow: owOptions,
    storageKey: undefined,
    redis: false
  }
  // const pj = require('package.json')
  const userAgent = 'postman-api/0.0.0'
  initializeAPI(userAgent)
  deployProject(projPath, owOptions, cred, fileSystemPersister, flags)
}
module.exports = { main }
