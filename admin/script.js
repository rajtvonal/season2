const AH = "f157fa8e8be20c20d2e63deff0679319f8825d7d1eb2d583b7ae88df02988240";

async function login() {
    const v = document.getElementById("password").value;
    const h = await t(v);

    if(h === AH){
        sessionStorage.setItem("admin-auth", "true");
        window.location.href ="./actions/";
    } else {
        document.getElementById("loginError").textContent = "Hibás jelszó";
    }
}

function logout(){
    sessionStorage.removeItem("admin-auth");
    window.location.href = "../";
}

async function t(t) {
    const d = new TextEncoder().encode(t);
    const hB = await window.crypto.subtle.digest("SHA-256", d);
    const hA = Array.from(new Uint8Array(hB));
    return hA.map(b => b.toString(16).padStart(2, "0")).join("");
}
