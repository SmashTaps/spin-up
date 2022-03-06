#!/usr/bin/env node
import readInput from "./readInput";
import clone from "git-clone";
import { renderToFolder, render } from "template-file";
import {
  postLambdaConstruct,
  getLambdaConstuct,
} from "./__templates__/lambdaTemplates";
import apiGatewayConstruct from "./__templates__/apiGateway";
import {
  getHandlerSettings,
  createHandlerSettings,
} from "./__templates__/settingsTemplates";
import jhsf from "./jhsf";
import { exec } from "child_process";
import ora from "ora";
async function run() {
  const devPath = `src/__templates__/`;
  const prodPath = `node_modules/@smashtaps/spin-up/src/__templates__/`;
  const templatePath = prodPath;

  try {
    const data: any = await readInput();

    jhsf(data.howDoYouFeel);

    const spinner = ora("\nConstructing code").start();

    const stackOptions = {
      stackName: data.nestedStackName,
      stackNameCap:
        data.nestedStackName.charAt(0).toUpperCase() +
        data.nestedStackName.slice(1),
    };

    const settingsOptions = {
      ...stackOptions,
      dbRemovalPolicy: data.dbRemovalPolicy,
      dbTableName: data.dbTableName,
      dbBillingMode: data.dbBillingMode,
      apiName: data.apiName,
      nodeJsRunTime: data.nodeJsRunTime,
    };

    spinner.text = "Generating tempaltes";

    const getConstructCode = render(getLambdaConstuct, stackOptions);
    const postConstructCode = render(postLambdaConstruct, stackOptions);
    const getHandlerSettingsCode = render(getHandlerSettings, settingsOptions);
    const createHandlerSettingsCode = render(
      createHandlerSettings,
      settingsOptions
    );
    const apigatewayConstructCode = render(apiGatewayConstruct, stackOptions);

    const indexTsTemplateData = {
      ...stackOptions,
      getConstructCode:
        data.apiEndPoints.indexOf("POST") !== -1 ? postConstructCode : "",
      postConstructCode:
        data.apiEndPoints.indexOf("GET") !== -1 ? getConstructCode : "",
      apigatewayConstructCode:
        data.apiEndPoints?.length !== 0 ? apigatewayConstructCode : "",
    };

    const settingsTsTemplateData = {
      ...settingsOptions,
      ...stackOptions,
      getHandlerSettingsCode:
        data.apiEndPoints.indexOf("GET") !== -1 ? getHandlerSettingsCode : "",
      createHandlerSettingsCode:
        data.apiEndPoints.indexOf("POST") !== -1
          ? createHandlerSettingsCode
          : "",
    };

    spinner.text = "Rendering files";

    renderToFolder(
      templatePath + "index.ts",
      data.nestedStackPath,
      indexTsTemplateData
    );

    renderToFolder(
      templatePath + "settings.ts",
      data.nestedStackPath,
      settingsTsTemplateData
    );

    spinner.text = "Importing business logic";

    try {
      if (data.apiEndPoints.indexOf("GET") !== -1) {
        clone(
          "https://github.com/smashtaps/__templates_get__.git",
          `${data.nestedStackPath}/lambdaFns/get`,
          undefined,
          function () {
            exec(`cd ${data.nestedStackPath}/lambdaFns/get && rm -rf .git`);
            exec(
              `cd ${data.nestedStackPath}/lambdaFns/get && rm -rf .gitignore`
            );
          }
        );
      }

      if (data.apiEndPoints.indexOf("POST") !== -1) {
        await clone(
          "https://github.com/smashtaps/__templates_create__.git",
          `${data.nestedStackPath}/lambdaFns/create`,
          undefined,
          function () {
            exec(`cd ${data.nestedStackPath}/lambdaFns/create && rm -rf .git`);
            exec(
              `cd ${data.nestedStackPath}/lambdaFns/create && rm -rf .gitignore`
            );
          }
        );
      }
      spinner.text = "Done 🎉 Happy Coding ❤️";
      spinner.stopAndPersist();
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
  }
}

run();
