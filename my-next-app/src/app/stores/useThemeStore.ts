import { create } from 'zustand'
import { Theme } from '../components/ThemeSetter'
import { persist} from 'zustand/middleware'

// add a route type for strict control
type Route = "/patient" | "/provider"

/**
 * ThemeState provides a type for useTheme (Typescript requirement)
 * Theme is pulled in from ThemeSetter for consistency.
 */
type ThemeState = {
    theme: Theme,
    route: Route,
    changeTheme: (newTheme: Theme) => void
    changeRoute: (newRoute: Route) => void
}

export const useTheme = create<ThemeState>()(
    persist(
        (set) => ({
            /* the current/default theme */
            theme: "theme-patient",

            /* the current/default theme */
            route: "/patient",

            /* lambda to change the theme */
            changeTheme: (newTheme: Theme) => set({theme: newTheme}), 

            /* lambda to change route*/
            changeRoute: (newRoute: Route) => set({route: newRoute})
        }),
        {
            name: "themeState"
        }
    )
)
/**
 * References:
 * 1. Creating Global Variables: Zustand Documents: https://zustand.docs.pmnd.rs/getting-started/introduction
 * 2. Persisting state: Zustand Documents: https://zustand.docs.pmnd.rs/integrations/persisting-store-data
 */