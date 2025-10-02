# Mod Updater

Automatically downloads Minecraft mods for the specified update. **Only supports Modrinth, not CurseForge.**

## Configuration File Structure

The program requires the `config.json` file to be in the current working directory.
This file contains all of the mods that are to be searched and updated if possible, as well as extra information about them.

Each entry must contain the following:

- Technical name (as in the URL)
- File name (optional)
- Permanent ID (optional)

Here is an example of what the file should look like (excluding comments).

```json
[
  {
    "name": "sodium", // The name of the mod in the Modrinth URL
    "file": "Sodium", // Optional; what the downloaded mod filename should be
    "id": "AANobbMI" // Optional; the permanent ID (in case the name of the mod ever changes)
  }
]
```
