import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ShowAllPatients.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditPatientForm from './EditPatientForm';

Modal.setAppElement('#root');

const ShowAllPatients = () => {
    const [allPatients, setAllPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const response = await axios.get('https://clinic-backend-4.onrender.com/api/patients/all');
                const sortedPatients = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
                setAllPatients(sortedPatients);
            } catch (error) {
                console.error('Error fetching all patients:', error);
                toast.error('Error fetching all patients. Please try again later.');
            }
        };
        fetchAllPatients();
    }, []);

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
        setIsDetailsModalOpen(true);
    };

    const handleDelete = async (patientId, patientFirstName) => {
        try {
            await axios.delete(`https://clinic-backend-4.onrender.com/api/patients/${patientId}`);
            setAllPatients(allPatients.filter(patient => patient._id !== patientId));
            toast.success(`Patient ${patientFirstName} deleted successfully`);
        } catch (error) {
            console.error('Error deleting patient:', error);
            toast.error('Error deleting patient. Please try again later.');
        }
    };

    const handleEditClick = (patient) => {
        setEditingPatient(patient);
        setIsEditModalOpen(true);
        setIsDetailsModalOpen(false); // Close details modal when editing
    };

    const handleEditSubmit = (updatedPatient) => {
        setAllPatients(allPatients.map(patient => patient._id === updatedPatient._id ? updatedPatient : patient));
        setEditingPatient(null);
        setIsEditModalOpen(false);
        toast.success(`Patient ${updatedPatient.firstName} updated successfully`);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingPatient(null);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedPatient(null);
    };

    return (
        <div id="showallpatients">
            <p>Click on Patient name to see details</p>
            <ul>
                {allPatients.map(patient => (
                    <li key={patient._id}>
                        <div onClick={() => handlePatientClick(patient)}>
                            {patient.firstName} {patient.lastName}
                        </div>
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={isDetailsModalOpen}
                onRequestClose={closeDetailsModal}
                contentLabel="Patient Details"
                className="modal"
                overlayClassName="overlay"
            >
                {selectedPatient && (
                    <div>
                        <h2>{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                        <p>Contact: <a href={`tel:${selectedPatient.contacts}`}>{selectedPatient.contacts}</a></p>
                        <p>Age: {selectedPatient.age}</p>
                        <p>Date: {selectedPatient.dateOfentry}</p>
                        <div id="medical-history">
                            <p>Medical History: {selectedPatient.medicalHistory.join(', ')}</p>
                        </div>
                        <p>Doctor: {selectedPatient.doctorName}</p>
                        <div className="button-container">
                            <button id="edtbtn" onClick={() => handleEditClick(selectedPatient)}>Edit</button>
                            <button id="delbtn" onClick={() => handleDelete(selectedPatient._id, selectedPatient.firstName)}>Delete</button>
                        </div>
                        <button id="closebtn" onClick={closeDetailsModal}>Close</button>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit Patient"
                className="modal"
                overlayClassName="overlay"
            >
                {editingPatient && <EditPatientForm patient={editingPatient} onSubmit={handleEditSubmit} onCancel={closeEditModal} />}
            </Modal>

            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ShowAllPatients;
