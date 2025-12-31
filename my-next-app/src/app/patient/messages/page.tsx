'use client'
import { Messages, MsgData, MessageData } from "../../components/MessagesPatient"
import { useEffect, useState } from "react"
import { CircularProgress, Alert, AlertTitle} from '@mui/material';
import { ApiResponseState, fhirApiClient } from '../../ApiClient/apiClient'
import { useProfile } from "@/app/stores/useProfileStore"
import '../../components/Messages.css'

export default function Page(){
    const [apiResponseState, setApiResponseState] = useState<ApiResponseState>("loading")
    const [apiData, apiSetData] = useState<any>(null)
    const currentUser = useProfile((state) => state)

    useEffect(() => {
        fhirApiClient.getAllReceivedMessages(
            setApiResponseState, 
            apiSetData,
            currentUser
        )
    }, [currentUser.isHydrated])

    switch (apiResponseState) {
        case "loading":
            return(
                <div className="container progress-indicator-card">
                    <CircularProgress
                        sx={{
                            color: 'var(--brand)'
                        }}
                        size='10rem'
                    /> 
                </div>
            )
        case "success":
            console.log(apiData)
            return(
                <div className="container messages-parent">
                    <Messages 
                        patientName={currentUser.isHydrated ? currentUser.user.fullName : "Loading"}
                        msgDataArray={MapMessageApiData(apiData)}
                    />   
                </div>
            )
        default:
            return(
                <div className="container messages-parent">
                    <Alert severity="error">
                        <AlertTitle>Unable to Retreive Messages</AlertTitle>
                        Please contact the administrator if this issue persists
                    </Alert>
                </div>
            )
    }
}

function MapMessageApiData(apiData: any[]): MessageData[] {
    const msgArr: MessageData[] = []
    apiData.map((messageItem, _) => {
        const message: MessageData = {
            id: messageItem.id,
            sender: messageItem.sender,
            recipient: messageItem.recipient,
            sent: new Date(messageItem.send_time),
            payload: messageItem.payload,
            partOf: null
        }
        msgArr.push(message)
    })
    return msgArr
}