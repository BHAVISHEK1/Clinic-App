import React, { useState } from 'react';
import axios from 'axios';
import PatientForm from '../PatientForm';
import SearchPatients from '../SearchPatients';
import ShowAllPatients from '../ShowAllPatients';
import '../App.css';


const Button = () => {
    const [displayAddPatient, setDisplayAddPatient] = useState(false);
    const [displaySearchPatient, setDisplaySearchPatient] = useState(false);
    const [displayAllPatients, setDisplayAllPatients] = useState(false);
    const [allPatients, setAllPatients] = useState([]);
  
    const handleAddPatientClick = () => {
      setDisplayAddPatient(true);
      setDisplaySearchPatient(false);
      setDisplayAllPatients(false); // Ensure other components are hidden
    };
  
    const handleSearchPatientClick = () => {
      setDisplayAddPatient(false);
      setDisplaySearchPatient(true);
      setDisplayAllPatients(false); // Ensure other components are hidden
    };
  
    const handleShowAllPatientsClick = async () => {
      setDisplayAddPatient(false);
      setDisplaySearchPatient(false);
      setDisplayAllPatients(true);
      try {
        const response = await axios.get('/api/patients/all');
        setAllPatients(response.data);
      } catch (error) {
        console.error('Error fetching all patients:', error);
      
      }
    };

    return (
        <>
          <div>
            <div id="mainbuttons" >
              <button onClick={handleAddPatientClick}>Add Patient</button>
              <button onClick={handleSearchPatientClick}>Search Patient</button>
              <button onClick={handleShowAllPatientsClick}>Show All Patients</button>
            </div>
            <div>
              {displayAddPatient && <PatientForm />}
              {displaySearchPatient && <SearchPatients />}
              {displayAllPatients && <ShowAllPatients allPatients={allPatients} />}
            </div>
          </div>
        </>
      );
    };
    
    export default Button;