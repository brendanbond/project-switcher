import path = require("path");
import * as vscode from "vscode";

function getProjectDirectory() {
  let projectDirectorySetting = vscode.workspace
    .getConfiguration("project-switcher")
    .get("projectDirectory");

  if (projectDirectorySetting && typeof projectDirectorySetting === "string") {
    return projectDirectorySetting;
  } else if (vscode.workspace.workspaceFolders !== undefined) {
    let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;
    return path.join("../", workspaceFolder);
  } else {
    throw new Error(
      "ProjectSwitcher: Project directory folder not found, open a folder an try again or set a default using project-switcher.projectDirectory"
    );
  }
}

function getQuickPickItems(): Thenable<string[]> {
  const projectDirectory = getProjectDirectory();
  return vscode.workspace.fs
    .readDirectory(vscode.Uri.file(projectDirectory))
    .then((result) =>
      result
        .filter(([name, fileType]) => fileType === vscode.FileType.Directory)
        .map(([dirName]) => dirName)
    );
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const projectDirectory = getProjectDirectory();
  let disposable = vscode.commands.registerCommand(
    "project-switcher.switch",
    () => {
      // use Promise.resolve() to coerce Thenable (wich doesn't contain `catch` or `finally`) into a native Promise
      Promise.resolve(
        getQuickPickItems()
          .then((items) => vscode.window.showQuickPick(items))
          .then((item) => {
            if (item) {
              let uri = vscode.Uri.file(path.join(projectDirectory, item));
              // check if there is a vscode workspace file
              vscode.workspace.fs.readDirectory(uri).then((items) => {
                const vsCodeWorkspaceFileTuple = items
                  .filter(
                    ([name, fileType]) => fileType === vscode.FileType.File
                  )
                  .find(([name]) => {
                    // get file extension as hackily as possible
                    const fileNameArr = name.split(".");
                    const extension = fileNameArr[fileNameArr.length - 1];
                    return extension === "code-workspace";
                  });
                if (vsCodeWorkspaceFileTuple) {
                  vscode.commands.executeCommand(
                    "vscode.openFolder",
                    vscode.Uri.file(
                      path.join(uri.fsPath, vsCodeWorkspaceFileTuple[0])
                    ),
                    { forceNewWindow: true }
                  );
                } else {
                  vscode.commands.executeCommand("vscode.openFolder", uri, {
                    forceNewWindow: true,
                  });
                }
              });
            }
          })
      ).catch((err) => vscode.window.showErrorMessage(err));
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
