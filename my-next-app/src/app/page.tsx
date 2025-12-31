"use client";

import { useState, useEffect, use } from 'react';
import Link from "next/link";
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { useTheme } from './stores/useThemeStore'
import { useProfile, Profile } from './stores/useProfileStore'  
import "./components/Home.css";
import "./styles/globals.css";

/**
 * 
 * Displays the root view for the app
 * 
 * @returns {JSX.Element} The rendered home page
 */
export default function Home() {

  const currentRoute = useTheme((state) => state.route)
  const changeRoute = useTheme((state) => state.changeRoute)
  const currentTheme = useTheme((state) => state.theme)
  const changeTheme = useTheme((state) => state.changeTheme)
  const currentUser = useProfile((state) => state.user)
  const changeUser = useProfile((state) => state.changeUser)

  return (
    <div className="home-container">
      <div className="home-title">
        <TitleIcon width={200} height={200} fill={"var(--brand)"} />
        <h1 className="title-text-overlap">regnancy-Pal</h1>
      </div>

      <div className='button-row'>
        <button 
          className='btn btn--primary btn--outline'
          onClick={() => {
            changeRoute("/patient")
            changeTheme("theme-patient")
            changeUser(patients[0])
          }} >
            I'm a Patient
        </button>
        <button 
          className='btn btn--primary btn--outline'
          onClick={() => {
            changeRoute("/provider")
            changeTheme("theme-provider")
            changeUser(providers[0])
          }}>I'm a Provider</button>
      </div>

      <Autocomplete
        sx={{ 
          width: 300,
          paddingTop: 5 
        }}
        options={currentTheme == 'theme-patient' ? patients : providers }
        value={currentUser}
        onChange={(_, selectedUser) => {selectedUser == null ? patients[0] : changeUser(selectedUser)}}
        autoHighlight
        getOptionLabel={(option) => option == null ? "" : option.fullName}
        renderInput={(params) => (
          <TextField
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset, &:hover fieldset, &.Mui-focused fieldset, .MuiOutlinedInput-input': {
                        borderColor: 'var(--brand)',
                        color: 'var(--brand)'
                    }
                }
            }}
            {...params}
            label={currentTheme == "theme-patient" ? "Patient List" : "Provider List"} 
          />
        )}
      />

      <nav className="nav-container">
        { currentUser != null ?
        <Link key={currentRoute} href={currentRoute}>
          <button className="btn btn--primary btn--pill login-btn">
            Login 
          </button>
        </Link> : <span>Please select a { currentRoute == "/patient" ? "patient" : "provider" }</span>
        }
      </nav>
    </div> 
  );
};

/**
 * Displays the title icon
 * 
 * the function takes 2 numeric values and a string.
 * 
 * @param {object} props - The components props
 * @param {number} props.width - The width of the svg
 * @param {number} props.height - The height of the svg
 * @param {string} props.fill - The fill color
 * @returns {JSX.Element} The rendered svg icon
 * 
 * 
 * Reference - <path/> element in TitleIcon comes from: 
 * https://www.reshot.com/free-svg-icons/item/pregnant-M8YHKGJESV/
 * 
 */

export const TitleIcon = ({width, height, fill}:{width: number, height: number, fill: string}) => {
  return(
    <svg 
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox='0 0 128 128'
    >
      <path id="_x31__2_" fill={fill} d="M87.713,70.414c0-9.997-6.967-18.179-15.821-18.905l-3.429-20.919H50.756
        L40.287,94.508h12.972V128H66.25V94.508h12.682l-1.125-6.876C83.667,84.62,87.713,78.052,87.713,70.414z M63.401,79.286H51.917
        V45.303c0-3.157,2.558-5.733,5.733-5.733c1.578,0,3.03,0.653,4.064,1.687c1.034,1.034,1.687,2.467,1.687,4.046V79.286z M59.083,0
        c-7.584,0-13.734,6.151-13.734,13.734s6.151,13.734,13.734,13.734s13.734-6.151,13.734-13.734S66.667,0,59.083,0z"/>
    </svg>
  );
};

export const patients: readonly Profile[] = [
  {
    id: "51589898",
    fullName: "Emily Smith",
    profileType: "patient",
    userName: "esmith47"  
  },
  {
    id: "51590004",
    fullName: "Jordan Lee",
    profileType: "patient",
    userName: "jlee45"  
  },
  {
    id: "51590110",
    fullName: "Ava Martinez",
    profileType: "patient",
    userName: "amartinez50"  
  },
  {
    id: "51590212",
    fullName: "Nora Patel",
    profileType: "patient",
    userName: "npatel46"  
  },
  {
    id: "51590318",
    fullName: "Kara Nguyen",
    profileType: "patient",
    userName: "knguyen81"  
  },
  {
    id: "51590424",
    fullName: "Lena Brown",
    profileType: "patient",
    userName: "lbrown84"  
  }
]

export const providers: readonly Profile[] = [
  {
    id: "51589895",
    fullName: "Minh Nguyen",
    profileType: "provider",
    userName: "drmn895"  
  }
]

/**
 * Reference - Textfield styling adopted from: https://mui.com/material-ui/react-text-field/
 */