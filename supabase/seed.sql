-- =============================================================================
-- Kamakhya Traders — seed the default product catalogue.
-- Run AFTER schema.sql. Safe to re-run (skips existing slugs).
-- =============================================================================

insert into public.products
  (slug, name, name_hindi, category, summary, description, uses, unit, price_label, image, image_alt, in_stock, badge, sort_order)
values
  ('cement', 'Cement', 'सीमेंट', 'Cement',
   'Branded PPC & OPC cement (UltraTech and more) for strong, lasting construction.',
   'We supply top-brand cement including UltraTech PPC (Portland Pozzolana Cement) and OPC grades. Ideal for foundations, RCC work, plastering, and brickwork. Fresh stock, correct weight, and fair rates for both retail buyers and bulk contractors.',
   array['Foundations & RCC','Plastering','Brickwork & masonry','Flooring'],
   'Bag (50 kg)', 'Negotiable', '/images/products/cement.svg', 'Stacked bags of branded cement', true, 'Best Seller', 100),

  ('iron-rods', 'Iron Rods', 'छड़', 'Iron & Steel',
   'High-strength iron rods (sariya) for strong, safe structural work.',
   'Quality iron rods / bars (chhad) in commonly used sizes for columns, beams, slabs and foundations. Strong, well-finished, and reliably sourced so your structure stays safe for decades. Available for small jobs and large site orders.',
   array['Columns & pillars','Beams & slabs','Foundations','Reinforcement work'],
   'Per Kg / Tonne', 'Negotiable', '/images/products/iron-rods.svg', 'Bundle of iron reinforcement rods', true, 'In Stock', 95),

  ('stone-chips', 'Stone Chips (Gitti)', 'गिट्टी', 'Aggregates',
   'Clean, graded crushed stone chips for high-grade concrete.',
   'Uniformly graded crushed stone aggregates (gitti) in common sizes such as 10 mm and 20 mm. Clean and strong — essential for durable concrete in slabs, columns and road work. Supplied by the required quantity for homes and large projects alike.',
   array['Concrete mixing','RCC slabs & columns','Road & flooring base'],
   'Per CFT / Tractor', 'Negotiable', '/images/products/stone-chips.svg', 'Pile of crushed grey stone chips', true, 'In Stock', 90),

  ('sand', 'Sand (Balu)', 'बालू', 'Aggregates',
   'Clean river sand, low in silt — perfect for plaster and concrete.',
   'Good quality river sand (balu), screened to keep it low in silt and impurities. Suitable for plastering, mortar and concrete work. We supply both fine sand for finishing and coarse sand for masonry.',
   array['Plastering & finishing','Mortar for brickwork','Concrete mixing'],
   'Per CFT / Tractor', 'Negotiable', '/images/products/sand.svg', 'Heap of fine river sand', true, 'In Stock', 85),

  ('bricks', 'Bricks (Eet)', 'ईंट', 'Bricks & Blocks',
   'Strong, well-fired red clay bricks for durable walls.',
   'Well-fired red clay bricks (eet) with good shape and strength for long-lasting walls and masonry. Available in bulk for construction projects, with consistent quality load after load.',
   array['Wall construction','Boundary walls','Masonry & partitions'],
   'Per 1000 pcs', 'Negotiable', '/images/products/bricks.svg', 'Stack of red clay bricks', true, 'Bulk Available', 80),

  ('bamboo', 'Bamboo (Baans)', 'बाँस', 'Construction Support',
   'Sturdy bamboo for scaffolding, shuttering support and site work.',
   'Strong, straight bamboo (baans) used for scaffolding, centering/shuttering support and general site work. Available in useful lengths and thicknesses for construction needs.',
   array['Scaffolding','Shuttering / centering support','Temporary structures'],
   'Per Piece', 'Negotiable', '/images/products/bamboo.svg', 'Bundle of bamboo poles', true, null, 75),

  ('plywood', 'Plywood', 'पलाई', 'Plywood & Boards',
   'All types of plywood available for construction and furniture.',
   'All types of plywood (palai) available — for shuttering/centering work as well as furniture and interior use. Come in and tell us the grade and thickness you need; we help you pick the right board for the job.',
   array['Shuttering / centering','Furniture & interiors','Doors & panels'],
   'Per Sheet', 'Negotiable', '/images/products/plywood.svg', 'Stacked sheets of plywood', true, 'All Types', 70)
on conflict (slug) do nothing;
