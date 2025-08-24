import React, { useEffect, useState } from "react";
import axios from "axios";
import UserList from "./UserList";

export interface User {
    id?: string;
    name: string;
    email: string;
    location: string;
    sessionToken: string;
    accessToken: string;
    bbCandidateId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const START_JOB_HUNT_URLS = (import.meta.env.VITE_START_JOB_SERVICE_URLS || "")
    .split(",")
    .map((url:any) => url.trim())
    .filter(Boolean);


export default function UserForm() {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const locationOptions = [
        "Any",
        "Cambridge, ON",
        "Hamilton, ON",
        "Bolton, ON",
        "Malton, ON",
        "Caledon, ON",
        "Brampton, ON",
        "Mississauga, ON",
        "Etobicoke, ON",
        "Scarborough, ON",
        "Ajex, ON",
        "Whitby, ON",
        "Richmond hill, ON",
        "Granville, NY"
    ];


    const [formData, setFormData] = useState<User>({
        name: "",
        email: "",
        location: "",
        sessionToken: "",
        accessToken: "",
        bbCandidateId: "",
    });

    // ✅ Fetch users only once
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/users`);
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    // ✅ Fill form when editing a user
    useEffect(() => {
        if (editingUser) {
            setFormData(editingUser);
        }
    }, [editingUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (editingUser) {
                // ✅ Update user
                console.log(formData)
                const res = await axios.post(
                    `${API_BASE_URL}/user`,
                    formData
                );
                setUsers((prev) =>
                    prev.map((u) => (u.id === editingUser.id ? res.data : u))
                );
            } else {
                // ✅ Add new user
                const res = await axios.post(`${API_BASE_URL}/user`, formData);
                setUsers((prev) => [...prev, res.data]);
            }

            // reset
            setFormData({
                name: "",
                email: "",
                location: "",
                sessionToken: "",
                accessToken: "",
                bbCandidateId: "",
            });
            setEditingUser(null);
        } catch (err: any) {
            setError(err.message || "Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/user/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-4 space-y-4"
            >
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="border px-3 py-2 w-full rounded"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border px-3 py-2 w-full rounded"
                />
                {/* Location dropdown */}
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border px-3 py-2 w-full rounded"
                >
                    <option value="">Select Location</option>
                    {locationOptions.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="sessionToken"
                    value={formData.sessionToken}
                    onChange={handleChange}
                    placeholder="Session Token"
                    className="border px-3 py-2 w-full rounded"
                />
                <input
                    type="text"
                    name="accessToken"
                    value={formData.accessToken}
                    onChange={handleChange}
                    placeholder="Access Token"
                    className="border px-3 py-2 w-full rounded"
                />
                <input
                    type="text"
                    name="bbCandidateId"
                    value={formData.bbCandidateId}
                    onChange={handleChange}
                    placeholder="BB Candidate ID"
                    className="border px-3 py-2 w-full rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : editingUser
                            ? "Update User"
                            : "Add User"}
                </button>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            </form>
            <div className="flex space-x-10 mx-5">
                <button className="bg-green-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                    onClick={() => {
                        START_JOB_HUNT_URLS.map((url: any) => {
                            axios.post(url + "/start");
                        })
                    }}
                >Start</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                    onClick={() => {
                        START_JOB_HUNT_URLS.map((url: any) => {
                            axios.post(url + "/stop");
                        })
                    }}
                >Stop</button>
            </div>

            <UserList
                users={users}
                onUpdate={(user) => setEditingUser(user)}
                onDelete={(id) => deleteUser(id)}
            />
        </>
    );
}
