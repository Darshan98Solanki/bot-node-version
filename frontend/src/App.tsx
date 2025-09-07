import UserForm from "./components/UserForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>
      <UserForm/>
    </div>
  );
}
