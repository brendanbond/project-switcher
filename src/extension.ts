// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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
      getQuickPickItems()
        .then((items) => vscode.window.showQuickPick(items))
        .then((item) => {
          if (item) {
            let uri = vscode.Uri.file(path.join(projectDirectory, item));
            vscode.commands.executeCommand("vscode.openFolder", uri, true);
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
