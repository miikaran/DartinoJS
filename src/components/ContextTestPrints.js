import React, { useContext } from 'react';
import { GameDataContext } from '../context/GameDataContext';

// NOTE: It's printing twice, because of React.StrictMode in
// index.js, this is supposedly a feature for devs.
// so just ignore it and don't delete React.StrictMode :)

/* This is just context test, delete when no longer needed */
const ContextTestPrints = () => {
    const { points, players } = useContext(GameDataContext);
    console.log('Context Points:', points);
    console.log('Context Players:', players);
    return <div>Just a test if context is working correctly</div>;
};

export default ContextTestPrints;