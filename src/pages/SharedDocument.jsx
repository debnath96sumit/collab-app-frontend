import React from 'react'
import { useParams } from 'react-router-dom'

const SharedDocument = () => {
    const { shareToken } = useParams();
    console.log(shareToken);

    return (
        <div>SharedDocument</div>
    )
}

export default SharedDocument