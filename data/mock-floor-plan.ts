import type { FloorPlan, PointOfInterest } from "@/types/navigation"

// Mock floor plans based on the provided images
export const mockFloorPlans: FloorPlan[] = [
  // Ground Floor (Begane Grond)
  {
    id: "floor-0",
    name: "Begane grond",
    width: 1000,
    height: 600,
    walls: [
      // Main building outline
      {
        path: "M 600,250 L 800,250 L 800,350 L 900,350 L 900,450 L 1000,450 L 1000,550 L 600,550 L 600,500 L 500,500 L 500,550 L 300,550 L 300,450 L 200,450 L 200,350 L 300,350 L 300,250 L 600,250",
      },
      // Wing section
      {
        path: "M 900,350 L 1100,250 L 1150,300 L 950,400 L 900,350",
      },
      // Entrance arrow
      {
        path: "M 800,570 L 800,600 L 830,585 L 800,570",
      },
    ],
    rooms: [
      // Room 1 - Main entrance (yellow)
      {
        id: "room-1",
        name: "Startpunt",
        path: "M 750,350 L 850,350 L 850,450 L 750,450 Z",
        labelPosition: { x: 800, y: 400 },
        color: "#FFEB3B",
      },
      // Room 2 - Ruimtelijk vormgever (teal)
      {
        id: "room-2",
        name: "Ruimtelijk vormgever",
        path: "M 850,250 L 950,250 L 950,350 L 850,350 Z",
        labelPosition: { x: 900, y: 300 },
        color: "#00BCD4",
      },
      // Room 3 - Immersive designer (teal)
      {
        id: "room-3",
        name: "Immersive designer",
        path: "M 750,250 L 850,250 L 850,350 L 750,350 Z",
        labelPosition: { x: 800, y: 300 },
        color: "#00BCD4",
      },
      // Room 4 - E-commerce designer (orange)
      {
        id: "room-4",
        name: "E-commerce designer",
        path: "M 650,350 L 750,350 L 750,450 L 650,450 Z",
        labelPosition: { x: 700, y: 400 },
        color: "#FF9800",
      },
      // Room 5 - Mediaproducer (green)
      {
        id: "room-5",
        name: "Mediaproducer",
        path: "M 650,450 L 750,450 L 750,500 L 650,500 Z",
        labelPosition: { x: 700, y: 475 },
        color: "#4CAF50",
      },
      // Room 6 - Mediaredactiemedewerker (green)
      {
        id: "room-6",
        name: "Mediaredactiemedewerker",
        path: "M 750,450 L 800,450 L 800,500 L 750,500 Z",
        labelPosition: { x: 775, y: 475 },
        color: "#4CAF50",
      },
      // Room 7 - Podium- en evenemententechnicus (purple)
      {
        id: "room-7",
        name: "Podium- en evenemententechnicus",
        path: "M 800,450 L 950,450 L 950,500 L 800,500 Z",
        labelPosition: { x: 875, y: 475 },
        color: "#9C27B0",
      },
      // Room 8/9 - Photographic designer & Audiovisueel (red)
      {
        id: "room-8-9",
        name: "Photographic designer / Audiovisueel",
        path: "M 950,350 L 1100,250 L 1150,300 L 1000,400 L 950,350 Z",
        labelPosition: { x: 1050, y: 325 },
        color: "#F44336",
      },
      // Room 10 - Filmacteur (red)
      {
        id: "room-10",
        name: "Filmacteur",
        path: "M 550,450 L 600,450 L 600,550 L 550,550 Z",
        labelPosition: { x: 575, y: 500 },
        color: "#F44336",
      },
    ],
    stairs: [
      // Wing stairs
      {
        x: 950,
        y: 350,
        width: 50,
        height: 30,
        label: "TRAP VLEUGEL",
      },
      // Entrance
      {
        x: 800,
        y: 550,
        width: 50,
        height: 30,
        label: "ENTREE",
      },
    ],
  },
  // 1st Floor (1e Verdieping)
  {
    id: "floor-1",
    name: "1e Verdieping",
    width: 1000,
    height: 400,
    walls: [
      // Main building outline
      {
        path: "M 650,100 L 850,100 L 850,150 L 900,150 L 900,200 L 950,200 L 950,300 L 650,300 L 650,250 L 600,250 L 600,300 L 500,300 L 500,200 L 550,200 L 550,150 L 650,150 L 650,100",
      },
      // Wing section
      {
        path: "M 950,200 L 1100,100 L 1150,150 L 1000,250 L 950,200",
      },
    ],
    rooms: [
      // Room 11 - Mediavormgever (teal)
      {
        id: "room-11",
        name: "Mediavormgever",
        path: "M 800,100 L 900,100 L 900,200 L 800,200 Z",
        labelPosition: { x: 850, y: 150 },
        color: "#00BCD4",
      },
      // Room 12 - Medewerker creatieve productie (teal) - multiple areas
      {
        id: "room-12-1",
        name: "Medewerker creatieve productie",
        path: "M 800,200 L 900,200 L 900,250 L 800,250 Z",
        labelPosition: { x: 850, y: 225 },
        color: "#00BCD4",
      },
      {
        id: "room-12-2",
        name: "Medewerker creatieve productie",
        path: "M 900,200 L 1000,200 L 1000,250 L 900,250 Z",
        labelPosition: { x: 950, y: 225 },
        color: "#00BCD4",
      },
      {
        id: "room-12-3",
        name: "Medewerker creatieve productie",
        path: "M 800,250 L 950,250 L 950,300 L 800,300 Z",
        labelPosition: { x: 875, y: 275 },
        color: "#00BCD4",
      },
    ],
    stairs: [
      // Central hall stairs
      {
        x: 850,
        y: 200,
        width: 50,
        height: 30,
        label: "TRAP CENTRALE HAL",
      },
    ],
  },
  // 2nd Floor (2e Verdieping)
  {
    id: "floor-2",
    name: "2e Verdieping",
    width: 1000,
    height: 400,
    walls: [
      // Main building outline
      {
        path: "M 650,100 L 850,100 L 850,150 L 900,150 L 900,200 L 950,200 L 950,300 L 650,300 L 650,250 L 600,250 L 600,300 L 500,300 L 500,200 L 550,200 L 550,150 L 650,150 L 650,100",
      },
      // Wing section
      {
        path: "M 950,200 L 1100,100 L 1150,150 L 1000,250 L 950,200",
      },
    ],
    rooms: [
      // Room 13 - Software developer (orange)
      {
        id: "room-13",
        name: "Software developer",
        path: "M 950,100 L 1100,100 L 1150,150 L 1000,250 L 950,200 L 950,100 Z",
        labelPosition: { x: 1050, y: 150 },
        color: "#FF9800",
      },
    ],
    stairs: [
      // Wing stairs
      {
        x: 950,
        y: 150,
        width: 50,
        height: 30,
        label: "TRAP VLEUGEL",
      },
    ],
  },
  // 3rd Floor (3e Verdieping)
  {
    id: "floor-3",
    name: "3e Verdieping",
    width: 1000,
    height: 400,
    walls: [
      // Main building outline - dashed to match the image
      {
        path: "M 650,100 L 850,100 L 850,150 L 900,150 L 900,200 L 950,200 L 950,300 L 650,300 L 650,250 L 600,250 L 600,300 L 500,300 L 500,200 L 550,200 L 550,150 L 650,150 L 650,100",
        dashed: true,
      },
      // Wing section
      {
        path: "M 950,200 L 1100,100 L 1150,150 L 1000,250 L 950,200",
      },
    ],
    rooms: [
      // Room 14 - Game artist (orange)
      {
        id: "room-14",
        name: "Game artist",
        path: "M 950,100 L 1100,100 L 1150,150 L 1000,250 L 950,200 L 950,100 Z",
        labelPosition: { x: 1050, y: 150 },
        color: "#FF9800",
      },
    ],
    stairs: [
      // Wing stairs
      {
        x: 950,
        y: 150,
        width: 50,
        height: 30,
        label: "TRAP VLEUGEL",
      },
    ],
  },
]

// Points of interest based on the provided floor plan
export const mockPointsOfInterest: PointOfInterest[] = [
  // Ground Floor (Begane Grond)
  {
    id: "1",
    number: "1",
    name: "Startpunt / Hoofdingang",
    description:
      "Startpunt van alle opleidingen, rondleiding, voorlichting, algemene informatie, aanmelden voor een opleiding, koffie en thee voor bezoekers",
    position: { x: 800, y: 400 },
    category: "algemeen",
    categoryName: "Algemeen",
    floor: 0,
    color: "#FFEB3B",
  },
  {
    id: "2",
    number: "2",
    name: "Ruimtelijk vormgever",
    description: "Opleiding Ruimtelijk vormgever (Ontwerpen & realiseren)",
    position: { x: 900, y: 300 },
    category: "design",
    categoryName: "Ontwerpen & realiseren",
    floor: 0,
    color: "#00BCD4",
  },
  {
    id: "3",
    number: "3",
    name: "Immersive designer",
    description: "Opleiding Immersive designer (Ontwerpen & realiseren)",
    position: { x: 800, y: 300 },
    category: "design",
    categoryName: "Ontwerpen & realiseren",
    floor: 0,
    color: "#00BCD4",
  },
  {
    id: "4",
    number: "4",
    name: "E-commerce designer",
    description: "Opleiding E-commerce designer (Games en Software)",
    position: { x: 700, y: 400 },
    category: "software",
    categoryName: "Games en Software",
    floor: 0,
    color: "#FF9800",
  },
  {
    id: "5",
    number: "5",
    name: "Mediaproducer en Music industry professional",
    description: "Opleiding Mediaproducer en Music industry professional (Media & events)",
    position: { x: 700, y: 475 },
    category: "media",
    categoryName: "Media & events",
    floor: 0,
    color: "#4CAF50",
  },
  {
    id: "6",
    number: "6",
    name: "Mediaredactiemedewerker",
    description: "Opleiding Mediaredactiemedewerker (Media & events)",
    position: { x: 775, y: 475 },
    category: "media",
    categoryName: "Media & events",
    floor: 0,
    color: "#4CAF50",
  },
  {
    id: "7",
    number: "7",
    name: "Podium- en evenementen technicus",
    description: "Opleiding Podium- en evenementen technicus (Backstage design & techniek)",
    position: { x: 875, y: 475 },
    category: "backstage",
    categoryName: "Backstage design & techniek",
    floor: 0,
    color: "#9C27B0",
  },
  {
    id: "8",
    number: "8",
    name: "Photographic designer",
    description: "Opleiding Photographic designer (Film & fotografie)",
    position: { x: 1050, y: 310 },
    category: "av",
    categoryName: "Film & fotografie",
    floor: 0,
    color: "#F44336",
  },
  {
    id: "9",
    number: "9",
    name: "Audiovisueel",
    description: "Opleiding Audiovisueel (Film & fotografie)",
    position: { x: 1050, y: 340 },
    category: "av",
    categoryName: "Film & fotografie",
    floor: 0,
    color: "#F44336",
  },
  {
    id: "10",
    number: "10",
    name: "Filmacteur",
    description: "Opleiding Filmacteur (Film & fotografie)",
    position: { x: 575, y: 500 },
    category: "av",
    categoryName: "Film & fotografie",
    floor: 0,
    color: "#F44336",
  },

  // 1st Floor (1e Verdieping)
  {
    id: "11",
    number: "11",
    name: "Mediavormgever",
    description: "Opleiding Mediavormgever (Ontwerpen & realiseren)",
    position: { x: 850, y: 150 },
    category: "design",
    categoryName: "Ontwerpen & realiseren",
    floor: 1,
    color: "#00BCD4",
  },
  {
    id: "12",
    number: "12",
    name: "Medewerker creatieve productie",
    description:
      "Opleiding Medewerker creatieve productie, Allround mediamaker (dtp-er) & Signspecialist (Ontwerpen & realiseren)",
    position: { x: 875, y: 250 },
    category: "design",
    categoryName: "Ontwerpen & realiseren",
    floor: 1,
    color: "#00BCD4",
  },

  // 2nd Floor (2e Verdieping)
  {
    id: "13",
    number: "13",
    name: "Software developer",
    description: "Opleiding Software developer (Games en Software)",
    position: { x: 1050, y: 150 },
    category: "software",
    categoryName: "Games en Software",
    floor: 2,
    color: "#FF9800",
  },

  // 3rd Floor (3e Verdieping)
  {
    id: "14",
    number: "14",
    name: "Game artist",
    description: "Opleiding Game artist (Games en Software)",
    position: { x: 1050, y: 150 },
    category: "software",
    categoryName: "Games en Software",
    floor: 3,
    color: "#FF9800",
  },
]

