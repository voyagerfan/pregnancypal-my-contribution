import { create } from 'zustand'
import { persist} from 'zustand/middleware'

/**
 * Normalize a type for both patient and provider
 * userName may be null since provider does not have a username
 */
export type Profile = {
    id: string
    fullName: string,
    profileType: "patient" | "provider",
    userName: string
}

/*
* Initialize the global variable with a patient to avoid null type
* and repeated double negation operator for API calls
*/
const initialPatient: Profile = {
    id: "51589898",
    fullName: "Emily Smith",
    profileType: "patient",
    userName: "esmith47"  
}

export type ProfileState = {
    user: Profile,
    isHydrated: boolean
    setHydration: (hydrationState: boolean) => void
    changeUser: (newUser: Profile) => void
}

export const useProfile = create<ProfileState>()(
    persist(
        (set) => ({
            /* the current/default user */
            user: initialPatient,
            
            /* boolean to track hydration state on hot reload or refresh*/
            isHydrated: false,

            /* lambda to update hydration state - used with the listener */
            setHydration: (hydrationState: boolean) => set({isHydrated: hydrationState}),

            /* lambda to change/update user */
            changeUser: (newUser: Profile) => set({user: newUser}) 
        }),
        {
            name: "userName",
            onRehydrateStorage: (state) => {
                return () => state.setHydration(true)
            }
        },
    ),  
)

/**
 * References:
 * 1. Creating Global Variables: Zustand Documents: https://zustand.docs.pmnd.rs/getting-started/introduction
 * 2. Persisting state: Zustand Documents: https://zustand.docs.pmnd.rs/integrations/persisting-store-data
 */