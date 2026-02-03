// const toMinutes = (time) => {
//     const [h , m] = time.split(":").map(Number)
//     return h * 60 + m 
// }

// module.exports.calculateTotalSlots = (from , to , breaks = [], slotDiration = 30 ) => {
//     if (!from || !to) return 0 

//     const start = toMinutes(from)
//     const end = toMinutes(to)

//     let totalMinutes = end - start 
//     if (totalMinutes < 0 ) return 0 

//     let breakMinutes = 0 
//     breaks.forEach((b) => {
//         breakMinutes += toMinutes(b.to) - toMinutes(b.from) 
//     })

//     const newMinutes = totalMinutes - breakMinutes 
//     if (newMinutes < 0 ) return 0 
//     return Math.floor(newMinutes / slotDiration)
// }

// -----------------------------------------------------------------

const toMinutes = (time) => {
  if (!time || typeof time !== "string") return 0;
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
};

const calculateTotalSlots = (
  from,
  to,
  breaks = [],
  slotDuration = 30 // ✅ fixed spelling
) => {
  if (!from || !to) return 0;

  const start = toMinutes(from);
  const end = toMinutes(to);

  if (end <= start) return 0;

  let totalMinutes = end - start;

  let breakMinutes = 0;

  breaks.forEach((b) => {
    if (!b?.from || !b?.to) return;

    const bStart = toMinutes(b.from);
    const bEnd = toMinutes(b.to);

    if (bEnd > bStart) {
      breakMinutes += bEnd - bStart;
    }
  });

  const availableMinutes = totalMinutes - breakMinutes;
  if (availableMinutes <= 0) return 0;

  return Math.floor(availableMinutes / slotDuration);
};

module.exports = { calculateTotalSlots };
