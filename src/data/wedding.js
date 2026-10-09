// All wedding details live here. Edit this file only.
export const wedding = {
  groom: { km: 'សុខ នរិន្ទ', en: 'Sok Norint', shortKm: 'នរិន្ទ', shortEn: 'Norint',
    parents: { father: 'សុខ ប៊ុនថាវុធ', mother: 'លឹម ពៅ' } },
  bride: { km: 'ទូច សុធីតា', en: 'Touch Sothida', shortKm: 'សុធីតា', shortEn: 'Sothida',
    parents: { father: 'ទូច វណ្ណា', mother: 'ទេព ចាន់ស៊ីណារី' } },
  date: { iso: '2026-12-07', weekdayIdx: 1, day: 7, month: 12, year: 2026 },
  lunarKm: 'ត្រូវនឹងថ្ងៃ ១៣រោច ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០',
  programme: [
    { time: '06:00', km: 'ពិធីសូត្រមន្ត', en: 'Monk chanting' },
    { time: '07:30', km: 'ហែជំនូន', en: 'Procession of gifts' },
    { time: '08:30', km: 'បំពាក់ថិញ្ជៀន', en: 'Exchange of rings' },
    { time: '09:00', km: 'សំពះផ្ទឹមចងដៃ', en: 'Bonding of hands' },
    { time: '16:30', km: 'ពិធីជប់លៀង', en: 'Wedding reception' },
  ],
  venue: {
    name: null, // no venue name given yet
    address: 'Phlouv Betong 1003, Phoum Banlar Saet, Sangkat Khmuonh, Khan Sensok, Phnom Penh, Cambodia (Postal Code: 120803)',
    short: 'Sangkat Khmuonh, Khan Sensok, Phnom Penh',
    lat: 11.60054, lng: 104.88305,
  },
  gift: [{ img: '/gift/qr.jpg', label: 'ABA KHQR · SOTHIDA TOUCH' }],
  music: null, // e.g. '/audio/music.mp3' once you have the rights to a track
  photos: { cover: 'p18', envelope: 'p18', arch: 'p11' },
};
