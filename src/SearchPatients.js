import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchPatients.css';
import Modal from 'react-modal'; // Import Modal from react-modal
import EditPatientForm from './EditPatientForm';

const SearchPatients = () => {
    const [searchType, setSearchType] = useState('patient');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        // Fetch the list of doctors when the component mounts
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('https://clinic-backend-4.onrender.com/api/doctors');
                setDoctorOptions(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchQuery('');
        setSearchError('');
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint;
            if (searchType === 'patient') {
                endpoint = `https://clinic-backend-4.onrender.com/api/patients/search?firstName=${searchQuery.toLowerCase()}`;
            } else if (searchType === 'doctor') {
                endpoint = `https://clinic-backend-4.onrender.com/api/patients/search?doctorName=${searchQuery}`;
            }

            const response = await axios.get(endpoint);
            setSearchResults(response.data.map(patient => ({
                ...patient,
                medicalHistory: patient.medicalHistory.join(', ')
            })));
            if (response.data.length === 0) {
                setSearchError('Patient not found');
            } else {
                setSearchError('');
            }
        } catch (error) {
            console.error('Error searching patients:', error);
            // Handle error
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setIsModalOpen(true); // Open the modal when editing
    };

    const handleCancelEdit = () => {
        setEditingPatient(null);
        setIsModalOpen(false); // Close the modal when editing is canceled
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://clinic-backend-4.onrender.com/api/patients/${id}`);
            setSearchResults(prevResults => prevResults.filter(patient => patient._id !== id));
            setMessage('Patient deleted successfully');
        } catch (error) {
            console.error('Error deleting patient:', error);
            // Handle error
        }
    };

    const handleEditSubmit = (updatedPatient) => {
        setSearchResults(prevResults =>
            prevResults.map(patient =>
                patient._id === updatedPatient._id ? updatedPatient : patient
            )
        );
        setEditingPatient(null);
        setIsModalOpen(false); // Close the modal after editing is submitted
        alert(`Patient ${updatedPatient.firstName} updated`);
    };

    return (
        <>
            <div className="container">
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="form-group">
                        <label>
                            Search :
                            <select id="patname" value={searchType} onChange={handleSearchTypeChange}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            {searchType === 'patient' ? 'Name : ' : ''}
                            {searchType === 'doctor' ? (
                                <select id="docs" value={searchQuery} onChange={handleSearchQueryChange} required>
                                    <option value="">Doctor</option>
                                    <option value="Dr Ruchi">Dr Ruchi</option>
                                    <option value="Dr Renu">Dr Renu</option>
                                    <option value="Other">Other</option>
                                    {doctorOptions.map((doctor) => (
                                        <option key={doctor._id} value={doctor.name}>
                                            {doctor.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    id="inn"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchQueryChange}
                                    required
                                />
                            )}
                        </label>
                    </div>
                    <button type="submit" className="btn-search">
                        Search
                    </button>
                </form>

                <div id="searchRes" className="search-results">
                    <h3>Search Results:</h3>
                    {searchError && <p>{searchError}</p>}
                    <ul>
                        {searchResults.map((patient) => (
                            <li key={patient._id}>
                                Name: {patient.firstName} {patient.lastName}
                                <br />
                                Contact: {patient.contacts}
                                <br />
                                Age: {patient.age}
                                <br />
                                Date: {patient.dateOfentry} <br />
                                <div id="medical-history">
                                    Medical History: {patient.medicalHistory}
                                    <br />
                                </div>
                                Doctor: {patient.doctorName}
                                <br />
                                <div className="button-container">
                                    <button id="edtbtn" onClick={() => handleEdit(patient)}>Edit</button>
                                    <button id="delbtn" onClick={() => handleDelete(patient._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal for editing patient */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCancelEdit}
                contentLabel="Edit Patient"
                className="modal"
                overlayClassName="overlay"
            >
                {editingPatient && (
                    <EditPatientForm
                        patient={editingPatient}
                        onSubmit={handleEditSubmit}
                        onCancel={handleCancelEdit}
                    />
                )}
            </Modal>

            {message && (
                <div className="message-container">
                    <p className="message">{message}</p>
                </div>
            )}
        </>
    );
};

export default SearchPatients;
