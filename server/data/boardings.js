/** 10 mock boardings near SLIIT — all requests route to owner@gmail.com */
const U = (id) =>
  `https://images.unsplash.com/photo-${id}?w=900&auto=format&fit=crop&q=80`;

export const MOCK_BOARDINGS = [
  {
    id: "bd-001",
    title: "Serene View Residence · Malabe",
    ownerEmail: "owner@gmail.com",
    address: "Thalangama North",
    distanceMeters: 2100,
    description:
      "Tree-lined lane, study desks, fiber Wi‑Fi. Optional veg meals.",
    singleAvailable: true,
    sharingAvailable: true,
    images: [U("1522708323590-d24dbb6b0267"), U("1502672260266-1c1ef2d93688"), U("1560448204-e02f11c3d0e2"), U("1586023492125-27b2c045efd7")],
  },
  {
    id: "bd-002",
    title: "Campus Edge Co-living",
    ownerEmail: "owner@gmail.com",
    address: "Hokandara Road side",
    distanceMeters: 1850,
    description: "Shared kitchen lounges, secure bike bay, laundry on site.",
    singleAvailable: false,
    sharingAvailable: true,
    images: [U("1493809842364-78817add7ffb"), U("1505843513577-22bb7d21e455"), U("1512918728675-ed5a9eebdeb7"), U("1536376072261-38c75010e6c9")],
  },
  {
    id: "bd-003",
    title: "Pine Hill Studio Wings",
    ownerEmail: "owner@gmail.com",
    address: "Near SLIIT rear access",
    distanceMeters: 950,
    description: "Compact single studios — calm nights for deep focus.",
    singleAvailable: true,
    sharingAvailable: false,
    images: [U("1616594039964-ae9021a400a0"), U("1616486338812-3dadae4b4ace"), U("1618221195710-dd6b41faaea7"), U("1616137424045-de733c716981")],
  },
  {
    id: "bd-004",
    title: "Emerald Terrace Boarding",
    ownerEmail: "owner@gmail.com",
    address: "Battaramulla link road",
    distanceMeters: 3200,
    description: "Rooftop hangout, ceiling fans in every room, 24h water.",
    singleAvailable: true,
    sharingAvailable: true,
    images: [U("1600596542815-ffad4c1539a9"), U("1600585154340-be6161f56d0a"), U("1600607687939-ce8a6c25118c"), U("1564013799919-65ee96e7a086")],
  },
  {
    id: "bd-005",
    title: "Scholar's Lane Hybrid Stay",
    ownerEmail: "owner@gmail.com",
    address: "Malabe town strip",
    distanceMeters: 1650,
    description: "Walk to food courts; mixed single + twin rooms by term.",
    singleAvailable: true,
    sharingAvailable: true,
    images: [U("1605276371367-11a3f5ea9a29"), U("1600566753086-00f18fb6b0bb"), U("1631679706909-84d9e7c7596b"), U("1600047509355-7f8fadc6b82e")],
  },
  {
    id: "bd-006",
    title: "Lotus Courtyard Homestay",
    ownerEmail: "owner@gmail.com",
    address: "Kaduwela approach",
    distanceMeters: 4100,
    description: "Family-run, curfew-friendly, quiet reading alcoves.",
    singleAvailable: false,
    sharingAvailable: true,
    images: [U("1600210492496-094ac1082c55"), U("1598928508061-b964edabc27a"), U("1618774078210-2a47a7b83873"), U("1582268611958-ebfd1614469e")],
  },
  {
    id: "bd-007",
    title: "Pixel Point Tech Lodge",
    ownerEmail: "owner@gmail.com",
    address: "IT Park boulevard",
    distanceMeters: 1200,
    description: "Dual monitors optional, UPS-backed sockets, dev-friendly vibe.",
    singleAvailable: true,
    sharingAvailable: true,
    images: [U("1531482615713-2afd69097998"), U("1497366216548-37526070297c"), U("1460925895917-afdab827c52f"), U("1454167804576-3787ee37d3a0")],
  },
  {
    id: "bd-008",
    title: "Summit Breeze Rooms",
    ownerEmail: "owner@gmail.com",
    address: "Elevated lane · evening breeze",
    distanceMeters: 2700,
    description: "Higher floor cross-breeze, laundry tokens, pantry snacks.",
    singleAvailable: true,
    sharingAvailable: false,
    images: [U("1519710841636-b87b5f5d8a1b"), U("1512917778480-9991f1c4c750"), U("1479837522676-c99da01fb91b"), U("1501183638763-4e1a9a0c04b5")],
  },
  {
    id: "bd-009",
    title: "Green Arc Shared Floors",
    ownerEmail: "owner@gmail.com",
    address: "Behind campus commuter path",
    distanceMeters: 780,
    description: "Shortest walk batch — shared baths maintained twice daily.",
    singleAvailable: false,
    sharingAvailable: true,
    images: [U("1575518092168-6f91d3a13ea3"), U("1565538810763-3b99ca59d7a5"), U("1556910109-35be34e09e2f"), U("1571896349842-33c89424de2d")],
  },
  {
    id: "bd-010",
    title: "Nova Stay Apartments",
    ownerEmail: "owner@gmail.com",
    address: "Bus route 255 corridor",
    distanceMeters: 2450,
    description: "Bright rooms, metro-style pantry, digital rent reminders.",
    singleAvailable: true,
    sharingAvailable: true,
    images: [U("1545325618-4a83c9b6f4b5"), U("1554995207-c9c043cae68c"), U("1574362848149-f01d219c0f54"), U("1583847268968-952a5b2a0ee8")],
  },
];

export function getBoardingById(id) {
  return MOCK_BOARDINGS.find((b) => b.id === id) || null;
}

export function getRandomBoarding() {
  const i = Math.floor(Math.random() * MOCK_BOARDINGS.length);
  return MOCK_BOARDINGS[i];
}
