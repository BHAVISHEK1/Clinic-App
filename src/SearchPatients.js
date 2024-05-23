import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchPatients.css'

const SearchPatients = () => {
    const [searchType, setSearchType] = useState('patient');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [searchError, setSearchError] = useState('');

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

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="form-group">
                    <label>
                        Search by:
                        <select value={searchType} onChange={handleSearchTypeChange}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        {searchType === 'patient' ? 'Name : ' : ''}
                        {searchType === 'doctor' ? (
                            <select value={searchQuery} onChange={handleSearchQueryChange} required>
                                <option value="">Doctor</option>
                                <option value="Dr Ruchi">Dr Ruchi</option>
                                <option value="Dr Renu">Dr Renu</option>
                                {doctorOptions.map((doctor) => (
                                    <option key={doctor._id} value={doctor.name}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                required
                            />
                        )}
                    </label>
                </div>
                <button type="submit" className="btn-search">Search</button>
            </form>
            <div id="searchRes" className="search-results">
                <h3>Search Results:</h3>
                {searchError && <p>{searchError}</p>}
                <ul>
                    {searchResults.map((patient) => (
                        <li key={patient._id}>
                            Name: {patient.firstName} {patient.lastName}<br />
                            Contact: {patient.contacts}<br />
                            Age: {patient.age}<br />
                            Date: {patient.dateOfentry} <br />
                            <div id="medical-history">
                                Medical History: {patient.medicalHistory}<br />
                            </div>
                            Doctor: {patient.doctorName}<br />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SearchPatients;
