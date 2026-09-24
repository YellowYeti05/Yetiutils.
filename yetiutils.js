/*
 YetiUtils for Sandboxels
 File: yetiutils.js
 Complete Combined Build
*/

(function () {
"use strict";

const YU = window.YetiUtils = window.YetiUtils || {};

YU.version = "1.0.0";

YU.water = new Set([
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

YU.maxSpeed = 10000;
YU.antiLag = true;
YU.fps = 60;
YU.targetFPS = 30;
YU.zoom = 1;


// ============================================================
// HELPERS
// ============================================================

function exists(name) {
    return !!(
        window.elements &&
        elements[name]
    );
}

function elem(name,fallback) {
    return exists(name)
        ? name
        : fallback;
}

function empty(x,y) {
    return (
        !outOfBounds(x,y) &&
        isEmpty(x,y)
    );
}

function pget(x,y) {

    if(outOfBounds(x,y)) {
        return null;
    }

    return pixelMap[x]?.[y] || null;
}

function around(pixel,radius=1) {

    const found = [];

    for(
        let dx=-radius;
        dx<=radius;
        dx++
    ) {

        for(
            let dy=-radius;
            dy<=radius;
            dy++
        ) {

            if(dx===0 && dy===0) {
                continue;
            }

            const p = pget(
                pixel.x+dx,
                pixel.y+dy
            );

            if(p) {
                found.push(p);
            }
        }
    }

    return found;
}

function safeCreate(name,x,y) {

    if(
        exists(name) &&
        empty(x,y)
    ) {

        createPixel(name,x,y);

        return pget(x,y);
    }

    return null;
}

function safeChange(pixel,name) {

    if(
        pixel &&
        exists(name) &&
        pixel.element !== name
    ) {

        changePixel(pixel,name);
    }
}

function charged(pixel) {

    return !!(
        pixel &&
        (
            pixel.charge ||
            pixel.chargeCD
        )
    );
}

function isWater(pixel) {

    return !!(
        pixel &&
        YU.water.has(pixel.element)
    );
}

function isGod(pixel) {

    return !!pixel?.godmode;
}

function killPixel(pixel,replacement) {

    if(
        !pixel ||
        isGod(pixel)
    ) {
        return;
    }

    if(
        replacement &&
        exists(replacement)
    ) {

        changePixel(
            pixel,
            replacement
        );

    } else {

        deletePixel(
            pixel.x,
            pixel.y
        );
    }
}

function exactColor(pixel,color) {

    if(!pixel || !color) {
        return;
    }

    pixel.color = color;

    pixel.yetiUltraPainted = true;

    pixel.yetiUltraColor = color;
}

function selectedColor() {

    return (
        window.currentColor ||
        window.mouseColor ||
        window.color ||
        "#ff00ff"
    );
}


// ============================================================
// LAPIS
// ============================================================

elements.lapis = {

    color:[
        "#1f4eb5",
        "#285bc7",
        "#173d99"
    ],

    behavior:behaviors.POWDER,

    category:"land",

    state:"solid",

    density:2750,

    tempHigh:1100,

    stateHigh:"molten_lapis",

    breakInto:"lapis_powder"
};


elements.lapis_powder = {

    color:[
        "#2f63ce",
        "#204eae"
    ],

    behavior:behaviors.POWDER,

    category:"powders",

    state:"solid",

    density:1800,

    tempHigh:1050,

    stateHigh:"molten_lapis"
};


elements.molten_lapis = {

    color:[
        "#405dff",
        "#273be6"
    ],

    behavior:behaviors.LIQUID,

    category:"states",

    hidden:true,

    state:"liquid",

    density:2400,

    temp:1200,

    tempLow:1050,

    stateLow:"lapis"
};


// ============================================================
// BONE POWDER
// ============================================================

elements.bone_powder = {

    color:[
        "#eee8d7",
        "#d9d1bc"
    ],

    behavior:behaviors.POWDER,

    category:"powders",

    state:"solid",

    density:900
};

if(exists("bone")) {

    elements.bone.breakInto =
        "bone_powder";
}


// ============================================================
// STRAWBERRY
// ============================================================

elements.strawberry = {

    color:[
        "#ef3340",
        "#c9182b",
        "#ff4d5a"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid",

    density:750,

    breakInto:"strawberry_juice",

    reactions:{

        sugar:{

            elem1:"sweet_strawberry",

            elem2:null
        }
    }
};


elements.strawberry_juice = {

    color:[
        "#d51e35",
        "#f13b4d"
    ],

    behavior:behaviors.LIQUID,

    category:"liquids",

    state:"liquid",

    density:1040,

    tempLow:-2,

    stateLow:"strawberry_ice",

    tempHigh:100,

    stateHigh:[
        "steam",
        "sugar"
    ]
};


elements.strawberry_ice = {

    color:[
        "#e86677",
        "#f18b99"
    ],

    behavior:behaviors.WALL,

    category:"states",

    hidden:true,

    state:"solid",

    tempHigh:-1,

    stateHigh:"strawberry_juice"
};


elements.sweet_strawberry = {

    color:[
        "#ff3652",
        "#d51a37"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid",

    density:780,

    breakInto:"strawberry_juice"
};


// ============================================================
// SPECIAL WATER
// ============================================================

elements.unfreezable_water = {

    color:"#3b8fff",

    behavior:behaviors.LIQUID,

    category:"liquids",

    state:"liquid",

    density:997,

    conduct:0.02,

    tempHigh:100,

    stateHigh:"steam"
};


elements.unheatable_water = {

    color:"#54a7ff",

    behavior:behaviors.LIQUID,

    category:"liquids",

    state:"liquid",

    density:997,

    conduct:0.02,

    tempLow:0,

    stateLow:"ice",

    tick(pixel) {

        if(pixel.temp > 20) {

            pixel.temp = 20;

            if(
                typeof pixelTempCheck
                === "function"
            ) {

                pixelTempCheck(pixel);
            }
        }
    }
};


// ============================================================
// GROWTH KELP
// ============================================================

elements.growth_kelp = {

    color:[
        "#1b7f3a",
        "#2e9b4d",
        "#17652f"
    ],

    behavior:
        behaviors.STURDYPOWDER ||
        behaviors.POWDER,

    category:"life",

    state:"solid",

    density:900,

    tick(pixel) {

        for(
            const p
            of around(pixel,1)
        ) {

            if(Math.random() > 0.02) {
                continue;
            }

            // Growth Kelp only performs
            // these two transformations.

            if(
                p.element ===
                "sea_monkey"
            ) {

                safeChange(
                    p,
                    "brine_shrimp"
                );

            } else if(
                p.element ===
                "fish"
            ) {

                safeChange(
                    p,
                    "shark"
                );
            }
        }
    }
};


// ============================================================
// LIZARD
// ============================================================

elements.lizard_slime = {

    color:[
        "#66bb55",
        "#7acc63"
    ],

    behavior:behaviors.LIQUID,

    category:"liquids",

    state:"liquid",

    density:1100,

    tempLow:-5,

    stateLow:"lizard_slime_ice",

    viscosity:1200
};


elements.lizard_slime_ice = {

    color:[
        "#9ddf92",
        "#b5e8ac"
    ],

    behavior:behaviors.WALL,

    category:"states",

    hidden:true,

    state:"solid",

    tempHigh:-4,

    stateHigh:"lizard_slime",

    breakInto:"lizard_slime"
};


elements.lizard = {

    color:[
        "#548c39",
        "#75a94c",
        "#3f702d"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    density:1050,

    tempHigh:80,

    stateHigh:
        elem(
            "cooked_meat",
            "meat"
        ),

    tempLow:-20,

    stateLow:
        elem(
            "frozen_meat",
            "meat"
        ),

    breakInto:
        elem(
            "meat",
            "blood"
        ),

    tick(pixel) {

        const dirs = [
            [1,0],
            [-1,0],
            [0,1]
        ];

        for(
            const [dx,dy]
            of dirs.sort(
                () => Math.random()-.5
            )
        ) {

            const target =
                pget(
                    pixel.x+dx,
                    pixel.y+dy
                );

            if(
                target &&
                [
                    "fly",
                    "ant",
                    "worm"
                ].includes(
                    target.element
                ) &&
                !isGod(target)
            ) {

                deletePixel(
                    target.x,
                    target.y
                );

                break;
            }
        }

        if(
            Math.random()
            < 0.003
        ) {

            safeCreate(
                "lizard_slime",
                pixel.x,
                pixel.y+1
            );
        }

        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// SEA MONKEY
// ============================================================

elements.sea_monkey = {

    color:[
        "#e7a86b",
        "#d88a58"
    ],

    behavior:
        behaviors.SWIM ||
        behaviors.LIQUID,

    category:"life",

    state:"solid",

    density:1020,

    tempHigh:40,

    stateHigh:"dead_bug",

    tempLow:5,

    stateLow:"dead_bug",

    tick(pixel) {

        for(
            const target
            of around(pixel,1)
        ) {

            if(
                [
                    "algae",
                    "plankton"
                ].includes(
                    target.element
                ) &&
                Math.random()
                < 0.08
            ) {

                deletePixel(
                    target.x,
                    target.y
                );
            }


            if(
                target.element
                    === "sea_monkey" &&
                Math.random()
                    < 0.0008
            ) {

                const dirs =
                    window.adjacentCoords ||
                    [
                        [1,0],
                        [-1,0],
                        [0,1],
                        [0,-1]
                    ];


                for(
                    const [dx,dy]
                    of dirs
                ) {

                    if(
                        safeCreate(
                            "sea_monkey",
                            pixel.x+dx,
                            pixel.y+dy
                        )
                    ) {

                        break;
                    }
                }
            }
        }


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// SHRIMP + SUSHI
// ============================================================

elements.uncooked_shrimp = {

    color:[
        "#b98570",
        "#d39b83"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid",

    tempHigh:65,

    stateHigh:"cooked_shrimp"
};


elements.cooked_shrimp = {

    color:[
        "#f08b78",
        "#ffad92"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid"
};


elements.sushi = {

    color:[
        "#f3d7c6",
        "#e88d82",
        "#222222"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid",

    tempHigh:70,

    stateHigh:"cooked_sushi"
};


elements.cooked_sushi = {

    color:[
        "#c77d65",
        "#8f563f"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid"
};


// ============================================================
// BRINE SHRIMP
// ============================================================

elements.brine_shrimp = {

    color:[
        "#dc8d72",
        "#f0aa8c"
    ],

    behavior:
        behaviors.SWIM ||
        behaviors.LIQUID,

    category:"life",

    state:"solid",

    density:1025,

    breakInto:"uncooked_shrimp",

    tempHigh:65,

    stateHigh:"cooked_shrimp",

    tick(pixel) {

        for(
            const target
            of around(pixel,1)
        ) {

            if(
                target.element
                    === "algae" &&
                Math.random()
                    < 0.08
            ) {

                deletePixel(
                    target.x,
                    target.y
                );
            }
        }


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// SHARK
// ============================================================

elements.shark_tooth = {

    color:[
        "#f4f0df",
        "#ded8c5"
    ],

    behavior:behaviors.POWDER,

    category:"powders",

    state:"solid",

    density:2200,

    breakInto:"bone_powder"
};


elements.solid_shark_tooth = {

    color:[
        "#eee9d8",
        "#d5cfbd"
    ],

    behavior:behaviors.WALL,

    category:"solids",

    state:"solid",

    density:2200
};


elements.shark = {

    color:[
        "#667783",
        "#7d8e99",
        "#4f606b"
    ],

    behavior:
        behaviors.SWIM ||
        behaviors.LIQUID,

    category:"life",

    state:"solid",

    density:1080,

    breakInto:[
        "sushi",
        "sushi",
        "sushi",
        "shark_tooth"
    ],

    tempHigh:70,

    stateHigh:"cooked_sushi",

    tick(pixel) {

        for(
            const target
            of around(pixel,1)
        ) {

            if(
                YU.seaAnimals.has(
                    target.element
                ) &&
                target.element
                    !== "shark" &&
                !isGod(target) &&
                Math.random()
                    < 0.30
            ) {

                if(
                    target.element
                    === "brine_shrimp"
                ) {

                    safeChange(
                        target,
                        "uncooked_shrimp"
                    );

                } else {

                    deletePixel(
                        target.x,
                        target.y
                    );
                }

                break;
            }
        }


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};// ============================================================
// RED MEAT
// ============================================================

elements.red_meat = {

    color:[
        "#a92d34",
        "#c53b40",
        "#8d232b"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid",

    density:1050,

    tempHigh:70,

    stateHigh:"cooked_red_meat",

    tempLow:-10,

    stateLow:"frozen_red_meat",

    burn:20,

    burnTime:200,

    burnInto:[
        "smoke",
        "ash"
    ]
};


elements.cooked_red_meat = {

    color:[
        "#70402f",
        "#8b503a"
    ],

    behavior:behaviors.POWDER,

    category:"food",

    state:"solid",

    density:1000
};


elements.frozen_red_meat = {

    color:[
        "#a9666a",
        "#c28486"
    ],

    behavior:behaviors.WALL,

    category:"states",

    hidden:true,

    state:"solid",

    tempHigh:0,

    stateHigh:"red_meat"
};


// ============================================================
// TIGER PARTS
// ============================================================

elements.tiger_fang = {

    color:[
        "#f1e6c8",
        "#d9cba8"
    ],

    behavior:behaviors.POWDER,

    category:"solids",

    state:"solid",

    density:2200,

    breakInto:"bone_powder"
};


elements.tiger_pelt = {

    color:[
        "#df7f22",
        "#1e1814",
        "#f2a33b"
    ],

    behavior:behaviors.POWDER,

    category:"solids",

    state:"solid",

    density:250,

    burn:35,

    burnTime:250,

    burnInto:"ash"
};


// ============================================================
// TIGER
// ============================================================

function tigerHunt(pixel) {

    for(
        const target
        of around(pixel,1)
    ) {

        if(
            [
                "human",
                "head",
                "body",
                "lizard"
            ].includes(
                target.element
            ) &&
            !isGod(target) &&
            Math.random() < 0.12
        ) {

            killPixel(
                target,
                "red_meat"
            );

            break;
        }
    }
}


elements.tiger = {

    color:[
        "#e78421",
        "#111111",
        "#f39c31"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    density:1080,

    tempHigh:80,

    stateHigh:"cooked_red_meat",

    tempLow:-20,

    stateLow:"frozen_red_meat",

    breakInto:[
        "red_meat",
        "red_meat",
        "blood",
        "tiger_fang",
        "tiger_pelt"
    ],

    tick(pixel) {

        tigerHunt(pixel);

        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// TIGER CUB
// ============================================================

elements.tiger_cub = {

    color:[
        "#efa04a",
        "#24201c"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    density:1040,

    tempHigh:80,

    stateHigh:"cooked_red_meat",

    tempLow:-20,

    stateLow:"frozen_red_meat",

    breakInto:[
        "red_meat",
        "blood"
    ],

    tick(pixel) {

        pixel.yetiAge =
            (pixel.yetiAge || 0)
            + 1;


        if(
            pixel.yetiAge >= 1800
        ) {

            safeChange(
                pixel,
                "tiger"
            );

            return;
        }


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// FUNGUS DUST
// ============================================================

elements.fungus_dust = {

    color:[
        "#a89168",
        "#c0ad80",
        "#877552"
    ],

    category:"powders",

    state:"solid",

    // Extremely light.
    density:5,

    // Feather-like floating behavior,
    // but even lighter.
    behavior:[

        "XX|M1%25|XX",

        "M2%25|XX|M2%25",

        "M2%10|M1|M2%10"
    ],

    tick(pixel) {

        for(
            const target
            of around(pixel,1)
        ) {

            // Dust acquires plague
            // by touching plague.

            if(
                target.element ===
                "plague"
            ) {

                pixel.yetiPlague =
                    true;
            }


            // Plague-carrying dust
            // can infect life.

            if(
                pixel.yetiPlague &&
                !isGod(target) &&
                target.element !==
                    "hazmat_human" &&
                elements[
                    target.element
                ]?.category === "life" &&
                Math.random() < 0.08
            ) {

                if(
                    exists("plague")
                ) {

                    safeChange(
                        target,
                        "plague"
                    );
                }
            }
        }
    }
};


// ============================================================
// SHROOM LIFE
// ============================================================

function shroomTick(
    targetName
) {

    return function(pixel) {

        for(
            const target
            of around(pixel,1)
        ) {

            if(
                target.element ===
                    targetName &&
                !isGod(target)
            ) {

                const x =
                    target.x;

                const y =
                    target.y;


                deletePixel(x,y);


                // Slowly reproduce
                // where the infection
                // or cancer was eaten.

                if(
                    Math.random() < 0.20
                ) {

                    safeCreate(
                        pixel.element,
                        x,
                        y
                    );
                }
            }
        }


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    };
}


elements.shroom_infection = {

    color:[
        "#9f5cb5",
        "#c778d6"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    tick:
        shroomTick(
            "infection"
        )
};


elements.shroom_cancer = {

    color:[
        "#6d8f49",
        "#93b55c"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    tick:
        shroomTick(
            "cancer"
        )
};


// ============================================================
// SHROOM HUMAN
// ============================================================

elements.shroom_head = {

    color:[
        "#c55a9f",
        "#f1a3ce",
        "#6e3c66"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    density:1080,

    breakInto:[
        "fungus_dust",
        "blood"
    ]
};


elements.shroom_body = {

    color:[
        "#8d557f",
        "#b271a3"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    density:1100,

    breakInto:[
        "fungus_dust",
        "meat",
        "blood"
    ]
};


elements.shroom_human = {

    color:[
        "#b461a1",
        "#734c70"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    tick(pixel) {

        // Convert the temporary
        // shroom_human into a body
        // and create its head.

        if(
            empty(
                pixel.x,
                pixel.y-1
            )
        ) {

            safeCreate(
                "shroom_head",
                pixel.x,
                pixel.y-1
            );


            safeChange(
                pixel,
                "shroom_body"
            );
        }
    }
};


// ============================================================
// STRONG GLASS
// ============================================================

elements.strong_glass = {

    color:"#b7e7ed",

    behavior:behaviors.WALL,

    category:"solids",

    state:"solid",

    density:2600,

    hardness:0.98,

    tempHigh:1800,

    stateHigh:"molten_glass",

    breakInto:
        elem(
            "glass_shard",
            "sand"
        )
};


// ============================================================
// HAZMAT MATERIAL
// ============================================================

elements.hazmat = {

    color:[
        "#ffd523",
        "#f2bc16"
    ],

    behavior:behaviors.POWDER,

    category:"solids",

    state:"solid",

    reactions:{

        strong_glass:{

            elem1:"hazmat_suit",

            elem2:null
        }
    }
};


// ============================================================
// HAZMAT SUIT
// ============================================================

elements.hazmat_suit = {

    color:[
        "#f7d21f",
        "#303030"
    ],

    behavior:behaviors.POWDER,

    category:"solids",

    state:"solid",

    reactions:{

        human:{

            elem1:null,

            elem2:"hazmat_human"
        }
    }
};


// ============================================================
// HAZMAT HUMAN
// ============================================================

elements.hazmat_human = {

    color:[
        "#f4cf1c",
        "#2e2e2e"
    ],

    behavior:behaviors.POWDER,

    category:"life",

    state:"solid",

    density:1080,

    tempHigh:120,

    stateHigh:
        elem(
            "cooked_meat",
            "meat"
        ),

    breakInto:[
        "meat",
        "blood"
    ],

    tick(pixel) {

        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// TINTED GLASS
// ============================================================

elements.tinted_glass = {

    color:[
        "#24262b",
        "#34373e"
    ],

    behavior:behaviors.WALL,

    category:"solids",

    state:"solid",

    density:2500,

    hardness:0.95,

    tempHigh:1500,

    stateHigh:"molten_glass",

    breakInto:
        elem(
            "glass_shard",
            "sand"
        ),

    insulate:true
};


// ============================================================
// BOMB STORM
// ============================================================

elements.bomb_storm = {

    color:[
        "#343943",
        "#454b56"
    ],

    behavior:behaviors.GAS,

    category:"weather",

    state:"gas",

    density:1.1,

    tick(pixel) {

        if(
            Math.random() < 0.035
        ) {

            for(
                let y=pixel.y+1;
                y<
                Math.min(
                    height,
                    pixel.y+8
                );
                y++
            ) {

                if(
                    empty(
                        pixel.x,
                        y
                    )
                ) {

                    safeCreate(
                        "bomb",
                        pixel.x,
                        y
                    );

                    break;
                }


                if(
                    pget(
                        pixel.x,
                        y
                    )
                ) {

                    break;
                }
            }
        }
    }
};


// ============================================================
// BULLETS
// ============================================================

function bulletTick(dir) {

    return function(pixel) {

        const nx =
            pixel.x + dir;

        const ny =
            pixel.y;


        if(
            outOfBounds(
                nx,
                ny
            )
        ) {

            deletePixel(
                pixel.x,
                pixel.y
            );

            return;
        }


        const target =
            pget(
                nx,
                ny
            );


        // Keep flying.

        if(!target) {

            tryMove(
                pixel,
                nx,
                ny
            );

            return;
        }


        // Godmode cannot be
        // damaged by bullets.

        if(
            isGod(target)
        ) {

            deletePixel(
                pixel.x,
                pixel.y
            );

            return;
        }


        if(
            typeof breakPixel
            === "function"
        ) {

            breakPixel(
                target
            );

        } else {

            deletePixel(
                target.x,
                target.y
            );
        }


        if(
            pget(
                pixel.x,
                pixel.y
            ) === pixel
        ) {

            deletePixel(
                pixel.x,
                pixel.y
            );
        }
    };
}


elements.bullet_left = {

    color:"#777777",

    behavior:behaviors.WALL,

    category:"weapons",

    state:"solid",

    density:7800,

    tick:
        bulletTick(-1)
};


elements.bullet_right = {

    color:"#777777",

    behavior:behaviors.WALL,

    category:"weapons",

    state:"solid",

    density:7800,

    tick:
        bulletTick(1)
};


// ============================================================
// GODMODE LASER
// ============================================================

elements.godmode_laser = {

    color:[
        "#fff36b",
        "#ffffff",
        "#7df9ff"
    ],

    category:"energy",

    canPlace:false,

    excludeRandom:true,

    tool(pixel) {

        if(!pixel) {
            return;
        }

        pixel.godmode =
            true;

        pixel.yetiGodColor =
            pixel.color;
    }
};


// ============================================================
// GODMODE ENGINE PROTECTION
// ============================================================

function installGodmode() {

    if(
        YU.godInstalled
    ) {

        return;
    }


    YU.godInstalled =
        true;


    // Protect from normal
    // deletion including Void.

    if(
        typeof window.deletePixel
        === "function"
    ) {

        const oldDelete =
            window.deletePixel;


        window.deletePixel =
            function(
                x,
                y,
                force
            ) {

                const target =
                    pget(x,y);


                if(
                    target?.godmode &&
                    !YU.eraseBypass &&
                    !force
                ) {

                    return false;
                }


                return oldDelete.apply(
                    this,
                    arguments
                );
            };
    }


    // Protect from
    // transformations.

    if(
        typeof window.changePixel
        === "function"
    ) {

        const oldChange =
            window.changePixel;


        window.changePixel =
            function(
                pixel,
                element,
                ...rest
            ) {

                if(
                    pixel?.godmode &&
                    !YU.godChangeBypass
                ) {

                    return pixel;
                }


                return oldChange.call(
                    this,
                    pixel,
                    element,
                    ...rest
                );
            };
    }


    // ERASE is the exception.
    // It can destroy Godmode.

    if(
        elements.erase?.tool
    ) {

        const oldErase =
            elements.erase.tool;


        elements.erase.tool =
            function(
                pixel,
                ...args
            ) {

                YU.eraseBypass =
                    true;

                YU.godChangeBypass =
                    true;


                try {

                    return oldErase.call(
                        this,
                        pixel,
                        ...args
                    );

                } finally {

                    YU.eraseBypass =
                        false;

                    YU.godChangeBypass =
                        false;
                }
            };
    }
}


// ============================================================
// HABITAT SYSTEM
// 30 REAL SECONDS
// ============================================================

function habitatTick(
    pixel,
    type
) {

    // Godmode animals do
    // not die from habitat.

    if(
        isGod(pixel)
    ) {

        delete pixel.yetiHabitatSince;

        return;
    }


    let unsafe=false;


    // ------------------------
    // LAND ANIMAL
    // ------------------------

    if(
        type === "land"
    ) {

        let waterCount=0;


        // Approximation of
        // deep water.

        for(
            let dx=-2;
            dx<=2;
            dx++
        ) {

            for(
                let dy=-2;
                dy<=2;
                dy++
            ) {

                if(
                    isWater(
                        pget(
                            pixel.x+dx,
                            pixel.y+dy
                        )
                    )
                ) {

                    waterCount++;
                }
            }
        }


        unsafe =
            waterCount >= 10;
    }


    // ------------------------
    // SEA ANIMAL
    // ------------------------

    else {

        const nearbyWater =
            around(
                pixel,
                1
            ).some(
                isWater
            );


        unsafe =
            !nearbyWater &&
            !isWater(
                pget(
                    pixel.x,
                    pixel.y
                )
            );
    }


    // Safe again.
    // Reset timer.

    if(!unsafe) {

        delete pixel.yetiHabitatSince;

        return;
    }


    if(
        !pixel.yetiHabitatSince
    ) {

        pixel.yetiHabitatSince =
            Date.now();
    }


    // Not yet 30 seconds.

    if(
        Date.now()
        - pixel.yetiHabitatSince
        < 30000
    ) {

        return;
    }


    // ------------------------
    // SEA DEATH
    // ------------------------

    if(
        type === "sea"
    ) {

        if(
            pixel.element ===
            "brine_shrimp"
        ) {

            killPixel(
                pixel,
                "uncooked_shrimp"
            );

        } else if(
            pixel.element ===
            "shark"
        ) {

            killPixel(
                pixel,
                "sushi"
            );

        } else {

            killPixel(
                pixel,
                exists("meat")
                    ? "meat"
                    : null
            );
        }
    }


    // ------------------------
    // LAND DEATH
    // ------------------------

    else {

        if(
            [
                "ant",
                "fly",
                "bee"
            ].includes(
                pixel.element
            )
        ) {

            killPixel(
                pixel,
                elem(
                    "dead_bug",
                    null
                )
            );

        } else if(
            pixel.element ===
                "tiger" ||
            pixel.element ===
                "tiger_cub"
        ) {

            killPixel(
                pixel,
                "red_meat"
            );

        } else {

            killPixel(
                pixel,
                exists("meat")
                    ? "meat"
                    : null
            );
        }
    }
}


function wrapHabitat(
    name,
    type
) {

    if(
        !exists(name)
    ) {

        return;
    }


    const oldTick =
        elements[name].tick;


    elements[name].tick =
        function(pixel) {

            if(oldTick) {

                oldTick.call(
                    this,
                    pixel
                );
            }


            // Make sure the original
            // pixel still exists.

            if(
                pget(
                    pixel.x,
                    pixel.y
                ) === pixel
            ) {

                habitatTick(
                    pixel,
                    type
                );
            }
        };
}// ============================================================
// FILTERS
// ============================================================

function filterPowered(pixel) {
    return charged(pixel);
}


// Solid Filter
// Disabled while electrically powered.

elements.solid_filter = {

    color:[
        "#8fa7b5",
        "#738b99"
    ],

    behavior:behaviors.WALL,

    category:"machines",

    state:"solid",

    conduct:1,

    hardness:1,

    tick(pixel) {

        pixel.yetiFilterDisabled =
            filterPowered(pixel);
    }
};


// Gas Filter
// Disabled while electrically powered.

elements.gas_filter = {

    color:[
        "#a6c8d5",
        "#7ca6b5"
    ],

    behavior:behaviors.WALL,

    category:"machines",

    state:"solid",

    conduct:1,

    hardness:1,

    tick(pixel) {

        pixel.yetiFilterDisabled =
            filterPowered(pixel);
    }
};


// Light Filter
// Absorbs light when unpowered.

elements.light_filter = {

    color:[
        "#292d35",
        "#3a404b"
    ],

    behavior:behaviors.WALL,

    category:"machines",

    state:"solid",

    conduct:1,

    hardness:1,

    tick(pixel) {

        pixel.yetiFilterDisabled =
            filterPowered(pixel);


        if(
            pixel.yetiFilterDisabled
        ) {

            return;
        }


        for(
            const target
            of around(pixel,1)
        ) {

            if(
                [
                    "light",
                    "laser"
                ].includes(
                    target.element
                ) &&
                !isGod(target)
            ) {

                deletePixel(
                    target.x,
                    target.y
                );
            }
        }
    }
};


// Make vanilla filter stop filtering
// while powered.

function patchVanillaFilter() {

    if(
        !exists("filter") ||
        elements.filter.yetiPatched
    ) {

        return;
    }


    elements.filter.yetiPatched =
        true;


    const oldTick =
        elements.filter.tick;


    if(oldTick) {

        elements.filter.tick =
            function(pixel) {

                if(
                    charged(pixel)
                ) {

                    return;
                }


                return oldTick.call(
                    this,
                    pixel
                );
            };
    }
}


// ============================================================
// BUTTON
// ============================================================

elements.button = {

    color:[
        "#b33b32",
        "#df5145"
    ],

    behavior:behaviors.WALL,

    category:"machines",

    state:"solid",

    conduct:1,

    hardness:1,

    tick(pixel) {

        let pressed=false;


        // Pressure from movable
        // material above.

        const above =
            pget(
                pixel.x,
                pixel.y-1
            );


        if(
            above &&
            elements[
                above.element
            ]?.movable !== false
        ) {

            pressed=true;
        }


        // Smash activation flag.

        if(
            pixel.yetiSmashed
        ) {

            pressed=true;

            pixel.yetiSmashed=false;
        }


        if(pressed) {

            pixel.charge=1;
        }


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// TORNADO VARIATIONS
// Acid and perfume are NOT new elements.
// They change the vanilla tornado.
// ============================================================

function patchTornado() {

    if(
        !exists("tornado") ||
        elements.tornado.yetiPatched
    ) {

        return;
    }


    elements.tornado.yetiPatched=true;


    const oldTick =
        elements.tornado.tick;


    elements.tornado.tick =
        function(pixel) {

            // Check for acid/perfume
            // touching the tornado.

            for(
                const target
                of around(pixel,1)
            ) {

                if(
                    target.element ===
                    "acid" ||
                    target.element ===
                    "perfume"
                ) {

                    pixel.yetiTornadoMaterial =
                        target.element;


                    if(
                        !isGod(target)
                    ) {

                        deletePixel(
                            target.x,
                            target.y
                        );
                    }
                }
            }


            // Preserve vanilla tornado
            // movement/behavior.

            if(oldTick) {

                oldTick.call(
                    this,
                    pixel
                );
            }


            if(
                pget(
                    pixel.x,
                    pixel.y
                ) !== pixel
            ) {

                return;
            }


            // Throw the material
            // being carried.

            if(
                pixel.yetiTornadoMaterial &&
                Math.random() < 0.08
            ) {

                const offsets=[
                    [-2,-1],
                    [-1,-2],
                    [0,-2],
                    [1,-2],
                    [2,-1],
                    [-2,0],
                    [2,0]
                ];


                const pick =
                    offsets[
                        Math.floor(
                            Math.random() *
                            offsets.length
                        )
                    ];


                safeCreate(
                    pixel.yetiTornadoMaterial,
                    pixel.x+pick[0],
                    pixel.y+pick[1]
                );
            }
        };
}


// ============================================================
// ULTRA PAINT
// ============================================================

elements.ultra_paint = {

    color:[
        "#ff00ff",
        "#00ffff",
        "#ffff00"
    ],

    category:"tools",

    canPlace:false,

    excludeRandom:true,

    tool(pixel) {

        if(!pixel) {
            return;
        }


        const color =
            selectedColor();


        exactColor(
            pixel,
            color
        );
    }
};


// ============================================================
// CAMERA
// ============================================================

function cameraCapture(pixel) {

    // Camera faces RIGHT.
    //
    // Capture everything in front,
    // including objects farther behind
    // other objects. No occlusion check.

    const captured=[];


    for(
        let dx=1;
        dx<=20;
        dx++
    ) {

        for(
            let dy=-5;
            dy<=5;
            dy++
        ) {

            const target =
                pget(
                    pixel.x+dx,
                    pixel.y+dy
                );


            if(!target) {
                continue;
            }


            captured.push({

                dx:dx,

                dy:dy,

                color:
                    target.yetiUltraPainted
                        ? target.yetiUltraColor
                        : target.color
            });
        }
    }


    // Find paper shreds next
    // to the camera.

    let paper=null;


    for(
        const target
        of around(pixel,1)
    ) {

        if(
            target.element ===
            "paper_shreds"
        ) {

            paper=target;

            break;
        }
    }


    if(!paper) {

        return;
    }


    deletePixel(
        paper.x,
        paper.y
    );


    // Print the picture to the
    // LEFT side of the camera.
    //
    // Each photographed pixel becomes
    // a paint pixel with its captured
    // color.

    const scaleX=1;


    for(
        const item
        of captured
    ) {

        const printX =
            pixel.x
            - 2
            - item.dx * scaleX;


        const printY =
            pixel.y
            + item.dy;


        if(
            outOfBounds(
                printX,
                printY
            ) ||
            !isEmpty(
                printX,
                printY
            )
        ) {

            continue;
        }


        if(
            exists("paint")
        ) {

            createPixel(
                "paint",
                printX,
                printY
            );


            const printed =
                pget(
                    printX,
                    printY
                );


            if(printed) {

                printed.color =
                    item.color;


                printed.yetiUltraPainted =
                    true;


                printed.yetiUltraColor =
                    item.color;
            }
        }
    }
}


elements.camera = {

    color:[
        "#383b40",
        "#16181b",
        "#59707c"
    ],

    behavior:behaviors.WALL,

    category:"machines",

    state:"solid",

    conduct:1,

    hardness:1,

    tick(pixel) {

        const powered =
            charged(pixel);


        // Only print once when
        // electricity first arrives.

        if(
            powered &&
            !pixel.yetiCameraPowered
        ) {

            cameraCapture(pixel);
        }


        pixel.yetiCameraPowered =
            powered;


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// HYDRAULIC PRESS
// ============================================================

function hydraulicPress(pixel) {

    // Press a 7-wide area downward.

    for(
        let depth=1;
        depth<=15;
        depth++
    ) {

        for(
            let dx=-3;
            dx<=3;
            dx++
        ) {

            const target =
                pget(
                    pixel.x+dx,
                    pixel.y+depth
                );


            if(
                !target ||
                isGod(target)
            ) {

                continue;
            }


            const belowX =
                target.x;


            const belowY =
                target.y+1;


            // Push downward first.

            if(
                empty(
                    belowX,
                    belowY
                )
            ) {

                tryMove(
                    target,
                    belowX,
                    belowY
                );

                continue;
            }


            // Flatten sideways.

            const directions =
                Math.random() < 0.5
                ? [-1,1]
                : [1,-1];


            let moved=false;


            for(
                const dir
                of directions
            ) {

                if(
                    empty(
                        target.x+dir,
                        target.y
                    )
                ) {

                    tryMove(
                        target,
                        target.x+dir,
                        target.y
                    );

                    moved=true;

                    break;
                }
            }


            // If completely trapped,
            // try breaking it.

            if(
                !moved &&
                typeof breakPixel
                === "function"
            ) {

                breakPixel(target);
            }
        }
    }
}


elements.hydraulic_press = {

    color:[
        "#555b61",
        "#737b82",
        "#292d31"
    ],

    behavior:behaviors.WALL,

    category:"machines",

    state:"solid",

    conduct:1,

    hardness:1,

    tick(pixel) {

        const powered =
            charged(pixel);


        if(
            powered &&
            !pixel.yetiPressPowered
        ) {

            hydraulicPress(pixel);
        }


        pixel.yetiPressPowered =
            powered;


        if(
            typeof doDefaults
            === "function"
        ) {

            doDefaults(pixel);
        }
    }
};


// ============================================================
// PIXEL RESIZE TOOL
// ============================================================

YU.pixelResizeAmount=1;


elements.pixel_resize = {

    color:[
        "#57a8ff",
        "#8dc5ff"
    ],

    category:"tools",

    canPlace:false,

    excludeRandom:true,

    tool(pixel) {

        if(!pixel) {
            return;
        }


        // Store a size value on the
        // selected pixel for YetiUtils
        // compatible systems.

        pixel.yetiPixelSize =
            Math.max(
                1,
                Math.min(
                    10,
                    YU.pixelResizeAmount
                )
            );
    }
};


window.yetiPixelResize =
    function(size) {

        size =
            Number(size);


        if(
            !Number.isFinite(size)
        ) {

            return;
        }


        YU.pixelResizeAmount =
            Math.max(
                1,
                Math.min(
                    10,
                    Math.round(size)
                )
            );


        return YU.pixelResizeAmount;
    };


// ============================================================
// ZOOM
// ============================================================

window.yetiZoom =
    function(amount) {

        amount =
            Number(amount);


        if(
            !Number.isFinite(amount)
        ) {

            return;
        }


        amount =
            Math.max(
                0.25,
                Math.min(
                    4,
                    amount
                )
            );


        YU.zoom=amount;


        const canvas =
            document.querySelector(
                "canvas"
            );


        if(canvas) {

            canvas.style.transformOrigin =
                "top left";


            canvas.style.transform =
                `scale(${amount})`;
        }


        return amount;
    };


// ============================================================
// MAX SPEED 10000
// ============================================================

function setYetiSpeed(value) {

    value =
        Math.max(
            1,
            Math.min(
                YU.maxSpeed,
                Math.round(value)
            )
        );


    if(
        typeof window.tps
        === "number"
    ) {

        window.tps=value;
    }


    if(
        typeof window.TPS
        === "number"
    ) {

        window.TPS=value;
    }


    if(
        typeof window.ticksPerSecond
        === "number"
    ) {

        window.ticksPerSecond=value;
    }


    YU.currentSpeed=value;


    return value;
}


window.yetiSpeed =
    setYetiSpeed;


// ============================================================
// ANTI-LAG
// ============================================================

YU.currentSpeed =
    YU.currentSpeed || 30;


let yetiLastFrame =
    performance.now();


let yetiFrames=0;


let yetiFpsTimer =
    performance.now();


function yetiFrame(now) {

    yetiFrames++;


    if(
        now-yetiFpsTimer
        >= 1000
    ) {

        YU.fps =
            Math.round(
                yetiFrames *
                1000 /
                (
                    now-yetiFpsTimer
                )
            );


        yetiFrames=0;

        yetiFpsTimer=now;


        if(YU.antiLag) {

            // Emergency lag.

            if(
                YU.fps < 15
            ) {

                setYetiSpeed(
                    Math.max(
                        1,
                        YU.currentSpeed
                        * 0.5
                    )
                );
            }


            // Moderate lag.

            else if(
                YU.fps <
                YU.targetFPS
            ) {

                setYetiSpeed(
                    Math.max(
                        1,
                        YU.currentSpeed
                        * 0.8
                    )
                );
            }
        }
    }


    yetiLastFrame=now;


    requestAnimationFrame(
        yetiFrame
    );
}


requestAnimationFrame(
    yetiFrame
);


window.yetiAntiLagOn =
    function() {

        YU.antiLag=true;

        return "YetiUtils Anti-Lag ON";
    };


window.yetiAntiLagOff =
    function() {

        YU.antiLag=false;

        return "YetiUtils Anti-Lag OFF";
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
    };// ============================================================
// WORLD PRESET HELPERS
// ============================================================

function yetiClearWorld() {

    if(
        typeof pixelMap === "undefined"
    ) {
        return;
    }

    for(
        let x=0;
        x<width;
        x++
    ) {

        for(
            let y=0;
            y<height;
            y++
        ) {

            const pixel =
                pget(x,y);

            if(
                pixel &&
                !isGod(pixel)
            ) {

                deletePixel(x,y);
            }
        }
    }
}


function yetiFill(
    element,
    x1,
    y1,
    x2,
    y2
) {

    if(!exists(element)) {
        return;
    }

    x1=Math.max(
        0,
        Math.floor(x1)
    );

    y1=Math.max(
        0,
        Math.floor(y1)
    );

    x2=Math.min(
        width-1,
        Math.floor(x2)
    );

    y2=Math.min(
        height-1,
        Math.floor(y2)
    );


    for(
        let x=x1;
        x<=x2;
        x++
    ) {

        for(
            let y=y1;
            y<=y2;
            y++
        ) {

            safeCreate(
                element,
                x,
                y
            );
        }
    }
}


function yetiLine(
    element,
    x1,
    y1,
    x2,
    y2
) {

    if(!exists(element)) {
        return;
    }

    const dx =
        Math.abs(x2-x1);

    const dy =
        Math.abs(y2-y1);

    const sx =
        x1<x2 ? 1 : -1;

    const sy =
        y1<y2 ? 1 : -1;

    let err =
        dx-dy;


    while(true) {

        safeCreate(
            element,
            x1,
            y1
        );


        if(
            x1===x2 &&
            y1===y2
        ) {
            break;
        }


        const e2 =
            2*err;


        if(e2 > -dy) {

            err-=dy;

            x1+=sx;
        }


        if(e2 < dx) {

            err+=dx;

            y1+=sy;
        }
    }
}


// ============================================================
// NORMAL WORLD
// ============================================================

function presetNormalWorld() {

    yetiClearWorld();


    const ground =
        Math.floor(
            height*0.68
        );


    yetiFill(
        "rock",
        0,
        ground+6,
        width-1,
        height-1
    );


    yetiFill(
        "dirt",
        0,
        ground+1,
        width-1,
        ground+5
    );


    yetiFill(
        "grass",
        0,
        ground,
        width-1,
        ground
    );
}


// ============================================================
// SKYBLOCK
// ============================================================

function presetSkyblock() {

    yetiClearWorld();


    const cx =
        Math.floor(
            width/2
        );

    const cy =
        Math.floor(
            height/2
        );


    // Floating island.

    yetiFill(
        "grass",
        cx-6,
        cy,
        cx+6,
        cy
    );


    yetiFill(
        "dirt",
        cx-5,
        cy+1,
        cx+5,
        cy+3
    );


    yetiFill(
        "dirt",
        cx-3,
        cy+4,
        cx+3,
        cy+5
    );


    yetiFill(
        "rock",
        cx-1,
        cy+6,
        cx+1,
        cy+7
    );
}


// ============================================================
// SULFUR ISLAND
// ============================================================

function presetSulfurIsland() {

    yetiClearWorld();


    const waterTop =
        Math.floor(
            height*0.60
        );


    yetiFill(
        "water",
        0,
        waterTop,
        width-1,
        height-1
    );


    const cx =
        Math.floor(
            width/2
        );


    const islandTop =
        waterTop-8;


    yetiFill(
        elem(
            "sulfur",
            "sand"
        ),
        cx-10,
        islandTop,
        cx+10,
        waterTop+1
    );


    yetiFill(
        "rock",
        cx-7,
        waterTop+2,
        cx+7,
        waterTop+5
    );
}


// ============================================================
// LAVA OCEAN
// ============================================================

function presetLavaOcean() {

    yetiClearWorld();


    const lavaTop =
        Math.floor(
            height*0.58
        );


    yetiFill(
        elem(
            "lava",
            "magma"
        ),
        0,
        lavaTop,
        width-1,
        height-1
    );


    const cx =
        Math.floor(
            width/2
        );


    yetiFill(
        elem(
            "basalt",
            "rock"
        ),
        cx-10,
        lavaTop-5,
        cx+10,
        lavaTop+4
    );


    yetiFill(
        "rock",
        cx-7,
        lavaTop-7,
        cx+7,
        lavaTop-6
    );
}


// ============================================================
// NETHER
// ============================================================

function presetNether() {

    yetiClearWorld();


    const ceiling =
        Math.max(
            3,
            Math.floor(
                height*0.10
            )
        );


    const lavaTop =
        Math.floor(
            height*0.72
        );


    const stone =
        elem(
            "basalt",
            "rock"
        );


    // Ceiling.

    yetiFill(
        stone,
        0,
        0,
        width-1,
        ceiling
    );


    // Lava ocean.

    yetiFill(
        elem(
            "lava",
            "magma"
        ),
        0,
        lavaTop,
        width-1,
        height-1
    );


    // Rocky floor pockets.

    for(
        let x=0;
        x<width;
        x+=8
    ) {

        if(
            Math.random()
            < 0.65
        ) {

            yetiFill(
                stone,
                x,
                lavaTop-2,
                Math.min(
                    width-1,
                    x+4
                ),
                lavaTop
            );
        }
    }


    // Lava falls.

    for(
        let x=6;
        x<width;
        x+=18
    ) {

        if(
            Math.random()
            < 0.55
        ) {

            yetiLine(
                elem(
                    "lava",
                    "magma"
                ),
                x,
                ceiling+1,
                x,
                Math.min(
                    height-1,
                    lavaTop+2
                )
            );
        }
    }


    // Fire pockets.

    if(exists("fire")) {

        for(
            let x=4;
            x<width;
            x+=10
        ) {

            if(
                Math.random()
                < 0.45
            ) {

                safeCreate(
                    "fire",
                    x,
                    lavaTop-3
                );
            }
        }
    }
}


// ============================================================
// OCEAN
// ============================================================

function presetOcean() {

    yetiClearWorld();


    const waterTop =
        Math.floor(
            height*0.18
        );


    const floor =
        Math.floor(
            height*0.84
        );


    yetiFill(
        "water",
        0,
        waterTop,
        width-1,
        floor-1
    );


    yetiFill(
        elem(
            "sand",
            "dirt"
        ),
        0,
        floor,
        width-1,
        height-1
    );


    // Rocks.

    for(
        let x=4;
        x<width;
        x+=12
    ) {

        safeCreate(
            "rock",
            x,
            floor-1
        );
    }


    // Sea plants.

    const plant =
        exists("seaweed")
            ? "seaweed"
            : (
                exists("algae")
                    ? "algae"
                    : null
            );


    if(plant) {

        for(
            let x=3;
            x<width;
            x+=8
        ) {

            if(
                Math.random()
                < 0.7
            ) {

                safeCreate(
                    plant,
                    x,
                    floor-1
                );
            }
        }
    }


    // Fish.

    if(exists("fish")) {

        for(
            let i=0;
            i<
            Math.max(
                3,
                Math.floor(
                    width/12
                )
            );
            i++
        ) {

            const x =
                2 +
                Math.floor(
                    Math.random()
                    * Math.max(
                        1,
                        width-4
                    )
                );


            const y =
                waterTop+2 +
                Math.floor(
                    Math.random()
                    * Math.max(
                        1,
                        floor-waterTop-5
                    )
                );


            safeCreate(
                "fish",
                x,
                y
            );
        }
    }
}


// ============================================================
// IMMOVABLE BOAT
// Uses vanilla wet_wood + wave_flag.
// Adds NO new boat material.
// ============================================================

function presetImmovableBoat() {

    presetOcean();


    const cx =
        Math.floor(
            width/2
        );


    const waterLine =
        Math.floor(
            height*0.42
        );


    // Hull.

    for(
        let x=cx-10;
        x<=cx+10;
        x++
    ) {

        const distance =
            Math.abs(
                x-cx
            );


        const hullY =
            waterLine
            + Math.floor(
                distance/5
            );


        for(
            let y=waterLine;
            y<=hullY+2;
            y++
        ) {

            const p =
                safeCreate(
                    elem(
                        "wet_wood",
                        "wood"
                    ),
                    x,
                    y
                );


            if(p) {

                // Pixel-level lock used by
                // YetiUtils. No custom boat
                // element is created.

                p.yetiImmovable =
                    true;
            }
        }
    }


    // Deck.

    for(
        let x=cx-8;
        x<=cx+8;
        x++
    ) {

        const p =
            safeCreate(
                elem(
                    "wet_wood",
                    "wood"
                ),
                x,
                waterLine-1
            );


        if(p) {

            p.yetiImmovable=true;
        }
    }


    // Mast.

    for(
        let y=waterLine-10;
        y<waterLine-1;
        y++
    ) {

        const p =
            safeCreate(
                elem(
                    "wet_wood",
                    "wood"
                ),
                cx,
                y
            );


        if(p) {

            p.yetiImmovable=true;
        }
    }


    // Vanilla flag.

    if(
        exists("wave_flag")
    ) {

        const flag =
            safeCreate(
                "wave_flag",
                cx+1,
                waterLine-10
            );


        if(flag) {

            flag.yetiImmovable=true;
        }
    }
}


// ============================================================
// PRESET API
// ============================================================

YU.presets = {

    normal:
        presetNormalWorld,

    skyblock:
        presetSkyblock,

    sulfur:
        presetSulfurIsland,

    lava_ocean:
        presetLavaOcean,

    nether:
        presetNether,

    ocean:
        presetOcean,

    immovable_boat:
        presetImmovableBoat
};


window.yetiPreset =
    function(name) {

        name =
            String(name)
            .toLowerCase()
            .trim()
            .replaceAll(
                " ",
                "_"
            );


        const preset =
            YU.presets[name];


        if(!preset) {

            return (
                "Unknown preset. " +
                "Use normal, skyblock, sulfur, " +
                "lava_ocean, nether, ocean, " +
                "or immovable_boat."
            );
        }


        if(
            !confirm(
                "This will clear your current world. Continue?"
            )
        ) {

            return "Cancelled";
        }


        preset();


        return (
            "Loaded YetiUtils preset: "
            + name
        );
    };


// ============================================================
// PRESET MENU
// ============================================================

function createPresetMenu() {

    if(
        document.getElementById(
            "yetiPresetPanel"
        )
    ) {

        return;
    }


    const panel =
        document.createElement(
            "div"
        );


    panel.id =
        "yetiPresetPanel";


    panel.style.position =
        "fixed";

    panel.style.right =
        "10px";

    panel.style.bottom =
        "10px";

    panel.style.zIndex =
        "99999";

    panel.style.background =
        "rgba(20,20,20,0.92)";

    panel.style.padding =
        "8px";

    panel.style.borderRadius =
        "8px";

    panel.style.fontFamily =
        "sans-serif";

    panel.style.fontSize =
        "12px";

    panel.style.maxWidth =
        "150px";


    const title =
        document.createElement(
            "div"
        );


    title.textContent =
        "YetiUtils Presets";


    title.style.fontWeight =
        "bold";

    title.style.marginBottom =
        "5px";

    title.style.color =
        "white";


    panel.appendChild(
        title
    );


    const presets=[

        [
            "Normal World",
            "normal"
        ],

        [
            "Skyblock",
            "skyblock"
        ],

        [
            "Sulfur Island",
            "sulfur"
        ],

        [
            "Lava Ocean",
            "lava_ocean"
        ],

        [
            "Nether",
            "nether"
        ],

        [
            "Ocean",
            "ocean"
        ],

        [
            "Immovable Boat",
            "immovable_boat"
        ]
    ];


    for(
        const [label,name]
        of presets
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            label;


        button.style.display =
            "block";

        button.style.width =
            "100%";

        button.style.margin =
            "3px 0";

        button.style.fontSize =
            "11px";


        button.onclick =
            function() {

                window.yetiPreset(
                    name
                );
            };


        panel.appendChild(
            button
        );
    }


    document.body.appendChild(
        panel
    );
}


// ============================================================
// IMMOVABLE BOAT PIXEL LOCK
// ============================================================

function installImmovablePixels() {

    if(
        YU.immovableInstalled
    ) {

        return;
    }


    YU.immovableInstalled=true;


    if(
        typeof window.tryMove
        !== "function"
    ) {

        return;
    }


    const oldTryMove =
        window.tryMove;


    window.tryMove =
        function(
            pixel,
            nx,
            ny,
            ...rest
        ) {

            if(
                pixel?.yetiImmovable
            ) {

                return false;
            }


            return oldTryMove.call(
                this,
                pixel,
                nx,
                ny,
                ...rest
            );
        };
}


// ============================================================
// HAZMAT IMMUNITY
// ============================================================

function installHazmatProtection() {

    const blocked=[
        "infection",
        "cancer",
        "plague"
    ];


    for(
        const hazard
        of blocked
    ) {

        if(
            !exists(hazard)
        ) {

            continue;
        }


        elements[hazard].reactions =
            elements[hazard].reactions
            || {};


        elements[hazard]
            .reactions
            .hazmat_human = {

                chance:0
            };
    }
}


// ============================================================
// SHROOM HUMAN INFECTION
// ============================================================

function installShroomHumanChance() {

    if(
        !exists(
            "shroom_infection"
        )
    ) {

        return;
    }


    const oldTick =
        elements
            .shroom_infection
            .tick;


    elements
        .shroom_infection
        .tick =
        function(pixel) {

            for(
                const target
                of around(pixel,1)
            ) {

                if(
                    (
                        target.element ===
                            "human" ||
                        target.element ===
                            "head" ||
                        target.element ===
                            "body"
                    ) &&
                    !isGod(target) &&
                    target.element !==
                        "hazmat_human" &&
                    Math.random() < 0.01
                ) {

                    safeChange(
                        target,
                        "shroom_human"
                    );

                    break;
                }
            }


            if(oldTick) {

                oldTick.call(
                    this,
                    pixel
                );
            }
        };
}


// ============================================================
// TINTED GLASS LIGHT BLOCKING
// ============================================================

function patchLight() {

    for(
        const name
        of [
            "light",
            "laser"
        ]
    ) {

        if(
            !exists(name)
        ) {

            continue;
        }


        const oldTick =
            elements[name].tick;


        if(!oldTick) {

            continue;
        }


        elements[name].tick =
            function(pixel) {

                for(
                    const target
                    of around(pixel,1)
                ) {

                    if(
                        target.element ===
                        "tinted_glass"
                    ) {

                        if(
                            !isGod(pixel)
                        ) {

                            deletePixel(
                                pixel.x,
                                pixel.y
                            );
                        }

                        return;
                    }
                }


                oldTick.call(
                    this,
                    pixel
                );
            };
    }
}


// ============================================================
// ULTRA PAINT COLOR LOCK
// ============================================================

function ultraPaintLoop() {

    if(
        typeof currentPixels
        !== "undefined"
    ) {

        for(
            const pixel
            of currentPixels
        ) {

            if(
                pixel?.yetiUltraPainted &&
                pixel.yetiUltraColor
            ) {

                pixel.color =
                    pixel.yetiUltraColor;
            }
        }
    }


    requestAnimationFrame(
        ultraPaintLoop
    );
}


requestAnimationFrame(
    ultraPaintLoop
);


// ============================================================
// HABITAT INSTALLATION
// ============================================================

function installHabitats() {

    for(
        const name
        of YU.landAnimals
    ) {

        wrapHabitat(
            name,
            "land"
        );
    }


    for(
        const name
        of YU.seaAnimals
    ) {

        wrapHabitat(
            name,
            "sea"
        );
    }
}


// ============================================================
// FINAL INSTALL
// ============================================================

function installYetiUtils() {

    patchVanillaFilter();

    patchTornado();

    installGodmode();

    installImmovablePixels();

    installHazmatProtection();

    installShroomHumanChance();

    patchLight();

    installHabitats();

    createPresetMenu();


    // Bone powder from tiger fang.

    if(
        exists("tiger_fang")
    ) {

        elements.tiger_fang
            .breakInto =
            "bone_powder";
    }


    // Bone also becomes bone powder.

    if(
        exists("bone")
    ) {

        elements.bone
            .breakInto =
            "bone_powder";
    }


    console.log(
        "YetiUtils "
        + YU.version
        + " loaded!"
    );
}


// ============================================================
// WAIT FOR SANDBOXELS
// ============================================================

if(
    typeof runAfterLoad
    === "function"
) {

    runAfterLoad(
        installYetiUtils
    );

} else {

    // Fallback for versions where
    // runAfterLoad isn't available.

    setTimeout(
        installYetiUtils,
        1000
    );
}


})();