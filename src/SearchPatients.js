import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPatients = () => {
    const [searchType, setSearchType] = useState('patient');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);

    useEffect(() => {
        // Fetch the list of doctors when the component mounts
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('/api/doctors');
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
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint;
            if (searchType === 'patient') {
                endpoint = `/api/patients/search?firstName=${searchQuery}`;
            } else if (searchType === 'doctor') {
                endpoint = `/api/patients/search?doctorName=${searchQuery}`;
            }

            const response = await axios.get(endpoint);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching patients:', error);
            // Handle error
        }
    };

    return (
        <div>
           
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Search by:
                        <select value={searchType} onChange={handleSearchTypeChange}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        {searchType === 'patient' ? 'Patient Name:' : 'Doctor Name:'}
                        {searchType === 'doctor' ? (
                            <select value={searchQuery} onChange={handleSearchQueryChange} required>
                                <option value="">Select Doctor</option>
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
                <button type="submit">Search</button>
            </form>
            <div id="searchRes">
                <h3>Search Results:</h3>
                <ul>
                    {searchResults.map((patient) => (
                        <li key={patient._id}>
                            Name: {patient.firstName} {patient.lastName}<br />
                            Contact: {patient.contacts}<br />
                            Age: {patient.age}<br />
                            Date: {patient.dateOfentry} <br />
                            Medical History: {patient.medicalHistory}<br />
                            Doctor: {patient.doctorName}<br />
                        </li>
                    ))}
                </ul>
                {/* <h2>Patients Diagnosed with {patient.doctorName} </h2> */}
            </div>
        </div>
    );
};

export default SearchPatients;
