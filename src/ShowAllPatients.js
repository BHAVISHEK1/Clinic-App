import React, { useState } from 'react';
import axios from 'axios';

const ShowAllPatients = ({ allPatients }) => {
    const [expandedPatient, setExpandedPatient] = useState(null);

    const handlePatientClick = (patientId) => {
        if (expandedPatient === patientId) {
            setExpandedPatient(null);
        } else {
            setExpandedPatient(patientId);
        }
    };

    const exportToCSV = async () => {
        try {
            const response = await axios.get('/api/patients/all/csv', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'patients.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting to CSV:', error);
        }
    };

    return (
        <div id="showallpatients">
            <button id="csvbtn" onClick={exportToCSV}>Export to CSV</button>
            <ul>
                {allPatients.sort((a, b) => (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName)).map(patient => (
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
