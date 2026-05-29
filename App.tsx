import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Header } from "./components/Header";
import { ProductList } from "./components/ProductList";
import { SellModal } from "./components/SellModal";
import { FilterBar } from "./components/FilterBar";
import {
  Product,
  Condition,
  Review,
  Currency,
  Conversation,
  ChatMessage,
  ToastMessage,
  Order,
  OrderStatus,
  Address,
} from "./types";
import {
  generateDescription,
  generateChatReply,
} from "./services/geminiService";
import { SignIn } from "./components/SignIn";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartModal } from "./components/CartModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { RoleSelection } from "./components/RoleSelection";
import { SellerDashboard } from "./components/SellerDashboard";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { ChatListModal } from "./components/ChatListModal";
import { ChatModal } from "./components/ChatModal";
import { WishlistModal } from "./components/WishlistModal";
import { Toast } from "./components/Toast";
import { OrdersPage } from "./components/OrdersPage";
import { ShippingPage } from "./components/ShippingPage";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const generateRandomPhoneNumber = () => {
  const countryCode = Math.floor(Math.random() * 90) + 10;
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const firstPart = Math.floor(Math.random() * 900) + 100;
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  return `+${countryCode} ${areaCode}-${firstPart}-${secondPart}`;
};

const mockLocations: Address[] = [
  {
    street: "123 Tech Ave",
    city: "Silicon Valley",
    state: "CA",
    zip: "94043",
    country: "USA",
  },
  {
    street: "456 Commerce St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
  },
  {
    street: "789 Fashion Blvd",
    city: "London",
    state: "N/A",
    zip: "W1J 9BR",
    country: "UK",
  },
  {
    street: "101 Innovation Dr",
    city: "Tokyo",
    state: "N/A",
    zip: "100-0001",
    country: "Japan",
  },
  {
    street: "212 Auto Row",
    city: "Stuttgart",
    state: "N/A",
    zip: "70173",
    country: "Germany",
  },
  {
    street: "555 Market St",
    city: "Mumbai",
    state: "MH",
    zip: "400001",
    country: "India",
  },
];

const CAR_BRANDS = [
  "Toyota",
  "BMW",
  "Honda",
  "Ford",
  "Mercedes",
  "Tesla",
  "Ferrari",
  "Audi",
  "Nissan",
  "Hyundai",
  "Volkswagen",
  "Porsche",
  "Lexus",
  "Chevrolet",
  "Mazda",
  "Subaru",
  "Kia",
  "Volvo",
  "Jaguar",
  "Land Rover",
];
const CAR_PARTS = [
  "Turbocharger",
  "Radiator",
  "Alternator",
  "Fuel Injector",
  "Brake Rotor",
  "Brake Pad",
  "Shock Absorber",
  "Lowering Spring",
  "Coilover",
  "Alloy Wheel",
  "Floor Mat",
  "Racing Seat",
  "Dash Cam",
  "Headlight",
  "Tail Light",
  "Air Filter",
  "Oil Filter",
  "Spark Plug",
  "Clutch Kit",
  "Exhaust Manifold",
  "Intercooler",
  "Blow Off Valve",
  "Strut Bar",
  "Sway Bar",
  "Brake Caliper",
  "Steering Wheel",
  "Gear Knob",
  "Roof Rack",
  "Spoiler",
  "Diffuser",
];

const MOTO_BRANDS = [
  "Ducati",
  "Harley-Davidson",
  "Yamaha",
  "Kawasaki",
  "Honda",
  "Suzuki",
  "BMW",
  "Triumph",
  "KTM",
  "Royal Enfield",
  "Aprilia",
  "Moto Guzzi",
  "Indian",
  "Benelli",
  "Husqvarna",
];
const MOTO_PARTS = [
  "Exhaust",
  "Helmet",
  "Master Cylinder",
  "Chain Kit",
  "Sprocket",
  "Rear Shock",
  "Fairing",
  "Handlebar",
  "Mirror",
  "Footpeg",
  "Brake Line",
  "Air Intake",
  "Fuel Tank",
  "Seat",
  "Tire",
  "Panniers",
  "Crash Bars",
  "Windshield",
  "Radiator Guard",
  "Tail Tidy",
  "Brake Lever",
  "Clutch Lever",
  "Tank Pad",
  "Engine Case Cover",
  "LED Indicators",
];

const BIKE_BRANDS = [
  "Shimano",
  "SRAM",
  "Campagnolo",
  "Specialized",
  "Trek",
  "Giant",
  "Canyon",
  "Pinarello",
  "Cannondale",
  "Scott",
  "Bianchi",
  "Orbea",
  "Santa Cruz",
  "Merida",
  "BMC",
  "Cervelo",
  "Colnago",
  "Ridley",
  "Fuji",
  "Marin",
];
const BIKE_PARTS = [
  "Groupset",
  "Wheelset",
  "Carbon Frame",
  "Handlebar",
  "Seatpost",
  "Saddle",
  "Pedal",
  "Tire",
  "Brake Set",
  "Derailleur",
  "Chain",
  "Cassette",
  "Crankset",
  "Fork",
  "Stem",
  "Bottom Bracket",
  "Headset",
  "Brake Rotors",
  "Thru Axle",
  "Bar Tape",
  "Bottle Cage",
  "Mudguards",
  "Pannier Rack",
  "Computer Mount",
  "Lights Set",
];

const MOCK_REVIEWERS = [
  "John D.",
  "Sarah W.",
  "Mike T.",
  "Emily R.",
  "Chris P.",
  "Alex K.",
  "Jordan L.",
  "Sam F.",
  "Taylor B.",
  "Morgan H.",
];
const MOCK_COMMENTS_POSITIVE = [
  "Great product! Fits perfectly.",
  "Fast shipping, item exactly as described.",
  "Highly recommend this seller. Excellent condition.",
  "Works like a charm. Very satisfied.",
  "Top notch quality. Would buy again.",
];
const MOCK_COMMENTS_MIXED = [
  "Okay item, had some scratches that were not mentioned.",
  "Decent for the price, but took a while to arrive.",
  "It works, but installation was a bit tricky.",
  "Average quality. Does the job.",
];

const generateFakeReviews = (): Review[] => {
  const numReviews = Math.floor(Math.random() * 4) + 1; // 1 to 4 reviews
  const reviews: Review[] = [];
  for (let i = 0; i < numReviews; i++) {
    const isPositive = Math.random() > 0.3; // 70% chance of positive review
    const commentList = isPositive
      ? MOCK_COMMENTS_POSITIVE
      : MOCK_COMMENTS_MIXED;
    const rating = isPositive
      ? Math.floor(Math.random() * 2) + 4
      : Math.floor(Math.random() * 2) + 2; // 4-5 or 2-3

    reviews.push({
      id: Math.floor(Math.random() * 1000000),
      author: MOCK_REVIEWERS[Math.floor(Math.random() * MOCK_REVIEWERS.length)],
      rating,
      comment: commentList[Math.floor(Math.random() * commentList.length)],
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000),
      ).toLocaleDateString(),
    });
  }
  return reviews;
};

const generateProducts = () => {
  const products: Product[] = [];
  let id = 1;

  // Helper to generate specific keywords for better image matching
  const getKeywords = (
    category: string,
    part: string,
    type: "main" | "detail" | "side" | "macro" = "main",
  ) => {
    const p = part.toLowerCase();

    // Map specific parts to high-quality Unsplash IDs for a "real website" feel
    const unsplashMapping: Record<string, string[]> = {
      turbocharger: [
        "1605559424843-9e4c228bf1c2",
        "1580273916550-e323be2ae537",
        "1517524204709-449d19fbbbd9",
      ],
      radiator: [
        "1504222490345-c075b6008014",
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
      ],
      alternator: [
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
      ],
      "brake rotor": [
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
      ],
      "brake pad": [
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
      ],
      "alloy wheel": [
        "1505429853006-8913588b3e82",
        "1584305323448-2936140031ae",
        "1549399500-5d521b4b197a",
      ],
      headlight: [
        "1549399500-5d521b4b197a",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      exhaust: [
        "1580273916550-e323be2ae537",
        "1517524204709-449d19fbbbd9",
        "1558981403-c5f91cbba527",
      ],
      helmet: [
        "1558444458-5cd00bb12ee1",
        "1558981403-c5f91cbba527",
        "1558444458-5cd00bb12ee1",
      ],
      tire: [
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
        "1486497395442-885e218fdb67",
      ],
      groupset: [
        "1520640530522-aa1504688697",
        "1532298229144-0ee0cb85a176",
        "1485965120184-e220f721d03e",
      ],
      wheelset: [
        "1485965120184-e220f721d03e",
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
      ],
      "carbon frame": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      saddle: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      pedal: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      chain: [
        "1520640530522-aa1504688697",
        "1532298229144-0ee0cb85a176",
        "1485965120184-e220f721d03e",
      ],
      fork: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "steering wheel": [
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
        "1503376780353-7e6692767b70",
      ],
      "gear knob": [
        "1541899481282-d53bcfcf7335",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      spoiler: [
        "1503376780353-7e6692767b70",
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
      ],
      "spark plug": [
        "1585832770230-11234f218e06",
        "1517524204709-449d19fbbbd9",
        "1605559424843-9e4c228bf1c2",
      ],
      "oil filter": [
        "1605559424843-9e4c228bf1c2",
        "1585832770230-11234f218e06",
        "1517524204709-449d19fbbbd9",
      ],
      "air filter": [
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
        "1517524204709-449d19fbbbd9",
      ],
      "racing seat": [
        "1542362567-b051c1f356bd",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      "dash cam": [
        "1600003015121-be09143bd7b8",
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
      ],
      "fuel injector": [
        "1585832770230-11234f218e06",
        "1517524204709-449d19fbbbd9",
        "1605559424843-9e4c228bf1c2",
      ],
      "shock absorber": [
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
      ],
      handlebar: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      mirror: [
        "1552519507-da3b142c6e3d",
        "1558981403-c5f91cbba527",
        "1541899481282-d53bcfcf7335",
      ],
      "fuel tank": [
        "1558981403-c5f91cbba527",
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
      ],
      windshield: [
        "1552519507-da3b142c6e3d",
        "1558981403-c5f91cbba527",
        "1503376780353-7e6692767b70",
      ],
      derailleur: [
        "1520640530522-aa1504688697",
        "1532298229144-0ee0cb85a176",
        "1485965120184-e220f721d03e",
      ],
      cassette: [
        "1520640530522-aa1504688697",
        "1532298229144-0ee0cb85a176",
        "1485965120184-e220f721d03e",
      ],
      crankset: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      stem: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      headset: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      engine: [
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
      ],
      piston: [
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
      ],
      clutch: [
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
      ],
      battery: [
        "1616422285861-92e0e952700b",
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
      ],
      wheel: [
        "1549399500-5d521b4b197a",
        "1505429853006-8913588b3e82",
        "1486497395442-885e218fdb67",
      ],
      interior: [
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
        "1503376780353-7e6692767b70",
      ],
      dashboard: [
        "1541899481282-d53bcfcf7335",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      "brake caliper": [
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
      ],
      suspension: [
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
      ],
      "exhaust manifold": [
        "1580273916550-e323be2ae537",
        "1517524204709-449d19fbbbd9",
        "1605559424843-9e4c228bf1c2",
      ],
      intercooler: [
        "1605559424843-9e4c228bf1c2",
        "1585832770230-11234f218e06",
        "1517524204709-449d19fbbbd9",
      ],
      "blow off valve": [
        "1605559424843-9e4c228bf1c2",
        "1585832770230-11234f218e06",
        "1517524204709-449d19fbbbd9",
      ],
      "strut bar": [
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
      ],
      "sway bar": [
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
        "1505429853006-8913588b3e82",
      ],
      "roof rack": [
        "1503376780353-7e6692767b70",
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
      ],
      diffuser: [
        "1503376780353-7e6692767b70",
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
      ],
      "chain kit": [
        "1558981403-c5f91cbba527",
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
      ],
      sprocket: [
        "1558981403-c5f91cbba527",
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
      ],
      "rear shock": [
        "1558981403-c5f91cbba527",
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
      ],
      fairing: [
        "1558981403-c5f91cbba527",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      footpeg: [
        "1558981403-c5f91cbba527",
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
      ],
      "brake line": [
        "1558981403-c5f91cbba527",
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
      ],
      "air intake": [
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
      ],
      panniers: [
        "1558981403-c5f91cbba527",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      "crash bars": [
        "1558981403-c5f91cbba527",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      "radiator guard": [
        "1504222490345-c075b6008014",
        "1558981403-c5f91cbba527",
        "1585832770230-11234f218e06",
      ],
      "tail tidy": [
        "1558981403-c5f91cbba527",
        "1552519507-da3b142c6e3d",
        "1503376780353-7e6692767b70",
      ],
      "brake lever": [
        "1558981403-c5f91cbba527",
        "1486497395442-885e218fdb67",
        "1584305323448-2936140031ae",
      ],
      "clutch lever": [
        "1558981403-c5f91cbba527",
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
      ],
      "tank pad": [
        "1558981403-c5f91cbba527",
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
      ],
      "engine case cover": [
        "1517524204709-449d19fbbbd9",
        "1585832770230-11234f218e06",
        "1605559424843-9e4c228bf1c2",
      ],
      "led indicators": [
        "1558981403-c5f91cbba527",
        "1552519507-da3b142c6e3d",
        "1541899481282-d53bcfcf7335",
      ],
      seatpost: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "brake set": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "bottom bracket": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "thru axle": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "bar tape": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "bottle cage": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      mudguards: [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "pannier rack": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "computer mount": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
      "lights set": [
        "1532298229144-0ee0cb85a176",
        "1520640530522-aa1504688697",
        "1485965120184-e220f721d03e",
      ],
    };

    const idx =
      type === "main" ? 0 : type === "detail" ? 1 : type === "side" ? 2 : 0;

    if (unsplashMapping[p]) {
      const id = unsplashMapping[p][idx % unsplashMapping[p].length];
      return `https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`;
    }

    // Fallback to loremflickr with very specific keywords
    const c =
      category === "car"
        ? "automotive"
        : category === "motorcycle"
          ? "motorbike"
          : "bicycle";
    const mapping: Record<string, string> = {
      "fuel injector": "fuel,injector,nozzle",
      "shock absorber": "suspension,shock,absorber",
      "lowering spring": "car,spring,suspension",
      coilover: "coilover,suspension,strut",
      "floor mat": "car,floor,mat",
      "racing seat": "racing,seat,bucket",
      "dash cam": "dashcam,camera,car",
      "tail light": "car,taillight,lamp",
      "air filter": "air,filter,engine",
      "oil filter": "oil,filter,engine",
      "spark plug": "spark,plug,engine",
      "clutch kit": "clutch,transmission,gear",
      "exhaust manifold": "exhaust,manifold,engine",
      intercooler: "intercooler,turbo,cooling",
      "blow off valve": "bov,turbo,valve",
      "strut bar": "strut,bar,suspension",
      "sway bar": "sway,bar,suspension",
      "brake caliper": "brake,caliper,piston",
      "steering wheel": "steering,wheel,car",
      "gear knob": "gear,knob,shifter",
      "roof rack": "roof,rack,car",
      spoiler: "car,spoiler,wing",
      diffuser: "car,diffuser,bumper",
      "master cylinder": "brake,master,cylinder",
      "chain kit": "motorcycle,chain,sprocket",
      sprocket: "motorcycle,sprocket,gear",
      "rear shock": "motorcycle,shock,suspension",
      fairing: "motorcycle,body,fairing",
      handlebar: "handlebar,bike",
      mirror: "motorcycle,mirror,side",
      footpeg: "motorcycle,footpeg,pedal",
      "brake line": "brake,hose,line",
      "air intake": "engine,air,intake",
      "fuel tank": "motorcycle,fuel,tank",
      seat: "motorcycle,seat,saddle",
      panniers: "motorcycle,panniers,bags",
      "crash bars": "motorcycle,crash,bars",
      windshield: "motorcycle,windshield,screen",
      "radiator guard": "motorcycle,radiator,guard",
      "tail tidy": "motorcycle,tail,tidy",
      "brake lever": "motorcycle,brake,lever",
      "clutch lever": "motorcycle,clutch,lever",
      "tank pad": "motorcycle,tank,pad",
      "engine case cover": "motorcycle,engine,cover",
      "led indicators": "motorcycle,led,indicators",
      seatpost: "bicycle,seatpost,tube",
      "brake set": "bicycle,brake,caliper",
      derailleur: "bicycle,derailleur,gears",
      cassette: "bicycle,cassette,gears",
      crankset: "bicycle,crankset,pedal",
      stem: "bicycle,stem,handlebar",
      "bottom bracket": "bicycle,bottom,bracket",
      headset: "bicycle,headset,bearing",
      "brake rotors": "bicycle,brake,rotor",
      "thru axle": "bicycle,thru,axle",
      "bar tape": "bicycle,bar,tape",
      "bottle cage": "bicycle,bottle,cage",
      mudguards: "bicycle,mudguards,fenders",
      "pannier rack": "bicycle,pannier,rack",
      "computer mount": "bicycle,computer,mount",
      "lights set": "bicycle,lights,set",
    };

    const specific = mapping[p] || p.split(" ").join(",");
    return `https://loremflickr.com/400/300/${specific},${c},part,${type}?lock=${Math.abs(p.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)) + idx}`;
  };

  // Generate 100+ Car Parts
  for (let i = 0; i < 150; i++) {
    const brand = CAR_BRANDS[i % CAR_BRANDS.length];
    const part = CAR_PARTS[i % CAR_PARTS.length];
    const imageUrl = getKeywords("car", part, "main");
    products.push({
      id: id++,
      name: `${brand} ${part}`,
      description: `High-quality ${part} for ${brand} vehicles. Durable and reliable performance. This genuine ${brand} part ensures perfect fitment and long-lasting durability for your high-performance vehicle. SKU: ${brand.substring(0, 3).toUpperCase()}-${part.substring(0, 3).toUpperCase()}-${id}`,
      price: Math.floor(Math.random() * 2000) + 50,
      condition: Math.random() > 0.5 ? Condition.NEW : Condition.USED,
      imageUrl,
      additionalImages: [
        getKeywords("car", part, "detail"),
        getKeywords("car", part, "side"),
        getKeywords("car", part, "macro"),
      ],
      currency: "USD",
      sellerId: Math.random() > 0.3 ? "otherUser" : "currentUser",
      sellerPhoneNumber: generateRandomPhoneNumber(),
      sellerLocation:
        mockLocations[Math.floor(Math.random() * mockLocations.length)],
      reviews: generateFakeReviews(),
      isVerified: true,
    });
  }

  // Generate 100+ Motorcycle Actions/Parts
  for (let i = 0; i < 100; i++) {
    const brand = MOTO_BRANDS[i % MOTO_BRANDS.length];
    const part = MOTO_PARTS[i % MOTO_PARTS.length];
    const imageUrl = getKeywords("motorcycle", part, "main");
    products.push({
      id: id++,
      name: `${brand} ${part}`,
      description: `Premium ${part} for ${brand} motorcycles. Enhances style and performance. Designed specifically for ${brand} track and road models to provide superior handling and aesthetics. SKU: ${brand.substring(0, 3).toUpperCase()}-${part.substring(0, 3).toUpperCase()}-${id}`,
      price: Math.floor(Math.random() * 1500) + 30,
      condition: Math.random() > 0.5 ? Condition.NEW : Condition.USED,
      imageUrl,
      additionalImages: [
        getKeywords("motorcycle", part, "detail"),
        getKeywords("motorcycle", part, "side"),
        getKeywords("motorcycle", part, "macro"),
      ],
      currency: "USD",
      sellerId: Math.random() > 0.3 ? "otherUser" : "currentUser",
      sellerPhoneNumber: generateRandomPhoneNumber(),
      sellerLocation:
        mockLocations[Math.floor(Math.random() * mockLocations.length)],
      reviews: generateFakeReviews(),
      isVerified: Math.random() > 0.2, // 80% chance of being verified
    });
  }

  return products;
};

const INITIAL_PRODUCTS: Product[] = generateProducts();

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<Condition | "all">(
    "all",
  );
  const [viewedProduct, setViewedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [role, setRole] = useState<"buyer" | "seller" | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<
    "marketplace" | "orders" | "shipping"
  >("marketplace");
  const [pendingShippingAddress, setPendingShippingAddress] =
    useState<Address | null>(null);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (message: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const handleDisplayCurrencyChange = (currency: Currency) => {
    setDisplayCurrency(currency);
  };

  const handleSelectRole = (selectedRole: "buyer" | "seller") => {
    setRole(selectedRole);
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setRole(null);
      setCurrentPage("marketplace");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleCloseSellModal = () => {
    setIsSellModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (
    productData:
      | Omit<Product, "id" | "sellerId" | "sellerPhoneNumber">
      | Product,
  ) => {
    if ("id" in productData && productData.id) {
      // Editing existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id ? ({ ...p, ...productData } as Product) : p,
        ),
      );
      addToast("Item updated successfully!", "success");
    } else {
      // Adding new product
      const newProduct: Product = {
        ...(productData as Omit<
          Product,
          "id" | "sellerId" | "sellerPhoneNumber"
        >),
        id: products.length + 1,
        sellerId: "currentUser",
        sellerPhoneNumber: generateRandomPhoneNumber(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      addToast("Item listed successfully!", "success");
    }
    handleCloseSellModal();
  };

  const handleDeleteProduct = (productId: number) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this listing? This action cannot be undone.",
      )
    ) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addToast("Item deleted successfully.", "info");
    }
  };

  const handleEditItem = (product: Product) => {
    setEditingProduct(product);
    setIsSellModalOpen(true);
  };

  const handleAddReview = (
    productId: number,
    reviewData: Omit<Review, "id" | "author" | "date">,
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const existingReviews = p.reviews || [];
          const newReview: Review = {
            ...reviewData,
            id: Date.now(),
            author: "You",
            date: new Date().toISOString().split("T")[0],
          };
          return { ...p, reviews: [...existingReviews, newReview] };
        }
        return p;
      }),
    );
    if (viewedProduct?.id === productId) {
      setViewedProduct((prev) => {
        if (!prev) return null;
        const existingReviews = prev.reviews || [];
        const newReview: Review = {
          ...reviewData,
          id: Date.now(),
          author: "You",
          date: new Date().toISOString().split("T")[0],
        };
        return { ...prev, reviews: [...existingReviews, newReview] };
      });
    }
    addToast("Review submitted successfully!", "success");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCondition =
        conditionFilter === "all" || product.condition === conditionFilter;
      return matchesSearch && matchesCondition;
    });
  }, [products, searchTerm, conditionFilter]);

  const sellerProducts = useMemo(() => {
    return products.filter((p) => p.sellerId === "currentUser");
  }, [products]);

  const handleViewItem = (product: Product) => setViewedProduct(product);
  const handleCloseDetailModal = () => setViewedProduct(null);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev; // Prevent duplicates
      }
      addToast(`${product.name} added to cart!`, "success");
      return [...prev, product];
    });
    setViewedProduct(null);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    addToast("Item removed from cart.", "info");
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);
    setWishlistItems((prev) => {
      if (isInWishlist) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
    addToast(
      isInWishlist ? "Removed from wishlist." : "Added to wishlist!",
      isInWishlist ? "info" : "success",
    );
  };

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    addToast("Item removed from wishlist.", "info");
  };

  const handleMoveFromWishlistToCart = (product: Product) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
    setCartItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
    addToast(`${product.name} moved to cart!`, "success");
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage("shipping");
  };

  const handleConfirmShipping = (address: Address) => {
    setPendingShippingAddress(address);
    setCurrentPage("marketplace"); // Visually go back
    setIsCheckoutOpen(true); // Open payment modal
  };

  const handleConfirmOrder = (orderDetails: {
    id: string;
    items: Product[];
    total: number;
    currency: Currency;
  }) => {
    if (!pendingShippingAddress) {
      console.error("Shipping address is missing!");
      addToast("An error occurred. Please try again.", "info");
      return;
    }

    const newOrder: Order = {
      ...orderDetails,
      date: new Date().toISOString(),
      status: OrderStatus.PROCESSING,
      shippingAddress: pendingShippingAddress,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setPendingShippingAddress(null);
    addToast(`Order ${newOrder.id} placed successfully!`, "success");

    // Simulate order status updates
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === newOrder.id ? { ...o, status: OrderStatus.SHIPPED } : o,
        ),
      );
      addToast(`Your order ${newOrder.id} has been shipped!`, "info");
    }, 5000); // Shipped after 5 seconds
  };

  const handleConfirmDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: OrderStatus.DELIVERED } : o,
      ),
    );
    addToast(
      `Order ${orderId} completed! Final payment successful.`,
      "success",
    );
  };

  const handleStartChat = (product: Product) => {
    const convoId = `product-${product.id}-user-currentUser`;
    const existingConvo = conversations.find((c) => c.id === convoId);

    if (!existingConvo) {
      const newConvo: Conversation = {
        id: convoId,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        participants: ["currentUser", "otherUser"],
        messages: [],
      };
      setConversations((prev) => [newConvo, ...prev]);
    }

    setActiveConversationId(convoId);
    setViewedProduct(null);
  };

  const handleSendMessage = async (conversationId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      sender: "currentUser",
      timestamp: new Date().toISOString(),
    };

    const updatedConversations = conversations.map((c) =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, newMessage] }
        : c,
    );
    setConversations(updatedConversations);

    const currentConvo = updatedConversations.find(
      (c) => c.id === conversationId,
    );
    if (!currentConvo) return;

    const aiReplyText = await generateChatReply(
      currentConvo.productName,
      currentConvo.messages,
    );

    const replyMessage: ChatMessage = {
      id: Date.now() + 1,
      text: aiReplyText,
      sender: "otherUser",
      timestamp: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, replyMessage] }
          : c,
      ),
    );
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setIsChatListOpen(false);
  };

  if (!role) {
    return <RoleSelection onSelectRole={handleSelectRole} />;
  }

  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} role={role} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "marketplace":
        return (
          <motion.main
            key="marketplace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto p-4 md:p-8"
          >
            {role === "buyer" && (
              <div className="mb-8 relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-bg-darker to-bg-dark border border-white/5 shadow-xl glass-panel flex flex-col lg:flex-row items-center justify-between gap-8">
                <div
                  className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
                  style={{ backgroundColor: "var(--color-brand-primary)" }}
                ></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                <div className="relative z-10 w-full lg:w-1/2">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold tracking-wider uppercase mb-3"
                    style={{ color: "var(--color-brand-primary)" }}
                  >
                    <ShieldCheck size={12} />
                    <span>AI-Verified Marketplace</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
                    Genuine Automotive & Racing Parts
                  </h1>
                  <p className="text-sm md:text-base text-text-secondary max-w-lg">
                    Shop authenticated premium components from strictly vetted
                    global dealers.
                  </p>
                </div>

                <div className="relative z-10 w-full lg:w-1/2 flex flex-wrap gap-2 justify-start lg:justify-end">
                  {[
                    "Engine & Drivetrain",
                    "Suspension & Steering",
                    "Exhaust Systems",
                    "Brakes & Rotors",
                    "Exterior Body",
                    "Wheels & Tires",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchTerm(cat.split(" ")[0])}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-primary/40 transition-all text-sm font-semibold text-white/90 group whitespace-nowrap"
                    >
                      <span className="group-hover:text-brand-primary transition-colors">
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {role === "buyer" ? (
              <>
                <FilterBar
                  searchTerm={searchTerm}
                  onSearchTermChange={setSearchTerm}
                  conditionFilter={conditionFilter}
                  onConditionFilterChange={setConditionFilter}
                  displayCurrency={displayCurrency}
                  onDisplayCurrencyChange={handleDisplayCurrencyChange}
                />
                <ProductList
                  products={filteredProducts}
                  onViewItem={handleViewItem}
                  displayCurrency={displayCurrency}
                />
              </>
            ) : (
              <SellerDashboard
                products={sellerProducts}
                orders={orders}
                onBack={() => setCurrentPage("marketplace")}
              />
            )}
          </motion.main>
        );
      case "dashboard":
        if (role === "buyer") {
          return (
            <motion.div
              key="customer-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CustomerDashboard
                orders={orders}
                wishlist={wishlistItems}
                onBack={() => setCurrentPage("marketplace")}
              />
            </motion.div>
          );
        }
        if (role === "seller") {
          return (
            <motion.div
              key="seller-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SellerDashboard
                products={sellerProducts}
                orders={orders}
                onBack={() => setCurrentPage("marketplace")}
              />
            </motion.div>
          );
        }
        return null;
      case "orders":
        return (
          <motion.div
            key="orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OrdersPage
              orders={orders}
              onConfirmDelivery={handleConfirmDelivery}
            />
          </motion.div>
        );
      case "shipping":
        return (
          <motion.div
            key="shipping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ShippingPage
              cartItems={cartItems}
              onConfirmShipping={handleConfirmShipping}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative text-text-primary overflow-x-hidden font-sans pb-20">
      {/* Base ambient background colors */}
      <div className="fixed inset-0 pointer-events-none bg-bg-darker -z-20"></div>
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent -z-10"></div>

      <Header
        onSellClick={() => setIsSellModalOpen(true)}
        cartItemCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        wishlistItemCount={wishlistItems.length}
        onWishlistClick={() => setIsWishlistOpen(true)}
        role={role}
        onChatClick={() => setIsChatListOpen(true)}
        chatCount={conversations.length}
        onOrdersClick={() => setCurrentPage("orders")}
        onNavigateHome={() => setCurrentPage("marketplace")}
        onDashboardClick={() => setCurrentPage("dashboard")}
        onLogout={handleLogout}
      />

      <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>

      {isSellModalOpen && (
        <SellModal
          onClose={handleCloseSellModal}
          onSaveProduct={handleSaveProduct}
          onGenerateDescription={generateDescription}
          productToEdit={editingProduct}
        />
      )}

      {viewedProduct && (
        <ProductDetailModal
          product={viewedProduct}
          onClose={handleCloseDetailModal}
          onAddToCart={handleAddToCart}
          onAddReview={handleAddReview}
          onStartChat={handleStartChat}
          displayCurrency={displayCurrency}
          isInWishlist={wishlistItems.some(
            (item) => item.id === viewedProduct.id,
          )}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        displayCurrency={displayCurrency}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={handleRemoveFromWishlist}
        onViewItem={handleViewItem}
        onMoveToCart={handleMoveFromWishlistToCart}
        displayCurrency={displayCurrency}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onConfirmOrder={handleConfirmOrder}
        displayCurrency={displayCurrency}
      />

      <ChatListModal
        isOpen={isChatListOpen}
        onClose={() => setIsChatListOpen(false)}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />

      {activeConversationId && (
        <ChatModal
          isOpen={!!activeConversationId}
          onClose={() => setActiveConversationId(null)}
          conversation={
            conversations.find((c) => c.id === activeConversationId)!
          }
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Toast Container */}
      <div
        aria-live="assertive"
        className="fixed bottom-0 right-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 z-[100]"
      >
        <div className="w-full flex flex-col space-y-4 items-center sm:items-end">
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;
