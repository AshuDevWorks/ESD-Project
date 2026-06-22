export const wasteDatabase = [
  {
    id: "plastic_bottle",
    name: "PET Plastic Water Bottle",
    emoji: "🧴",
    category: "recyclable",
    bin: "recyclable",
    decomp: "450 Years",
    co2: 0.10,
    water: 3.0,
    guidelines: [
      "Rinse any residual liquids inside to prevent batch contamination.",
      "Crush the bottle flat to save space in the recycle bin.",
      "Remove the cap and recycle it separately, as it uses a different plastic grade."
    ],
    tips: "Transition to a durable stainless steel or vacuum-insulated water bottle. It pays for itself in less than a month."
  },
  {
    id: "cardboard_box",
    name: "Cardboard Packaging Box",
    emoji: "📦",
    category: "recyclable",
    bin: "recyclable",
    decomp: "2 Months",
    co2: 0.22,
    water: 5.5,
    guidelines: [
      "Flatten the cardboard boxes completely to maximize bin capacity.",
      "Remove plastic packaging tape, labels, and bubble wrap inside.",
      "Ensure the cardboard is dry; wet paper fibers cannot be recycled."
    ],
    tips: "Re-use cardboard boxes for storage, shipping, or weed-blocking mulch in home gardening."
  },
  {
    id: "banana_peel",
    name: "Banana Peel",
    emoji: "🍌",
    category: "organic",
    bin: "organic",
    decomp: "10 Days",
    co2: 0.05,
    water: 0.2,
    guidelines: [
      "Throw directly into the organic composting container.",
      "Do not bag it in plastic bags unless they are certified 100% compostable.",
      "Remove any tiny plastic fruit stickers before disposal."
    ],
    tips: "Soak banana peels in water for 48 hours to create a nutrient-rich potassium liquid feed for houseplants."
  },
  {
    id: "alkaline_battery",
    name: "AA Alkaline Battery",
    emoji: "🔋",
    category: "hazardous",
    bin: "hazardous",
    decomp: "100 Years",
    co2: 0.45,
    water: 12.0,
    guidelines: [
      "NEVER dispose in household trash. Heavy metals leak into landfill soil.",
      "Store safely in a cool dry container until you have a batch to recycle.",
      "Drop off at designated battery collection points in supermarkets or electronic stores."
    ],
    tips: "Switch to NiMH rechargeable batteries. A single rechargeable cell replaces up to 500 single-use batteries."
  },
  {
    id: "styrofoam_cup",
    name: "Styrofoam Coffee Cup",
    emoji: "🥤",
    category: "landfill",
    bin: "landfill",
    decomp: "500+ Years",
    co2: -0.15,
    water: 0.0,
    guidelines: [
      "Place in the general landfill bin.",
      "Styrofoam (expanded polystyrene) is brittle and breaks into microplastics easily.",
      "Most local municipality facilities do NOT accept styrofoam recycling."
    ],
    tips: "Bring your own reusable ceramic cup or thermos. Many coffee shops offer a discount for doing so."
  },
  {
    id: "glass_jar",
    name: "Glass Jar / Jar Lid",
    emoji: "🫙",
    category: "recyclable",
    bin: "recyclable",
    decomp: "1 Million Years",
    co2: 0.30,
    water: 2.1,
    guidelines: [
      "Rinse glass thoroughly. Food residue creates odors and pests.",
      "Metal lids should be unscrewed and put in the metal recycle stream.",
      "Unlike ceramics, container glass melts easily and is 100% infinitely recyclable."
    ],
    tips: "Wash and reuse glass jars for storing bulk pantry staples like beans, grains, nuts, and spices."
  },
  {
    id: "aluminum_can",
    name: "Aluminum Soda Can",
    emoji: "🥫",
    category: "recyclable",
    bin: "recyclable",
    decomp: "100 Years",
    co2: 0.38,
    water: 4.8,
    guidelines: [
      "Ensure the can is entirely empty of liquids.",
      "Crushing is helpful but not mandatory. Do not remove the pull tab.",
      "Recycling aluminum saves 95% of the energy needed to make new metal from raw ore."
    ],
    tips: "Aluminum is highly valued by recyclers. Reclaim them to reduce global mining of raw bauxite."
  },
  {
    id: "broken_mug",
    name: "Broken Ceramic Mug",
    emoji: "☕",
    category: "landfill",
    bin: "landfill",
    decomp: "Indefinite",
    co2: -0.05,
    water: 0.0,
    guidelines: [
      "Wrap carefully in thick newspaper or bubble wrap before disposing.",
      "Label the wrapped item to protect sanitation workers from cuts.",
      "Ceramics melt at a higher temperature than bottle glass and will ruin glass recycle batches."
    ],
    tips: "Use broken ceramic pieces at the bottom of plant pots to improve water drainage."
  },
  {
    id: "led_bulb",
    name: "LED Lightbulb",
    emoji: "💡",
    category: "hazardous",
    bin: "hazardous",
    decomp: "20 Years",
    co2: 0.20,
    water: 2.0,
    guidelines: [
      "LED bulbs contain electronic components and micro-circuitry.",
      "Take them to a local e-waste or hazardous waste collection drive.",
      "Avoid crushing as fractured glass can cause micro-electronic dust dispersion."
    ],
    tips: "Purchase high-quality bulbs with long lifespan ratings (25,000+ hours) to minimize replacement rates."
  },
  {
    id: "smartphone",
    name: "Old Smartphone",
    emoji: "📱",
    category: "hazardous",
    bin: "hazardous",
    decomp: "1000 Years",
    co2: 5.20,
    water: 50.0,
    guidelines: [
      "Do not throw in household bins. Lithium battery inside is a combustion risk.",
      "Perform a factory reset to wipe all personal data before disposal.",
      "Hand over to verified electronics recycling programs or manufacturer trade-ins."
    ],
    tips: "If the phone still works, donate it to charities or sell it on refurbished marketplaces."
  },
  {
    id: "apple_core",
    name: "Apple Core",
    emoji: "🍎",
    category: "organic",
    bin: "organic",
    decomp: "2 Months",
    co2: 0.04,
    water: 0.1,
    guidelines: [
      "Compost at home or place in municipal yard/organic waste bins.",
      "Keep seeds included; they decompose naturally in compost piles.",
      "Do not let it sit in airtight plastic bags where it decays into greenhouse gases."
    ],
    tips: "Apple scraps can be simmered with water, sugar, and cinnamon to make delicious apple jelly."
  },
  {
    id: "pizza_box",
    name: "Greasy Pizza Box",
    emoji: "🍕",
    category: "landfill",
    bin: "landfill",
    decomp: "2 Months",
    co2: -0.08,
    water: 0.0,
    guidelines: [
      "Tear off clean sections (usually the top lid) and recycle them.",
      "Put grease-soaked cardboard (bottom) in the landfill bin or organic compost.",
      "Food oil ruins paper recycling batches by preventing paper fibers from binding."
    ],
    tips: "You can place grease-laden cardboard in home compost bins, provided you tear it into small shreds."
  },
  {
    id: "steel_can",
    name: "Steel Soup Can",
    emoji: "🥫",
    category: "recyclable",
    bin: "recyclable",
    decomp: "50 Years",
    co2: 0.28,
    water: 3.5,
    guidelines: [
      "Rinse off sauce residues inside the container.",
      "Push the detached lid inside the can to prevent safety cuts during sorting.",
      "Steel is magnetic, making it one of the easiest metals for sorting plants to separate."
    ],
    tips: "Clean steel cans make excellent DIY desk pencil holders, paint organizers, or bird feeders."
  },
  {
    id: "eggshells",
    name: "Eggshells",
    emoji: "🥚",
    category: "organic",
    bin: "organic",
    decomp: "1 Month",
    co2: 0.03,
    water: 0.1,
    guidelines: [
      "Crush shells slightly to speed up decomposition in compost piles.",
      "Wash egg residues out if you want to avoid attracting pests.",
      "Adds valuable calcium to the compost mixture, which plants love."
    ],
    tips: "Crushed eggshells sprinkled around the base of plants act as an organic deterrent for snails and slugs."
  },
  {
    id: "plastic_bag",
    name: "Plastic Grocery Bag",
    emoji: "🛍️",
    category: "landfill",
    bin: "landfill",
    decomp: "20 Years",
    co2: -0.06,
    water: 0.0,
    guidelines: [
      "Throw in general landfill bins OR bring to grocery bag collection boxes.",
      "Do not put in curbside recycle bins. Soft plastic wraps jam sorting machinery.",
      "Avoid reusing if they have holes or leaks."
    ],
    tips: "Switch to long-lasting canvas bags. Keep a few bags folded inside your car or backpack."
  },
  {
    id: "medicine_blister",
    name: "Medicine Blister Pack",
    emoji: "💊",
    category: "landfill",
    bin: "landfill",
    decomp: "100+ Years",
    co2: -0.04,
    water: 0.0,
    guidelines: [
      "Discard in the general landfill container.",
      "Blister packs consist of aluminum fused to plastic, which cannot be separated.",
      "Ensure all pills are removed before tossing the pack."
    ],
    tips: "Certain pharmacies offer specialty recycling programs for empty blister packets."
  },
  {
    id: "magazine",
    name: "Glossy Magazine",
    emoji: "📖",
    category: "recyclable",
    bin: "recyclable",
    decomp: "1 Year",
    co2: 0.12,
    water: 1.8,
    guidelines: [
      "Put in paper recycling bin. Glossy clay-coatings on magazines are recyclable.",
      "Remove plastic wrap or adhesive sample inserts before throwing.",
      "Keep dry to preserve fiber quality."
    ],
    tips: "Donate magazines to schools, doctors' waiting rooms, or libraries instead of recycling them immediately."
  },
  {
    id: "used_napkin",
    name: "Used Paper Napkin",
    emoji: "🧻",
    category: "landfill",
    bin: "landfill",
    decomp: "1 Month",
    co2: -0.02,
    water: 0.0,
    guidelines: [
      "Place soiled paper napkins and tissues in the general waste bin.",
      "Soiled paper contains food fats and body fluids which contaminate paper pulp.",
      "If you home compost, unsoiled paper tissues can be thrown in the compost bin."
    ],
    tips: "Swap out single-use paper napkins for washable cloth napkins for daily family dinners."
  },
  {
    id: "aerosol_can",
    name: "Aerosol Spray Can",
    emoji: "💨",
    category: "hazardous",
    bin: "hazardous",
    decomp: "50 Years",
    co2: 0.25,
    water: 2.8,
    guidelines: [
      "Ensure the can is completely empty by spraying until nothing comes out.",
      "Do not puncture or incinerate the can; pressurized contents can explode.",
      "If empty, check local rules; some accept it in metal recycle, others count it as hazardous."
    ],
    tips: "Choose pump spray alternatives or non-aerosol formulations when purchasing personal care products."
  },
  {
    id: "yard_waste",
    name: "Dead Leaves & Twigs",
    emoji: "🍂",
    category: "organic",
    bin: "organic",
    decomp: "3 Months",
    co2: 0.04,
    water: 0.2,
    guidelines: [
      "Compost or put in the brown/green yard trimmings waste container.",
      "Tear branches down to smaller sizes to keep collection bins neat.",
      "Do not combine with stones, metal wires, or gravel."
    ],
    tips: "Use leaves as an organic mulch layer in flower beds to suppress weeds and retain soil moisture."
  },
  {
    id: "old_jeans",
    name: "Old Cotton Jeans",
    emoji: "👖",
    category: "landfill",
    bin: "landfill",
    decomp: "40 Years",
    co2: -0.30,
    water: 0.0,
    guidelines: [
      "Dispose in general trash if completely shredded and unwearable.",
      "Polyester thread stitching and metal zippers prevent easy fabric recycling.",
      "Try textile collection programs before using general landfill."
    ],
    tips: "Repurpose old jeans into heavy-duty shop rags, denim insulation, or cute patches for other clothes."
  },
  {
    id: "thermometer",
    name: "Mercury Thermometer",
    emoji: "🌡️",
    category: "hazardous",
    bin: "hazardous",
    decomp: "Indefinite",
    co2: 1.20,
    water: 30.0,
    guidelines: [
      "CRITICAL: Contains liquid mercury, a highly toxic neurotoxin.",
      "If broken, do not vacuum. Sweep up wearing gloves and seal in a glass jar.",
      "Bring directly to a hazardous chemical disposal center immediately."
    ],
    tips: "Swap to safe digital thermometers that do not contain mercury or hazardous fluids."
  },
  {
    id: "expired_medicine",
    name: "Expired Medicine",
    emoji: "💊",
    category: "hazardous",
    bin: "hazardous",
    decomp: "15 Years",
    co2: 0.50,
    water: 5.0,
    guidelines: [
      "Do NOT flush down the toilet or sink. Antibiotics pollute groundwater systems.",
      "Keep pills inside their original packaging bottles.",
      "Drop them off at pharmacies participating in safe medicine disposal programs."
    ],
    tips: "Check your medicine chest bi-annually and only purchase non-prescription medication in quantities you need."
  },
  {
    id: "dirty_diaper",
    name: "Disposable Diaper",
    emoji: "🚼",
    category: "landfill",
    bin: "landfill",
    decomp: "500 Years",
    co2: -0.50,
    water: 0.0,
    guidelines: [
      "Wrap soiled diaper tightly and seal it in a disposal bag.",
      "Throw in general landfill trash bin. Contains pathogenetic bacteria.",
      "Never put diapers in compost or recyclable paper bins."
    ],
    tips: "Consider reusable cloth diapers. They save thousands of diapers from entering landfill systems per child."
  },
  {
    id: "coffee_grounds",
    name: "Coffee Grounds",
    emoji: "☕",
    category: "organic",
    bin: "organic",
    decomp: "1 Month",
    co2: 0.05,
    water: 0.2,
    guidelines: [
      "Place directly in compost or garden soil.",
      "Rich in nitrogen, making them a fantastic fertilizer helper.",
      "Discard coffee filter papers in compost only if they are unbleached paper."
    ],
    tips: "Mix coffee grounds directly with topsoil to feed acid-loving plants like roses, blueberries, and hydrangeas."
  },
  {
    id: "bubble_wrap",
    name: "Bubble Wrap Sheet",
    emoji: "🫧",
    category: "landfill",
    bin: "landfill",
    decomp: "500 Years",
    co2: -0.08,
    water: 0.0,
    guidelines: [
      "Throw in general landfill bins.",
      "Similar to plastic bags, it jams sorting rotating drums in recycle plants.",
      "Can be dropped at grocery stores along with other soft film plastics."
    ],
    tips: "Pop carefully and reuse bubble wrap sheets for packing fragile items when moving houses."
  },
  {
    id: "newspaper",
    name: "Newspaper",
    emoji: "📰",
    category: "recyclable",
    bin: "recyclable",
    decomp: "6 Weeks",
    co2: 0.18,
    water: 2.5,
    guidelines: [
      "Place in the paper recycling bin.",
      "Keep dry; wet newspaper can clog sorting machines and degrade fibers.",
      "Remove any plastic delivery sleeves or rubber bands before recycling."
    ],
    tips: "Use old newspapers for cleaning windows (leaves no streaks), lining drawers, or as carbon-rich brown material in composting."
  },
  {
    id: "milk_bag",
    name: "Plastic Milk Bag / Pouch",
    emoji: "🥛",
    category: "recyclable",
    bin: "recyclable",
    decomp: "500 Years",
    co2: 0.08,
    water: 1.5,
    guidelines: [
      "Rinse the inside thoroughly with water to remove all milk residues (prevents odors and contamination).",
      "Check local municipal rules: some accept clean milk bags in soft plastic drop-offs or curbside recycling.",
      "Cut open and dry completely before placing in the recycling bin."
    ],
    tips: "Consider buying milk in returnable glass bottles or cardboard cartons to reduce single-use soft plastic packaging."
  }
];
