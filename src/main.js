const btnAdd = document.querySelector("#btnAdd");
const contenuMess = document.querySelector("#list1");
const interface = document.querySelector("#interface");
const newcontact = document.querySelector("#newcontact");
const formulaire = document.querySelector("#formulaire");
const btnAddcontact = document.querySelector("#save");
const btnArchive = document.querySelector("#btnArchive");
const inputP = document.querySelector("#inputP");
const inputN = document.querySelector("#inputN");
const inputT = document.querySelector("#inputT");
const btnMsg = document.querySelector("#btnMsg");
const listeContacts = document.querySelector("#listeContacts");
const archives = document.querySelector("#btnArch");
const errormsg = document.querySelector("#errorMsg");
const verifnum = document.querySelector("#isnum");
const btngroup = document.querySelector("#btngrp");
const ajoutgrp=document.querySelector("#ajoutgrp");
const nd=document.querySelector("#nd");
const list1contenu=document.querySelector("#list1contenu")
const contenance= document.querySelector("#contenance");
const showbtn= document.querySelector("#showbtn");
const btncreategrp= document.querySelector("#btncreategrp");
const grpname=document.querySelector("#grpname")
const btnvalidgrp= document.querySelector("#btnvalidgrp");


const tabUsers = [];
const contactarchives = [];
const messages = {};
let contactselectionne = null;
let contactActifChat = null;
const tabGroupes = [];

// ===============================MA FONCTION afficherInterface===========================

function afficherInterface() {
  list1contenu.innerHTML = '';
  list1contenu.appendChild(interface);
  interface.classList.remove("hidden");
  interface.classList.add("flex");
}
  

btnAdd.addEventListener('click', afficherInterface);

nd.addEventListener("click",()=>{
   list1contenu.innerHTML = '';

  interface.classList.add("hidden");
 
})
// ===============================MA FONCTION afficherFormulaire===========================

function afficherFormulaire() {
  formulaire.classList.remove("hidden");
  formulaire.classList.add("flex");
  interface.classList.add("hidden");
  list1contenu.appendChild(formulaire)
  
  errormsg.textContent = "";
  verifnum.textContent = "";
}


// ===============================MA FONCTION CREER CONTACT===========================
function creerContact() {
  const prenom = inputP.value.trim();
  const nom = inputN.value.trim();
  const telephone = inputT.value.trim();

  errormsg.textContent = "";
  verifnum.textContent = "";

  const verifnumber = /^[0-9+\-\s()]{8,15}$/.test(telephone);

  if (prenom && nom && telephone) {
    if (!verifnumber) {
      verifnum.textContent = "Numéro invalide";
    } else {
      const contact = {
        prenom,
        nom,
        telephone,
        id: Date.now() + Math.random()
      };
      tabUsers.push(contact);
      messages[contact.id] = [];
      inputP.value = '';
      inputN.value = '';
      inputT.value = '';
    }
  } else {
    errormsg.textContent = "Tous les champs sont obligatoires";
  }
}

// ======================================================FONCTION afficherListcontact==============================
function afficherListcontact() {
  formulaire.classList.add("hidden");
  formulaire.classList.remove("flex");
  interface.classList.add("hidden");
  listeContacts.classList.remove("hidden");
  listeContacts.classList.add("flex");
  ajoutgrp.classList.add("hidden");

  listeContacts.innerHTML = ""; // Vide la liste avant d'ajouter


  if (tabUsers.length === 0) {
    listeContacts.innerHTML = `<div class="text-gray-500 p-4">Aucun contact pour le moment.</div>`;
    list1contenu.appendChild(listeContacts);

    return;
  }

  tabUsers.forEach((contact, index) => {
    const contactDiv = document.createElement("div");
    contactDiv.className = "contact group relative flex items-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 hover:border-green-400 rounded-lg p-3 mt-2 w-full max-w-sm h-16 cursor-pointer transition-all duration-200 ease-in-out shadow-sm hover:shadow-md";
    const profil = document.createElement("span");
    profil.className = "w-[40px] h-[40px] rounded-full bg-green-500 mr-2 flex-shrink-0";

    const infoDiv = document.createElement("div");
    infoDiv.className = "flex flex-col flex-1 min-w-0";

    const nomPrenomDiv = document.createElement("div");
    nomPrenomDiv.textContent = `${contact.prenom} ${contact.nom}`;
    nomPrenomDiv.className = "font-bold text-black text-sm truncate";

    const telSpan = document.createElement("div");
    telSpan.textContent = contact.telephone;
    telSpan.className = "text-gray-700 text-xs truncate";

    const lastMessage = messages[contact.id] && messages[contact.id].length > 0
      ? messages[contact.id][messages[contact.id].length - 1]
      : null;

    if (lastMessage) {
      const lastMsgDiv = document.createElement("div");
      lastMsgDiv.textContent = lastMessage.text.length > 20
        ? lastMessage.text.substring(0, 20) + "..."
        : lastMessage.text;
      lastMsgDiv.className = "text-gray-500 text-xs truncate";
      infoDiv.appendChild(nomPrenomDiv);
      infoDiv.appendChild(lastMsgDiv);
    } else {
      infoDiv.appendChild(nomPrenomDiv);
      infoDiv.appendChild(telSpan);
    }

    contactDiv.append(profil, infoDiv);

    contactDiv.addEventListener('click', () => {
      document.querySelectorAll('.contact').forEach(el => el.classList.remove('selected'));
      contactDiv.classList.add('selected');
      contactselectionne = index;
      ouvrirChat(contact);
    });

    listeContacts.appendChild(contactDiv);
  });

  list1contenu.appendChild(listeContacts);
}


// =================================MA FONCTION archiver===========================

function afficherArchives() {
  listeContacts.innerHTML = "";
  listeContacts.classList.remove("hidden");
  listeContacts.classList.add("flex");
  formulaire.classList.add("hidden");
  formulaire.classList.remove("flex");
  interface.classList.add("hidden");


  if (contactarchives.length === 0) {
    listeContacts.innerHTML = `<div class="text-gray-500 p-4">Aucune archive pour le moment.</div>`;
    return;
  }

  contactarchives.forEach((contact) => {
    const contactDiv = document.createElement("div");
    contactDiv.className = "contact group relative flex items-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 hover:border-green-400 rounded-lg p-3 mt-2 w-full max-w-sm h-16 cursor-pointer transition-all duration-200 ease-in-out shadow-sm hover:shadow-md";
    const nomPrenomDiv = document.createElement("div");
    nomPrenomDiv.textContent = `${contact.prenom} ${contact.nom}`;
    nomPrenomDiv.className = "font-bold text-black text-sm mb-1";

    const telSpan = document.createElement("div");
    telSpan.textContent = contact.telephone;
    telSpan.className = "text-gray-700 text-xs truncate";

    contactDiv.append(nomPrenomDiv, telSpan);
    listeContacts.appendChild(contactDiv);
  });
  list1contenu.appendChild(listeContacts);
}


function archiverContact() {
  if (contactselectionne !== null && tabUsers[contactselectionne]) {
    const contactarchive = tabUsers.splice(contactselectionne, 1)[0];

    
       contactarchives.push(contactarchive);
       
    if (messages[contactarchive.id]) {
      delete messages[contactarchive.id];
    }


    contactselectionne = null;
    contactActifChat = null;
    

    chatArea.innerHTML = '';
    
        afficherListcontact();

   
  } else { 
    alert("Veuillez sélectionner un contact à archiver.");
  }
}


function creerGroupe() {
  interface.classList.add("hidden");
  formulaire.classList.add("hidden");
  listeContacts.classList.add("hidden");
  list1contenu.innerHTML = '';
  ajoutgrp.classList.remove("hidden");
  ajoutgrp.classList.add("flex");
  list1contenu.appendChild(ajoutgrp);
  showbtn.classList.add('hidden');
  window.contactsSelectionnesPourGroupe = [];
  if (tabUsers.length > 0) {
    contenance.innerHTML = "";
    tabUsers.forEach((contact, index) => {
      const contactDiv = document.createElement("div");
      contactDiv.className = "contact flex items-center gap-2 p-2 border-b cursor-pointer";
      contactDiv.textContent = `${contact.prenom} ${contact.nom} (${contact.telephone})`;
      contactDiv.addEventListener('click', () => {
        if (contactDiv.classList.contains('border-2')) {
          contactDiv.classList.remove('border-2', 'border-teal-500', 'bg-teal-50');
          window.contactsSelectionnesPourGroupe = window.contactsSelectionnesPourGroupe.filter(i => i !== index);
        } else {
          contactDiv.classList.add('border-2', 'border-teal-500', 'bg-teal-50');
          window.contactsSelectionnesPourGroupe.push(index);
        }
        if (window.contactsSelectionnesPourGroupe.length > 0) {
          showbtn.classList.remove('hidden');
          showbtn.classList.add('flex');
        } else {
          showbtn.classList.add('hidden');
          showbtn.classList.remove('flex');
        }
      });
      contenance.appendChild(contactDiv);
    });
  } else {
    contenance.innerHTML = "<div class='text-gray-500 p-2'>Aucun contact à ajouter au groupe.</div>";
  }
}

function creerGroupeFinal() {
  if (!window.contactsSelectionnesPourGroupe || window.contactsSelectionnesPourGroupe.length === 0) {
    alert("Veuillez sélectionner au moins un contact pour créer un groupe.");
    return;
  }
  grpname.classList.remove("hidden");
  grpname.classList.add('flex');
  ajoutgrp.classList.remove('flex');
  ajoutgrp.classList.add('hidden');
  list1contenu.appendChild(grpname);
}






btnAddcontact.addEventListener('click', creerContact);
newcontact.addEventListener('click', afficherFormulaire);
btnMsg.addEventListener('click', afficherListcontact);
btnArchive.addEventListener('click', archiverContact);
archives.addEventListener('click', afficherArchives);
btngroup.addEventListener('click', creerGroupe);
btncreategrp.addEventListener('click', creerGroupeFinal);
