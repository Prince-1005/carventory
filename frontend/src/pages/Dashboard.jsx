import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Carventory Dashboard</h1>
        <div>
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 mr-4">Logout</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Vehicle Inventory</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            + Add Vehicle
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li className="px-6 py-4 text-center text-gray-500">
              No vehicles available.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
