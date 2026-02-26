import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Role = 'Doctor' | 'Patient' | 'ASHA Worker' | null;

interface RoleContextType {
    role: Role;
    setRole: (role: Role) => void;
    activeUserId: number | null;
    setActiveUserId: (id: number | null) => void;
    activeUserName: string | null;
    setActiveUserName: (name: string | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<Role>(null);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [activeUserName, setActiveUserName] = useState<string | null>(null);

    return (
        <RoleContext.Provider value={{ role, setRole, activeUserId, setActiveUserId, activeUserName, setActiveUserName }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};
