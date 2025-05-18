const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
router.post('/', async (req, res) => {
  const { idMed, minDate, maxDate } = req.body;
  try {
    if (!idMed || !minDate || !maxDate) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

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

    const abscence = await prisma.abscence.create({
      data: {
        minDate: new Date(minDate),
        maxDate: new Date(maxDate),
        idMed: idMed
      }
    });

    res.json(abscence);
  } catch (error) {
    console.error("Erreur lors de la création d'une absence :", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
    try{
   
         // Fin de la journée

    const abscence = await prisma.abscence.findMany({
       
            include: {
                medecin: {
                    include: {
                        utilisateur: { 
                            select: { nom: true, prenom: true }
                        },
                        specialite: {
                            select: { designation: true, cout: true }
                        }
                    }
                },
                
            }
        });

        res.json(abscence);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});





router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const abscence = await prisma.abscence.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                medecin: {
                    select: {
                        utilisateur: { 
                            select: {
                                nom: true,
                                prenom: true
                            }
                        },
                        specialite: {
                            select: {
                                designation: true,
                            }
                        }
                    }
                },
               
            }
        });

        if (!abscence) {
            return res.status(404).json({ message: "abscence not found" });
        }

        res.json(rendezvous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { minDate, maxDate, idMed } = req.body;
  
    // Validation des entrées
    if (!minDate || !maxDate  || !idMed ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Vérification que l'ID est un nombre valide
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
  
    try {
      const existingAbscence = await prisma.abscence.findUnique({
        where: { id: Number(id) },
      });
  
      if (!existingAbscence) {
        return res.status(404).json({ message: "Rendezvous not found" });
      }
  
  
      // Mise à jour du coût selon l'assurance
      
  
      // Mise à jour du rendez-vous dans la base de données
      const abscence = await prisma.abscence.update({
        data: {
          maxDate:new Date(maxDate),
          minDate:new Date(minDate),
         
          idMed,
         
        },
        where: { id: Number(id) },
      });
  
      res.json(abscence);
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
     await prisma.abscence.delete({
        where: { id: Number(id) },
    })
    res.json({ message: "abscence "+ id +" deleted successfully." });
} catch (error) {
    res.status(404).json({ message: error.message });
    }
});
async function deleteExpiredAbsences() {
  const now = new Date()
  await prisma.abscence.deleteMany({
    where: {
      maxDate: {
        lt: now,
      },
    },
  })
  console.log('Absences expirées supprimées.')
}

deleteExpiredAbsences()
  .finally(() => prisma.$disconnect())
module.exports = router;


