import { Box, Card, CardContent } from '@mui/material';
import { FileText, Activity, Clock } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import './Updates.css';

type UpdateData = {
    updateDescription: string,
    date: string,
    icon: React.ReactElement
};

/**
 * 
 * @param {object} props
 * @param {string} props.updateDescription - Description of the update
 * @param {string} props.date - Date that the service/visit occured
 * @param {number} props.colorKey - The index of position of the row used to determine color
 *   
 * @returns JSX.Element 
 */

export const UpdateRow = ({updateDescription, date, icon, colorKey}: {date: string, updateDescription: string, icon: React.ReactElement, colorKey: number}) => {
    return (
        <Box className= 'updates-row'>
            <Avatar className={colorKey % 2 == 0 ? 'avatar-pink-theme' : 'avatar-blue-theme' }>
                <span className={colorKey % 2 == 0 ? 'icon-pink-theme' : 'icon-blue-theme' }>{icon}</span>
            </Avatar>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <span>{updateDescription}</span>
                <span className='updates-subtext'>{date}</span>
            </div>
        </Box>
    )
};

/**
 * 
 * @param {object} props
 * @param {string} props.updates - Array of type updateData (temporarily hardcoded)
 * @returns JSX.Element 
 */
export const Updates = ({updates = testData}: {updates?: Array<UpdateData>}) => {
    return(
        <Card className='updates-container'>
            <CardContent className='updates-content'>

                {/* Top Row of container */}
                <Box className='header-row'>
                    <Box className='header-row-textbox'>
                        <h3>Recent Updates</h3>
                        <span className='updates-subtext'>Your activity timeline</span>
                    </Box>
                    <Clock className='updates-subtext' />
                </Box>

                {/* Dynamically create service/visit rows */}
                {updates.map((updateData, i) =>
                    <UpdateRow
                        key={i}
                        updateDescription={updateData.updateDescription}
                        date={updateData.date}
                        icon={updateData.icon}
                        colorKey={i}
                    />
                )}
            </CardContent>
        </Card>
    )
};

export const testData: Array<UpdateData> = [
    {
        updateDescription: "Completed Depression Suvery",
        date: "Oct 10, 2025",
        icon: <FileText />
    },
    {
       updateDescription: "BP Reading - 118/76",
       date: "Oct 8, 2025",
       icon: <Activity />
    }
]