import React, { useEffect, useState } from "react";

const ConnectionLink = ( { position, connectionVal }) => {
    let imgSrc = '/horizontal_broken.png';
    let alignment = '';

    if (position % 10 === 0 || position % 10 === 1 || position % 10 === 5 || position % 10 === 6) { // -->
        imgSrc = connectionVal ? '/horizontal_link.png' : '/horizontal_broken.png';
    }
    else if (position % 10 === 3) { // <--
        imgSrc = connectionVal ? '/horizontal_link.png' : '/horizontal_broken.png';
    }
    if (position % 10 === 2 || position % 10 === 7) { // <-'
        imgSrc = connectionVal ? '/down_link.png' : '/down_broken.png';
        alignment = ' align-top';
    }
    else if (position % 10 === 4 || position % 10 === 9) { // v-
        imgSrc = connectionVal ? '/down_link.png' : '/down_broken.png';
        alignment = ' align-bottom';
    }
    

    return (
        <div class={`item connector${alignment}`}>
            <img src = {imgSrc}
                title={`${position}, ${connectionVal}`}
            />
        </div>
    )
};

export default ConnectionLink;