const fallingCanvas = document.getElementById("particles");
const fallingCtx = fallingCanvas.getContext("2d");

function resize() {
    fallingCanvas.width = 900;
    fallingCanvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const particles = [];

for(let i = 0; i < 80; i++) {
    particles.push({
    x: Math.random() * fallingCanvas.width,
    y: Math.random() * fallingCanvas.height,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.1 + 0.05,
    drift: Math.random() * 0.2 - 0.1,
    rotation: Math.random() * Math.PI,
    type: Math.random() > 0.5 ? "star" : "cross"
});
}

function drawCross(x,y,s,r){
    fallingCtx.save();
    fallingCtx.translate(x,y);
    fallingCtx.rotate(r);

    fallingCtx.beginPath();
    fallingCtx.moveTo(-s,0);
    fallingCtx.lineTo(s,0);
    fallingCtx.moveTo(0,-s);
    fallingCtx.lineTo(0,s);

    fallingCtx.stroke();
    fallingCtx.restore();
}

function drawStar(x,y,s,r){
    fallingCtx.save();
    fallingCtx.translate(x,y);
    fallingCtx.rotate(r);

    fallingCtx.beginPath();

    fallingCtx.moveTo(-s,0);
    fallingCtx.lineTo(s,0);

    fallingCtx.moveTo(0,-s);
    fallingCtx.lineTo(0,s);

    fallingCtx.moveTo(-s*0.7,-s*0.7);
    fallingCtx.lineTo(s*0.7,s*0.7);

    fallingCtx.moveTo(-s*0.7,s*0.7);
    fallingCtx.lineTo(s*0.7,-s*0.7);

    fallingCtx.stroke();

    fallingCtx.restore();
}

function animate() {

    fallingCtx.clearRect(0,0,fallingCanvas.width,fallingCanvas.height);

    fallingCtx.strokeStyle = "rgba(219,10,64,0.3)";
    fallingCtx.lineWidth = 1;

    for(const p of particles){

        p.y += p.speed;
        p.rotation += 0.002;

        if(p.y > fallingCanvas.height + 20){
            p.y = -20;
            p.x = Math.random() * fallingCanvas.width;
        }

        if(p.type === "cross"){
            drawCross(
                p.x,
                p.y,
                p.size,
                p.rotation
            );
        }
        else{
            drawStar(
                p.x,
                p.y,
                p.size,
                p.rotation
            );
        }
    }

    requestAnimationFrame(animate);
}


animate();