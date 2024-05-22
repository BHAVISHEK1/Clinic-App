import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowAllPatients = () => {
    const [allPatients, setAllPatients] = useState([]);
    const [expandedPatient, setExpandedPatient] = useState(null);

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const response = await axios.get('https://clinic-backend-4.onrender.com/api/patients/all');
                setAllPatients(response.data);
            } catch (error) {
                console.error('Error fetching all patients:', error);
            }
        };
        fetchAllPatients();
    }, []);

    const handlePatientClick = (patientId) => {
        if (expandedPatient === patientId) {
            setExpandedPatient(null);
        } else {
            setExpandedPatient(patientId);
        }
    };

    return (
        <div id="showallpatients">
            <ul>
                {allPatients.map(patient => (
                    <li key={patient._id}>
                        <div onClick={() => handlePatientClick(patient._id)}>
                            {patient.firstName} {patient.lastName}
                        </div>
                        {expandedPatient === patient._id && (
                            <div>
                                <p>Contact: <a href={`tel:${patient.contacts}`}>{patient.contacts}</a></p>
                                <p>Age: {patient.age}</p>
                                <p>Date: {patient.dateOfentry}</p>
                                <div id="medical-history">
                                    <p>Medical History: {patient.medicalHistory.join(', ')}</p>
                                </div>
                                <p>Doctor: {patient.doctorName}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowAllPatients;
