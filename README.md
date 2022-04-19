# Description

Detach master components, just like you detach instances with this simple plugin.

Ever been annoyed by the fact that once you create a component, there’s no going back? Select a component and run this simple plugin to revert it back to a frame in the same way "Detach Instance" does with your instances.

It will also do multiple components if you select more than one.

### What will happen the master has instances?

Any instances will remain untouched. You will also still be able to run "Master Component —> Restore Master Component" on them to restore their master component.

# Setup

1. Clone this repo to a folder
2. Run `npm install` from the command line within your new project folder
3. Follow Figma's setup instructions (https://www.figma.com/plugin-docs/setup/)
4. In Figma, create a new plugin by going to your profile -> Plugins -> Create new plugin -> "Link existing plugin" and selecting the manifest.json in your project folder
5. Run `npm run dev`
6. Execute the plugin from Plugins -> Development -> ...

# Figma Documentation

-   Plugin info/guide: https://www.figma.com/plugin-docs/
-   Figma API documentation: https://www.figma.com/plugin-docs/api/api-overview/
