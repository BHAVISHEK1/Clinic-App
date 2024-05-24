import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowAllPatients.css';
import EditPatientForm from './EditPatientForm.js'; // Import the edit form component

const ShowAllPatients = () => {
    const [allPatients, setAllPatients] = useState([]);
    const [expandedPatient, setExpandedPatient] = useState(null);
    const [message, setMessage] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const response = await axios.get('https://clinic-backend-4.onrender.com/api/patients/all');
                const sortedPatients = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
                setAllPatients(sortedPatients);
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

    const handleDelete = async (patientId, patientFirstName) => {
        try {
            await axios.delete(`https://clinic-backend-4.onrender.com/api/patients/${patientId}`);
            setAllPatients(allPatients.filter(patient => patient._id !== patientId));
            alert(`Patient ${patientFirstName} deleted`);
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleEditClick = (patient) => {
        setEditingPatient(patient);
    };

    const handleEditSubmit = (updatedPatient) => {
        setAllPatients(allPatients.map(patient => patient._id === updatedPatient._id ? updatedPatient : patient));
        setEditingPatient(null);
        alert(`Patient ${updatedPatient.firstName} updated`);
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    return (
        <div id="showallpatients">
            {message && <div className="message">{message}</div>}
            <p>Click on Patient name to see details</p>
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
                                <button id="edtbtn" onClick={() => handleEditClick(patient)}>Edit</button>
                                <button id="delbtn" onClick={() => handleDelete(patient._id, patient.firstName)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {editingPatient && <EditPatientForm patient={editingPatient} onSubmit={handleEditSubmit} />}
        </div>
    );
};

export default ShowAllPatients;
