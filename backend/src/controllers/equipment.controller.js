const Equipment = require("../models/equipment.model");

const EQUIPMENT_IMAGE_BASE = "https://ik.imagekit.io/ofm1vl6gr/Equipments";

function equipmentImage(filename) {
  return `${EQUIPMENT_IMAGE_BASE}/${filename}`;
}

const DEFAULT_EQUIPMENT = [
  {
    name: "Nikon z6m2",
    slug: "camera-nikon-z6m2",
    category: "camera",
    imageUrl: equipmentImage("72-720217_nikon-z6-mirrorless-camera-hd-png-download-removebg-preview.png"),
    isDefault: true,
  },
  {
    name: "Sony A7m4",
    slug: "camera-sony-a7m4",
    category: "camera",
    imageUrl: equipmentImage("1_eagjSND-removebg-preview.png"),
    isDefault: true,
  },
  {
    name: "Nikon D3500",
    slug: "camera-nikon-d3500",
    category: "camera",
    imageUrl: equipmentImage("05ku5nmytcdriocf9n5f2vz-30-hero-image-gallery.fit_lim.size_1050x591.v1569479607-removebg-preview.png"),
    isDefault: true,
  },
  {
    name: "Sony ZV e-1",
    slug: "camera-sony-zv-e-1",
    category: "camera",
    imageUrl: equipmentImage("01_Hero_Mobile-removebg-preview.png"),
    isDefault: true,
  },
  {
    name: "Digitek dtr520bh",
    slug: "tripod-digitek-dtr520bh",
    category: "tripod",
    imageUrl: equipmentImage("0100101_digitek-professional-aluminium-tripod-cum-monopod-dtr-520-bh_600-removebg-preview.png"),
    isDefault: true,
  },
  {
    name: "welborn",
    slug: "flash-welborn-show",
    category: "flash",
    imageUrl: equipmentImage("a7e788d3-9a72-4b97-bafb-3c9d4b277791._CR0_0_3840_1575_SX1500_-removebg-preview.png"),
    isDefault: true,
  },
];

function normalizeName(value) {
  return String(value || "").trim();
}

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function makeSlug(category, name) {
  return `${category}-${name}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureDefaultEquipment() {
  for (const item of DEFAULT_EQUIPMENT) {
    await Equipment.updateOne(
      { slug: item.slug },
      {
        $set: {
          name: item.name,
          category: item.category,
          imageUrl: item.imageUrl,
          isDefault: true,
        },
        $setOnInsert: {
          slug: item.slug,
          createdBy: null,
          updatedBy: null,
        },
      },
      { upsert: true }
    );
  }
}

async function getEquipment(req, res) {
  try {
    await ensureDefaultEquipment();

    const equipment = await Equipment.find({})
      .sort({ category: 1, createdAt: 1 })
      .select("name slug category imageUrl isDefault");

    return res.json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function createEquipment(req, res) {
  try {
    const name = normalizeName(req.body?.name);
    const category = normalizeCategory(req.body?.category);
    const imageUrl = String(req.body?.imageUrl || "").trim();

    if (!name || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "name, category and imageUrl are required",
      });
    }

    if (!["camera", "tripod", "flash"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "category must be camera, tripod, or flash",
      });
    }

    const slug = makeSlug(category, name);

    const alreadyExists = await Equipment.findOne({ slug });
    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Equipment with same name and category already exists",
      });
    }

    const equipment = await Equipment.create({
      name,
      slug,
      category,
      imageUrl,
      isDefault: false,
      createdBy: req.admin?._id || null,
      updatedBy: req.admin?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Equipment added successfully",
      data: equipment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateEquipment(req, res) {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    const nextName = req.body?.name !== undefined ? normalizeName(req.body.name) : equipment.name;
    const nextCategory =
      req.body?.category !== undefined ? normalizeCategory(req.body.category) : equipment.category;
    const nextImageUrl =
      req.body?.imageUrl !== undefined ? String(req.body.imageUrl || "").trim() : equipment.imageUrl;

    if (!nextName || !nextCategory || !nextImageUrl) {
      return res.status(400).json({
        success: false,
        message: "name, category and imageUrl cannot be empty",
      });
    }

    if (!["camera", "tripod", "flash"].includes(nextCategory)) {
      return res.status(400).json({
        success: false,
        message: "category must be camera, tripod, or flash",
      });
    }

    const nextSlug = makeSlug(nextCategory, nextName);

    const duplicate = await Equipment.findOne({ slug: nextSlug, _id: { $ne: id } });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another equipment already uses this name/category",
      });
    }

    equipment.name = nextName;
    equipment.category = nextCategory;
    equipment.imageUrl = nextImageUrl;
    equipment.slug = nextSlug;
    equipment.updatedBy = req.admin?._id || null;

    await equipment.save();

    return res.json({
      success: true,
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getEquipment,
  createEquipment,
  updateEquipment,
};
