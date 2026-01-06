const isDoctorAvailable = (availability) => {
  if (!availability) return false;
  if (!availability.days || availability.days.length === 0) return false;
  if (!availability.from || !availability.to) return false;
  return true;
};

const isDoctorAvailableNow = (availability) => {
  if (!availability) return false;

  const { days, from, to } = availability;
  const now = new Date();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[now.getDay()];

  if (!days.includes(today)) {
    return false;
  }

  const [fromH, fromM] = from.split(":").map(Number);
  const [toH, toM] = to.split(":").map(Number);

  const fromTime = new Date();
  fromTime.setHours(fromH, fromM, 0, 0);

  const toTime = new Date();
  toTime.setHours(toH, toM, 0, 0);

  if (toTime < fromTime) {
    return now >= fromTime || now <= toTime;
  }

  return now >= fromTime && now <= toTime;
};

const getNextAvailableDay = (days) => {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();

  for (let i = 1; i <= 7; i++) {
    const nextDay = week[(todayIndex + i) % 7];
    if (days.includes(nextDay)) return nextDay;
  }
  return null;
};

const DoctorCard = ({ doctor, onSelect }) => {
  const available = isDoctorAvailable(doctor.availability);
  const isAvailable = isDoctorAvailableNow(doctor.availability);
  const nextDay = getNextAvailableDay(doctor.availability?.days || []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg">
          {doctor.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-slate-800">
            {doctor.name}
          </h3>
          <p className="text-sm text-slate-500">{doctor.specialization}</p>
        </div>
      </div>

      <div className="space-y-1 text-sm text-slate-600">
        <p>
          <span className="font-medium">Experience:</span> {doctor.experience}{" "}
          years
        </p>

        {available ? (
          <div className="mt-2 text-green-700">
            <p>
              <span className="font-medium">Available:</span>{" "}
              {doctor.availability.days.join(", ")}
            </p>
            <p>
              <span className="font-medium">Time:</span>{" "}
              {doctor.availability.from} – {doctor.availability.to}
            </p>
          </div>
        ) : (
          <p className="text-red-600 font-medium mt-2">Not Available</p>
        )}
      </div>

      <div className="mt-5">
        <button
          onClick={() => onSelect(doctor)}
          disabled={!isAvailable}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition ${
            isAvailable
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-300 text-slate-600 cursor-not-allowed"
          }`}
        >
          Book Appointment
        </button>

        {!isAvailable && nextDay && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Next available: {nextDay} ({doctor.availability.from} –{" "}
            {doctor.availability.to})
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
