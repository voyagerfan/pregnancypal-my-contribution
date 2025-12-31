import { Card, CardContent } from '@mui/material';
import { Calendar } from "lucide-react"
import "./Banner.css";

/**
 * 
 * @param {object} props
 * @param {string} props.patientName - The patient's name (temporarily hardcoded)
 * @returns JSX.Element
 * 
 * Reference - Data formatting adopted from:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 */
export const Banner = ({patientName = "Emily"}:{patientName: string}) => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const currentDateString = date.toLocaleDateString("en-US", options);

    return(
        <Card className='pp-banner'>
            <CardContent className='pp-banner-content'>
                <p>Welcome Back, {patientName}! 👋</p>
                <div className='pp-banner-date-container'>
                    <Calendar/>
                    <p>{currentDateString}</p>
                </div>
                <span className='pp-banner-date'>{  }</span>
                <p>How are you feeling today?</p>
            </CardContent>
        </Card>
    );
};