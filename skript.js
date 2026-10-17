// Autorid: Triine Jõudna ja Marten Maalt
"use strict";

// 1. Tooted. Hinnad on sentides: 890 tähendab 8,90 eurot.
const tooted = [
    { id: 1, nimi: "D-vitamiin 1000 IU", hind: 690, pakend: "90 tabletti", tugevus: "1000 IU", tootja: "Tootja A", kategooria: "Vitamiinid", laos: true, pilt: "pildid/pilt1.jpg", kirjeldus: "D-vitamiin 1000 IU. Pakendis on 90 tabletti." },
    { id: 2, nimi: "D-vitamiin 2000 IU", hind: 890, pakend: "90 kapslit", tugevus: "2000 IU", tootja: "Tootja A", kategooria: "Vitamiinid", laos: true, pilt: "pildid/pilt2.jpeg", kirjeldus: "D-vitamiin 2000 IU kapslitena. Pakendis on 90 kapslit." },
    { id: 3, nimi: "D-vitamiin 4000 IU", hind: 1190, pakend: "60 kapslit", tugevus: "4000 IU", tootja: "Tootja B", kategooria: "Vitamiinid", laos: true, pilt: "pildid/pilt3.jpeg", kirjeldus: "D-vitamiin 4000 IU. Pakendis on 60 kapslit." },
    { id: 4, nimi: "Paratsetamool 500 mg", hind: 340, pakend: "20 tabletti", tugevus: "500 mg", tootja: "Tootja B", kategooria: "Valu ja palavik", laos: true, pilt: "pildid/pilt4.jpeg", kirjeldus: "Paratsetamool 500 mg tablettidena. Pakendis on 20 tabletti." },
    { id: 5, nimi: "Merevee ninasprei", hind: 560, pakend: "30 ml", tugevus: "Märkimata", tootja: "Tootja C", kategooria: "Ninahooldus", laos: true, pilt: "pildid/pilt5.jpeg", kirjeldus: "Merevee ninasprei 30 ml pudelis." },
    { id: 6, nimi: "Magneesium 250 mg", hind: 1690, pakend: "60 tabletti", tugevus: "250 mg", tootja: "Tootja C", kategooria: "Mineraalained", laos: false, pilt: "pildid/pilt6.jpg", kirjeldus: "Magneesium 250 mg tablettidena. Pakendis on 60 tabletti." }
];

let korv = [];
let vordlus = [];
let tellimusKinnitatud = false;

function leiaToode(id) {
    return tooted.find(toode => toode.id === id);
}

function raha(sendid) {
    return (sendid / 100).toLocaleString("et-EE", { style: "currency", currency: "EUR" });
}

function teavita(tekst) {
    document.getElementById("teade").textContent = tekst;
}

function sobivKogus(kogus) {
    return Number.isInteger(kogus) && kogus >= 1 && kogus <= 99;
}

// Valikud püsivad muutujates seni, kuni lehte ei värskendata.
function uuendaLoendureid() {
    let kogus = 0;
    korv.forEach(toode => { kogus = kogus + toode.kogus; });
    document.querySelectorAll(".korvi-arv").forEach(koht => { koht.textContent = kogus; });
    document.querySelectorAll(".vordluse-arv").forEach(koht => { koht.textContent = vordlus.length; });
}

// 3. Tootekaardid. HTML-i lisame ainult siin failis määratud tooteandmed.
function kuvaKaardid(koht, valitud) {
    koht.innerHTML = "";
    valitud.forEach(toode => {
        koht.insertAdjacentHTML("beforeend", `
            <div class="col-md-6 col-xl-4">
                <article class="card">
                    <a href="#toode-${toode.id}" aria-label="Vaata toodet: ${toode.nimi}"><img src="${toode.pilt}" class="tootepilt" alt="${toode.nimi}" width="600" height="360"></a>
                    <div class="card-body">
                        <h3 class="card-title"><a href="#toode-${toode.id}">${toode.nimi}</a></h3>
                        <p class="vaike mb-1">${toode.pakend} · ${toode.tootja}</p>
                        <p class="hind mb-1">${raha(toode.hind)}</p>
                        <p class="saadavus ${toode.laos ? "" : "otsas"}">${toode.laos ? "● Laos olemas" : "○ Laost otsas"}</p>
                        <a class="btn btn-primary mt-auto" href="#toode-${toode.id}">Vaata toodet</a>
                        <label class="d-flex align-items-center gap-2 mt-3"><input type="checkbox" class="form-check-input mt-0" data-vordle="${toode.id}" ${vordlus.includes(toode.id) ? "checked" : ""}> Lisa võrdlusse<span class="visually-hidden">: ${toode.nimi}</span></label>
                    </div>
                </article>
            </div>
        `);
    });
    seoVordluseValikud(koht);
}

function kuvaTooted() {
    const otsing = document.getElementById("filter-otsing").value.trim().toLowerCase();
    const kategooria = document.getElementById("filter-kategooria").value;
    const hind = document.getElementById("filter-hind").value;
    const tootja = document.getElementById("filter-tootja").value;
    const tugevus = document.getElementById("filter-tugevus").value;
    const saadavus = document.getElementById("filter-saadavus").value;
    const sort = document.getElementById("sorteerimine").value;
    const tulemused = tooted.filter(toode => {
        const tekst = (toode.nimi + " " + toode.tootja + " " + toode.kategooria).toLowerCase();
        if (otsing && !tekst.includes(otsing)) return false;
        if (kategooria && toode.kategooria !== kategooria) return false;
        if (tootja && toode.tootja !== tootja) return false;
        if (tugevus && toode.tugevus !== tugevus) return false;
        if (saadavus === "laos" && !toode.laos) return false;
        if (saadavus === "otsas" && toode.laos) return false;
        if (hind === "odav" && toode.hind > 1000) return false;
        if (hind === "keskmine" && (toode.hind <= 1000 || toode.hind > 1500)) return false;
        if (hind === "kallis" && toode.hind <= 1500) return false;
        return true;
    });
    if (sort === "kasvav") tulemused.sort((a, b) => a.hind - b.hind);
    if (sort === "kahanev") tulemused.sort((a, b) => b.hind - a.hind);
    kuvaKaardid(document.getElementById("tooteloend"), tulemused);
    document.getElementById("tulemuste-arv").textContent = "Leitud tooteid: " + tulemused.length;
    document.getElementById("tyhi-tulemus").hidden = tulemused.length > 0;
}

function kuvaToode(id) {
    const toode = leiaToode(id);
    const koht = document.getElementById("toote-sisu");
    if (!toode) {
        koht.innerHTML = "<h1>Toodet ei leitud</h1><p>Vali toode tooteloendist.</p>";
        return;
    }
    document.title = toode.nimi + " | Parim Apteek";
    koht.innerHTML = `
        <article class="paneel"><div class="row g-4">
            <div class="col-lg-6"><img class="tootepilt suur-tootepilt" src="${toode.pilt}" alt="${toode.nimi}" width="600" height="360"></div>
            <div class="col-lg-6">
                <p class="ylesilt">${toode.kategooria}</p><h1>${toode.nimi}</h1>
                <p>${toode.kirjeldus}</p>
                <dl class="omadused"><div><dt>Pakend</dt><dd>${toode.pakend}</dd></div><div><dt>Tugevus / sisaldus</dt><dd>${toode.tugevus}</dd></div><div><dt>Tootja</dt><dd>${toode.tootja}</dd></div></dl>
                <p class="hind">${raha(toode.hind)}</p><p class="saadavus ${toode.laos ? "" : "otsas"}">${toode.laos ? "● Laos olemas" : "○ Laost otsas"}</p>
                <form id="lisa-korvi-vorm" class="d-flex gap-3 align-items-end my-4"><div><label class="form-label" for="toote-kogus">Kogus</label><input class="form-control kogusevalik" id="toote-kogus" type="number" value="1" min="1" max="99" step="1" required ${toode.laos ? "" : "disabled"}></div><button class="btn btn-primary" type="submit" ${toode.laos ? "" : "disabled"}>${toode.laos ? "Lisa ostukorvi" : "Toode on otsas"}</button></form>
                <label class="d-flex align-items-center gap-2"><input class="form-check-input mt-0" type="checkbox" data-vordle="${toode.id}" ${vordlus.includes(toode.id) ? "checked" : ""}> Lisa võrdlusse</label>
                <p class="vaike mt-3 mb-0">Toote sobivuse ja kasutamise kohta küsi apteekrilt.</p>
            </div>
        </div></article>`;
    document.getElementById("lisa-korvi-vorm").addEventListener("submit", syndmus => {
        syndmus.preventDefault();
        lisaArtikkel(id, Number(document.getElementById("toote-kogus").value));
    });
    seoVordluseValikud(koht);
}

// 4. Ostukorv: massiiv, koguse suurendamine, vähendamine ja eemaldamine.
function lisaArtikkel(id, kogus) {
    const toode = leiaToode(id);
    if (!toode || !toode.laos || !sobivKogus(kogus)) return;
    const olemas = korv.find(rida => rida.id === id);
    if (olemas && olemas.kogus + kogus > 99) {
        teavita("Ühe toote kogus saab olla kuni 99.");
        return;
    }
    tellimusKinnitatud = false;
    if (olemas) olemas.kogus = olemas.kogus + kogus;
    else korv.push({ id: id, kogus: kogus });
    uuendaLoendureid();
    document.getElementById("lisamise-teade").hidden = false;
    document.getElementById("lisamise-tekst").textContent = toode.nimi + ": lisatud " + kogus + " tk.";
}

function arvutaKoguhind() {
    let summa = 0;
    korv.forEach(rida => { summa = summa + leiaToode(rida.id).hind * rida.kogus; });
    return summa;
}

function kuvaKorv() {
    const koht = document.getElementById("korvi-sisu");
    const jalus = document.getElementById("korvi-jalus");
    jalus.hidden = korv.length === 0;
    if (korv.length === 0) {
        koht.innerHTML = '<div class="paneel"><h2>Ostukorv on tühi</h2><p>Lisa kõigepealt mõni toode.</p><a class="btn btn-primary" href="#tooted">Jätka ostlemist</a></div>';
        return;
    }
    koht.innerHTML = "";
    korv.forEach(rida => {
        const toode = leiaToode(rida.id);
        koht.insertAdjacentHTML("beforeend", `
            <article class="korv_artikkel">
                <div><h2><a href="#toode-${toode.id}">${toode.nimi}</a></h2><p class="vaike">${toode.pakend}</p></div>
                <div><p class="vaike">Ühikuhind</p><p>${raha(toode.hind)}</p></div>
                <div><label class="vaike" for="kogus-${toode.id}">Kogus<span class="visually-hidden">: ${toode.nimi}</span></label><div class="korvi-nupud"><button class="btn btn-outline-primary" type="button" data-action="vahenda_artikkel" data-id="${toode.id}" aria-label="Vähenda kogust: ${toode.nimi}">−</button><input class="form-control korvi-kogus" id="kogus-${toode.id}" type="number" min="1" max="99" step="1" required value="${rida.kogus}" data-kogus="${toode.id}"><button class="btn btn-outline-primary" type="button" data-action="suurenda_artikkel" data-id="${toode.id}" aria-label="Suurenda kogust: ${toode.nimi}">+</button></div></div>
                <div><p class="vaike">Reasumma</p><strong>${raha(toode.hind * rida.kogus)}</strong></div>
                <button class="btn btn-outline-primary" type="button" data-action="eemalda_artikkel" data-id="${toode.id}" aria-label="Eemalda: ${toode.nimi}">Eemalda</button>
            </article>`);
    });
    document.getElementById("korvi-summa").textContent = raha(arvutaKoguhind());
    // Nuppude sündmusekuulajad lisatakse pärast korvi HTML-i loomist.
    koht.querySelectorAll("button[data-action]").forEach(nupp => {
        nupp.addEventListener("click", () => {
            const id = Number(nupp.dataset.id);
            if (nupp.dataset.action === "suurenda_artikkel") suurendaArtikkel(id);
            if (nupp.dataset.action === "vahenda_artikkel") vahendaArtikkel(id);
            if (nupp.dataset.action === "eemalda_artikkel") eemaldaArtikkel(id);
        });
    });
    koht.querySelectorAll("[data-kogus]").forEach(vali => {
        vali.addEventListener("change", () => muudaKogust(Number(vali.dataset.kogus), Number(vali.value)));
    });
}

function muudaKogust(id, kogus) {
    const rida = korv.find(ese => ese.id === id);
    if (!rida) return;
    if (!sobivKogus(kogus)) {
        document.getElementById("kogus-" + id).value = rida.kogus;
        teavita("Kogus peab olema täisarv 1–99.");
        return;
    }
    rida.kogus = kogus;
    uuendaLoendureid();
    kuvaKorv();
    document.getElementById("kogus-" + id).focus();
    teavita("Kogus muudetud. Tooted kokku " + raha(arvutaKoguhind()) + ".");
}

function suurendaArtikkel(id) {
    const rida = korv.find(ese => ese.id === id);
    if (rida) muudaKogust(id, rida.kogus + 1);
}

function vahendaArtikkel(id) {
    const rida = korv.find(ese => ese.id === id);
    if (!rida) return;
    if (rida.kogus === 1) eemaldaArtikkel(id);
    else muudaKogust(id, rida.kogus - 1);
}

function eemaldaArtikkel(id) {
    korv = korv.filter(rida => rida.id !== id);
    uuendaLoendureid();
    kuvaKorv();
    document.querySelector("#ostukorv h1").focus();
    teavita("Toode eemaldatud.");
}

function tyhjendaKorv() {
    korv = [];
    uuendaLoendureid();
    kuvaKorv();
    document.querySelector("#ostukorv h1").focus();
    teavita("Ostukorv on tühi.");
}

// 5. Võrdlusvalikud. Korraga saab valida kuni kolm toodet.
function muudaVordlust(id, valitud) {
    if (!leiaToode(id)) return;
    if (valitud && !vordlus.includes(id)) {
        if (vordlus.length < 3) vordlus.push(id);
        else teavita("Võrdlusesse saab lisada kuni kolm toodet.");
    }
    if (!valitud) vordlus = vordlus.filter(tooteId => tooteId !== id);
    uuendaLoendureid();
    document.querySelectorAll("[data-vordle]").forEach(vali => {
        vali.checked = vordlus.includes(Number(vali.dataset.vordle));
    });
}

function seoVordluseValikud(koht) {
    koht.querySelectorAll("[data-vordle]").forEach(vali => {
        vali.addEventListener("change", () => muudaVordlust(Number(vali.dataset.vordle), vali.checked));
    });
}

function kuvaVordlus() {
    const koht = document.getElementById("vordluse-sisu");
    if (vordlus.length === 0) {
        koht.innerHTML = '<p class="paneel">Võrdluses pole veel tooteid. Märgi tootekaartidel valik „Lisa võrdlusse“.</p>';
        return;
    }
    let tabel = '<div class="table-responsive" tabindex="0" role="region" aria-label="Toodete võrdlus, vajadusel külgsuunas keritav"><table class="table"><caption>Valitud toodete omadused</caption><thead><tr><th scope="col">Omadus</th>';
    vordlus.forEach(id => { tabel += `<th scope="col"><a href="#toode-${id}">${leiaToode(id).nimi}</a></th>`; });
    tabel += '</tr></thead><tbody>';
    const omadused = ["pakend", "tugevus", "tootja", "hind", "laos"];
    const sildid = ["Pakend", "Tugevus / sisaldus", "Tootja", "Hind", "Saadavus"];
    omadused.forEach((omadus, number) => {
        tabel += `<tr><th scope="row">${sildid[number]}</th>`;
        vordlus.forEach(id => {
            let vaartus = leiaToode(id)[omadus];
            if (omadus === "hind") vaartus = raha(vaartus);
            if (omadus === "laos") vaartus = vaartus ? "Laos olemas" : "Laost otsas";
            tabel += `<td>${vaartus}</td>`;
        });
        tabel += '</tr>';
    });
    tabel += '<tr><th scope="row">Muuda valikut</th>';
    vordlus.forEach(id => { tabel += `<td><button class="btn btn-outline-primary" type="button" data-eemalda-vordlus="${id}" aria-label="Eemalda võrdlusest: ${leiaToode(id).nimi}">Eemalda</button></td>`; });
    koht.innerHTML = tabel + '</tr></tbody></table></div>';
    koht.querySelectorAll("[data-eemalda-vordlus]").forEach(nupp => {
        nupp.addEventListener("click", () => {
            muudaVordlust(Number(nupp.dataset.eemaldaVordlus), false);
            kuvaVordlus();
            document.querySelector("#vordlus h1").focus();
        });
    });
}

// 6. Tarne ja vorm. Kohustuslikke välju kontrollib HTML, lisakontrollid teeb JS.
function tarneHind() {
    if (document.getElementById("tarne-automaat").checked) return 290;
    if (document.getElementById("tarne-kuller").checked) return 490;
    return 0;
}

function uuendaTarnet() {
    const automaat = document.getElementById("tarne-automaat").checked;
    const kuller = document.getElementById("tarne-kuller").checked;
    document.getElementById("automaadi-valik").hidden = !automaat;
    document.getElementById("automaat").disabled = !automaat;
    document.getElementById("automaat").required = automaat;
    document.getElementById("aadressi-valjad").hidden = !kuller;
    document.getElementById("aadressi-valjad").disabled = !kuller;
    document.querySelectorAll("#aadressi-valjad input").forEach(vali => { vali.required = kuller; });
    kuvaTellimuseSumma();
}

function kuvaTellimuseSumma() {
    const koht = document.getElementById("tellimuse-kokkuvote");
    koht.innerHTML = "";
    korv.forEach(rida => {
        const toode = leiaToode(rida.id);
        koht.insertAdjacentHTML("beforeend", `<div class="summa-rida"><span>${toode.nimi} × ${rida.kogus}</span><span>${raha(toode.hind * rida.kogus)}</span></div>`);
    });
    const tarneValitud = document.getElementById("tarne-automaat").checked || document.getElementById("tarne-kuller").checked;
    koht.insertAdjacentHTML("beforeend", `<div class="summa-rida"><span>Tarne</span><span>${tarneValitud ? raha(tarneHind()) : "Vali tarneviis"}</span></div><div class="summa-rida"><strong>${tarneValitud ? "Kokku" : "Kokku enne tarnet"}</strong><strong>${raha(arvutaKoguhind() + tarneHind())}</strong></div>`);
    document.getElementById("kinnita-tellimus").disabled = korv.length === 0;
}

function sisaldabNumbrit(tekst) {
    for (let i = 0; i < tekst.length; i++) {
        if (tekst[i] >= "0" && tekst[i] <= "9") return true;
    }
    return false;
}

function ainultNumbrid(tekst) {
    if (tekst.length === 0) return false;
    for (let i = 0; i < tekst.length; i++) {
        if (tekst[i] < "0" || tekst[i] > "9") return false;
    }
    return true;
}

function kinnitaTellimus(syndmus) {
    syndmus.preventDefault();
    const vorm = document.getElementById("tellimisvorm");
    const vead = [];
    if (korv.length === 0) vead.push("Ostukorv on tühi.");
    const eesnimi = document.getElementById("eesnimi").value.trim();
    const perenimi = document.getElementById("perenimi").value.trim();
    if (eesnimi === "" || sisaldabNumbrit(eesnimi)) vead.push("Sisesta eesnimi ilma numbriteta.");
    if (perenimi === "" || sisaldabNumbrit(perenimi)) vead.push("Sisesta perekonnanimi ilma numbriteta.");
    const telefon = document.getElementById("telefon").value.trim();
    if (telefon.length < 6) vead.push("Telefon peab sisaldama vähemalt kuus numbrit.");
    if (!ainultNumbrid(telefon)) vead.push("Telefon võib sisaldada ainult numbreid.");
    if (document.getElementById("tarne-kuller").checked) {
        if (document.getElementById("aadress").value.trim() === "") vead.push("Sisesta tarneaadress.");
        if (document.getElementById("linn").value.trim() === "") vead.push("Sisesta linn või asula.");
    }
    document.getElementById("vormi-viga").textContent = vead.join(" ");
    if (vead.length > 0 || !vorm.reportValidity()) return;
    document.getElementById("kinnitatud-summa").textContent = raha(arvutaKoguhind() + tarneHind());
    korv = [];
    uuendaLoendureid();
    vorm.reset();
    uuendaTarnet();
    tellimusKinnitatud = true;
    location.hash = "kinnitusvaade";
}

// 7. Üks HTML-fail: näitame korraga ühte vaadet.
// Näiteks #ostukorv avab korvi ja #toode-2 teise toote.
function kuvaVaade() {
    const aadress = location.hash.slice(1) || "avaleht";
    if (aadress === "sisu") {
        document.getElementById("sisu").focus();
        return;
    }
    let nimi = aadress.split("-")[0];
    if (nimi === "toode") kuvaToode(Number(aadress.split("-")[1]));
    const vaade = document.getElementById(nimi);
    if (!vaade || !vaade.classList.contains("vaade")) nimi = "avaleht";
    if (nimi === "kinnitusvaade" && !tellimusKinnitatud) nimi = "avaleht";
    document.querySelectorAll(".vaade").forEach(osa => { osa.hidden = osa.id !== nimi; });
    document.getElementById("lisamise-teade").hidden = true;
    teavita("");
    if (nimi === "tooted") kuvaTooted();
    if (nimi === "ostukorv") kuvaKorv();
    if (nimi === "vordlus") kuvaVordlus();
    if (nimi === "tellimine") {
        document.getElementById("tyhi-korv").hidden = korv.length > 0;
        document.getElementById("tellimise-sisu").hidden = korv.length === 0;
        uuendaTarnet();
    }
    document.querySelectorAll(".nav-link").forEach(link => {
        const aktiivne = link.getAttribute("href") === "#" + nimi;
        link.classList.toggle("active", aktiivne);
        if (aktiivne) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
    // Pärast menüüvalikut sulgeme telefonis avatud menüü.
    if (document.getElementById("peamenyy").classList.contains("show")) {
        document.querySelector(".navbar-toggler").click();
    }
    const pealkiri = document.querySelector("#" + nimi + " h1");
    document.title = pealkiri.textContent + " | Parim Apteek";
    pealkiri.setAttribute("tabindex", "-1");
    pealkiri.focus({ preventScroll: true });
    window.scrollTo(0, 0);
}

function alustaOtsingut(tekst) {
    document.getElementById("filtrid").reset();
    document.getElementById("filter-otsing").value = tekst;
    kuvaTooted();
    location.hash = "tooted";
}

// 8. Seome HTML-is olevad vormid ja lingid funktsioonidega.
document.getElementById("pais-otsinguvorm").addEventListener("submit", syndmus => {
    syndmus.preventDefault();
    alustaOtsingut(document.getElementById("pais-otsing").value);
});
document.getElementById("avalehe-otsinguvorm").addEventListener("submit", syndmus => {
    syndmus.preventDefault();
    alustaOtsingut(document.getElementById("avalehe-otsing").value);
});
document.querySelectorAll("[data-kategooria]").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("filtrid").reset();
        document.getElementById("filter-kategooria").value = link.dataset.kategooria;
        kuvaTooted();
    });
});
const filtrid = document.getElementById("filtrid");
filtrid.addEventListener("input", kuvaTooted);
filtrid.addEventListener("change", kuvaTooted);
filtrid.addEventListener("submit", syndmus => syndmus.preventDefault());
filtrid.addEventListener("reset", () => {
    document.getElementById("sorteerimine").value = "vaikimisi";
    setTimeout(kuvaTooted, 0);
});
document.getElementById("sorteerimine").addEventListener("change", kuvaTooted);
document.getElementById("tyhjenda-korv").addEventListener("click", tyhjendaKorv);
document.getElementById("tarne-automaat").addEventListener("change", uuendaTarnet);
document.getElementById("tarne-kuller").addEventListener("change", uuendaTarnet);
document.getElementById("tellimisvorm").addEventListener("submit", kinnitaTellimus);
window.addEventListener("hashchange", kuvaVaade);

document.addEventListener("error", syndmus => {
    if (syndmus.target.matches("img.tootepilt")) {
        const tekst = document.createElement("p");
        tekst.className = "paneel";
        tekst.textContent = "Tootepilt puudub. Lisa vastav JPG-pilt kausta pildid.";
        syndmus.target.replaceWith(tekst);
    }
}, true);

uuendaLoendureid();
kuvaKaardid(document.getElementById("avalehe-tooted"), [leiaToode(2), leiaToode(4), leiaToode(5)]);
kuvaVaade();
