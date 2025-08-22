import type { User } from "./UserForm";

interface Props {
    users: User[];
    onUpdate: (user: User) => void;
    onDelete: (id: string) => void;
}

export default function UserList({ users, onUpdate, onDelete }: Props) {
    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">User List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg border">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Location</th>
                            <th className="px-4 py-2 text-left">Session Token</th>
                            <th className="px-4 py-2 text-left">Access Token</th>
                            <th className="px-4 py-2 text-left">bbCandidateId</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-4 text-gray-500 italic"
                                >
                                    No users added yet.
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.location}</td>
                                    <td className="px-4 py-2 truncate max-w-xs">
                                        {user.sessionToken.slice(0,15)+'...'}
                                    </td>
                                    <td className="px-4 py-2 truncate max-w-xs">
                                        {user.accessToken.slice(0,15)+'...'}
                                    </td>
                                    <td className="px-4 py-2">{user.bbCandidateId.slice(0,15)+'...'}</td>
                                    <td className="px-4 py-2 space-x-2 text-center">
                                        <button
                                            onClick={() => onUpdate(user)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => onDelete(user.id!)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
