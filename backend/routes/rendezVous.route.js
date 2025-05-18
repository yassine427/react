const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
router.post('/', async (req, res) => {
    const {type,dateRendez,idMed,idPat,assurance} = req.body;
    try {
        const medecin = await prisma.medecin.findUnique({
            where: { id: idMed },
            include: {
                specialite: {
                    select: { cout: true }
                }
            }
        });
        if (!medecin) {
            return res.status(404).json({ message: "Medecin not found" });
        }
        let cout = medecin.specialite.cout; 
        if (assurance) {
            cout *= 0.8; 
        }
        const rendezVous = await prisma.rendezvous.create({
            data: {
                type:type,
                dateRendez :new Date(dateRendez),
                idMed:idMed,
                idPat:idPat,
                assurance : assurance,
                cout: cout,
            }
        });

        res.json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});
router.get('/effectuer', async (req, res) => {
    try{
    const { dateRDV } = req.query;
   
    const formattedDate = new Date(dateRDV);
    formattedDate.setHours(0, 0, 0, 0);  // Réinitialiser l'heure, minute, seconde, milliseconde

    // Créer un intervalle pour comparer seulement la date
    const startOfDay = new Date(formattedDate); // Début de la journée
    const endOfDay = new Date(formattedDate);   // Fin de la journée
    endOfDay.setHours(23, 59, 59, 999);         // Fin de la journée

    const rendezVous = await prisma.rendezvous.findMany({
        where: {
            etat: "EFF",  // Toujours filtrer par l'état "NONEFF"
            ...(dateRDV && dateRDV.trim() !== "0" ? { // Si dateRDV n'est pas vide ou seulement des espaces
              dateRendez: {
                gte: startOfDay,  // Date >= début de la journée
                lte: endOfDay    // Date <= fin de la journée
              }
            } : {}) // Sinon, on n'ajoute pas le filtre `dateRendez`
          },
            include: {
                medecin: {
                    include: {
                        utilisateur: { 
                            select: { nom: true, prenom: true,                                email:true
 }
                        },
                        specialite: {
                            select: { designation: true, cout: true }
                        }
                    }
                },
                patient: { 
                    select: {
                        utilisateur: {
                            select: { nom: true, prenom: true }
                        }
                    }
                }
            }
        });

        res.json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const { dateRDV } = req.query;

        // Si la date n'est pas fournie, retourner une erreur
        

        // Convertir la date en format yyyy-mm-dd sans heure
        const formattedDate = new Date(dateRDV);
        formattedDate.setHours(0, 0, 0, 0);  // Réinitialiser l'heure, minute, seconde, milliseconde

        // Créer un intervalle pour comparer seulement la date
        const startOfDay = new Date(formattedDate); // Début de la journée
        const endOfDay = new Date(formattedDate);   // Fin de la journée
        endOfDay.setHours(23, 59, 59, 999);         // Fin de la journée

        const rendezVous = await prisma.rendezvous.findMany({
            where: {
etat: {
  in: ["NONEFF", "REPORTE"]
},              ...(dateRDV && dateRDV.trim() !== "0" ? { // Si dateRDV n'est pas vide ou seulement des espaces
                dateRendez: {
                  gte: startOfDay,  // Date >= début de la journée
                  lte: endOfDay    // Date <= fin de la journée
                }
              } : {}) // Sinon, on n'ajoute pas le filtre `dateRendez`
            },
            include: {
              medecin: {
                include: {
                  
                utilisateur: true,     
          
                  specialite: {
                    select: {
                      designation: true,
                      cout: true
                    }
                  }
                }
              },
              patient: { 
                select: {
                  utilisateur: {
                    select: { nom: true, prenom: true,email:true }
                  }
                }
              }
            }
          });
          
          
          

        // Retourner les rendez-vous trouvés
        res.json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});



router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const rendezvous = await prisma.rendezvous.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                medecin: {
                    select: {
                        utilisateur: { 
                            select: {
                                nom: true,
                                prenom: true,
                                email:true
                            }
                        },
                        specialite: {
                            select: {
                                designation: true,
                            }
                        }
                    }
                },
                patient: { 
                    select: {
                        utilisateur: {
                            select: { nom: true, prenom: true }
                        }
                    }
                }
            }
        });

        if (!rendezvous) {
            return res.status(404).json({ message: "Rendezvous not found" });
        }

        res.json(rendezvous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { type, dateRendez, etat, idMed, idPat, assurance } = req.body;
  
    // Validation des entrées
    if (!type || !dateRendez || !etat || !idMed || !idPat) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Vérification que l'ID est un nombre valide
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
  
    try {
      const existingRendezvous = await prisma.rendezvous.findUnique({
        where: { id: Number(id) },
      });
  
      if (!existingRendezvous) {
        return res.status(404).json({ message: "Rendezvous not found" });
      }
  
      let updatedCout = existingRendezvous.cout;
  
      // Mise à jour du coût selon l'assurance
      if (existingRendezvous.assurance !== assurance) {
        if (assurance) {
          updatedCout = Math.round(updatedCout * 0.8 * 100) / 100;
        } else {
          updatedCout = Math.round(updatedCout / 0.8 * 100) / 100;
        }
      }
  
      // Mise à jour du rendez-vous dans la base de données
      const rendezvous = await prisma.rendezvous.update({
        data: {
          type,
          dateRendez:dateRendez,
          etat,
          idMed,
          idPat,
          cout: updatedCout,
        },
        where: { id: Number(id) },
      });
  
      res.json(rendezvous);
    } catch (error) {
      console.error(error); // Log l'erreur pour le développement
      res.status(500).json({
        message: "Something went wrong",
        error: error.message || error,
      });
    }
  });
router.delete('/:id', async (req, res)=> {
    const  id  = req.params.id;
    try {
     await prisma.rendezvous.delete({
        where: { id: Number(id) },
    })
    res.json({ message: "rendezVous "+ id +" deleted successfully." });
} catch (error) {
    res.status(404).json({ message: error.message });
    }
});
module.exports = router;