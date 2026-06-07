console.log("Triangles loaded");

(() => {

const triangleCanvas = document.getElementById("edgeTriangles");
const triangleCtx = triangleCanvas.getContext("2d");

function resizeCanvas() {
    triangleCanvas.width = window.innerWidth;
    triangleCanvas.height = document.documentElement.scrollHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const COLUMN_COUNT = 8;

const columns = [];

for(let i = 0; i < COLUMN_COUNT; i++) {

    const t = i / (COLUMN_COUNT - 1);

    columns.push({

        index: i,

        // sokkal erősebb méretcsökkenés
        size: 48 - (t * 38),

        // nagyobb oszlopköz
        spacingX: 55 + (t * 20),

        // kisebb sorköz
        spacingY: 52 - (t * 12),

        // hamarabb kezd szétesni
        missingChance: 0.05 + Math.pow(t, 1.15) * 0.45
    });
}

function drawTriangle(x, y, size, dir) {

    triangleCtx.beginPath();

    if(dir === "right") {

        triangleCtx.moveTo(x, y);
        triangleCtx.lineTo(x + size, y + size / 2);
        triangleCtx.lineTo(x, y + size);

    } else {

        triangleCtx.moveTo(x + size, y);
        triangleCtx.lineTo(x, y + size / 2);
        triangleCtx.lineTo(x + size, y + size);
    }

    triangleCtx.closePath();
    triangleCtx.fill();
}

function drawSide(isLeft, time) {

    let currentOffset = 4;

    columns.forEach(col => {

        let move = 0;

        // első két oszlop fix
        if(col.index > 1) {

            move =
                Math.sin(time * 0.00012) *
                Math.pow(col.index - 1, 1.3) *
                2.2;
        }

        const x = isLeft
            ? currentOffset - move
            : triangleCanvas.width - currentOffset - col.size + move;

        const rows =
            Math.ceil(
                triangleCanvas.height /
                col.spacingY
            ) + 2;

        let consecutiveMissing = 0;

        for(let row = 0; row < rows; row++) {

            const seed =
                (row * 92821) ^
                (col.index * 68917);

            const rnd =
                Math.abs(
                    Math.sin(seed)
                );

            let skip = false;

            if(rnd < col.missingChance) {

                if(consecutiveMissing < 2) {

                    skip = true;
                    consecutiveMissing++;

                }

            } else {

                consecutiveMissing = 0;
            }

            if(skip) {
                continue;
            }

            const y =
                row * col.spacingY;

            // váltakozó irány
            let rightDirection;
            let leftDirection;

            if(col.index % 2 === 0) {

                rightDirection =
                    row % 2 === 0
                        ? "right"
                        : "left";

                leftDirection =
                    row % 2 === 0
                        ? "left"
                        : "right";

            } else {

                rightDirection =
                    row % 2 === 0
                        ? "left"
                        : "right";

                leftDirection =
                    row % 2 === 0
                        ? "right"
                        : "left";
            }

            drawTriangle(
                x,
                y,
                col.size,
                isLeft
                    ? rightDirection
                    : leftDirection
            );
        }

        currentOffset += col.spacingX;
    });
}

function animate(time) {

    resizeCanvas();

    triangleCtx.clearRect(
        0,
        0,
        triangleCanvas.width,
        triangleCanvas.height
    );

    triangleCtx.fillStyle =
        "rgba(219,10,64,0.3)";

    drawSide(true, time);
    drawSide(false, time);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

})();