# Project Switcher

A very simple project switcher for VSCode.

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
