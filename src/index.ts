import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { Dialog, showDialog, showErrorMessage } from '@jupyterlab/apputils';
import { ICurrentUser } from '@jupyterlab/user';
import { requestAPI, requestJupyterAPI } from './handler';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
const commandID = 'my-share-flie';
/**
 * Initialization data for the share-platform extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'share-platform:plugin',
  autoStart: true,
  requires: [IFileBrowserFactory, ICurrentUser],
  activate: (
    app: JupyterFrontEnd,
    factory: IFileBrowserFactory,
    currentUsr: ICurrentUser
  ) => {
    const { tracker } = factory;

    const userInfo = currentUsr.toJSON();
    console.log('userInfo', userInfo);
    app.commands.addCommand(commandID, {
      label: '分享到数字平台',
      isEnabled: () => true,
      isVisible: () => true,
      iconClass: 'some-css-icon-class',
      execute: () => {
        const widget = tracker.currentWidget;
        if (!widget) {
          return;
        }
        const path = widget.selectedItems().next()?.path;
        requestJupyterAPI<any>('/api/contents/' + path)
          .then(data => {
            data.userInfo = userInfo;
            console.log('data', data);
            requestAPI<any>('get_example', {
              body: JSON.stringify(data),
              method: 'POST'
            })
              .then(data => {
                console.log('error', data);
                if (data.code === 200) {
                  void showDialog({
                    title: '提示',
                    body: '同步成功',
                    buttons: [Dialog.okButton()]
                  });
                } else {
                  showErrorMessage('提示', data.message);
                }
              })
              .catch(reason => {
                showErrorMessage('提示', reason);
              });
          })
          .catch(reason => {
            showErrorMessage('提示', reason);
          });
      }
    });
    app.contextMenu.addItem({
      command: commandID,
      selector: '.jp-DirListing-item[data-isdir="false"]',
      rank: 1
    });
  }
};

export default plugin;
