import React, { useState } from 'react';
import axios from 'axios';

const EditPatientForm = ({ patient, onSubmit }) => {
    const [formData, setFormData] = useState(patient);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://clinic-backend-4.onrender.com/api/patients/${patient._id}`, formData);
            onSubmit(response.data);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </label>
            <label>
                Last Name:
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </label>
            <label>
                Contacts:
                <input type="text" name="contacts" value={formData.contacts} onChange={handleChange} />
            </label>
            <label>
                Age:
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
            </label>
            <label>
                Date of Entry:
                <input type="date" name="dateOfentry" value={formData.dateOfentry} onChange={handleChange} />
            </label>
            <label>
                Medical History:
                <input type="text" name="medicalHistory" value={formData.medicalHistory.join(', ')} onChange={handleChange} />
            </label>
            <label>
                Doctor Name:
                <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} />
            </label>
            <button type="submit">Save</button>
        </form>
    );
};

export default EditPatientForm;
