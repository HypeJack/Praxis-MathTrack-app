"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our state
interface TriadState {
    computationStatus: "Supported" | "Needs Improvement" | null;
    literacyA_Status: "Strong Match" | "Partial Match" | "Missed" | null;
    literacyB_Status: "Precise Gap Identified" | "Needs Improvement" | null;
    activeScenarioId: string;
}

interface TriadContextType {
    state: TriadState;
    setActiveScenarioId: (id: string) => void;
    setComputationStatus: (status: TriadState['computationStatus']) => void;
    setLiteracyA_Status: (status: TriadState['literacyA_Status']) => void;
    setLiteracyB_Status: (status: TriadState['literacyB_Status']) => void;
}

const TriadContext = createContext<TriadContextType | undefined>(undefined);

export function TriadProvider({ children, initialScenarioId }: { children: ReactNode; initialScenarioId?: string }) {
    const [state, setState] = useState<TriadState>({
        computationStatus: null,
        literacyA_Status: null,
        literacyB_Status: null,
        activeScenarioId: initialScenarioId || "slope",
    });

    const setActiveScenarioId = (id: string) => {
        setState(prev => ({
            // Reset all other statuses when starting a new scenario
            computationStatus: null,
            literacyA_Status: null,
            literacyB_Status: null,
            activeScenarioId: id
        }));
    };

    const setComputationStatus = (status: TriadState['computationStatus']) => {
        setState(prev => ({ ...prev, computationStatus: status }));
    };

    const setLiteracyA_Status = (status: TriadState['literacyA_Status']) => {
        setState(prev => ({ ...prev, literacyA_Status: status }));
    };

    const setLiteracyB_Status = (status: TriadState['literacyB_Status']) => {
        setState(prev => ({ ...prev, literacyB_Status: status }));
    };

    return (
        <TriadContext.Provider value={{ state, setActiveScenarioId, setComputationStatus, setLiteracyA_Status, setLiteracyB_Status }}>
            {children}
        </TriadContext.Provider>
    );
}

export function useTriad() {
    const context = useContext(TriadContext);
    if (context === undefined) {
        throw new Error('useTriad must be used within a TriadProvider');
    }
    return context;
}
