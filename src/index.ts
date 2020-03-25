import {
  JupyterFrontEndPlugin,
  JupyterFrontEnd
} from "@jupyterlab/application";
import { ICommandPalette, MainAreaWidget } from "@jupyterlab/apputils";

import { Widget } from "@lumino/widgets";

import "../style/index.css";

function activate(
  this: JupyterFrontEndPlugin<void>,
  app: JupyterFrontEnd,
  palette: ICommandPalette
): void {
  console.log("In activate");

  /* Create main view components */
  const sparkWidget = new Widget();
  sparkWidget.title.label = "Open Spark UI";
  const widget = new MainAreaWidget({ content: sparkWidget });
  widget.id = "spark-ui";
  widget.title.label = "Spark UI";
  widget.title.closable = true;
  const heading = document.createElement("h1");
  heading.innerHTML = "Access the Spark UI";
  heading.style.marginLeft = "5%";
  const sparkContainer = document.createElement("div");
  sparkContainer.style.textAlign = "center";
  sparkContainer.style.height = "70vh";

  let fetchDataofPySpark = async () => {
    let portNumber = (document.getElementById("portnumber") as HTMLInputElement)
      .value;

    try {
      document.getElementById("applicationRes").innerHTML = `<p>Loading application data...</p>`
      document.getElementById("executorRes").innerHTML = `<p>Loading executors data...</p>`
      document.getElementById("environmentRes").innerHTML = `<p>Loading environment data...</p>`

      let applicationResponse = await fetch(`http://localhost:${portNumber}/api/v1/applications/`);
      let applicationResult = await applicationResponse.json();
      console.log("result is " , applicationResult)
      document.getElementById("applicationRes").innerHTML = `
      <p>Applications Detail</p>
      <p>Number of applications running : ${applicationResult.length}</p>
        <ul>
        <li>App Id: ${applicationResult[0].id}</li>
        <li>App Name: ${applicationResult[0].name}</li>
        </ul>
      `
      let appId = applicationResult[0].id
      let executorsResponse = await fetch(`http://localhost:${portNumber}/api/v1/applications/${appId}/executors`)
      let executors = await executorsResponse.json();
      console.log("executors" , executors)
      document.getElementById("executorRes").innerHTML = `
      <p>Executors Detail</p>
      <ul>
      <li>Executor Id: ${executors[0].id}</li>
      <li>Host Port: ${executors[0].hostPort}</li>
      <li>Add Time: ${executors[0].addTime}</li>
      <li>Max Memory: ${executors[0].maxMemory}</li>
      </ul>
    `
      let environmentResponse =  await fetch(`http://localhost:${portNumber}/api/v1/applications/${appId}/environment`)
      let environment = await environmentResponse.json();
      console.log("environment" , environment)
      document.getElementById("environmentRes").innerHTML = `
      <p>Environment Detail</p>

      <ul>
      <li>Java verion : ${environment.runtime.javaVersion}</li>
      <li>Java Home: ${environment.runtime.javaHome}</li>
      <li>Scala Version: ${environment.runtime.scalaVersion}</li>
      </ul>
    `
    } catch (err) {
      console.log(err)
    }
  };
  /* Create input field */
  const submitButton = document.createElement("button");
  submitButton.id = "submitBtn";
  submitButton.value = "4040";

  submitButton.innerHTML = "FETCH HUH";
  submitButton.onclick = () => fetchDataofPySpark();

  const portInput = document.createElement("div");

  portInput.innerHTML = `<div class="wrapper">
      <span>Get Spark UI (typically at port numbers at and after 4040)</span>
      <input class="input" id="portnumber" placeholder="4040" type="text" value="4040">
    </div>`;

  const applicationResponse = document.createElement("div");
  applicationResponse.setAttribute("id", "applicationRes");
  const executorsResponse = document.createElement("div");
  executorsResponse.setAttribute("id", "executorRes");
  const environmentResponse = document.createElement("div");
  environmentResponse.setAttribute("id", "environmentRes");

  sparkWidget.node.appendChild(heading);
  sparkWidget.node.appendChild(portInput);
  sparkWidget.node.appendChild(submitButton);
  sparkWidget.node.appendChild(applicationResponse);
  sparkWidget.node.appendChild(executorsResponse);
  sparkWidget.node.appendChild(environmentResponse);


  sparkWidget.node.appendChild(sparkContainer);


  /* Add an application command */
  const command: string = "spark:open";
  app.commands.addCommand(command, {
    label: "Spark UI",
    execute: () => {
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, "main");
      }
      // Refresh the picture in the widget
      sparkWidget.update();
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  /* Add the command to the palette. */
  palette.addItem({ command, category: "Spark" });
}

/**
 * Initialization data for the spark_ui_tab extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "spark_ui",
  autoStart: true,
  requires: [ICommandPalette],
  activate: activate
};

export default extension;
