export function determineConnection(type, personID, movieID) {
    if (type === 'person') {

    }
}

export async function checkPersonInMovie(cached, personID, movieID) {
    console.log(`checking personID: ${personID} and movieID ${movieID}`);
    if (!(personID in cached)) {
        try {
            const response = await fetch(`http://localhost:5000/api/filmography?person_id=${personID}`);
            const json = await response.json();
            let IDs = new Set(json.IDs);
            let titles = new Set(json.titles);
            cached[personID] = {'movieIDs': IDs, 'titles': titles};
        } catch (e) {
            console.log(`Error failed connection check: ${e}`);
            return false;
        }
    }
    let filmographyIDs = cached[personID]['movieIDs'];
    console.log(`result: ${filmographyIDs.has(movieID)}`);
    return filmographyIDs.has(movieID);
}

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