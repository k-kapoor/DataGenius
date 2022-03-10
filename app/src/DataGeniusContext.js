import React, { useState } from "react";

export const DataGeniusContext = React.createContext({user: null, setUser: () => {}});

export default function DataGeniusProvider(props) {
    
    const [user, setUser] = useState({exists: false, username: "", bio: "", avatar: ""})
    const value = {user, setUser}

    return (
        <DataGeniusContext.Provider value={value}>
            {props.children}
        </DataGeniusContext.Provider>
    )
}