# Project Switcher

A very simple project switcher for VSCode.

## Extension Commands

This extension contributes the following command:
- `project-switcher.switch`

You can invoke this command using the Command Palette (Shift + Cmd + P on a Mac) and choosing `Project Switcher: Switch Projects` or by binding a key (see below for the provided keybinding).

## Extension Settings

This extension contributes the following setting:

- `project-switcher.projectDirectory`: The directory from which ProjectSwitcher looks for project folders.

If the `projectDirectory` setting is not set, the extension will attempt to use the parent directory of the currect workspace.

## Keybindings

This extension contributes the following keybinding:

```json
{
  "key": "ctrl+;",
  "mac": "cmd+;",
  "command": "project-switcher.switch",
  "when": "!inQuickOpen"
}
```

## Installation

To build the .VSIX file from source, you'll need the `vcse` package:
```
npm install -g vcse
```
You can then build your .VSIX file by invoking the `package` command in the root directory:
```
vsce package
```

Finally, you can install the extension in VSCode by invoking the `Extensions: Install from VSIX...` command in the Command Palette (Shift + Cmd + P on a Mac) and choosing the newly created .VSIX file from the dialog.
