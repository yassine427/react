const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const  jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require( "../middleware/auth.js");
router.post('/', async (req, res) => {
    const { password, sexe, imageart, email, prenom, nom, specid, reference,tel } = req.body;
    
    const user = await prisma.utilisateur.findFirst(
        {  where: {
                email: email,
             }}
    )
    if (user) return res.status(409).send({ success: false, message: "Account already exists with this email" })
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(password,salt);
    try {
        const result=await prisma.$transaction(async prisma =>{
        const utilisateur = await prisma.utilisateur.create({
            data: {
                tel:tel,
                nom: nom,
                prenom: prenom,
                email: email,
                imageart: imageart,
                sexe: sexe,
                password: hash,
                role: "medecin",
            }
        });
        const medecin = await prisma.medecin.create({
            data: {
                reference: reference,
                utilisateur: {
                    connect: { id: utilisateur.id }
                },
                specialite: { connect: { specid: specid } },
            }
        });
        return { utilisateur, medecin };
        })
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}); 
router.get('/',async (req, res, )=> {
    try {
        const medecin = await prisma.medecin.findMany({
            where: {
                utilisateur: {
                    deleted: false,
                },
            },
            include: {  
                utilisateur: true,    
                specialite: {
                  select: {
                    designation: true, 
                  },
                },
    },
        })
         res.json(medecin)
        } catch (error) {
         res.status(500).json({
        message: "Something went wrong",
       })
       }
});
router.get('/archived',async (req, res, )=> {
    try {
        const medecin = await prisma.medecin.findMany({
            where: {
                utilisateur: {
                    deleted: true,
                },
            },
            include: {  
                utilisateur: true,    
                specialite: {
                  select: {
                    designation: true,
                  },
                },
    },
        })

         res.json(medecin)
        } catch (error) {
         res.status(500).json({
        message: "Something went wrong",
       })
       }
});
router.get('/:id', async (req, res, )=> {
    const { id } = req.params
    
    try {
        const medecin = await prisma.medecin.findUnique({
            where: {
                id: Number(id),
            },
            include: {  
                utilisateur: true,     
                specialite: {
                  select: {
                    designation: true,
                  },
                },
            },
        })
       res.json(medecin)
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong",
        })
      }

});
router.put('/:id', async (req, res) => {
    const medecinId = Number(req.params.id);
    const {
      password, sexe, imageart, email, prenom, nom, specid, reference, deleted, tel
    } = req.body;
    try {
      const medecin = await prisma.medecin.findUnique({
        where: { id: medecinId },
      });
      if (!medecin) {
        return res.status(404).json({ message: "Medecin not found" });
      }
  
      const userId = medecin.userId;
  
      const result = await prisma.$transaction(async prisma => {
        const utilisateur = await prisma.utilisateur.update({
          where: { id: userId },
          data: {
            nom,
            prenom,
            deleted,
            email,
            imageart,
            sexe,
            password,
            tel
          },
        });
        const updatedMedecin = await prisma.medecin.update({
          where: { id: medecinId },
          data: {
            reference,
            specid: specid,
          },
        });
  
        return { utilisateur, medecin: updatedMedecin };
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  });
  router.put('/restore/:id', async (req, res) => {
    const medecinId = Number(req.params.id);
    try {
        const medecin = await prisma.medecin.findUnique({
            where: { id: medecinId },
        });

        if (!medecin) {
            return res.status(404).json({ message: "Medecin not found" });
        }
        await prisma.utilisateur.update({
            where: { id: medecin.userId },
            data: { deleted: false }
        });
        res.json({ message: `Medecin ${medecinId} restored successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Something went wrong",
            error: error.message 
        });
    }
});
router.delete('/:id',async (req, res) => {
    const medecinId = Number(req.params.id);
    try {
        const medecin = await prisma.medecin.findUnique({
            where: { id: medecinId },
        });

        if (!medecin) {
            return res.status(404).json({ message: "Medecin not found" });
        }

        await prisma.utilisateur.update({
            where: { id: medecin.userId },
            data: { deleted: true }
        });

        res.json({ message: `Medecin ${medecinId} soft deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Something went wrong",
            error: error.message 
        });
    }
});
module.exports = router;
