import prisma from "../utils/prisma";

async function seed(){
    // prisma.livre.createMany({ data: [...] }) meilleur pour plusieurs créations
    const livre1 = await prisma.livre.create({
        data: {
            titre: "Le petit prince",
            auteur: "Antoine de Saint-Exupéry",
            annee: 1943,
            disponible: true,
        },
    });
    console.log("Cree :", livre1);

    const livre2 = await prisma.livre.create({
        data: {
            titre: "1984",
            auteur: "George Orwell",
            annee: 1949,
            disponible: false,
        },
    });
    console.log("Cree :", livre2);

    const livre3 = await prisma.livre.create({
        data: {
            titre: "Madame Bovary",
            auteur: "Gustave Flaubert",
            annee: 1856,
            disponible: true,
        },
    });
    console.log("Cree :", livre3);

    const livre4 = await prisma.livre.create({
        data: {
            titre: "Le comte de Monte-Cristo",
            auteur: "Alexandre Dumas",
            annee: 1844,
            disponible: false,
        },
    });
    console.log("Cree :", livre4);

    const livre5 = await prisma.livre.create({
        data: {
            titre: "Les misérables",
            auteur: "Victor Hugo",
            annee: 1862,
            disponible: true,
        },
    });
    console.log("Cree :", livre5);
}

// fonctions de lecture
// 1. Récupérer tous les livres
async function getTousLesLivres(){
    return prisma.livre.findMany();
}

// 2. seulement les livres disponibles
async function getLivresDisponibles(){
    return prisma.livre.findMany({
        where: { disponible: true},
    });
}

// 3. un livre par son id
async function getLivreParId(id: number){
    return prisma.livre.findUnique({
        where: { id },
    });
}

// 4. recherche partielle par auteur
async function chercherParAuteur(motCle: string){
    return prisma.livre.findMany({
        where: {
            auteur: {contains: motCle, mode: "insensitive"},
        },
    });
}


// fonctions de update
// peut utiliser updateMany
// 1. marquer un livre comme indesponible
async function marquerIndisponible(id: number){
    return prisma.livre.update({
        where: { id },
        data: { disponible: false },
    });
}

// corriger lannee dun livre
async function corrigerAnnee(id: number, nouvelleAnnee: number){
    return prisma.livre.update({
        where: { id },
        data: { annee: nouvelleAnnee },
    });
}



// fonctions de suppression
// prisma.livre.deleteMany({ where: ... }) pour plusieurs
// 1. supprimer un livre par son id
async function supprimerLivre(id: number){
    return prisma.livre.delete({
        where: { id },
    });
}

// 2. supprimer tous les livres antérieurs à une certaine année
async function supprimerAnciens(avantAnnee: number){
    return prisma.livre.deleteMany({
        where: { annee: { lt: avantAnnee } },
    });
}



// relation entre livres et emprunts
// emprunter un livre
async function emprunterLivre(livreId: number, parQui: string){
    // cree l'emprunt
    const emprunt = await prisma.emprunt.create({
        data: { livreId, empruntePar: parQui },
    });
    // marquer le livre comme indisponible
    await prisma.livre.update({
        where: { id: livreId },
        data: { disponible: false },
    });
    return emprunt;
}

// lister tous les emprunts avec les infos du livre
async function listerEmprunts(){
    return prisma.emprunt.findMany({
        include: { livre: true },
    });
}

// retourner un livre
async function rendreLivre(empruntId: number){
    const emprunt = await prisma.emprunt.delete({
        where: { id: empruntId },
    });
    await prisma.livre.update({
        where: { id: emprunt.livreId },
        data: { disponible: true },
    });
    return emprunt;
}


async function main(){
    await seed();



    // console.log("\n---- Tous les livres ----");
    // console.log(await getTousLesLivres());

    // console.log("\n---- Livres disponibles ----");
    // console.log(await getLivresDisponibles());

    // console.log("\n---- Livre par ID ----");
    // console.log(await getLivreParId(1));

    // console.log("\n---- Recherche par auteur ----");
    // console.log(await chercherParAuteur("saint"));



    // console.log(await marquerIndisponible(1));
    // console.log(await corrigerAnnee(2, 2024));



    // console.log(await supprimerLivre(3));
    // console.log(await supprimerAnciens(1900));



    // console.log("\n---- Emprunter un livre ----");
    // const emprunt = await emprunterLivre(6, "Alice");
    // console.log("Emprunt cree :", emprunt);

    // console.log("\n---- Lister les emprunts ----");
    // console.log(await listerEmprunts());

    // console.log("\n---- Rendre un livre ----");
    // const rendu = await rendreLivre(emprunt.id);
    // console.log("Emprunt rendu :", rendu);

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});