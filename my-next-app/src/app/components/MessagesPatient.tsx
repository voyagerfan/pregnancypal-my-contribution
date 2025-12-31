"use client";

import { useState, useEffect } from 'react';
import { useProfile } from '../stores/useProfileStore'
import { providers } from '../page'
import { Profile } from '../stores/useProfileStore'
import { fhirApiClient, MessageSendState } from '../ApiClient/apiClient'
import { TrucateText } from '../utils/utils'
import {CardContent, TextField, Box, Dialog, Autocomplete, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Search, ArrowUpDown, Plus, ArrowLeft } from 'lucide-react' 
import './Messages.css'

/*
Can use Communication Resource to grab data for MessageData type
*/

export type MessageData = {
    id: string,             // communication.id     -> unique message id 
    sender: string,         // communication.sender
    recipient: string,      // communication.recipient
    payload: Array<string>  // payload[0] = subject, payload[1] = message
    sent: Date,             // communiccation.sent
    partOf?: string | null  // communication.partOf -> link messages in a thread
};

export const Messages = ({patientName, msgDataArray}: {patientName: string, msgDataArray: Array<MessageData>}) => {

    /* ---- State Variables ---- */
    const [openNewEmail, setOpenNewEmail] = useState(false)
    const [isSortedDesc, setSortingDesc] = useState(true)
    const [openSingleEmail, setOpenSingleEmail] = useState(false)
    const [selectedEmail, setSelectedEmail] = useState<MessageData | null>(null)
    const [msgSendState, setMsgSendState] = useState<MessageSendState>("idle")
    const currentUser = useProfile((state) => state)

    /* ---- Handlers ---- */
    const newEmailButtonHandler = () => {
        setOpenNewEmail(openNewEmail == false ? true : false)
    };
    const closeNewEmail = () => {
        setOpenNewEmail(false)
    }
    const cancelNewEmail = () => {
        setMsgSendState("idle")
        setOpenNewEmail(false)
    }
    const submitNewEmail = (formData: FormData) => {
        setMsgSendState("sending")
        fhirApiClient.SendMessage(
            setMsgSendState, 
            currentUser,
            formData
        )
    }
    const emailRowClick = (data: MessageData) => {
        setSelectedEmail(data)
        setOpenSingleEmail(true)
    }
    const singleEmailBackHandler = () => {
        setOpenSingleEmail(false) 
    }

    // used to dispaly total amount of messages for the current user
    const totalMessages = msgDataArray.length;

    // immediately close the new message window if the send was successful
    useEffect(() => {
        if (msgSendState === "success") { closeNewEmail() }
    }, [msgSendState])
    
    /*
    * TODO: filter by keyword
    */
    return(
        <div className='card dashboard-card'>
            {msgSendState === "success" ?
                <Snackbar 
                    open={true} 
                    autoHideDuration={4000} 
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    onClose={() => {
                        setMsgSendState("idle")  
                    }}
                >
                    <Alert 
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Email Succesfully Sent!
                    </Alert>
                </Snackbar>
            : null
            }

            {msgSendState === "error" ?
                <Snackbar 
                    open={true} 
                    autoHideDuration={4000} 
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    onClose={() => {
                        setMsgSendState("idle")  
                    }}
                >
                    <Alert 
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Error sending message. Please try again or contact the administrator
                    </Alert>
                </Snackbar>
            : null
            }

            <NewEmailWindow
                open={openNewEmail}
                closeNewEmail={cancelNewEmail}
                sendEmail={(formData) => {submitNewEmail(formData)}}
                sendState={msgSendState}
                sender={currentUser.user}
                recipient={providers[0]}
            />

            {openSingleEmail == true ? 
                <SingleEmailView 
                    emailMsgData={selectedEmail}
                    backHandler={singleEmailBackHandler}
                /> : null }
            
            <CardContent>
                <Box className='message-header'>
                    <h1>{patientName}'s Messages</h1>
                    <p>You've got <strong> {totalMessages} </strong> messages</p>
                </Box>
                <Box className='message-main-body'>
                    <Box className='message-filter-and-sort'>
                        <div style={{display: 'flex', gap: '1rem'}}>
                            <button 
                                className="btn btn--primary btn--pill"
                                onClick={newEmailButtonHandler}
                            >
                                <Plus size={18}/>New Email
                            </button>
                        </div>
                        <IconButton onClick={() => {
                            if (isSortedDesc == true) {
                                msgDataArray.sort((a, b) => a.sent.getTime() - b.sent.getTime())
                                setSortingDesc(false) 
                            } else {
                                msgDataArray.sort((a, b) => b.sent.getTime() - a.sent.getTime())
                                setSortingDesc(true) 
                            }
                            }}>
                            <ArrowUpDown />
                        </IconButton>
                        
                    </Box>
                    <div className='table-wrap'>
                        <table className='table'>
                            <tbody>
                            {msgDataArray.map((msgData, i) =>
                                <MessageRow
                                    key={i}
                                    data={msgData}
                                    onClick={() => emailRowClick(msgData)}
                                />
                            )}
                            </tbody>
                        </table>
                    </div>
                </Box>
            </CardContent>
        </div>
    )
};

export const MessageRow = ({data, onClick}: {data: MessageData, onClick: (msgData: MessageData) => void}) => {

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric"
    }

    return(
        <tr className='message-row' onClick={() => onClick(data)}>
            <td>
                <p>{data.sender}</p> 
            </td>
            <td>
                <h4>{TrucateText(data.payload[0], 30)}</h4>
            </td>
            <td>
                <span>{TrucateText(data.payload[1], 60)}</span>
            </td>
            <td>
                <span>{data.sent.toLocaleDateString('en-US', options)}</span>
            </td>
        </tr>
    ) 
};

export const SingleEmailView = ({emailMsgData, backHandler}: {emailMsgData: MessageData | null, backHandler: () => void}) => {
    return(
        <div className='card single-email-view-open'>
            <button className='btn btn--primary btn--pill email-back-btn' onClick={backHandler}><ArrowLeft />Back</button>
            <div className='card single-email-msg-container'>
                <div className='single-email-msg-container'>
                    <span>From: {emailMsgData?.sender}</span>
                    <span>To: {emailMsgData?.recipient} </span>
                    <span>Subject: {emailMsgData?.payload[0]} </span>
                    <Box
                        className="single-email-message-box"
                        sx={{
                        border: "1px solid #ccc",
                        padding: 2,              
                        overflowWrap: "break-word",
                    }}
                    >
                    {emailMsgData?.payload[1]}
                    </Box>
                </div>
            </div>
        </div>
    )
};

export const NewEmailWindow = (
    {open, sender, recipient, sendEmail, sendState, closeNewEmail}:
    {   open: boolean,  
        sender: Profile,
        recipient: Profile,
        sendEmail: (formData: FormData) => void,
        sendState: MessageSendState,
        closeNewEmail: () => void
    }
) => {
    return(
        <Dialog 
            open={open}
        >
            <form 
                className='card newMessageContainerParent' 
                action={(formData) => {
                    formData.append("patient_id", sender.id)
                    formData.append("provider_id", recipient.id)
                    formData.append("profileType", sender.profileType)
                    sendEmail(formData)
                }}
                >
                <div className='newMessageContainer'>
                    <span className="sender-receiver-field">
                        <span>To:</span> 
                        <TextField
                            id="outlined-textarea"
                            value={`Dr. ${recipient.fullName}`}
                            disabled={true}
                        />
                    </span>
                    <span className="sender-receiver-field">
                        <span>From:</span>
                        <TextField
                            id="outlined-textarea"
                            defaultValue={sender.fullName}
                            disabled={true}
                        /> 
                    </span>
                    <TextField
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset, &:hover fieldset, &.Mui-focused fieldset, .MuiOutlinedInput-input': {
                                    borderColor: 'var(--brand)',
                                    color: 'var(--brand)'
                                }
                            }
                        }}
                        id="outlined-textarea"
                        name="subject"
                        placeholder="Subject"
                        required={true}
                        multiline
                        />
                    <TextField
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset, &:hover fieldset, &.Mui-focused fieldset, .MuiOutlinedInput-input': {
                                    borderColor: 'var(--brand)',
                                    color: 'var(--brand)'
                                }
                            }
                        }}
                        id="outlined-multiline-static"
                        name="messageContent"
                        multiline
                        required={true}
                        rows={4}
                        placeholder="Message"
                    />
                    <div className="form-buttons-row">
                        <button className='btn btn--primary btn--pill' type="button" onClick={closeNewEmail}>Cancel</button>
                        {sendState === "sending" ?  
                            <CircularProgress sx={{color: 'var(--brand)'}}/> : 
                            <button className='btn btn--primary btn--pill' type="submit">Submit</button>
                        }
                    </div>
                </div>
            </form>
        </Dialog>
    )
};

type EmailMsgData = {
    selectedRecipient: string | null,
    newEmailSubject: string | null,
    newEmailMessage: string | null,
}

export const recipientNames = [
    "Dr. Henry Nguyen",
    "Care Team"
];

export const MsgData: Array<MessageData> = [
    {
        id: "1",
        sender: "Dr Nguyen",
        recipient: "Emily",
        payload: [
            "Your latest lab results",
            "Your your glucose levels are normal"
        ],
        sent: new Date("2025-10-28T17:22:00-07:00"),
        partOf: null
    },
    {
       id: "1",
        sender: "Care Team",
        recipient: "Emily",
        payload: [
            "Next appointment scheduling",
            "We would like to schedule a follow up appointment within the next few weeks"
        ],
        sent: new Date("2024-05-10T11:05:40+05:30"),
        partOf: null 
    },
    {
       id: "1",
        sender: "Dr Spellman",
        recipient: "Emily",
        payload: [
            "PHQ-9 Follow-up",
            "Hi Emily, I received your latest PHQ-9 survey and based on the results..."
        ],
        sent: new Date("2024-05-10T11:05:40+05:30"),
        partOf: null 
    }
].sort((a, b) => b.sent.getTime() - a.sent.getTime())

/**
 * Reference - Textfield styling adopted from: https://mui.com/material-ui/react-text-field/
 */


