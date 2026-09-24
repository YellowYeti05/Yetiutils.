// ============================================================
// YETIUTILS — ACID + PERFUME TORNADO VARIATIONS
// ============================================================
//
// These are NOT selectable elements.
//
// Vanilla Tornado touching Acid:
//      Tornado becomes an Acid-carrying variation.
//
// Vanilla Tornado touching Perfume:
//      Tornado becomes a Perfume-carrying variation.
//
// YetiUtils does NOT redefine:
//      tornado
//      acid
//      perfume
// ============================================================

runAfterLoad(function () {

    if (!elements.tornado) {
        console.warn("YetiUtils: Vanilla tornado not found.");
        return;
    }

    // ----------------------------------------
    // Add reactions to vanilla Tornado
    // ----------------------------------------

    elements.tornado.reactions ??= {};


    // ACID TORNADO VARIATION
    elements.tornado.reactions.acid = {

        elem2: null,

        func: function (tornado) {

            // Remember what this tornado picked up
            tornado.yetiTornadoType = "acid";

            // Acid-like tornado appearance
            tornado.color = "#b5d943";
        }
    };


    // PERFUME TORNADO VARIATION
    elements.tornado.reactions.perfume = {

        elem2: null,

        func: function (tornado) {

            // Remember what this tornado picked up
            tornado.yetiTornadoType = "perfume";

            // Perfume-like tornado appearance
            tornado.color = "#e6a6dc";
        }
    };


    // ----------------------------------------
    // Preserve vanilla Tornado behavior
    // ----------------------------------------

    const vanillaTornadoTick =
        elements.tornado.tick;


    elements.tornado.tick = function (pixel) {

        // ALWAYS run vanilla tornado code first.
        if (vanillaTornadoTick) {
            vanillaTornadoTick(pixel);
        }

        // Pixel may have changed/deleted during
        // vanilla processing.
        if (
            !pixel ||
            pixel.element !== "tornado" ||
            !pixel.yetiTornadoType
        ) {
            return;
        }


        // ------------------------------------
        // THROW MATERIAL
        // ------------------------------------

        // Don't release material every tick.
        if (Math.random() >= 0.08) {
            return;
        }


        const material =
            pixel.yetiTornadoType;


        // Possible places around tornado
        const spots = [

            [-2,-1],
            [-1,-1],
            [ 1,-1],
            [ 2,-1],

            [-2, 0],
            [-1, 0],
            [ 1, 0],
            [ 2, 0],

            [-2, 1],
            [-1, 1],
            [ 1, 1],
            [ 2, 1],

            [-1, 2],
            [ 0, 2],
            [ 1, 2]
        ];


        // Try several locations
        for (let attempt = 0; attempt < 4; attempt++) {

            const spot =
                spots[
                    Math.floor(
                        Math.random() *
                        spots.length
                    )
                ];


            const x =
                pixel.x + spot[0];

            const y =
                pixel.y + spot[1];


            if (
                x < 0 ||
                x >= width ||
                y < 0 ||
                y >= height
            ) {
                continue;
            }


            if (!isEmpty(x,y)) {
                continue;
            }


            // Spawn the SAME VANILLA MATERIAL
            // that created the variation.
            createPixel(
                material,
                x,
                y
            );

            break;
        }
    };

});