// import { runNimCommand, CaptureLogger } from 'nimbella-cli'
// import { initializeAPI, Flags, deployProject} from 'nimbella-cli/lib/deployer'
import { initializeAPI, Flags, deployProject, readAndPrepare, fileSystemPersister, wipePackage, buildProject, deploy, getCurrentNamespace } from 'nimbella-deployer'
import { default as Generate } from '@nimbella/postman-api/lib/invoker'
import { existsSync } from 'fs'
import { removeDir } from 'rimraf'
import { join, dirname } from 'path'
// import Generate from 'nim-postman/lib/invoker';

async function main(args: any) {
  try {

    await nimGenerate(args.collection_id, args.postman_key)
    await nimDeploy(args.collection_id, args.postman_key, await getCurrentNamespace(fileSystemPersister))
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
    dirname(join(__dirname, collection_id, 'project.yml')),
    {
    }, {
    ow: {
      apihost: process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
      api_key: nim_auth_key
    }
  },
    fileSystemPersister,
    {}, ""
  );

  const build: any = await buildProject(prepare);
  if (!build) {
    Object.assign(process.env, { __OW_NAMESPACE: namespace });
    existsSync(join(__dirname, collection_id)) && removeDir(join(__dirname, collection_id));
    throw new Error(`${collection_id} Couldn't build project.`);
  }

  const deployResponse = await deploy(build);
  if (deployResponse.failures && deployResponse.failures.length > 0) {
    await wipePackage(collection_id, process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
      nim_auth_key);
    throw new Error(`${collection_id} Couldn't deploy.`);
  }
  Object.assign(process.env, { __OW_NAMESPACE: namespace });
  if (collection_id && existsSync(join(__dirname, collection_id))) {
    removeDir(join(__dirname, collection_id));
  }
}

module.exports = { main }
