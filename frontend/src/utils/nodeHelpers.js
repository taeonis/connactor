export function getNodeType(node) {
    if (!node) return undefined;
    if (node.id % 2 === 0) {
        return 'person';
    } else {
        return 'movie';
    }
}

export async function fetchCredits(node) {
    if (node.data) {
        const nodeType = getNodeType(node);
        try {
            const response = await fetch(`/api/get-credits?type=${nodeType}&id=${node.data.id}`);
            const json = await response.json();
            node['credits']['IDs'] = new Set(json.IDs);
            node['credits']['images'] = json.images;
        } catch (e) {
            console.log(`Error failed connection check: ${e}`);
        }
    }
}

export function getLastNonEmptyNode(nodes) {
    for (let idx = nodes.length - 1; idx >= 0; idx--) {
        if (nodes[idx].data) {
            return nodes[idx];
        }
    }
    return null;
}


