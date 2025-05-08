const DoctorDashboard = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, Dr. Smith</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#E0F2FE] rounded-2xl p-4 shadow-md">
          <h2 className="text-xl font-semibold text-[#2563EB]">Upcoming Appointments</h2>
          {/* Map upcoming appointments here */}
          <p className="mt-2 text-gray-700">You have 3 appointments today.</p>
        </div>
        
        <div className="bg-[#E0F2FE] rounded-2xl p-4 shadow-md">
          <h2 className="text-xl font-semibold text-[#2563EB]">Availability Summary</h2>
          <p className="mt-2 text-gray-700">You’re available on Tue, Wed, Fri this week.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
