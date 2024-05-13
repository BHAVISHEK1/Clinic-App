import React, { useState } from 'react';

const ShowAllPatients = ({ allPatients }) => {
    const [expandedPatient, setExpandedPatient] = useState(null);

    const handlePatientClick = (patientId) => {
        if (expandedPatient === patientId) {
            setExpandedPatient(null);
        } else {
            setExpandedPatient(patientId);
        }
    };

    return (
        <div id="showallpatients">

            <ol>
                {allPatients.sort((a, b) => (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName)).map(patient => (
                    <li key={patient._id} onClick={() => handlePatientClick(patient._id)}>
                        {patient.firstName} {patient.lastName}
                        {expandedPatient === patient._id && (
                            <div>
                                Contact: {patient.contacts}<br />
                                Age: {patient.age}<br />
                                Date: {patient.dateOfentry} <br />
                                Medical History: {patient.medicalHistory}<br />
                                Doctor: {patient.doctorName}<br />
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ShowAllPatients;
