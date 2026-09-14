// -----------------------------------------------------------------------------
// Long-form buying guides for the product detail pages, keyed by slug.
//
// Why this exists: Search Console listed most product pages as "not indexed".
// Each page had ~50 words of its own — the rest was header, footer and the
// same product cards repeated on every page — so Google saw seven near-identical
// thin pages and declined to index them. These guides give every page real,
// useful, page-specific content (sizes, how to check quality, what drives the
// rate, FAQs) written around what people in Patna actually search for.
//
// Rules for editing this file:
//  - Never state a price. Rates change daily and the business is "Call for
//    Price"; the pages explain what the rate depends on instead.
//  - Never claim a brand, grade, size or delivery area that the shop doesn't
//    confirm. Phrase stock-dependent things as "call to confirm".
//  - Iron rods are "iron rods / sariya / chhad" — not "TMT" (owner's wording).
//
// Products added later from the admin panel without an entry here still render
// fine — the page just falls back to the shorter template.
// -----------------------------------------------------------------------------

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Simple two-column table, e.g. rod diameter → weight. */
  table?: { head: [string, string]; rows: [string, string][] };
};

export type ProductGuide = {
  /** <title> (the site template appends " | Kamakhya Traders"). */
  title: string;
  metaDescription: string;
  /** Visible H1. */
  h1: string;
  /** Opening paragraph under the H1 area. */
  intro: string;
  /** One or two sentences in Hindi for Devanagari searches. */
  hindi: string;
  keywords: string[];
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
};

/** Bump when the wording below changes — feeds sitemap <lastmod>. */
export const GUIDES_UPDATED = '2026-09-14T00:00:00.000Z';

export const productGuides: Record<string, ProductGuide> = {
  cement: {
    title: 'Cement Dealer in Danapur, Patna — Today’s Cement Rate',
    metaDescription:
      'Cement dealer in Danapur, Patna — PPC & OPC cement (UltraTech and more) in 50 kg bags, for home builders and contractors. Shop at Neora, near Railway Gumti. Call for today’s cement rate.',
    h1: 'Cement Dealer in Danapur, Patna',
    intro:
      'Looking for a cement shop in Danapur? Kamakhya Traders supplies fresh, correctly weighed 50 kg cement bags from our shop at Neora, near Railway Gumti — a few bags for repair work or a full load for a building site. We keep PPC and OPC cement, including UltraTech, and can tell you which type suits your job before you buy.',
    hindi:
      'दानापुर, पटना में सीमेंट की दुकान — PPC और OPC सीमेंट (50 किलो बैग)। आज का सीमेंट रेट जानने के लिए कॉल करें।',
    keywords: [
      'cement dealer in Danapur',
      'cement shop Danapur Patna',
      'cement rate today Patna',
      'cement price in Patna',
      'cement ka rate Patna',
      'UltraTech cement dealer Danapur',
      'PPC cement Patna',
      'OPC 53 grade cement Patna',
      'cement wholesaler Danapur',
      'सीमेंट का रेट पटना',
      'सीमेंट दुकान दानापुर',
    ],
    sections: [
      {
        heading: 'PPC or OPC — which cement should you buy?',
        paragraphs: [
          'Most house construction in Patna uses PPC (Portland Pozzolana Cement). It gains strength a little more slowly, but it gives a denser, more crack-resistant finish, which is why masons prefer it for plastering, brickwork and general RCC work.',
          'OPC (Ordinary Portland Cement), in 43 and 53 grade, sets and gains strength faster. It is chosen where early strength matters — for example when shuttering has to come off sooner — and it needs proper curing because it gives off more heat while setting.',
        ],
        bullets: [
          'Plaster, brickwork, flooring: PPC',
          'Slabs, beams, columns for a house: PPC is widely used; OPC 53 where faster strength is needed',
          'Not sure? Tell us the work and we will suggest the right bag',
        ],
      },
      {
        heading: 'How to check cement before you use it',
        bullets: [
          'Look at the manufacturing date printed on the bag — fresher is better, and cement loses strength the longer it sits.',
          'Press the bag: it should feel smooth and powdery, with no hard lumps inside.',
          'Store bags on a raised wooden platform or plastic sheet, away from walls and damp floors, and cover them before rain.',
          'Stack no more than about 10 bags high so the bottom bags don’t compact.',
        ],
      },
      {
        heading: 'What decides today’s cement rate in Patna',
        paragraphs: [
          'Cement prices move with the brand, the type (PPC or OPC), how many bags you take and how far the load has to travel. Bulk orders for a site usually get a better per-bag rate than a few loose bags. That is why we don’t print a fixed price — call or WhatsApp us and we will give you the current rate for your quantity.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the cement rate today in Danapur?',
        a: 'It changes with the brand, type and quantity, so call us on the number above for today’s rate. Tell us how many bags you need and we will quote for that quantity.',
      },
      {
        q: 'Do you have UltraTech cement?',
        a: 'Yes, we supply UltraTech PPC and OPC cement along with other brands. Call to confirm the brand and grade in stock on the day.',
      },
      {
        q: 'Can I buy just a few bags?',
        a: 'Yes. We sell to homeowners buying a few bags for repair work as well as contractors buying in bulk.',
      },
      {
        q: 'Do you deliver cement to Khagaul, Bihta or Phulwari Sharif?',
        a: 'We supply across Danapur and nearby parts of Patna including Neora, Khagaul, Bihta and Phulwari Sharif. Call with your site location and we will confirm delivery.',
      },
    ],
  },

  'iron-rods': {
    title: 'Sariya (Iron Rod) Dealer in Danapur, Patna — Today’s Rate',
    metaDescription:
      'Iron rods (sariya / chhad) in Danapur, Patna — commonly used diameters for columns, beams, slabs & foundations. Weight chart per rod inside. Shop at Neora, near Railway Gumti. Call for today’s sariya rate.',
    h1: 'Sariya (Iron Rod) Dealer in Danapur, Patna',
    intro:
      'Kamakhya Traders supplies iron rods — sariya, or chhad — for house construction in Danapur and across Patna. Whether you need a few rods for a boundary wall or tonnes for a building, tell us the diameter and quantity and we will give you the rate by the kg or tonne.',
    hindi:
      'दानापुर, पटना में सरिया (छड़) डीलर — कॉलम, बीम, छत और नींव के लिए। आज का सरिया रेट जानने के लिए कॉल करें।',
    keywords: [
      'sariya dealer Danapur',
      'sariya rate today Patna',
      'sariya ka rate Patna',
      'iron rod price in Patna',
      'iron rod dealer Danapur',
      'chhad ka rate Patna',
      '12mm sariya weight',
      'sariya weight per piece',
      'सरिया का रेट पटना',
      'छड़ का रेट दानापुर',
    ],
    sections: [
      {
        heading: 'Which sariya size goes where',
        paragraphs: [
          'The size of iron rod is set by the structural drawing, and your engineer or mason should always have the final say. As a general guide, this is how the common diameters are used in house construction:',
        ],
        bullets: [
          '8 mm — rings / stirrups in columns and beams',
          '10 mm — slab bars and lighter beams',
          '12 mm — slabs, beams and columns in most houses',
          '16 mm and above — main bars in columns, footings and larger beams',
        ],
      },
      {
        heading: 'Sariya weight chart — kg per metre and per 12 m rod',
        paragraphs: [
          'Iron rods are sold by weight, so it helps to know how many kilograms you are getting. Weight per metre is calculated as diameter² ÷ 162 (diameter in mm). A standard rod is about 12 metres (roughly 40 feet) long.',
        ],
        table: {
          head: ['Diameter', 'Approx. weight (per metre / per 12 m rod)'],
          rows: [
            ['8 mm', '0.395 kg/m — about 4.7 kg per rod'],
            ['10 mm', '0.617 kg/m — about 7.4 kg per rod'],
            ['12 mm', '0.889 kg/m — about 10.7 kg per rod'],
            ['16 mm', '1.58 kg/m — about 19 kg per rod'],
            ['20 mm', '2.47 kg/m — about 29.6 kg per rod'],
          ],
        },
      },
      {
        heading: 'How to check iron rods on delivery',
        bullets: [
          'Rods should be straight and uniformly ribbed along their full length.',
          'Light surface rust is normal; flaking rust or pitting is not.',
          'Bend a short piece: good rod bends without cracking on the outside of the bend.',
          'Weigh a bundle, or count rods and check against the weight chart above.',
        ],
      },
      {
        heading: 'What decides the sariya rate',
        paragraphs: [
          'Steel prices move almost daily with the market, and the rate also depends on diameter, quantity and delivery distance. Call us with your size-wise requirement and we will quote the current rate per kg or per tonne.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the sariya rate today in Patna?',
        a: 'Steel rates change almost every day. Call or WhatsApp us with the diameter and quantity and we will give you today’s rate.',
      },
      {
        q: 'How many kg is one 12 mm sariya rod?',
        a: 'A 12 mm rod weighs about 0.889 kg per metre, so a standard 12 m rod is roughly 10.7 kg.',
      },
      {
        q: 'Which sizes do you keep?',
        a: 'We keep the diameters most used in house construction. Call to confirm the sizes in stock before you come.',
      },
      {
        q: 'Do you sell iron rods in small quantities?',
        a: 'Yes — from a few rods for small jobs to large site orders.',
      },
    ],
  },

  'stone-chips': {
    title: 'Gitti (Stone Chips) Supplier in Danapur, Patna — 10 mm & 20 mm',
    metaDescription:
      'Gitti / stone chips supplier in Danapur, Patna — clean, graded 10 mm and 20 mm crushed stone for concrete, slabs and columns. Sold by CFT or tractor load. Call for today’s gitti rate.',
    h1: 'Gitti (Stone Chips) Supplier in Danapur, Patna',
    intro:
      'Good concrete needs clean, properly sized gitti. Kamakhya Traders supplies crushed stone chips in the common 10 mm and 20 mm sizes to homes and building sites in Danapur, Neora, Khagaul, Bihta and the rest of Patna — by the CFT or by the tractor load.',
    hindi:
      'दानापुर, पटना में गिट्टी (स्टोन चिप्स) सप्लायर — 10 mm और 20 mm गिट्टी, CFT या ट्रैक्टर के हिसाब से। आज का गिट्टी रेट जानने के लिए कॉल करें।',
    keywords: [
      'gitti supplier Danapur',
      'gitti rate Patna',
      'gitti price in Patna',
      '20mm gitti price Patna',
      'stone chips price in Patna',
      'stone chips supplier Danapur',
      'gitti per cft rate Patna',
      'गिट्टी का रेट पटना',
      'गिट्टी सप्लायर दानापुर',
    ],
    sections: [
      {
        heading: '10 mm or 20 mm gitti — which one do you need?',
        bullets: [
          '20 mm gitti — the standard size for RCC slabs, beams, columns and footings in house construction.',
          '10 mm gitti — for thin sections, lintels, precast work, and mixed with 20 mm for a better-packed concrete.',
          'Larger sizes (such as 40 mm) are used for PCC base layers and road work — ask us if you need them.',
        ],
      },
      {
        heading: 'How to check gitti quality',
        bullets: [
          'Pieces should be angular and cube-like, not flat or long and flaky — flaky chips make weaker concrete.',
          'There should be very little dust or mud. Rub a handful between your palms: clean gitti leaves little powder behind.',
          'Size should be consistent — a load of 20 mm should not be full of fine chips or big lumps.',
        ],
      },
      {
        heading: 'Buying by CFT or tractor load',
        paragraphs: [
          'Gitti is usually sold by the cubic foot (CFT) or by the tractor or truck load. Measure the loaded trolley (length × width × height in feet) to check the CFT you are getting. Tell us the area and thickness of your slab or floor and we can help you estimate how much gitti to order, so you don’t pay for a second trip.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the gitti rate in Patna today?',
        a: 'It depends on size, quantity and delivery distance. Call us with your requirement for today’s rate.',
      },
      {
        q: 'Which gitti is used for a roof slab?',
        a: '20 mm gitti is the usual choice for house slabs, sometimes combined with 10 mm. Follow your engineer’s mix design.',
      },
      {
        q: 'Do you deliver gitti by tractor?',
        a: 'Yes, we supply by the tractor load across Danapur and nearby areas. Call with your site location to confirm.',
      },
    ],
  },

  sand: {
    title: 'Balu (Sand) Supplier in Danapur, Patna — Today’s Balu Rate',
    metaDescription:
      'Balu / sand supplier in Danapur, Patna — clean, low-silt sand for plaster, brickwork and concrete. Fine and coarse sand by CFT or tractor load. Call for today’s balu rate.',
    h1: 'Balu (Sand) Supplier in Danapur, Patna',
    intro:
      'Kamakhya Traders supplies balu for plastering, brickwork and concrete to sites across Danapur and Patna. We screen our sand to keep silt and rubbish low, and we stock both fine sand for finishing and coarse sand for masonry and concrete.',
    hindi:
      'दानापुर, पटना में बालू सप्लायर — प्लास्टर, ईंट जोड़ाई और ढलाई के लिए साफ़ बालू। आज का बालू रेट जानने के लिए कॉल करें।',
    keywords: [
      'balu supplier Danapur',
      'balu rate Patna',
      'balu rate today Patna',
      'sand price in Patna',
      'sand supplier Danapur Patna',
      'sand price per cft Patna',
      'lal balu Patna',
      'बालू का रेट पटना',
      'बालू सप्लायर दानापुर',
    ],
    sections: [
      {
        heading: 'Fine sand or coarse sand?',
        bullets: [
          'Fine sand — for internal and external plaster, where a smooth finish matters.',
          'Coarse sand — for concrete (with cement and gitti) and for brickwork mortar, where strength matters.',
          'Many buyers in Patna ask for a particular balu by name, such as lal balu. Tell us what you want and we will confirm what is available that day.',
        ],
      },
      {
        heading: 'A simple silt test you can do at site',
        paragraphs: [
          'Too much silt (mud) in sand weakens plaster and concrete and causes cracks. To check: fill a clear glass bottle about halfway with sand, add water until it is three-quarters full, add a pinch of salt, shake well and leave it for a few hours. The silt settles as a separate layer on top of the sand. A thin layer is fine; a thick layer of mud means the sand needs washing or should be rejected.',
        ],
      },
      {
        heading: 'Why the balu rate changes',
        paragraphs: [
          'Sand is one of the most changeable prices in Bihar. Rates depend on the type of sand, quantity and transport distance, and they often rise during the monsoon months when river sand mining is restricted. If you have a big job coming up, ask us about ordering before the rains. Call for the current rate.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the balu rate today in Danapur?',
        a: 'Sand prices change often, especially around the monsoon. Call or WhatsApp us for today’s rate for your quantity.',
      },
      {
        q: 'Which sand is best for plaster?',
        a: 'Fine, clean sand with low silt gives the smoothest plaster. Coarse sand is better for concrete and brickwork.',
      },
      {
        q: 'Can you deliver a tractor of balu to my site?',
        a: 'Yes, we deliver across Danapur and nearby parts of Patna. Call with your location to confirm.',
      },
    ],
  },

  bricks: {
    title: 'Eet (Red Bricks) Supplier in Danapur, Patna — Bulk Bricks',
    metaDescription:
      'Red clay bricks (eet) supplier in Danapur, Patna — well-fired bricks for walls, boundary walls and masonry, sold per 1000 in bulk. How to check brick quality inside. Call for today’s eet rate.',
    h1: 'Eet (Red Bricks) Supplier in Danapur, Patna',
    intro:
      'Kamakhya Traders supplies well-fired red clay bricks — eet — for house walls, boundary walls and partitions in Danapur, Neora, Khagaul, Bihta and across Patna. Bricks are sold in bulk, usually per 1000, with consistent quality load after load.',
    hindi:
      'दानापुर, पटना में लाल ईंट सप्लायर — दीवार और बाउंड्री के लिए पकी हुई मज़बूत ईंट, हज़ार के हिसाब से। आज का ईंट रेट जानने के लिए कॉल करें।',
    keywords: [
      'bricks supplier Danapur',
      'eet supplier Danapur Patna',
      'bricks price in Patna',
      'eet ka rate Patna',
      'red bricks Patna',
      'red bricks price per 1000 Patna',
      'brick dealer Danapur',
      'ईंट का रेट पटना',
      'ईंट सप्लायर दानापुर',
    ],
    sections: [
      {
        heading: 'How to check brick quality',
        paragraphs: ['A few quick checks at site tell you a lot about a load of bricks:'],
        bullets: [
          'Colour: an even, deep red means the brick is properly fired. Pale or yellowish bricks are under-burnt and weak.',
          'Sound: strike two bricks together — a clear, ringing sound is good; a dull thud means poor firing.',
          'Shape: edges should be straight and sharp, with flat faces, so walls go up true with less mortar.',
          'Strength: a good brick dropped flat from about waist height onto hard ground should not break.',
          'Soak test: a good brick should not absorb a lot of water or crumble after soaking.',
        ],
      },
      {
        heading: 'Planning how many bricks to order',
        paragraphs: [
          'The number of bricks depends on the wall thickness (a 9-inch main wall uses roughly twice as many bricks per square foot as a 4.5-inch partition), openings for doors and windows, and wastage during handling. Share your wall lengths and heights, or your mason’s estimate, and we will help you order in sensible loads.',
        ],
      },
      {
        heading: 'What decides the eet rate',
        paragraphs: [
          'Brick prices depend on the grade (first class or second class), the season at the kilns, quantity and delivery distance. Call us for the current rate per 1000.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the brick rate in Patna today?',
        a: 'It depends on grade, quantity and delivery distance. Call us for today’s rate per 1000 bricks.',
      },
      {
        q: 'Do you sell bricks in small quantities?',
        a: 'Bricks are mainly supplied in bulk for construction. Call and tell us how many you need.',
      },
      {
        q: 'How do I know the bricks are well fired?',
        a: 'Look for an even red colour and a ringing sound when two bricks are struck together. Under-burnt bricks look pale and sound dull.',
      },
    ],
  },

  bamboo: {
    title: 'Bamboo (Baans) Supplier in Danapur, Patna — Scaffolding & Centering',
    metaDescription:
      'Bamboo (baans) supplier in Danapur, Patna — strong, straight bamboo for scaffolding, slab centering / shuttering support and temporary sheds. Sold per piece. Call for today’s rate.',
    h1: 'Bamboo (Baans) Supplier in Danapur, Patna',
    intro:
      'On most building sites in Patna, bamboo still does the heavy lifting — scaffolding for plaster and paint, and props under the shuttering when a slab is cast. Kamakhya Traders supplies strong, straight baans in useful lengths and thicknesses, sold per piece.',
    hindi:
      'दानापुर, पटना में बाँस सप्लायर — पाड़ (स्कैफोल्डिंग), छत की सेंटरिंग और अस्थायी ढांचे के लिए मज़बूत, सीधे बाँस।',
    keywords: [
      'bamboo supplier Danapur',
      'bamboo supplier Patna',
      'baans for scaffolding Patna',
      'bamboo for centering Patna',
      'bamboo ballies Patna',
      'bamboo price Patna',
      'बाँस सप्लायर पटना',
      'सेंटरिंग बाँस दानापुर',
    ],
    sections: [
      {
        heading: 'Where bamboo is used on a building site',
        bullets: [
          'Scaffolding (paad) — for brickwork, plastering and painting on upper floors.',
          'Slab centering / shuttering support — vertical props under plywood or steel plates while the concrete sets.',
          'Temporary structures — site sheds, covers, fencing and pandals.',
        ],
      },
      {
        heading: 'How to choose good bamboo',
        bullets: [
          'Straight poles with no bends — props under a slab must stand true.',
          'No long cracks or splits running along the pole.',
          'Mature, dry bamboo feels heavy and hard; green or soft bamboo bends under load.',
          'Check for insect holes or powdery patches, which weaken the pole.',
          'Pick thickness for the job: thicker poles for slab props, lighter poles for scaffolding ties.',
        ],
      },
      {
        heading: 'Ordering bamboo',
        paragraphs: [
          'Tell us the number of pieces, the length you need and what it is for (props or scaffolding), and we will quote a rate per piece. For slab work, order along with your plywood and other shuttering material so everything is on site before casting day.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you sell bamboo for slab centering?',
        a: 'Yes. We supply bamboo for centering / shuttering support as well as for scaffolding.',
      },
      {
        q: 'How is bamboo priced?',
        a: 'Per piece, depending on length and thickness. Call us for today’s rate.',
      },
      {
        q: 'Can I buy plywood and bamboo together for shuttering?',
        a: 'Yes — we supply both, so you can order your shuttering material from one shop.',
      },
    ],
  },

  plywood: {
    title: 'Plywood Dealer in Danapur, Patna — Shuttering & Furniture Ply',
    metaDescription:
      'Plywood dealer in Danapur, Patna — all types of ply for shuttering / centering, furniture, doors and interiors. Help choosing grade and thickness. Shop at Neora, near Railway Gumti. Call for today’s plywood rate.',
    h1: 'Plywood Dealer in Danapur, Patna',
    intro:
      'Kamakhya Traders keeps all types of plywood — palai — for both site work and interiors: shuttering ply for casting slabs and beams, and board for furniture, doors and panelling. Come to our shop in Danapur or call us, tell us the job, and we will help you pick the right grade and thickness.',
    hindi:
      'दानापुर, पटना में प्लाई (पलाई) डीलर — शटरिंग / सेंटरिंग प्लाई और फर्नीचर के लिए हर तरह की प्लाई। आज का रेट जानने के लिए कॉल करें।',
    keywords: [
      'plywood dealer Danapur',
      'plywood shop Danapur Patna',
      'shuttering plywood Patna',
      'shuttering plywood Danapur',
      'plywood price in Patna',
      'furniture plywood Patna',
      'centering plywood Patna',
      'प्लाई डीलर दानापुर',
      'शटरिंग प्लाई पटना',
    ],
    sections: [
      {
        heading: 'Types of plywood and where to use them',
        bullets: [
          'Shuttering plywood — for casting slabs, beams and columns. Made with water-resistant bonding so it can be reused over several pours.',
          'Commercial / MR (moisture-resistant) plywood — for indoor furniture, wardrobes and wall panelling in dry areas.',
          'BWR / BWP (boiling-water-resistant / proof) plywood — for kitchens, bathroom cabinets and anywhere that sees water.',
        ],
      },
      {
        heading: 'Choosing thickness',
        paragraphs: [
          'Plywood sheets are commonly 8 × 4 feet. Thinner sheets (4–6 mm) are used for backing and panelling, 12 mm for shuttering and cabinet sides, and 18–19 mm for strong furniture such as beds, wardrobes and tabletops. Ask us before you buy — the right thickness saves money and lasts longer.',
        ],
      },
      {
        heading: 'Making shuttering ply last longer',
        bullets: [
          'Apply shuttering oil before every pour so concrete releases cleanly.',
          'Clean off concrete after de-shuttering and store sheets flat, off the ground and out of the rain.',
          'Seal cut edges so water doesn’t get into the layers.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you have shuttering plywood?',
        a: 'Yes. We supply plywood for shuttering / centering work as well as for furniture and interiors.',
      },
      {
        q: 'Which plywood is best for a kitchen?',
        a: 'Use BWR or BWP grade plywood wherever it may get wet, such as kitchens and bathrooms.',
      },
      {
        q: 'What is the plywood price in Patna?',
        a: 'It depends on type, grade and thickness. Call us with your requirement for today’s rate per sheet.',
      },
    ],
  },
};

export function getProductGuide(slug: string): ProductGuide | undefined {
  return productGuides[slug];
}
