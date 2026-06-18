import { PrismaClient, ProductCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin user ──────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin@esmae2025!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@esmae.dz" },
    update: {},
    create: {
      name: "Esmae Admin",
      email: "admin@esmae.dz",
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
      locale: "ar",
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // ─── B2B demo user ───────────────────────────────────────────────────────
  const b2bHash = await bcrypt.hash("B2B@client2025!", 12);
  const b2bUser = await prisma.user.upsert({
    where: { email: "b2b@example.dz" },
    update: {},
    create: {
      name: "Studio Nord SARL",
      email: "b2b@example.dz",
      passwordHash: b2bHash,
      role: "B2B_CLIENT",
      locale: "fr",
    },
  });

  await prisma.b2BAccount.upsert({
    where: { userId: b2bUser.id },
    update: {},
    create: {
      userId: b2bUser.id,
      companyName: "Studio Nord SARL",
      taxId: "000123456789000",
      discountTier: 2,
      creditLimit: 500000,
      paymentTermsDays: 30,
      accountManagerNote:
        "Priority client. Monthly standing order for business cards and letterheads. Contact before any price changes.",
      isActive: true,
    },
  });
  console.log(`  ✓ B2B user: ${b2bUser.email}`);

  // ─── Products ────────────────────────────────────────────────────────────
  const products = [
    {
      slug: "business-cards-standard",
      category: ProductCategory.BUSINESS_STATIONERY,
      nameAr: "بطاقات الأعمال الكلاسيكية",
      nameEn: "Classic Business Cards",
      nameFr: "Cartes de visite classiques",
      descEn:
        "Premium business cards printed on 350gsm paper with optional finishes including matte, gloss, or soft-touch lamination.",
      basePrice: 3500,
      minQuantity: 100,
      sortOrder: 1,
    },
    {
      slug: "business-cards-premium",
      category: ProductCategory.BUSINESS_STATIONERY,
      nameAr: "بطاقات الأعمال الفاخرة",
      nameEn: "Luxury Business Cards",
      nameFr: "Cartes de visite de luxe",
      descEn:
        "Ultra-premium business cards with soft-touch lamination, spot UV, or gold foil stamping on 600gsm board.",
      basePrice: 7500,
      minQuantity: 100,
      sortOrder: 2,
    },
    {
      slug: "wedding-invitations",
      category: ProductCategory.WEDDING_EVENTS,
      nameAr: "دعوات الأفراح",
      nameEn: "Wedding Invitations",
      nameFr: "Invitations de mariage",
      descEn:
        "Exquisite wedding invitations crafted on premium paper with envelope, ribbon, and custom finishing options.",
      basePrice: 12000,
      minQuantity: 50,
      sortOrder: 1,
    },
    {
      slug: "product-boxes",
      category: ProductCategory.LUXURY_PACKAGING,
      nameAr: "علب المنتجات الفاخرة",
      nameEn: "Luxury Product Boxes",
      nameFr: "Boîtes produit de luxe",
      descEn:
        "Custom rigid and folding boxes for premium product packaging with foil, embossing, and varnish options.",
      basePrice: 25000,
      minQuantity: 50,
      sortOrder: 1,
    },
    {
      slug: "roll-up-banners",
      category: ProductCategory.LARGE_FORMAT,
      nameAr: "لافتات رول أب",
      nameEn: "Roll-Up Banners",
      nameFr: "Banners enrouleurs",
      descEn:
        "Professional retractable roll-up banners for exhibitions, events, and retail display. Durable aluminium stand included.",
      basePrice: 8500,
      minQuantity: 1,
      sortOrder: 1,
    },
    {
      slug: "company-letterhead",
      category: ProductCategory.BUSINESS_STATIONERY,
      nameAr: "ورق الرسائل الرسمي",
      nameEn: "Company Letterhead",
      nameFr: "En-tête de société",
      descEn:
        "Professional company letterhead on 100gsm premium paper, single or double-sided.",
      basePrice: 4500,
      minQuantity: 250,
      sortOrder: 3,
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, isActive: true },
    });

    // Add options for business cards
    if (p.slug === "business-cards-standard") {
      const options = [
        // Paper weight
        { key: "paper_weight", labelEn: "350gsm", labelAr: "٣٥٠ جم", labelFr: "350g", value: "350gsm", multiplier: 1.0, addedCost: 0, isDefault: true, sortOrder: 1 },
        { key: "paper_weight", labelEn: "400gsm", labelAr: "٤٠٠ جم", labelFr: "400g", value: "400gsm", multiplier: 1.15, addedCost: 0, isDefault: false, sortOrder: 2 },
        // Finish
        { key: "finish", labelEn: "No Lamination", labelAr: "بدون تغليف", labelFr: "Sans pelliculage", value: "none", multiplier: 1.0, addedCost: 0, isDefault: true, sortOrder: 1 },
        { key: "finish", labelEn: "Matte Lamination", labelAr: "تغليف مطفأ", labelFr: "Pelliculage mat", value: "matte", multiplier: 1.3, addedCost: 0, isDefault: false, sortOrder: 2 },
        { key: "finish", labelEn: "Gloss Lamination", labelAr: "تغليف لامع", labelFr: "Pelliculage brillant", value: "gloss", multiplier: 1.25, addedCost: 0, isDefault: false, sortOrder: 3 },
        { key: "finish", labelEn: "Soft Touch", labelAr: "لمسة ناعمة", labelFr: "Soft touch", value: "soft_touch", multiplier: 1.5, addedCost: 0, isDefault: false, sortOrder: 4 },
        // Sides
        { key: "sides", labelEn: "Single Sided", labelAr: "وجه واحد", labelFr: "Recto seul", value: "single", multiplier: 1.0, addedCost: 0, isDefault: true, sortOrder: 1 },
        { key: "sides", labelEn: "Double Sided", labelAr: "وجهان", labelFr: "Recto-verso", value: "double", multiplier: 1.2, addedCost: 0, isDefault: false, sortOrder: 2 },
      ];

      for (const opt of options) {
        await prisma.productOption.upsert({
          where: { productId_key_value: { productId: product.id, key: opt.key, value: opt.value } },
          update: {},
          create: { ...opt, productId: product.id, valueFr: opt.value, valueEn: opt.value, valueAr: opt.value },
        });
      }
    }

    console.log(`  ✓ Product: ${product.nameEn}`);
  }

  // ─── Quantity tiers ──────────────────────────────────────────────────────
  const tiers = [
    { minQty: 250, maxQty: 499, discountPct: 5, label: "Small bulk" },
    { minQty: 500, maxQty: 999, discountPct: 10, label: "Medium bulk" },
    { minQty: 1000, maxQty: 2499, discountPct: 15, label: "Large bulk" },
    { minQty: 2500, maxQty: null, discountPct: 20, label: "Wholesale" },
  ];

  for (const tier of tiers) {
    await prisma.quantityTier.create({ data: tier }).catch(() => {});
  }
  console.log(`  ✓ ${tiers.length} quantity tiers`);

  // ─── Pricing rules ───────────────────────────────────────────────────────
  await prisma.pricingRule.upsert({
    where: { id: "rule-b2b-default" },
    update: {},
    create: {
      id: "rule-b2b-default",
      name: "B2B Base Discount",
      ruleType: "b2b_tier",
      conditionJson: { isB2B: true },
      actionJson: { type: "percent_off", value: 5 },
      priority: 10,
      isActive: true,
    },
  });
  console.log("  ✓ Pricing rules");

  // ─── Portfolio items ─────────────────────────────────────────────────────
  const portfolioItems = [
    { titleEn: "Al-Rashid Wedding Collection", titleAr: "مجموعة الراشد للأفراح", titleFr: "Collection Mariage Al-Rashid", category: ProductCategory.WEDDING_EVENTS, imageUrl: "/portfolio/wedding-1.jpg", isPublished: true, sortOrder: 1 },
    { titleEn: "Maison Azur Corporate Identity", titleAr: "هوية ميزون أزور", titleFr: "Identité corporate Maison Azur", category: ProductCategory.BUSINESS_STATIONERY, imageUrl: "/portfolio/corp-1.jpg", isPublished: true, sortOrder: 2 },
    { titleEn: "Dar Perfume Packaging", titleAr: "تغليف عطور الدار", titleFr: "Packaging Dar Parfum", category: ProductCategory.LUXURY_PACKAGING, imageUrl: "/portfolio/pkg-1.jpg", isPublished: true, sortOrder: 3 },
  ];

  for (const item of portfolioItems) {
    await prisma.portfolioItem.create({ data: item }).catch(() => {});
  }
  console.log("  ✓ Portfolio items");

  console.log("\n✅ Seeding complete!");
  console.log("\n📋 Test accounts:");
  console.log("   Admin:  admin@esmae.dz / Admin@esmae2025!");
  console.log("   B2B:    b2b@example.dz / B2B@client2025!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
