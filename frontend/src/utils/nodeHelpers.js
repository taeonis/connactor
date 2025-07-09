export async function fetchCredits(node) {
    if (node.data) {
        const apiURL = node.id % 2 === 0 ? `/api/person-credits?person_id=${node.data.id}` : `/api/movie-credits?movie_id=${node.data.id}`;
        try {
            const response = await fetch(apiURL);
            const json = await response.json();
            node['credits']['IDs'] = new Set(json.IDs);
            node['credits']['images'] = json.images;
        } catch (e) {
            console.log(`Error failed connection check: ${e}`);
        }
    }
}


export function lastNodeIsEmpty(nodes) {
    if (nodes.length > 0 && nodes[nodes.length - 1].data) {
        return false
    }
    return true
}

export function getLastNonEmptyNode(nodes) {
    for (let idx = nodes.length - 1; idx >= 0; idx--) {
        if (nodes[idx].data) {
            return nodes[idx];
        }
    }
    return null;
}

export function getNodeType(node){
    if (!node) return undefined;
    if (node.id % 2 === 0) {
        return 'person';
    } else {
        return 'movie';
    }
}

export function isLastDynamicNode(node, nodes) {
    let lastNode = getLastNonEmptyNode(nodes, endNodeIncluded);
    if (lastNode?.data?.id === node.data?.id && getNodeType(lastNode) === getNodeType(node)) {
        return true;
    }
    return false;
}