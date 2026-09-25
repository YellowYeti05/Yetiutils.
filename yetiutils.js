/*
============================================================
 YetiUtils for Sandboxels
 File: yetiutils.js
 Corrected Combined Build
============================================================
*/

(function () {
"use strict";

/* ==========================================================
   YETIUTILS CORE
   ========================================================== */

const YU = window.YetiUtils = window.YetiUtils || {};

YU.version = "1.1.0";
YU.maxSpeed = 10000;
YU.targetFPS = 30;
YU.antiLag = true;
YU.fps = 60;
YU.currentSpeed = 30;
YU.zoom = 1;
YU.pixelResizeAmount = 1;


/* ==========================================================
   SHARED ELEMENT SETS
   ========================================================== */

YU.waterElements = new Set([
    "water",
    "salt_water",
    "sugar_water",
    "dirty_water",
    "unfreezable_water",
    "unheatable_water"
]);

YU.landAnimals = new Set([
    "human",
    "head",
    "body",
    "lizard",
    "ant",
    "fly",
    "bee",
    "worm",
    "tiger",
    "tiger_cub",
    "hazmat_human",
    "shroom_human",
    "shroom_head",
    "shroom_body"
]);

YU.seaAnimals = new Set([
    "fish",
    "tadpole",
    "sea_monkey",
    "brine_shrimp",
    "shark"
]);


/* ==========================================================
   BASIC HELPERS
   ========================================================== */

function yetiElementExists(name) {
    return (
        typeof elements !== "undefined" &&
        !!elements[name]
    );
}


function yetiElement(name, fallback) {
    if (yetiElementExists(name)) {
        return name;
    }

    return fallback;
}


function yetiPixelAt(x, y) {
    if (
        typeof outOfBounds === "function" &&
        outOfBounds(x, y)
    ) {
        return null;
    }

    if (
        typeof pixelMap === "undefined" ||
        !pixelMap[x]
    ) {
        return null;
    }

    return pixelMap[x][y] || null;
}


function yetiIsEmpty(x, y) {
    if (
        typeof outOfBounds === "function" &&
        outOfBounds(x, y)
    ) {
        return false;
    }

    if (typeof isEmpty !== "function") {
        return false;
    }

    return isEmpty(x, y);
}


function yetiNeighbors(pixel, radius = 1) {
    const result = [];

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {

            if (dx === 0 && dy === 0) {
                continue;
            }

            const target = yetiPixelAt(
                pixel.x + dx,
                pixel.y + dy
            );

            if (target) {
                result.push(target);
            }
        }
    }

    return result;
}


function yetiCreate(name, x, y) {
    if (!yetiElementExists(name)) {
        return null;
    }

    if (!yetiIsEmpty(x, y)) {
        return null;
    }

    if (typeof createPixel !== "function") {
        return null;
    }

    createPixel(name, x, y);

    return yetiPixelAt(x, y);
}


function yetiChange(pixel, name) {
    if (!pixel) {
        return false;
    }

    if (!yetiElementExists(name)) {
        return false;
    }

    if (pixel.godmode) {
        return false;
    }

    if (typeof changePixel !== "function") {
        return false;
    }

    changePixel(pixel, name);

    return true;
}


function yetiDelete(pixel) {
    if (!pixel) {
        return false;
    }

    if (pixel.godmode) {
        return false;
    }

    if (typeof deletePixel !== "function") {
        return false;
    }

    deletePixel(pixel.x, pixel.y);

    return true;
}


function yetiCharged(pixel) {
    return !!(
        pixel &&
        (
            pixel.charge ||
            pixel.chargeCD
        )
    );
}


function yetiIsWater(pixel) {
    return !!(
        pixel &&
        YU.waterElements.has(pixel.element)
    );
}


function yetiIsGodmode(pixel) {
    return !!(
        pixel &&
        pixel.godmode
    );
}


function yetiDefault(pixel) {
    if (typeof doDefaults === "function") {
        doDefaults(pixel);
    }
}


/* ==========================================================
   SAFE BEHAVIOR HELPERS
   ========================================================== */

function yetiPowderBehavior() {
    if (
        typeof behaviors !== "undefined" &&
        behaviors.POWDER
    ) {
        return behaviors.POWDER;
    }

    return [
        "XX|XX|XX",
        "XX|XX|XX",
        "M2|M1|M2"
    ];
}


function yetiLiquidBehavior() {
    if (
        typeof behaviors !== "undefined" &&
        behaviors.LIQUID
    ) {
        return behaviors.LIQUID;
    }

    return [
        "XX|XX|XX",
        "M2|XX|M2",
        "M1|M1|M1"
    ];
}


function yetiWallBehavior() {
    if (
        typeof behaviors !== "undefined" &&
        behaviors.WALL
    ) {
        return behaviors.WALL;
    }

    return [
        "XX|XX|XX",
        "XX|XX|XX",
        "XX|XX|XX"
    ];
}


function yetiGasBehavior() {
    if (
        typeof behaviors !== "undefined" &&
        behaviors.GAS
    ) {
        return behaviors.GAS;
    }

    return [
        "M2|M1|M2",
        "M1|XX|M1",
        "M2|M1|M2"
    ];
}


/* ==========================================================
   LAPIS
   ========================================================== */

elements.lapis = {
    color: [
        "#173b8f",
        "#1f4eb5",
        "#285bc7",
        "#3266d4"
    ],

    behavior: yetiPowderBehavior(),

    category: "land",

    state: "solid",

    density: 2750,

    tempHigh: 1100,

    stateHigh: "molten_lapis",

    breakInto: "lapis_powder"
};


elements.lapis_powder = {
    color: [
        "#204eae",
        "#2f63ce",
        "#3970df"
    ],

    behavior: yetiPowderBehavior(),

    category: "powders",

    state: "solid",

    density: 1800,

    tempHigh: 1050,

    stateHigh: "molten_lapis"
};


elements.molten_lapis = {
    color: [
        "#263ee5",
        "#405dff",
        "#5974ff"
    ],

    behavior: yetiLiquidBehavior(),

    category: "states",

    hidden: true,

    state: "liquid",

    density: 2400,

    temp: 1200,

    tempLow: 1050,

    stateLow: "lapis"
};


/* ==========================================================
   BONE POWDER
   ========================================================== */

elements.bone_powder = {
    color: [
        "#f2edde",
        "#e4ddca",
        "#d6cdb8"
    ],

    behavior: yetiPowderBehavior(),

    category: "powders",

    state: "solid",

    density: 900
};


/* ==========================================================
   STRAWBERRY
   ========================================================== */

elements.strawberry = {
    color: [
        "#c9182b",
        "#df2437",
        "#ef3340",
        "#ff4d5a"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 750,

    breakInto: "strawberry_juice",

    reactions: {
        sugar: {
            elem1: "sweet_strawberry",
            elem2: null
        }
    }
};


elements.strawberry_juice = {
    color: [
        "#c71831",
        "#d51e35",
        "#f13b4d"
    ],

    behavior: yetiLiquidBehavior(),

    category: "liquids",

    state: "liquid",

    density: 1040,

    tempLow: -2,

    stateLow: "strawberry_ice",

    tempHigh: 100,

    stateHigh: [
        "steam",
        "sugar"
    ]
};


elements.strawberry_ice = {
    color: [
        "#df6475",
        "#e86677",
        "#f18b99"
    ],

    behavior: yetiWallBehavior(),

    category: "states",

    hidden: true,

    state: "solid",

    tempHigh: -1,

    stateHigh: "strawberry_juice",

    breakInto: "strawberry_juice"
};


elements.sweet_strawberry = {
    color: [
        "#d51a37",
        "#ed2946",
        "#ff3652"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 780,

    breakInto: "strawberry_juice"
};


/* ==========================================================
   SPECIAL WATER
   ========================================================== */

elements.unfreezable_water = {
    color: [
        "#2784ef",
        "#3b8fff",
        "#56a1ff"
    ],

    behavior: yetiLiquidBehavior(),

    category: "liquids",

    state: "liquid",

    density: 997,

    conduct: 0.02,

    tempHigh: 100,

    stateHigh: "steam"
};


elements.unheatable_water = {
    color: [
        "#3d96f5",
        "#54a7ff",
        "#6ab4ff"
    ],

    behavior: yetiLiquidBehavior(),

    category: "liquids",

    state: "liquid",

    density: 997,

    conduct: 0.02,

    tempLow: 0,

    stateLow: "ice",

    tick(pixel) {
        if (
            typeof pixel.temp === "number" &&
            pixel.temp > 20
        ) {
            pixel.temp = 20;
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   SEA MONKEY
   ========================================================== */

elements.sea_monkey = {
    color: [
        "#d88a58",
        "#e7a86b",
        "#f0ba82"
    ],

    behavior: yetiLiquidBehavior(),

    category: "life",

    state: "solid",

    density: 1020,

    tempHigh: 40,

    stateHigh: yetiElement(
        "dead_bug",
        "meat"
    ),

    tempLow: 5,

    stateLow: yetiElement(
        "dead_bug",
        "meat"
    ),

    tick(pixel) {

        const neighbors =
            yetiNeighbors(pixel, 1);

        let anotherSeaMonkey = false;

        for (const target of neighbors) {

            if (
                target.element === "algae" ||
                target.element === "plankton"
            ) {
                if (Math.random() < 0.08) {
                    yetiDelete(target);
                }
            }

            if (target.element === "sea_monkey") {
                anotherSeaMonkey = true;
            }
        }

        if (
            anotherSeaMonkey &&
            Math.random() < 0.0008
        ) {
            const possible = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1]
            ];

            for (const offset of possible) {
                if (
                    yetiCreate(
                        "sea_monkey",
                        pixel.x + offset[0],
                        pixel.y + offset[1]
                    )
                ) {
                    break;
                }
            }
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   SHRIMP
   ========================================================== */

elements.uncooked_shrimp = {
    color: [
        "#b98570",
        "#c99079",
        "#d39b83"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 1050,

    tempHigh: 65,

    stateHigh: "cooked_shrimp"
};


elements.cooked_shrimp = {
    color: [
        "#e67c6b",
        "#f08b78",
        "#ffad92"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 1000
};


/* ==========================================================
   SUSHI
   ========================================================== */

elements.sushi = {
    color: [
        "#222222",
        "#e88d82",
        "#f3d7c6"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 950,

    tempHigh: 70,

    stateHigh: "cooked_sushi"
};


elements.cooked_sushi = {
    color: [
        "#704232",
        "#8f563f",
        "#c77d65"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 950
};


/* ==========================================================
   BRINE SHRIMP
   ========================================================== */

elements.brine_shrimp = {
    color: [
        "#d47e66",
        "#dc8d72",
        "#f0aa8c"
    ],

    behavior: yetiLiquidBehavior(),

    category: "life",

    state: "solid",

    density: 1025,

    breakInto: "uncooked_shrimp",

    tempHigh: 65,

    stateHigh: "cooked_shrimp",

    tick(pixel) {

        for (
            const target
            of yetiNeighbors(pixel, 1)
        ) {
            if (
                target.element === "algae" &&
                Math.random() < 0.08
            ) {
                yetiDelete(target);
            }
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   SHARK TOOTH
   ========================================================== */

elements.shark_tooth = {
    color: [
        "#f7f2e4",
        "#e9e3d2",
        "#d8d1bf"
    ],

    behavior: yetiPowderBehavior(),

    category: "powders",

    state: "solid",

    density: 2200,

    breakInto: "bone_powder"
};


elements.solid_shark_tooth = {
    color: [
        "#f3eddd",
        "#e1dac8",
        "#cec6b3"
    ],

    behavior: yetiWallBehavior(),

    category: "solids",

    state: "solid",

    density: 2200,

    hardness: 0.9,

    breakInto: "bone_powder"
};


/* ==========================================================
   SHARK
   ========================================================== */

elements.shark = {
    color: [
        "#4f606b",
        "#667783",
        "#7d8e99"
    ],

    behavior: yetiLiquidBehavior(),

    category: "life",

    state: "solid",

    density: 1080,

    breakInto: [
        "sushi",
        "sushi",
        "sushi",
        "shark_tooth"
    ],

    tempHigh: 70,

    stateHigh: "cooked_sushi",

    tick(pixel) {

        const nearby =
            yetiNeighbors(pixel, 1);

        for (const target of nearby) {

            if (
                !YU.seaAnimals.has(
                    target.element
                )
            ) {
                continue;
            }

            if (
                target.element === "shark"
            ) {
                continue;
            }

            if (
                yetiIsGodmode(target)
            ) {
                continue;
            }

            if (
                Math.random() >= 0.30
            ) {
                continue;
            }

            if (
                target.element ===
                "brine_shrimp"
            ) {
                yetiChange(
                    target,
                    "uncooked_shrimp"
                );
            }
            else {
                yetiDelete(target);
            }

            break;
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   GROWTH KELP
   ONLY:
   Sea Monkey -> Brine Shrimp
   Fish -> Shark
   ========================================================== */

elements.growth_kelp = {
    color: [
        "#17652f",
        "#1b7f3a",
        "#2e9b4d"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 900,

    tick(pixel) {

        for (
            const target
            of yetiNeighbors(pixel, 1)
        ) {

            if (
                Math.random() >= 0.02
            ) {
                continue;
            }

            if (
                target.element ===
                "sea_monkey"
            ) {
                yetiChange(
                    target,
                    "brine_shrimp"
                );
            }

            else if (
                target.element ===
                "fish"
            ) {
                yetiChange(
                    target,
                    "shark"
                );
            }
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   LIZARD SLIME
   ========================================================== */

elements.lizard_slime = {
    color: [
        "#54a847",
        "#66bb55",
        "#7acc63"
    ],

    behavior: yetiLiquidBehavior(),

    category: "liquids",

    state: "liquid",

    density: 1100,

    viscosity: 1200,

    tempLow: -5,

    stateLow: "lizard_slime_ice"
};


elements.lizard_slime_ice = {
    color: [
        "#8dce83",
        "#9ddf92",
        "#b5e8ac"
    ],

    behavior: yetiWallBehavior(),

    category: "states",

    hidden: true,

    state: "solid",

    tempHigh: -4,

    stateHigh: "lizard_slime",

    breakInto: "lizard_slime"
};


/* ==========================================================
   LIZARD
   ========================================================== */

elements.lizard = {
    color: [
        "#3f702d",
        "#548c39",
        "#75a94c"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 1050,

    tempHigh: 80,

    stateHigh: yetiElement(
        "cooked_meat",
        "meat"
    ),

    tempLow: -20,

    stateLow: yetiElement(
        "frozen_meat",
        "meat"
    ),

    breakInto: yetiElement(
        "meat",
        "blood"
    ),

    tick(pixel) {

        const prey = [
            "fly",
            "ant",
            "worm"
        ];

        for (
            const target
            of yetiNeighbors(pixel, 1)
        ) {
            if (
                prey.includes(
                    target.element
                ) &&
                !yetiIsGodmode(target) &&
                Math.random() < 0.15
            ) {
                yetiDelete(target);
                break;
            }
        }

        if (
            Math.random() < 0.003
        ) {
            const possible = [
                [0, 1],
                [1, 0],
                [-1, 0]
            ];

            for (
                const offset
                of possible
            ) {
                if (
                    yetiCreate(
                        "lizard_slime",
                        pixel.x + offset[0],
                        pixel.y + offset[1]
                    )
                ) {
                    break;
                }
            }
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   HABITAT TIMER HELPERS
   30 REAL SECONDS
   ========================================================== */

function yetiDeepWater(pixel) {
    let count = 0;

    for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {

            const target =
                yetiPixelAt(
                    pixel.x + dx,
                    pixel.y + dy
                );

            if (
                yetiIsWater(target)
            ) {
                count++;
            }
        }
    }

    return count >= 10;
}


function yetiSeaAnimalHasWater(pixel) {

    const positions = [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1]
    ];

    for (
        const offset
        of positions
    ) {

        const target =
            yetiPixelAt(
                pixel.x + offset[0],
                pixel.y + offset[1]
            );

        if (
            yetiIsWater(target)
        ) {
            return true;
        }
    }

    return false;
}


function yetiHabitatDeath(
    pixel,
    type
) {

    if (
        !pixel ||
        yetiIsGodmode(pixel)
    ) {
        if (pixel) {
            delete pixel.yetiHabitatStart;
        }

        return;
    }

    let unsafe = false;

    if (type === "land") {
        unsafe =
            yetiDeepWater(pixel);
    }

    else if (type === "sea") {
        unsafe =
            !yetiSeaAnimalHasWater(pixel);
    }

    if (!unsafe) {
        delete pixel.yetiHabitatStart;
        return;
    }

    if (!pixel.yetiHabitatStart) {
        pixel.yetiHabitatStart =
            Date.now();

        return;
    }

    if (
        Date.now() -
        pixel.yetiHabitatStart <
        30000
    ) {
        return;
    }

    if (type === "sea") {

        if (
            pixel.element ===
            "brine_shrimp"
        ) {
            yetiChange(
                pixel,
                "uncooked_shrimp"
            );

            return;
        }

        if (
            pixel.element ===
            "shark"
        ) {
            yetiChange(
                pixel,
                "sushi"
            );

            return;
        }

        if (
            yetiElementExists("meat")
        ) {
            yetiChange(
                pixel,
                "meat"
            );
        }
        else {
            yetiDelete(pixel);
        }

        return;
    }

    if (
        pixel.element === "ant" ||
        pixel.element === "fly" ||
        pixel.element === "bee"
    ) {
        if (
            yetiElementExists(
                "dead_bug"
            )
        ) {
            yetiChange(
                pixel,
                "dead_bug"
            );
        }
        else {
            yetiDelete(pixel);
        }

        return;
    }

    if (
        pixel.element === "tiger" ||
        pixel.element === "tiger_cub"
    ) {
        if (
            yetiElementExists(
                "red_meat"
            )
        ) {
            yetiChange(
                pixel,
                "red_meat"
            );
        }
        else {
            yetiDelete(pixel);
        }

        return;
    }

    if (
        yetiElementExists("meat")
    ) {
        yetiChange(
            pixel,
            "meat"
        );
    }
    else {
        yetiDelete(pixel);
    }
}


/* ==========================================================
   HABITAT WRAPPER
   Installed later after Sandboxels finishes loading.
   ========================================================== */

function yetiWrapHabitat(
    elementName,
    type
) {

    if (
        !yetiElementExists(
            elementName
        )
    ) {
        return;
    }

    const definition =
        elements[elementName];

    if (
        definition.yetiHabitatWrapped
    ) {
        return;
    }

    definition.yetiHabitatWrapped =
        true;

    const originalTick =
        definition.tick;

    definition.tick =
        function(pixel) {

            if (originalTick) {
                originalTick.call(
                    this,
                    pixel
                );
            }

            /*
             Only run habitat logic if
             this exact pixel still exists
             at its current coordinates.
            */

            if (
                yetiPixelAt(
                    pixel.x,
                    pixel.y
                ) !== pixel
            ) {
                return;
            }

            yetiHabitatDeath(
                pixel,
                type
            );
        };
}


/* ==========================================================
   PART 1 END
   ========================================================== *//* ==========================================================
   RED MEAT
   ========================================================== */

elements.red_meat = {
    color: [
        "#8d232b",
        "#a92d34",
        "#c53b40"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 1050,

    tempHigh: 70,

    stateHigh: "cooked_red_meat",

    tempLow: -10,

    stateLow: "frozen_red_meat",

    burn: 20,

    burnTime: 200,

    burnInto: [
        "smoke",
        "ash"
    ]
};


elements.cooked_red_meat = {
    color: [
        "#633929",
        "#70402f",
        "#8b503a"
    ],

    behavior: yetiPowderBehavior(),

    category: "food",

    state: "solid",

    density: 1000
};


elements.frozen_red_meat = {
    color: [
        "#a9666a",
        "#b97679",
        "#c28486"
    ],

    behavior: yetiWallBehavior(),

    category: "states",

    hidden: true,

    state: "solid",

    tempHigh: 0,

    stateHigh: "red_meat"
};


/* ==========================================================
   TIGER FANG
   ========================================================== */

elements.tiger_fang = {
    color: [
        "#f1e6c8",
        "#e4d7b7",
        "#d9cba8"
    ],

    behavior: yetiPowderBehavior(),

    category: "solids",

    state: "solid",

    density: 2200,

    breakInto: "bone_powder"
};


/* ==========================================================
   TIGER PELT
   ========================================================== */

elements.tiger_pelt = {
    color: [
        "#df7f22",
        "#1e1814",
        "#f2a33b"
    ],

    behavior: yetiPowderBehavior(),

    category: "solids",

    state: "solid",

    density: 250,

    burn: 35,

    burnTime: 250,

    burnInto: "ash"
};


/* ==========================================================
   TIGER HUNTING
   ========================================================== */

function yetiTigerHunt(pixel) {

    const prey = [
        "human",
        "head",
        "body",
        "lizard"
    ];

    for (
        const target
        of yetiNeighbors(pixel, 1)
    ) {

        if (
            !prey.includes(
                target.element
            )
        ) {
            continue;
        }

        if (
            yetiIsGodmode(target)
        ) {
            continue;
        }

        if (
            Math.random() >= 0.12
        ) {
            continue;
        }

        if (
            yetiElementExists(
                "red_meat"
            )
        ) {
            yetiChange(
                target,
                "red_meat"
            );
        }
        else {
            yetiDelete(target);
        }

        break;
    }
}


/* ==========================================================
   TIGER
   ========================================================== */

elements.tiger = {
    color: [
        "#e78421",
        "#111111",
        "#f39c31"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 1080,

    tempHigh: 80,

    stateHigh: "cooked_red_meat",

    tempLow: -20,

    stateLow: "frozen_red_meat",

    breakInto: [
        "red_meat",
        "red_meat",
        "blood",
        "tiger_fang",
        "tiger_pelt"
    ],

    tick(pixel) {

        yetiTigerHunt(pixel);

        yetiDefault(pixel);
    }
};


/* ==========================================================
   TIGER CUB
   ========================================================== */

elements.tiger_cub = {
    color: [
        "#efa04a",
        "#24201c",
        "#d98835"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 1040,

    tempHigh: 80,

    stateHigh: "cooked_red_meat",

    tempLow: -20,

    stateLow: "frozen_red_meat",

    breakInto: [
        "red_meat",
        "blood"
    ],

    tick(pixel) {

        if (
            typeof pixel.yetiAge
            !== "number"
        ) {
            pixel.yetiAge = 0;
        }

        pixel.yetiAge++;

        if (
            pixel.yetiAge >= 1800
        ) {
            yetiChange(
                pixel,
                "tiger"
            );

            return;
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   FUNGUS DUST
   ========================================================== */

elements.fungus_dust = {
    color: [
        "#877552",
        "#a89168",
        "#c0ad80"
    ],

    category: "powders",

    state: "solid",

    density: 5,

    /*
     Feather-like movement with
     extra drifting because the
     dust is extremely light.
    */

    behavior: [
        "M2%15|M1%25|M2%15",
        "M2%25|XX|M2%25",
        "M2%10|M1|M2%10"
    ],

    tick(pixel) {

        for (
            const target
            of yetiNeighbors(pixel, 1)
        ) {

            /*
             It only becomes plague-carrying
             after actually touching plague.
            */

            if (
                target.element === "plague"
            ) {
                pixel.yetiPlague = true;
            }

            if (
                !pixel.yetiPlague
            ) {
                continue;
            }

            if (
                yetiIsGodmode(target)
            ) {
                continue;
            }

            if (
                target.element ===
                "hazmat_human"
            ) {
                continue;
            }

            const targetDefinition =
                elements[
                    target.element
                ];

            if (
                !targetDefinition ||
                targetDefinition.category
                    !== "life"
            ) {
                continue;
            }

            if (
                Math.random() >= 0.08
            ) {
                continue;
            }

            if (
                yetiElementExists(
                    "plague"
                )
            ) {
                yetiChange(
                    target,
                    "plague"
                );
            }
        }
    }
};


/* ==========================================================
   SHROOM LIFE HELPER
   ========================================================== */

function yetiShroomEater(
    targetElement
) {

    return function(pixel) {

        for (
            const target
            of yetiNeighbors(pixel, 1)
        ) {

            if (
                target.element !==
                targetElement
            ) {
                continue;
            }

            if (
                yetiIsGodmode(target)
            ) {
                continue;
            }

            const x = target.x;
            const y = target.y;

            if (
                !yetiDelete(target)
            ) {
                continue;
            }

            /*
             Slow fungal reproduction
             into the consumed space.
            */

            if (
                Math.random() < 0.20
            ) {
                yetiCreate(
                    pixel.element,
                    x,
                    y
                );
            }
        }

        yetiDefault(pixel);
    };
}


/* ==========================================================
   SHROOM INFECTION
   ========================================================== */

elements.shroom_infection = {
    color: [
        "#8e4da5",
        "#9f5cb5",
        "#c778d6"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    tick: yetiShroomEater(
        "infection"
    )
};


/* ==========================================================
   SHROOM CANCER
   ========================================================== */

elements.shroom_cancer = {
    color: [
        "#607f3e",
        "#6d8f49",
        "#93b55c"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    tick: yetiShroomEater(
        "cancer"
    )
};


/* ==========================================================
   SHROOM HUMAN PARTS
   ========================================================== */

elements.shroom_head = {
    color: [
        "#c55a9f",
        "#f1a3ce",
        "#6e3c66"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 1080,

    breakInto: [
        "fungus_dust",
        "blood"
    ],

    tick(pixel) {

        /*
         If the body is directly below,
         keep the head associated with it.
        */

        const below =
            yetiPixelAt(
                pixel.x,
                pixel.y + 1
            );

        if (
            below &&
            below.element ===
                "shroom_body"
        ) {
            pixel.yetiShroomBody =
                true;
        }

        yetiDefault(pixel);
    }
};


elements.shroom_body = {
    color: [
        "#734c70",
        "#8d557f",
        "#b271a3"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 1100,

    breakInto: [
        "fungus_dust",
        "meat",
        "blood"
    ],

    tick(pixel) {

        /*
         Regrow a missing shroom head
         occasionally if there is room.
        */

        const above =
            yetiPixelAt(
                pixel.x,
                pixel.y - 1
            );

        if (
            !above &&
            Math.random() < 0.01
        ) {
            yetiCreate(
                "shroom_head",
                pixel.x,
                pixel.y - 1
            );
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   SHROOM HUMAN SPAWNER
   ========================================================== */

elements.shroom_human = {
    color: [
        "#b461a1",
        "#734c70"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 1090,

    tick(pixel) {

        if (
            yetiIsEmpty(
                pixel.x,
                pixel.y - 1
            )
        ) {
            yetiCreate(
                "shroom_head",
                pixel.x,
                pixel.y - 1
            );

            /*
             Direct conversion here is
             intentional because this is
             the shroom-human spawner,
             not a Godmode target.
            */

            if (
                typeof changePixel
                === "function"
            ) {
                changePixel(
                    pixel,
                    "shroom_body"
                );
            }

            return;
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   SHROOM HUMAN 1% INFECTION CHANCE
   ========================================================== */

function yetiInstallShroomHumanInfection() {

    if (
        !yetiElementExists(
            "shroom_infection"
        )
    ) {
        return;
    }

    const definition =
        elements.shroom_infection;

    if (
        definition
            .yetiHumanInfectionPatched
    ) {
        return;
    }

    definition
        .yetiHumanInfectionPatched =
        true;

    const originalTick =
        definition.tick;

    definition.tick =
        function(pixel) {

            for (
                const target
                of yetiNeighbors(
                    pixel,
                    1
                )
            ) {

                if (
                    ![
                        "human",
                        "head",
                        "body"
                    ].includes(
                        target.element
                    )
                ) {
                    continue;
                }

                if (
                    yetiIsGodmode(
                        target
                    )
                ) {
                    continue;
                }

                if (
                    target.element ===
                    "hazmat_human"
                ) {
                    continue;
                }

                if (
                    Math.random() < 0.01
                ) {
                    yetiChange(
                        target,
                        "shroom_human"
                    );

                    break;
                }
            }

            if (originalTick) {
                originalTick.call(
                    this,
                    pixel
                );
            }
        };
}


/* ==========================================================
   STRONG GLASS
   ========================================================== */

elements.strong_glass = {
    color: [
        "#a9dce4",
        "#b7e7ed",
        "#c8f1f4"
    ],

    behavior: yetiWallBehavior(),

    category: "solids",

    state: "solid",

    density: 2600,

    hardness: 0.98,

    tempHigh: 1800,

    stateHigh: "molten_glass",

    breakInto: yetiElement(
        "glass_shard",
        "sand"
    )
};


/* ==========================================================
   HAZMAT MATERIAL
   ========================================================== */

elements.hazmat = {
    color: [
        "#f2bc16",
        "#ffd523",
        "#ffe458"
    ],

    behavior: yetiPowderBehavior(),

    category: "solids",

    state: "solid",

    reactions: {
        strong_glass: {
            elem1: "hazmat_suit",
            elem2: null
        }
    }
};


/* ==========================================================
   HAZMAT SUIT
   ========================================================== */

elements.hazmat_suit = {
    color: [
        "#f7d21f",
        "#303030",
        "#ffe45a"
    ],

    behavior: yetiPowderBehavior(),

    category: "solids",

    state: "solid",

    reactions: {
        human: {
            elem1: null,
            elem2: "hazmat_human"
        },

        head: {
            elem1: null,
            elem2: "hazmat_human"
        }
    }
};


/* ==========================================================
   HAZMAT HUMAN
   ========================================================== */

elements.hazmat_human = {
    color: [
        "#f4cf1c",
        "#2e2e2e",
        "#ffe14a"
    ],

    behavior: yetiPowderBehavior(),

    category: "life",

    state: "solid",

    density: 1080,

    tempHigh: 120,

    stateHigh: yetiElement(
        "cooked_meat",
        "meat"
    ),

    breakInto: [
        "meat",
        "blood"
    ],

    tick(pixel) {

        /*
         Remove infection markers that
         other mods may place directly
         on the hazmat human.
        */

        delete pixel.infected;
        delete pixel.infection;
        delete pixel.plague;
        delete pixel.cancer;

        yetiDefault(pixel);
    }
};


/* ==========================================================
   HAZMAT REACTION IMMUNITY
   ========================================================== */

function yetiInstallHazmatProtection() {

    const hazards = [
        "infection",
        "cancer",
        "plague"
    ];

    for (
        const hazard
        of hazards
    ) {

        if (
            !yetiElementExists(
                hazard
            )
        ) {
            continue;
        }

        const definition =
            elements[hazard];

        definition.reactions =
            definition.reactions || {};

        /*
         An empty reaction prevents us
         from intentionally converting
         the hazmat human through this
         YetiUtils patch.
        */

        definition.reactions
            .hazmat_human = {
                chance: 0
            };
    }
}


/* ==========================================================
   TINTED GLASS
   ========================================================== */

elements.tinted_glass = {
    color: [
        "#202329",
        "#292d35",
        "#3a404b"
    ],

    behavior: yetiWallBehavior(),

    category: "solids",

    state: "solid",

    density: 2500,

    hardness: 0.95,

    tempHigh: 1500,

    stateHigh: "molten_glass",

    breakInto: yetiElement(
        "glass_shard",
        "sand"
    ),

    insulate: true
};


/* ==========================================================
   TINTED GLASS LIGHT BLOCKING
   ========================================================== */

function yetiInstallTintedGlassBlocking() {

    const energyElements = [
        "light",
        "laser"
    ];

    for (
        const name
        of energyElements
    ) {

        if (
            !yetiElementExists(name)
        ) {
            continue;
        }

        const definition =
            elements[name];

        if (
            definition
                .yetiTintedGlassPatched
        ) {
            continue;
        }

        definition
            .yetiTintedGlassPatched =
            true;

        const originalTick =
            definition.tick;

        if (!originalTick) {
            continue;
        }

        definition.tick =
            function(pixel) {

                for (
                    const target
                    of yetiNeighbors(
                        pixel,
                        1
                    )
                ) {

                    if (
                        target.element !==
                        "tinted_glass"
                    ) {
                        continue;
                    }

                    if (
                        !yetiIsGodmode(
                            pixel
                        )
                    ) {
                        yetiDelete(pixel);
                    }

                    return;
                }

                originalTick.call(
                    this,
                    pixel
                );
            };
    }
}


/* ==========================================================
   BOMB STORM
   ========================================================== */

elements.bomb_storm = {
    color: [
        "#343943",
        "#454b56",
        "#555d69"
    ],

    behavior: yetiGasBehavior(),

    category: "weather",

    state: "gas",

    density: 1.1,

    tick(pixel) {

        if (
            Math.random() >= 0.035
        ) {
            return;
        }

        /*
         Drop a bomb into the first
         available space beneath the
         storm pixel.
        */

        for (
            let distance = 1;
            distance <= 8;
            distance++
        ) {

            const x = pixel.x;
            const y =
                pixel.y + distance;

            if (
                typeof outOfBounds
                    === "function" &&
                outOfBounds(x, y)
            ) {
                break;
            }

            if (
                yetiIsEmpty(x, y)
            ) {
                yetiCreate(
                    "bomb",
                    x,
                    y
                );

                break;
            }

            /*
             Don't spawn bombs through
             existing material.
            */

            if (
                yetiPixelAt(x, y)
            ) {
                break;
            }
        }
    }
};


/* ==========================================================
   BULLET ENGINE
   ========================================================== */

function yetiBulletTick(direction) {

    return function(pixel) {

        const nextX =
            pixel.x + direction;

        const nextY =
            pixel.y;

        if (
            typeof outOfBounds
                === "function" &&
            outOfBounds(
                nextX,
                nextY
            )
        ) {
            if (
                typeof deletePixel
                === "function"
            ) {
                deletePixel(
                    pixel.x,
                    pixel.y
                );
            }

            return;
        }

        const target =
            yetiPixelAt(
                nextX,
                nextY
            );

        if (!target) {

            if (
                typeof tryMove
                === "function"
            ) {
                tryMove(
                    pixel,
                    nextX,
                    nextY
                );
            }

            return;
        }

        /*
         Bullet disappears when it hits
         Godmode, but Godmode survives.
        */

        if (
            yetiIsGodmode(
                target
            )
        ) {
            if (
                typeof deletePixel
                === "function"
            ) {
                deletePixel(
                    pixel.x,
                    pixel.y
                );
            }

            return;
        }

        if (
            typeof breakPixel
            === "function"
        ) {
            breakPixel(target);
        }
        else {
            yetiDelete(target);
        }

        /*
         Remove the bullet if it still
         exists after the collision.
        */

        if (
            yetiPixelAt(
                pixel.x,
                pixel.y
            ) === pixel &&
            typeof deletePixel
                === "function"
        ) {
            deletePixel(
                pixel.x,
                pixel.y
            );
        }
    };
}


/* ==========================================================
   BULLET LEFT
   ========================================================== */

elements.bullet_left = {
    color: [
        "#666666",
        "#888888"
    ],

    behavior: yetiWallBehavior(),

    category: "weapons",

    state: "solid",

    density: 7800,

    tick: yetiBulletTick(-1)
};


/* ==========================================================
   BULLET RIGHT
   ========================================================== */

elements.bullet_right = {
    color: [
        "#666666",
        "#888888"
    ],

    behavior: yetiWallBehavior(),

    category: "weapons",

    state: "solid",

    density: 7800,

    tick: yetiBulletTick(1)
};


/* ==========================================================
   GODMODE LASER
   ========================================================== */

function yetiGiveGodmode(pixel) {

    if (!pixel) {
        return false;
    }

    pixel.godmode = true;

    pixel.yetiGodmode = true;

    pixel.yetiGodColor =
        pixel.color;

    return true;
}


YU.giveGodmode =
    yetiGiveGodmode;


window.giveGodmode =
    yetiGiveGodmode;


elements.godmode_laser = {
    color: [
        "#fff36b",
        "#ffffff",
        "#7df9ff"
    ],

    category: "energy",

    canPlace: false,

    excludeRandom: true,

    tool(pixel) {
        yetiGiveGodmode(pixel);
    }
};


/* ==========================================================
   GODMODE PROTECTION
   ========================================================== */

function yetiInstallGodmode() {

    if (
        YU.godmodeInstalled
    ) {
        return;
    }

    YU.godmodeInstalled = true;


    /* ------------------------------------------------------
       PROTECT DELETE
       ------------------------------------------------------ */

    if (
        typeof window.deletePixel
        === "function"
    ) {

        const originalDeletePixel =
            window.deletePixel;

        window.deletePixel =
            function(x, y) {

                const target =
                    yetiPixelAt(x, y);

                if (
                    target &&
                    target.godmode &&
                    !YU.eraseGodmodeBypass
                ) {
                    return false;
                }

                return originalDeletePixel
                    .apply(
                        this,
                        arguments
                    );
            };
    }


    /* ------------------------------------------------------
       PROTECT CHANGE
       ------------------------------------------------------ */

    if (
        typeof window.changePixel
        === "function"
    ) {

        const originalChangePixel =
            window.changePixel;

        window.changePixel =
            function(
                pixel,
                newElement
            ) {

                if (
                    pixel &&
                    pixel.godmode &&
                    !YU.eraseGodmodeBypass
                ) {
                    return pixel;
                }

                return originalChangePixel
                    .apply(
                        this,
                        arguments
                    );
            };
    }


    /* ------------------------------------------------------
       PROTECT BREAK
       ------------------------------------------------------ */

    if (
        typeof window.breakPixel
        === "function"
    ) {

        const originalBreakPixel =
            window.breakPixel;

        window.breakPixel =
            function(pixel) {

                if (
                    pixel &&
                    pixel.godmode &&
                    !YU.eraseGodmodeBypass
                ) {
                    return false;
                }

                return originalBreakPixel
                    .apply(
                        this,
                        arguments
                    );
            };
    }


    /* ------------------------------------------------------
       ERASE IS THE ONE EXCEPTION
       ------------------------------------------------------ */

    if (
        yetiElementExists("erase") &&
        typeof elements.erase.tool
            === "function"
    ) {

        const originalErase =
            elements.erase.tool;

        elements.erase.tool =
            function(pixel) {

                YU.eraseGodmodeBypass =
                    true;

                try {
                    return originalErase
                        .apply(
                            this,
                            arguments
                        );
                }
                finally {
                    YU.eraseGodmodeBypass =
                        false;
                }
            };
    }
}


/* ==========================================================
   BONE PATCH
   ========================================================== */

function yetiInstallBonePowder() {

    if (
        yetiElementExists("bone")
    ) {
        elements.bone.breakInto =
            "bone_powder";
    }

    if (
        yetiElementExists(
            "tiger_fang"
        )
    ) {
        elements.tiger_fang
            .breakInto =
            "bone_powder";
    }
}


/* ==========================================================
   PART 2 END
   ========================================================== *//* ==========================================================
   FILTER HELPERS
   ========================================================== */

function yetiFilterIsPowered(pixel) {
    return yetiCharged(pixel);
}


/* ==========================================================
   SOLID FILTER
   ========================================================== */

elements.solid_filter = {
    color: [
        "#738b99",
        "#8fa7b5",
        "#a8bdc8"
    ],

    behavior: yetiWallBehavior(),

    category: "machines",

    state: "solid",

    conduct: 1,

    hardness: 1,

    tick(pixel) {
        pixel.yetiFilterDisabled =
            yetiFilterIsPowered(pixel);

        yetiDefault(pixel);
    }
};


/* ==========================================================
   GAS FILTER
   ========================================================== */

elements.gas_filter = {
    color: [
        "#7ca6b5",
        "#a6c8d5",
        "#c0dce5"
    ],

    behavior: yetiWallBehavior(),

    category: "machines",

    state: "solid",

    conduct: 1,

    hardness: 1,

    tick(pixel) {
        pixel.yetiFilterDisabled =
            yetiFilterIsPowered(pixel);

        yetiDefault(pixel);
    }
};


/* ==========================================================
   LIGHT FILTER
   ========================================================== */

elements.light_filter = {
    color: [
        "#20242b",
        "#292d35",
        "#3a404b"
    ],

    behavior: yetiWallBehavior(),

    category: "machines",

    state: "solid",

    conduct: 1,

    hardness: 1,

    tick(pixel) {

        pixel.yetiFilterDisabled =
            yetiFilterIsPowered(pixel);

        if (
            !pixel.yetiFilterDisabled
        ) {
            for (
                const target
                of yetiNeighbors(
                    pixel,
                    1
                )
            ) {
                if (
                    target.element ===
                        "light" ||
                    target.element ===
                        "laser"
                ) {
                    if (
                        !yetiIsGodmode(
                            target
                        )
                    ) {
                        yetiDelete(
                            target
                        );
                    }
                }
            }
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   VANILLA FILTER POWER PATCH
   ========================================================== */

function yetiPatchVanillaFilter() {

    if (
        !yetiElementExists(
            "filter"
        )
    ) {
        return;
    }

    const definition =
        elements.filter;

    if (
        definition
            .yetiPowerPatched
    ) {
        return;
    }

    definition
        .yetiPowerPatched =
        true;

    const originalTick =
        definition.tick;

    if (
        typeof originalTick
        !== "function"
    ) {
        return;
    }

    definition.tick =
        function(pixel) {

            if (
                yetiFilterIsPowered(
                    pixel
                )
            ) {
                yetiDefault(pixel);
                return;
            }

            return originalTick.call(
                this,
                pixel
            );
        };
}


/* ==========================================================
   BUTTON
   ========================================================== */

elements.button = {
    color: [
        "#8f2c26",
        "#b33b32",
        "#df5145"
    ],

    behavior: yetiWallBehavior(),

    category: "machines",

    state: "solid",

    conduct: 1,

    hardness: 1,

    tick(pixel) {

        let pressed = false;

        const above =
            yetiPixelAt(
                pixel.x,
                pixel.y - 1
            );

        if (above) {

            const definition =
                elements[
                    above.element
                ];

            if (
                !definition ||
                definition.movable
                    !== false
            ) {
                pressed = true;
            }
        }

        if (
            pixel.yetiSmashed
        ) {
            pressed = true;

            pixel.yetiSmashed =
                false;
        }

        if (pressed) {
            pixel.charge = 1;
        }

        yetiDefault(pixel);
    }
};


/* ==========================================================
   BUTTON SMASH SUPPORT
   ========================================================== */

function yetiInstallButtonSmash() {

    /*
     Sandboxels versions/mods may use
     different names for the Smash tool,
     so check common possibilities.
    */

    const smashNames = [
        "smash",
        "smash_tool"
    ];

    for (
        const name
        of smashNames
    ) {

        if (
            !yetiElementExists(name)
        ) {
            continue;
        }

        const definition =
            elements[name];

        if (
            definition
                .yetiButtonPatched
        ) {
            continue;
        }

        if (
            typeof definition.tool
            !== "function"
        ) {
            continue;
        }

        definition
            .yetiButtonPatched =
            true;

        const originalTool =
            definition.tool;

        definition.tool =
            function(pixel) {

                if (
                    pixel &&
                    pixel.element ===
                        "button"
                ) {
                    pixel.yetiSmashed =
                        true;

                    pixel.charge = 1;

                    /*
                     Don't call the normal
                     smash behavior on the
                     button, so it survives.
                    */

                    return;
                }

                return originalTool.apply(
                    this,
                    arguments
                );
            };
    }
}


/* ==========================================================
   TORNADO VARIATIONS
   Acid and Perfume remain vanilla elements.
   No acid_tornado or perfume_tornado element is created.
   ========================================================== */

function yetiPatchTornado() {

    if (
        !yetiElementExists(
            "tornado"
        )
    ) {
        return;
    }

    const definition =
        elements.tornado;

    if (
        definition
            .yetiVariationPatched
    ) {
        return;
    }

    definition
        .yetiVariationPatched =
        true;

    const originalTick =
        definition.tick;

    definition.tick =
        function(pixel) {

            /*
             Touching vanilla acid or
             vanilla perfume loads that
             material into the tornado.
            */

            for (
                const target
                of yetiNeighbors(
                    pixel,
                    1
                )
            ) {

                if (
                    target.element !==
                        "acid" &&
                    target.element !==
                        "perfume"
                ) {
                    continue;
                }

                pixel
                    .yetiTornadoMaterial =
                    target.element;

                if (
                    !yetiIsGodmode(
                        target
                    )
                ) {
                    yetiDelete(
                        target
                    );
                }
            }

            /*
             Keep all normal tornado
             behavior.
            */

            if (
                typeof originalTick
                === "function"
            ) {
                originalTick.call(
                    this,
                    pixel
                );
            }

            /*
             Tornado may have moved or
             transformed during its
             original tick.
            */

            if (
                yetiPixelAt(
                    pixel.x,
                    pixel.y
                ) !== pixel
            ) {
                return;
            }

            if (
                !pixel
                    .yetiTornadoMaterial
            ) {
                return;
            }

            if (
                Math.random() >= 0.08
            ) {
                return;
            }

            const offsets = [
                [-2, -1],
                [-1, -2],
                [0, -2],
                [1, -2],
                [2, -1],
                [-2, 0],
                [2, 0]
            ];

            const offset =
                offsets[
                    Math.floor(
                        Math.random() *
                        offsets.length
                    )
                ];

            yetiCreate(
                pixel
                    .yetiTornadoMaterial,
                pixel.x + offset[0],
                pixel.y + offset[1]
            );
        };
}


/* ==========================================================
   ULTRA PAINT
   ========================================================== */

function yetiSelectedColor() {

    /*
     Different Sandboxels builds can
     expose the selected color under
     different globals.
    */

    if (
        typeof window.currentColor
        === "string"
    ) {
        return window.currentColor;
    }

    if (
        typeof window.mouseColor
        === "string"
    ) {
        return window.mouseColor;
    }

    if (
        typeof window.color
        === "string"
    ) {
        return window.color;
    }

    return "#ff00ff";
}


function yetiApplyExactColor(
    pixel,
    color
) {

    if (
        !pixel ||
        !color
    ) {
        return;
    }

    pixel.color = color;

    pixel.yetiUltraPainted =
        true;

    pixel.yetiUltraColor =
        color;
}


elements.ultra_paint = {
    color: [
        "#ff00ff",
        "#00ffff",
        "#ffff00"
    ],

    category: "tools",

    canPlace: false,

    excludeRandom: true,

    tool(pixel) {

        if (!pixel) {
            return;
        }

        yetiApplyExactColor(
            pixel,
            yetiSelectedColor()
        );
    }
};


/* ==========================================================
   ULTRA PAINT COLOR LOCK
   ========================================================== */

function yetiUltraPaintLoop() {

    if (
        typeof currentPixels
        !== "undefined" &&
        currentPixels
    ) {

        for (
            const pixel
            of currentPixels
        ) {

            if (
                !pixel ||
                !pixel
                    .yetiUltraPainted ||
                !pixel
                    .yetiUltraColor
            ) {
                continue;
            }

            pixel.color =
                pixel
                    .yetiUltraColor;
        }
    }

    if (
        typeof requestAnimationFrame
        === "function"
    ) {
        requestAnimationFrame(
            yetiUltraPaintLoop
        );
    }
}


/* ==========================================================
   CAMERA
   Faces RIGHT.
   Captures everything in front.
   Requires paper_shreds.
   Prints using paint.
   ========================================================== */

function yetiCameraCapture(pixel) {

    if (
        !yetiElementExists(
            "paint"
        )
    ) {
        return false;
    }

    const captured = [];

    /*
     20 pixels forward and
     11 pixels tall.
    */

    for (
        let dx = 1;
        dx <= 20;
        dx++
    ) {

        for (
            let dy = -5;
            dy <= 5;
            dy++
        ) {

            const target =
                yetiPixelAt(
                    pixel.x + dx,
                    pixel.y + dy
                );

            if (!target) {
                continue;
            }

            captured.push({
                dx: dx,
                dy: dy,
                color:
                    target
                        .yetiUltraPainted
                        ?
                    target
                        .yetiUltraColor
                        :
                    target.color
            });
        }
    }

    /*
     Find one unit of
     paper_shreds beside camera.
    */

    let paper = null;

    for (
        const target
        of yetiNeighbors(
            pixel,
            1
        )
    ) {

        if (
            target.element ===
            "paper_shreds"
        ) {
            paper = target;
            break;
        }
    }

    if (!paper) {
        return false;
    }

    yetiDelete(paper);

    /*
     Print behind/left of camera.
    */

    for (
        const item
        of captured
    ) {

        const printX =
            pixel.x -
            2 -
            item.dx;

        const printY =
            pixel.y +
            item.dy;

        if (
            !yetiIsEmpty(
                printX,
                printY
            )
        ) {
            continue;
        }

        const printed =
            yetiCreate(
                "paint",
                printX,
                printY
            );

        if (!printed) {
            continue;
        }

        yetiApplyExactColor(
            printed,
            item.color
        );
    }

    return true;
}


elements.camera = {
    color: [
        "#16181b",
        "#383b40",
        "#59707c"
    ],

    behavior: yetiWallBehavior(),

    category: "machines",

    state: "solid",

    conduct: 1,

    hardness: 1,

    tick(pixel) {

        const powered =
            yetiCharged(pixel);

        if (
            powered &&
            !pixel
                .yetiCameraPowered
        ) {
            yetiCameraCapture(
                pixel
            );
        }

        pixel
            .yetiCameraPowered =
            powered;

        yetiDefault(pixel);
    }
};


/* ==========================================================
   HYDRAULIC PRESS
   ========================================================== */

function yetiRunHydraulicPress(
    pixel
) {

    /*
     7 pixels wide,
     15 pixels deep.
    */

    for (
        let depth = 1;
        depth <= 15;
        depth++
    ) {

        for (
            let dx = -3;
            dx <= 3;
            dx++
        ) {

            const target =
                yetiPixelAt(
                    pixel.x + dx,
                    pixel.y + depth
                );

            if (
                !target ||
                yetiIsGodmode(
                    target
                )
            ) {
                continue;
            }

            /*
             Try pushing downward.
            */

            if (
                yetiIsEmpty(
                    target.x,
                    target.y + 1
                ) &&
                typeof tryMove
                    === "function"
            ) {

                tryMove(
                    target,
                    target.x,
                    target.y + 1
                );

                continue;
            }

            /*
             If downward movement isn't
             possible, spread sideways.
            */

            const directions =
                Math.random() < 0.5
                    ?
                [-1, 1]
                    :
                [1, -1];

            let moved = false;

            for (
                const direction
                of directions
            ) {

                if (
                    !yetiIsEmpty(
                        target.x +
                            direction,
                        target.y
                    )
                ) {
                    continue;
                }

                if (
                    typeof tryMove
                    !== "function"
                ) {
                    continue;
                }

                if (
                    tryMove(
                        target,
                        target.x +
                            direction,
                        target.y
                    )
                ) {
                    moved = true;
                    break;
                }
            }

            /*
             Completely trapped material
             can be crushed/broken.
            */

            if (
                !moved &&
                typeof breakPixel
                    === "function"
            ) {
                breakPixel(
                    target
                );
            }
        }
    }
}


elements.hydraulic_press = {
    color: [
        "#292d31",
        "#555b61",
        "#737b82"
    ],

    behavior: yetiWallBehavior(),

    category: "machines",

    state: "solid",

    conduct: 1,

    hardness: 1,

    tick(pixel) {

        const powered =
            yetiCharged(pixel);

        if (
            powered &&
            !pixel
                .yetiPressPowered
        ) {
            yetiRunHydraulicPress(
                pixel
            );
        }

        pixel
            .yetiPressPowered =
            powered;

        yetiDefault(pixel);
    }
};


/* ==========================================================
   PIXEL RESIZE TOOL
   ========================================================== */

elements.pixel_resize = {
    color: [
        "#57a8ff",
        "#8dc5ff"
    ],

    category: "tools",

    canPlace: false,

    excludeRandom: true,

    tool(pixel) {

        if (!pixel) {
            return;
        }

        pixel.yetiPixelSize =
            Math.max(
                1,
                Math.min(
                    10,
                    YU
                        .pixelResizeAmount
                )
            );
    }
};


window.yetiPixelResize =
    function(size) {

        size =
            Number(size);

        if (
            !Number.isFinite(
                size
            )
        ) {
            return YU
                .pixelResizeAmount;
        }

        YU.pixelResizeAmount =
            Math.max(
                1,
                Math.min(
                    10,
                    Math.round(size)
                )
            );

        return YU
            .pixelResizeAmount;
    };


/* ==========================================================
   ZOOM
   ========================================================== */

window.yetiZoom =
    function(amount) {

        amount =
            Number(amount);

        if (
            !Number.isFinite(
                amount
            )
        ) {
            return YU.zoom;
        }

        amount =
            Math.max(
                0.25,
                Math.min(
                    4,
                    amount
                )
            );

        YU.zoom = amount;

        const canvas =
            document.querySelector(
                "canvas"
            );

        if (canvas) {

            canvas.style
                .transformOrigin =
                "top left";

            canvas.style.transform =
                "scale(" +
                amount +
                ")";
        }

        return amount;
    };


/* ==========================================================
   MAX SPEED 10000
   ========================================================== */

function yetiSetSpeed(value) {

    value =
        Number(value);

    if (
        !Number.isFinite(
            value
        )
    ) {
        return YU
            .currentSpeed;
    }

    value =
        Math.max(
            1,
            Math.min(
                YU.maxSpeed,
                Math.round(
                    value
                )
            )
        );

    /*
     Support several possible speed
     globals without requiring one
     specific Sandboxels build.
    */

    if (
        typeof window.tps
        === "number"
    ) {
        window.tps =
            value;
    }

    if (
        typeof window.TPS
        === "number"
    ) {
        window.TPS =
            value;
    }

    if (
        typeof window
            .ticksPerSecond
        === "number"
    ) {
        window
            .ticksPerSecond =
            value;
    }

    YU.currentSpeed =
        value;

    return value;
}


window.yetiSpeed =
    yetiSetSpeed;


/* ==========================================================
   ANTI-LAG
   ========================================================== */

let yetiFrameCount = 0;

let yetiFPSTime =
    (
        typeof performance
            !== "undefined"
    )
        ?
    performance.now()
        :
    Date.now();


function yetiAntiLagFrame(now) {

    yetiFrameCount++;

    const currentTime =
        typeof now === "number"
            ?
        now
            :
        Date.now();

    const elapsed =
        currentTime -
        yetiFPSTime;

    if (
        elapsed >= 1000
    ) {

        YU.fps =
            Math.round(
                yetiFrameCount *
                1000 /
                elapsed
            );

        yetiFrameCount = 0;

        yetiFPSTime =
            currentTime;

        if (
            YU.antiLag
        ) {

            /*
             Severe lag:
             halve simulation speed.
            */

            if (
                YU.fps < 15
            ) {
                yetiSetSpeed(
                    Math.max(
                        1,
                        YU.currentSpeed
                            * 0.5
                    )
                );
            }

            /*
             Moderate lag:
             reduce by 20%.
            */

            else if (
                YU.fps <
                YU.targetFPS
            ) {
                yetiSetSpeed(
                    Math.max(
                        1,
                        YU.currentSpeed
                            * 0.8
                    )
                );
            }
        }
    }

    if (
        typeof requestAnimationFrame
        === "function"
    ) {
        requestAnimationFrame(
            yetiAntiLagFrame
        );
    }
}


window.yetiAntiLagOn =
    function() {

        YU.antiLag = true;

        return (
            "YetiUtils Anti-Lag ON"
        );
    };


window.yetiAntiLagOff =
    function() {

        YU.antiLag = false;

        return (
            "YetiUtils Anti-Lag OFF"
        );
    };


window.yetiAntiLagStatus =
    function() {

        return {
            enabled:
                YU.antiLag,

            fps:
                YU.fps,

            speed:
                YU.currentSpeed,

            maxSpeed:
                YU.maxSpeed
        };
    };


/* ==========================================================
   START DISPLAY LOOPS
   ========================================================== */

function yetiStartLoops() {

    if (
        YU.loopsStarted
    ) {
        return;
    }

    YU.loopsStarted = true;

    if (
        typeof requestAnimationFrame
        === "function"
    ) {
        requestAnimationFrame(
            yetiAntiLagFrame
        );

        requestAnimationFrame(
            yetiUltraPaintLoop
        );
    }
}


/* ==========================================================
   PART 3 END
   ========================================================== *//* ==========================================================
   WORLD PRESET HELPERS
   ========================================================== */

YU.presets = YU.presets || {};


function yetiWorldWidth() {

    if (
        typeof width === "number"
    ) {
        return width;
    }

    if (
        typeof pixelMap !== "undefined" &&
        pixelMap
    ) {
        return pixelMap.length;
    }

    return 0;
}


function yetiWorldHeight() {

    if (
        typeof height === "number"
    ) {
        return height;
    }

    if (
        typeof pixelMap !== "undefined" &&
        pixelMap &&
        pixelMap[0]
    ) {
        return pixelMap[0].length;
    }

    return 0;
}


/* ==========================================================
   CLEAR WORLD
   Godmode survives because Godmode can only
   be removed with the Erase tool.
   ========================================================== */

function yetiClearWorld() {

    const worldWidth =
        yetiWorldWidth();

    const worldHeight =
        yetiWorldHeight();

    for (
        let x = 0;
        x < worldWidth;
        x++
    ) {

        for (
            let y = 0;
            y < worldHeight;
            y++
        ) {

            const pixel =
                yetiPixelAt(
                    x,
                    y
                );

            if (!pixel) {
                continue;
            }

            if (
                yetiIsGodmode(
                    pixel
                )
            ) {
                continue;
            }

            yetiDelete(pixel);
        }
    }
}


/* ==========================================================
   WORLD FILL HELPERS
   ========================================================== */

function yetiFillRect(
    elementName,
    x1,
    y1,
    x2,
    y2
) {

    if (
        !yetiElementExists(
            elementName
        )
    ) {
        return;
    }

    const worldWidth =
        yetiWorldWidth();

    const worldHeight =
        yetiWorldHeight();

    x1 =
        Math.max(
            0,
            Math.floor(x1)
        );

    y1 =
        Math.max(
            0,
            Math.floor(y1)
        );

    x2 =
        Math.min(
            worldWidth - 1,
            Math.floor(x2)
        );

    y2 =
        Math.min(
            worldHeight - 1,
            Math.floor(y2)
        );

    for (
        let x = x1;
        x <= x2;
        x++
    ) {

        for (
            let y = y1;
            y <= y2;
            y++
        ) {

            if (
                yetiIsEmpty(
                    x,
                    y
                )
            ) {
                yetiCreate(
                    elementName,
                    x,
                    y
                );
            }
        }
    }
}


function yetiFillCircle(
    elementName,
    centerX,
    centerY,
    radius
) {

    if (
        !yetiElementExists(
            elementName
        )
    ) {
        return;
    }

    for (
        let dx = -radius;
        dx <= radius;
        dx++
    ) {

        for (
            let dy = -radius;
            dy <= radius;
            dy++
        ) {

            if (
                dx * dx +
                dy * dy >
                radius * radius
            ) {
                continue;
            }

            const x =
                centerX + dx;

            const y =
                centerY + dy;

            if (
                yetiIsEmpty(
                    x,
                    y
                )
            ) {
                yetiCreate(
                    elementName,
                    x,
                    y
                );
            }
        }
    }
}


function yetiRandomElement(
    choices,
    fallback
) {

    const available =
        choices.filter(
            yetiElementExists
        );

    if (
        available.length === 0
    ) {
        return fallback;
    }

    return available[
        Math.floor(
            Math.random() *
            available.length
        )
    ];
}


/* ==========================================================
   PRESET CONFIRMATION
   ========================================================== */

function yetiConfirmPreset(
    presetName,
    generator
) {

    let approved = true;

    if (
        typeof window.confirm
        === "function"
    ) {

        approved =
            window.confirm(
                "Load " +
                presetName +
                "?\n\n" +
                "This will clear your current world. Continue?"
            );
    }

    if (!approved) {
        return false;
    }

    yetiClearWorld();

    generator();

    return true;
}


/* ==========================================================
   PRESET 1 — NORMAL WORLD
   ========================================================== */

YU.presets.normal =
    function() {

        return yetiConfirmPreset(
            "Normal World",
            function() {

                const w =
                    yetiWorldWidth();

                const h =
                    yetiWorldHeight();

                if (
                    w <= 0 ||
                    h <= 0
                ) {
                    return;
                }

                const ground =
                    Math.floor(
                        h * 0.72
                    );

                const rock =
                    yetiElement(
                        "rock",
                        "sand"
                    );

                const dirt =
                    yetiElement(
                        "dirt",
                        rock
                    );

                const grass =
                    yetiElement(
                        "grass",
                        dirt
                    );

                yetiFillRect(
                    rock,
                    0,
                    ground + 5,
                    w - 1,
                    h - 1
                );

                yetiFillRect(
                    dirt,
                    0,
                    ground + 1,
                    w - 1,
                    ground + 4
                );

                yetiFillRect(
                    grass,
                    0,
                    ground,
                    w - 1,
                    ground
                );
            }
        );
    };


/* ==========================================================
   PRESET 2 — SKYBLOCK
   ========================================================== */

YU.presets.skyblock =
    function() {

        return yetiConfirmPreset(
            "Skyblock",
            function() {

                const w =
                    yetiWorldWidth();

                const h =
                    yetiWorldHeight();

                const centerX =
                    Math.floor(
                        w / 2
                    );

                const centerY =
                    Math.floor(
                        h / 2
                    );

                const rock =
                    yetiElement(
                        "rock",
                        "sand"
                    );

                const dirt =
                    yetiElement(
                        "dirt",
                        rock
                    );

                const grass =
                    yetiElement(
                        "grass",
                        dirt
                    );

                /*
                 Small floating island.
                */

                yetiFillRect(
                    grass,
                    centerX - 5,
                    centerY - 2,
                    centerX + 5,
                    centerY - 2
                );

                yetiFillRect(
                    dirt,
                    centerX - 5,
                    centerY - 1,
                    centerX + 5,
                    centerY + 1
                );

                yetiFillRect(
                    rock,
                    centerX - 3,
                    centerY + 2,
                    centerX + 3,
                    centerY + 4
                );

                yetiFillRect(
                    rock,
                    centerX - 1,
                    centerY + 5,
                    centerX + 1,
                    centerY + 7
                );
            }
        );
    };


/* ==========================================================
   PRESET 3 — SULFUR ISLAND
   ========================================================== */

YU.presets.sulfur_island =
    function() {

        return yetiConfirmPreset(
            "Sulfur Island",
            function() {

                const w =
                    yetiWorldWidth();

                const h =
                    yetiWorldHeight();

                const water =
                    yetiElement(
                        "water",
                        null
                    );

                const rock =
                    yetiElement(
                        "rock",
                        "sand"
                    );

                const sulfur =
                    yetiElement(
                        "sulfur",
                        rock
                    );

                const waterLine =
                    Math.floor(
                        h * 0.55
                    );

                if (water) {
                    yetiFillRect(
                        water,
                        0,
                        waterLine,
                        w - 1,
                        h - 1
                    );
                }

                const cx =
                    Math.floor(
                        w / 2
                    );

                const cy =
                    waterLine - 2;

                yetiFillCircle(
                    rock,
                    cx,
                    cy + 5,
                    Math.max(
                        5,
                        Math.floor(
                            w * 0.09
                        )
                    )
                );

                yetiFillCircle(
                    sulfur,
                    cx,
                    cy,
                    Math.max(
                        4,
                        Math.floor(
                            w * 0.07
                        )
                    )
                );
            }
        );
    };


/* ==========================================================
   PRESET 4 — LAVA OCEAN
   ========================================================== */

YU.presets.lava_ocean =
    function() {

        return yetiConfirmPreset(
            "Lava Ocean",
            function() {

                const w =
                    yetiWorldWidth();

                const h =
                    yetiWorldHeight();

                const lava =
                    yetiElement(
                        "lava",
                        null
                    );

                const magma =
                    yetiElement(
                        "magma",
                        "rock"
                    );

                const basalt =
                    yetiElement(
                        "basalt",
                        "rock"
                    );

                const lavaLine =
                    Math.floor(
                        h * 0.55
                    );

                if (lava) {
                    yetiFillRect(
                        lava,
                        0,
                        lavaLine,
                        w - 1,
                        h - 1
                    );
                }

                /*
                 Basalt island.
                */

                const cx =
                    Math.floor(
                        w / 2
                    );

                const islandRadius =
                    Math.max(
                        5,
                        Math.floor(
                            w * 0.08
                        )
                    );

                yetiFillCircle(
                    basalt,
                    cx,
                    lavaLine - 1,
                    islandRadius
                );

                yetiFillCircle(
                    magma,
                    cx,
                    lavaLine + 3,
                    Math.max(
                        3,
                        islandRadius - 3
                    )
                );
            }
        );
    };


/* ==========================================================
   PRESET 5 — NETHER
   ========================================================== */

YU.presets.nether =
    function() {

        return yetiConfirmPreset(
            "Nether",
            function() {

                const w =
                    yetiWorldWidth();

                const h =
                    yetiWorldHeight();

                const basalt =
                    yetiElement(
                        "basalt",
                        "rock"
                    );

                const magma =
                    yetiElement(
                        "magma",
                        basalt
                    );

                const lava =
                    yetiElement(
                        "lava",
                        null
                    );

                const fire =
                    yetiElement(
                        "fire",
                        null
                    );

                /*
                 Rocky ceiling.
                */

                yetiFillRect(
                    basalt,
                    0,
                    0,
                    w - 1,
                    Math.floor(
                        h * 0.10
                    )
                );

                /*
                 Rocky floor.
                */

                yetiFillRect(
                    basalt,
                    0,
                    Math.floor(
                        h * 0.82
                    ),
                    w - 1,
                    h - 1
                );

                /*
                 Magma layer.
                */

                yetiFillRect(
                    magma,
                    0,
                    Math.floor(
                        h * 0.78
                    ),
                    w - 1,
                    Math.floor(
                        h * 0.81
                    )
                );

                /*
                 Lava ocean.
                */

                if (lava) {
                    yetiFillRect(
                        lava,
                        0,
                        Math.floor(
                            h * 0.68
                        ),
                        w - 1,
                        Math.floor(
                            h * 0.77
                        )
                    );
                }

                /*
                 Lava falls.
                */

                if (lava) {

                    const falls = [
                        Math.floor(
                            w * 0.20
                        ),
                        Math.floor(
                            w * 0.50
                        ),
                        Math.floor(
                            w * 0.78
                        )
                    ];

                    for (
                        const x
                        of falls
                    ) {

                        yetiFillRect(
                            lava,
                            x,
                            Math.floor(
                                h * 0.10
                            ) + 1,
                            x + 1,
                            Math.floor(
                                h * 0.45
                            )
                        );
                    }
                }

                /*
                 Random fire near floor.
                */

                if (fire) {

                    for (
                        let i = 0;
                        i < 25;
                        i++
                    ) {

                        const x =
                            Math.floor(
                                Math.random()
                                * w
                            );

                        const y =
                            Math.floor(
                                h * 0.67
                            );

                        yetiCreate(
                            fire,
                            x,
                            y
                        );
                    }
                }
            }
        );
    };


/* ==========================================================
   PRESET 6 — OCEAN
   ========================================================== */

YU.presets.ocean =
    function() {

        return yetiConfirmPreset(
            "Ocean",
            function() {

                const w =
                    yetiWorldWidth();

                const h =
                    yetiWorldHeight();

                const water =
                    yetiElement(
                        "water",
                        null
                    );

                const sand =
                    yetiElement(
                        "sand",
                        "rock"
                    );

                const rock =
                    yetiElement(
                        "rock",
                        sand
                    );

                const plant =
                    yetiRandomElement(
                        [
                            "seaweed",
                            "algae"
                        ],
                        null
                    );

                const fish =
                    yetiElement(
                        "fish",
                        null
                    );

                const waterLine =
                    Math.floor(
                        h * 0.18
                    );

                if (water) {
                    yetiFillRect(
                        water,
                        0,
                        waterLine,
                        w - 1,
                        h - 6
                    );
                }

                yetiFillRect(
                    sand,
                    0,
                    h - 5,
                    w - 1,
                    h - 1
                );

                /*
                 Rocks on ocean floor.
                */

                for (
                    let i = 0;
                    i < 15;
                    i++
                ) {

                    const x =
                        Math.floor(
                            Math.random()
                            * w
                        );

                    yetiFillCircle(
                        rock,
                        x,
                        h - 6,
                        Math.floor(
                            Math.random()
                            * 3
                        ) + 1
                    );
                }

                /*
                 Ocean plants.
                */

                if (plant) {

                    for (
                        let i = 0;
                        i < 30;
                        i++
                    ) {

                        const x =
                            Math.floor(
                                Math.random()
                                * w
                            );

                        const y =
                            h - 6 -
                            Math.floor(
                                Math.random()
                                * 5
                            );

                        yetiCreate(
                            plant,
                            x,
                            y
                        );
                    }
                }

                /*
                 Fish.
                */

                if (fish) {

                    for (
                        let i = 0;
                        i < 20;
                        i++
                    ) {

                        const x =
                            Math.floor(
                                Math.random()
                                * w
                            );

                        const y =
                            waterLine +
                            2 +
                            Math.floor(
                                Math.random()
                                *
                                Math.max(
                                    1,
                                    h -
                                    waterLine -
                                    12
                                )
                            );

                        yetiCreate(
                            fish,
                            x,
                            y
                        );
                    }
                }
            }
        );
    };


/* ==========================================================
   IMMOVABLE BOAT PIXEL LOCK
   Uses ONLY wet_wood and wave_flag.
   No custom boat elements are created.
   ========================================================== */

function yetiMarkBoatPixel(
    pixel
) {

    if (!pixel) {
        return;
    }

    pixel.yetiImmovableBoat =
        true;
}


/* ==========================================================
   BUILD IMMOVABLE BOAT
   ========================================================== */

function yetiBuildBoat(
    centerX,
    deckY
) {

    const wetWood =
        yetiElement(
            "wet_wood",
            "wood"
        );

    const flag =
        yetiElement(
            "wave_flag",
            null
        );

    /*
     Hull.
    */

    for (
        let dx = -8;
        dx <= 8;
        dx++
    ) {

        const y =
            deckY +
            Math.floor(
                Math.abs(dx) / 4
            );

        const pixel =
            yetiCreate(
                wetWood,
                centerX + dx,
                y
            );

        yetiMarkBoatPixel(
            pixel
        );
    }

    /*
     Second hull layer.
    */

    for (
        let dx = -6;
        dx <= 6;
        dx++
    ) {

        const pixel =
            yetiCreate(
                wetWood,
                centerX + dx,
                deckY + 2
            );

        yetiMarkBoatPixel(
            pixel
        );
    }

    /*
     Deck.
    */

    for (
        let dx = -6;
        dx <= 6;
        dx++
    ) {

        const pixel =
            yetiCreate(
                wetWood,
                centerX + dx,
                deckY - 1
            );

        yetiMarkBoatPixel(
            pixel
        );
    }

    /*
     Mast.
    */

    for (
        let dy = 2;
        dy <= 9;
        dy++
    ) {

        const pixel =
            yetiCreate(
                wetWood,
                centerX,
                deckY - dy
            );

        yetiMarkBoatPixel(
            pixel
        );
    }

    /*
     Flag.
    */

    if (flag) {

        for (
            let dx = 1;
            dx <= 4;
            dx++
        ) {

            const pixel =
                yetiCreate(
                    flag,
                    centerX + dx,
                    deckY - 9
                );

            yetiMarkBoatPixel(
                pixel
            );
        }
    }
}


/* ==========================================================
   PRESET 7 — IMMOVABLE BOAT
   ========================================================== */

YU.presets.immovable_boat =
    function() {

        return yetiConfirmPreset(
            "Immovable Boat",
            function() {

                const w =
                    yetiWorldWidth();

                const h =
                    yetiWorldHeight();

                const water =
                    yetiElement(
                        "water",
                        null
                    );

                const sand =
                    yetiElement(
                        "sand",
                        "rock"
                    );

                const waterLine =
                    Math.floor(
                        h * 0.50
                    );

                if (water) {

                    yetiFillRect(
                        water,
                        0,
                        waterLine,
                        w - 1,
                        h - 5
                    );
                }

                yetiFillRect(
                    sand,
                    0,
                    h - 4,
                    w - 1,
                    h - 1
                );

                yetiBuildBoat(
                    Math.floor(
                        w / 2
                    ),
                    waterLine - 1
                );
            }
        );
    };


/* ==========================================================
   IMMOVABLE BOAT MOVEMENT PROTECTION
   ========================================================== */

function yetiInstallBoatLock() {

    if (
        YU.boatLockInstalled
    ) {
        return;
    }

    if (
        typeof window.tryMove
        !== "function"
    ) {
        return;
    }

    YU.boatLockInstalled =
        true;

    const originalTryMove =
        window.tryMove;

    window.tryMove =
        function(
            pixel,
            nx,
            ny
        ) {

            if (
                pixel &&
                pixel
                    .yetiImmovableBoat
            ) {
                return false;
            }

            return originalTryMove
                .apply(
                    this,
                    arguments
                );
        };
}


/* ==========================================================
   PRESET API
   ========================================================== */

window.yetiPreset =
    function(name) {

        if (
            typeof name
            !== "string"
        ) {
            return Object.keys(
                YU.presets
            );
        }

        const normalized =
            name
                .toLowerCase()
                .trim()
                .replace(
                    /\s+/g,
                    "_"
                )
                .replace(
                    /-/g,
                    "_"
                );

        if (
            !YU.presets[
                normalized
            ]
        ) {

            return (
                "Unknown preset: " +
                name +
                ". Available: " +
                Object.keys(
                    YU.presets
                ).join(", ")
            );
        }

        return YU.presets[
            normalized
        ]();
    };


/* ==========================================================
   PRESET MENU
   ========================================================== */

window.yetiPresetMenu =
    function() {

        const choices = [
            "Normal World",
            "Skyblock",
            "Sulfur Island",
            "Lava Ocean",
            "Nether",
            "Ocean",
            "Immovable Boat"
        ];

        const message =
            "YetiUtils World Presets\n\n" +
            choices
                .map(
                    function(
                        item,
                        index
                    ) {
                        return (
                            (index + 1) +
                            ". " +
                            item
                        );
                    }
                )
                .join("\n") +
            "\n\nEnter 1-7:";

        if (
            typeof window.prompt
            !== "function"
        ) {
            return choices;
        }

        const result =
            window.prompt(
                message
            );

        if (
            result === null
        ) {
            return false;
        }

        const number =
            Number(result);

        const presetKeys = [
            "normal",
            "skyblock",
            "sulfur_island",
            "lava_ocean",
            "nether",
            "ocean",
            "immovable_boat"
        ];

        if (
            number < 1 ||
            number > 7 ||
            !Number.isInteger(
                number
            )
        ) {
            return false;
        }

        return YU.presets[
            presetKeys[
                number - 1
            ]
        ]();
    };


/* ==========================================================
   INSTALL HABITAT SYSTEM
   ========================================================== */

function yetiInstallHabitats() {

    /*
     Land animals.
    */

    for (
        const name
        of YU.landAnimals
    ) {

        yetiWrapHabitat(
            name,
            "land"
        );
    }

    /*
     Sea animals.
    */

    for (
        const name
        of YU.seaAnimals
    ) {

        yetiWrapHabitat(
            name,
            "sea"
        );
    }
}


/* ==========================================================
   INSTALL FINAL PATCHES
   ========================================================== */

function yetiInstallAll() {

    if (
        YU.installComplete
    ) {
        return;
    }

    YU.installComplete =
        true;

    /*
     Vanilla element patches.
    */

    yetiInstallBonePowder();

    yetiPatchVanillaFilter();

    yetiInstallButtonSmash();

    yetiPatchTornado();

    yetiInstallShroomHumanInfection();

    yetiInstallHazmatProtection();

    yetiInstallTintedGlassBlocking();

    /*
     Global systems.
    */

    yetiInstallGodmode();

    yetiInstallBoatLock();

    yetiInstallHabitats();

    yetiStartLoops();

    /*
     Expose useful functions.
    */

    YU.clearWorld =
        yetiClearWorld;

    YU.setSpeed =
        yetiSetSpeed;

    YU.zoomTo =
        window.yetiZoom;

    YU.preset =
        window.yetiPreset;

    YU.presetMenu =
        window.yetiPresetMenu;

    YU.installed =
        true;
}


/* ==========================================================
   SANDBOXELS LOAD HOOK
   ========================================================== */

if (
    typeof runAfterLoad
    === "function"
) {

    runAfterLoad(
        function() {
            yetiInstallAll();
        }
    );
}
else {

    /*
     Fallback for Sandboxels builds where
     runAfterLoad is unavailable.
    */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function() {

                setTimeout(
                    yetiInstallAll,
                    100
                );
            }
        );
    }
    else {

        setTimeout(
            yetiInstallAll,
            100
        );
    }
}


/* ==========================================================
   YETIUTILS READY MESSAGE
   ========================================================== */

try {

    console.log(
        "[YetiUtils] " +
        YU.version +
        " loaded."
    );

    console.log(
        "[YetiUtils] Presets: " +
        "Normal, Skyblock, Sulfur Island, " +
        "Lava Ocean, Nether, Ocean, " +
        "Immovable Boat."
    );

}
catch (error) {
    /* Console unavailable — ignore. */
}


/* ==========================================================
   END YETIUTILS
   ========================================================== */

})();