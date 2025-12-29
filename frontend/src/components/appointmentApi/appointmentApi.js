import axios from "axios";

const API = "http://localhost:5000/api/v2/appointment";

export const updateAppointment = (id, data, token) =>
  axios.put(`${API}/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAppointment = (id, token) =>
  axios.delete(`${API}/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
