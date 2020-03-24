import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';


/**
 * Initialization data for the bisso extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'bisso',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension bisso is activated!');
  }
};

export default extension;
