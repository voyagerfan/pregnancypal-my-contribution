'use client'
import { ProfileState } from '../stores/useProfileStore'


export const fhirApiClient = {
    // base url for api calls - variables live in .env
    baseUrl: process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "https://production-url.com",

    /** 
    * Fetches all received messages for a specific user, then updates 
    * the loadingState and responseState
    * 
    * @param loadingState - Corresponds to the setter from the state hook in the calling component to track state. 
    * @param responseData - Corresponds to the setter from the state hook in the calling component to store data.
    * @param currentUser - Global hook (variable) for the current user.
    * @returns {void} - No return value, only state updates to the calling component
    * @example
    * client.getAllReceivedMessages(setApiResponseState, apiSetData,currentUser)
    * -> the result will be state updates to the loadingState and responseData
    * 
    * Function adapted from: MDN docs, https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises
    */
    async getAllReceivedMessages(
        loadingState: React.Dispatch<React.SetStateAction<ApiResponseState>>,
        responseData: React.Dispatch<React.SetStateAction<any>>,
        currentUser: ProfileState
    ) {
        const searchParams = new URLSearchParams(
                    {
                        id: currentUser.user.id, 
                        profileType: currentUser.user.profileType
                    }) 
        if (currentUser.isHydrated) {
            console.log(`${this.baseUrl}/coms/allrecieved?${searchParams.toString()}`)
            fetch(`${this.baseUrl}/coms/allrecieved?${searchParams.toString()}`, {
                method: "GET"
            })
            .then((res) => {
                if(!res.ok) {throw new Error(`${res.status} ${res.statusText}`)}
                return res.json()
            })
            .then((data) => {
                console.log("Success")
                responseData(data);
                loadingState("success"); 
            })
            .catch((error: Error) => {
                loadingState("error")
                responseData("issue with fetch")
                console.log(error.message)
            })
        }
    },
    /**
     * Makes a POST request to the fetch endpoint for form data while
     * tracking the state of the request (e.g. "loading", "idle", "success", "error")
     * 
     * @param setMsgSendState - Corresponds to the setter from the state hook in the calling component to track state. 
     * @param currentUser - Global hook (variable) for the current user. 
     * @param formData - FormData object passed from the form in the calling component
     * @returns {void} - No return value, only state updates to the calling component
     * 
     * @example
     * client.SendMessage(setMsgSendState, currentUser,formData)
     * 
     * Function adapted from: MDN docs, https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises 
     */
    
    async SendMessage(
        setMsgSendState: React.Dispatch<React.SetStateAction<MessageSendState>>,
        currentUser: ProfileState,
        formData: FormData
    ) {
        if (currentUser.isHydrated) {
            fetch(`${this.baseUrl}/coms/send`, {
                method: "POST",
                body: formData
            })
            .then((res) => { 
                if(!res.ok) {throw new Error(`${res.status} ${res.statusText}`)}
                return res.json()
            })
            .then((data) => {
                setMsgSendState("success") 
                console.log(`data returned: ${data}`)
            })
            .catch((error: Error) => {
                setMsgSendState("error")
                console.log(error.message)
            })
        }
    }
}   

// fixed response type for the loading state
export type ApiResponseState = "success" | "error" | "loading"

// fixed state tracking for messages
export type MessageSendState = "success" | "error" | "sending" | "idle"