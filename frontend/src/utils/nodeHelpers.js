export function getPairIDS(nodes, idx, startingPerson) {
    let personID = '';
    let movieID = '';

    let nodeType = nodes[idx].id % 2 === 0 ? 'person' : 'movie';
    if (nodeType === 'person') {
        personID = nodes[idx].data?.id;
        movieID = nodes[idx - 1].data?.id;
    }
    else {
        personID = idx === 0 ? startingPerson.data.id : nodes[idx - 1].data?.id;
        movieID = nodes[idx].data?.id;
    }
    console.log(`IDX: ${idx}`);
    console.log(`Person ID: ${personID}, Movie ID: ${movieID}`);

    return { personID, movieID };
}

export function lastNodeIsEmpty(nodes) {
    if (nodes.length > 0 && nodes[nodes.length - 1].data) {
        return false
    }
    return true
}

export function getLastNonEmptyNode(nodes, endNodeIncluded=false) {
    let idx = nodes.length - 1;
    if (endNodeIncluded) {
        idx--;
    }
    for (; idx >= 0; idx--) {
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