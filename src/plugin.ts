const plugin = () => {
    let components: ComponentNode[] = [];
    let frames: FrameNode[] = [];

    const selection = figma.currentPage.selection;

    if (selection.length > 0) {
        for (const node of selection) {
            components = components.concat(getComponentNodes(node));            
        }
        for (const component of components) {
            const parent = component.parent;
            const frame = createFrameFromComponent(component);
            // Reposition frame in tree and on the canvas
            if (parent) {
                if (parent.type !== "COMPONENT_SET") {
                    const index = parent.children.indexOf(component);
                    parent.insertChild(index, frame);
                    frame.x = component.x;
                    frame.y = component.y;
                }
                else { // It's a set of variants
                    const grandparent = parent.parent;
                    if (grandparent) {
                        const index = grandparent.children.indexOf(parent);
                        grandparent.insertChild(index, frame);
                    }
                    frame.x = parent.x + component.x;
                    frame.y = parent.y + component.y;
                    frame.name = component.name; // Rename to capture variant properties
                }
            }
            else {
                frame.x = component.x;
                frame.y = component.y;
            }

            // Save layer tree expanded state
            frame.setPluginData("expanded", JSON.stringify(component.expanded));
            frame.expanded = component.expanded;
            component.remove();
            frames.push(frame);
        }

        // Report results (and set new selection)
        const count = frames.length;
        if (count > 0) {
            figma.currentPage.selection = frames;

            // Reset expanded state from saved
            for (const frame of frames) {
                frame.expanded = JSON.parse(frame.getPluginData("expanded"));
            }

            figma.notify(
                `${count} component${
                    count > 1 ? "s" : ""
                } successfully detached`
            );
        } else {
            figma.notify("No main components found in your selection");
        }
    } else {
        figma.notify("Select a main component to detach");
    }

    figma.closePlugin();
};

const getComponentNodes = (node: SceneNode): ComponentNode[] => {
    // If node has children, traverse
    if (node.type === "COMPONENT") {
        return [node];
    } else if ("children" in node && node.children.length > 0) {
        return node.children.reduce((all: ComponentNode[], child) => {
            return all.concat(getComponentNodes(child));
        }, []);
    } else {
        return [];
    }
};

const createFrameFromComponent = (component: ComponentNode): FrameNode => {
    const instance = component.createInstance();
    const frame = instance.detachInstance();
    return frame;
};

const clone = (value: any): any => {
    return JSON.parse(JSON.stringify(value));
};

plugin();
