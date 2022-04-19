const plugin = () => {
    let componentSets: ComponentSetNode[] = [];
    let components: SceneNode[] = [];

    const selection = figma.currentPage.selection;

    if (selection.length > 0) {
        for (const node of selection) {
            componentSets = componentSets.concat(getComponentSetNodes(node));            
        }
        for (const componentSet of componentSets) {
            const parent = componentSet.parent;
            const variants = componentSet.children;
            
            for (const variant of variants) {
                // Save position and name
                const x = componentSet.x + variant.x;
                const y = componentSet.y + variant.y;
                const name = variant.name;

                if (parent) {
                    const index = parent.children.indexOf(componentSet);
                    parent.insertChild(index, variant)
                    variant.x = x
                    variant.y = y;
                    variant.name = name; // Rename to capture variant properties
                }
                components.push(variant);
            }
        }

        // Report results (and set new selection)
        const count = components.length;
        if (count > 0) {
            figma.currentPage.selection = components;

            // // Reset expanded state from saved
            // for (const component of components) {
            //     component.expanded = JSON.parse(component.getPluginData("expanded"));
            // }

            figma.notify(
                `${count} variant${
                    count > 1 ? "s" : ""
                } successfully converted to components`
            );
        } else {
            figma.notify("No variant sets found in your selection");
        }
    } else {
        figma.notify("Select a set of variants to convert to components");
    }

    figma.closePlugin();
};

const getComponentSetNodes = (node: SceneNode): ComponentSetNode[] => {
    // If node has children, traverse
    if (node.type === "COMPONENT_SET") {
        return [node];
    } else if ("children" in node && node.children.length > 0) {
        return node.children.reduce((all: ComponentSetNode[], child) => {
            return all.concat(getComponentSetNodes(child));
        }, []);
    } else {
        return [];
    }
};

const clone = (value: any): any => {
    return JSON.parse(JSON.stringify(value));
};

plugin();
