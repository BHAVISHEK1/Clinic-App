import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ShowAllPatients.css';
import EditPatientForm from './EditPatientForm'; // Import the edit form component

Modal.setAppElement('#root'); // Set the app root for accessibility

const ShowAllPatients = () => {
    const [allPatients, setAllPatients] = useState([]);
    const [expandedPatient, setExpandedPatient] = useState(null);
    const [message, setMessage] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(true);
    };

    const handleEditSubmit = (updatedPatient) => {
        setAllPatients(allPatients.map(patient => patient._id === updatedPatient._id ? updatedPatient : patient));
        setEditingPatient(null);
        setIsModalOpen(false);
        alert(`Patient ${updatedPatient.firstName} updated`);
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPatient(null);
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
                                <div className="button-container">
                                <button id="edtbtn" onClick={() => handleEditClick(patient)}>Edit</button>
                                <button id="delbtn" onClick={() => handleDelete(patient._id, patient.firstName)}>Delete</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Patient"
                className="modal"
                overlayClassName="overlay"
            >
                {editingPatient && <EditPatientForm patient={editingPatient} onSubmit={handleEditSubmit} onCancel={closeModal} />}
            </Modal>
        </div>
    );
};

export default ShowAllPatients;
