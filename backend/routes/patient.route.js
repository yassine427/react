const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const  jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
router.post('/', async (req, res) => {
    const {password, sexe, imageart, email, prenom, nom, numDossier,tel } = req.body;
   const user = await prisma.utilisateur.findFirst(
           {  where: {
                   email: email,
                }}
       )
       if (user) return res.status(404).send({ success: false, message: "Account already exists" })
   
       const salt=await bcrypt.genSalt(10);
       const hash=await bcrypt.hash(password,salt);
   
       
    try {
        const result=await prisma.$transaction(async prisma =>{
        
            const utilisateur = await prisma.utilisateur.create({
            data: {
                nom: nom,
                prenom: prenom,
                email: email,
                imageart: imageart,
                sexe: sexe,
                password: hash,
                role: "patient",
                                tel:tel
            }
        });
        const patient = await prisma.patient.create({
            data: {
                numDossier: numDossier,
                
                utilisateur: {
                    connect: { id: utilisateur.id }
                }            }
        });
        return {utilisateur,patient};
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
      
    
router.get('/', async (req, res, )=> {
    try {
        const patient = await prisma.patient.findMany({
            where :{
                utilisateur:{
                    deleted:false,
                }
            },
            where: {
                utilisateur: {
                    deleted: false,
                },
            },
            include: {  
                utilisateur: true,    
    },
        })

         res.json(patient)
        } catch (error) {
         res.status(500).json({
        message: "Something went wrong",
       })
       }
});
router.get('/archived', async (req, res, )=> {
    try {
        const patient = await prisma.patient.findMany({
            where :{
                utilisateur:{
                    deleted:true,
                }
            },
            include: {  
                utilisateur: true,    
    },
        })

         res.json(patient)
        } catch (error) {
         res.status(500).json({
        message: "Something went wrong",
       })
       }
});
router.get('/:id', async (req, res, )=> {
    const { id } = req.params
    
    try {
        const patient = await prisma.patient.findUnique({
            where: {
                id: Number(id),
            },
         
            include: {  
                utilisateur: true,     
            },
        })
        
        
       res.json(patient)
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong",
        })
      }

});


router.put('/:id', async (req, res)=> {
    const patientId  =  Number(req.params.id);;
    const {password, sexe, imageart, email, prenom, nom, numDossier,tel,deleted } = req.body;
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
          });
          if (!patient) {
            return res.status(404).json({ message: "Medecin not found" });
          }
        const userId = patient.userId;
        const result=await prisma.$transaction(async prisma =>{
        const utilisateur = await prisma.utilisateur.update({
            where: { id: userId },
            data: {
                tel:tel,
                nom     :nom,
                prenom  :prenom  ,

                email   :email,
                imageart  :imageart,
                sexe      :sexe,
                deleted : deleted,
                password :password  ,
            },
        })
        const patient = await prisma.patient.update({
            where: { id: patientId },
            data: {
                numDossier: numDossier 
            },
        })
        return {utilisateur,patient};
        })
        res.json(result);
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong",
        })
      }
   
});

router.put('/restore/:id', async (req, res)=> {
    const patientId = Number(req.params.id);
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            return res.status(404).json({ message: "Medecin not found" });
        }
        const utilisateur = await prisma.utilisateur.update({
            where: { id: patient.userId },
            data: { deleted: false },
        })
       
        res.json({ message: "patient "+ patientId +" restored successfully."});
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong",
        })
      }
   
});

router.delete('/:id', async (req, res)=> {
    const patientId = Number(req.params.id);
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        });

        if (!patient) {
            return res.status(404).json({ message: "Medecin not found" });
        }
        await prisma.utilisateur.update({
            where: { id: patient.userId },
            data: { deleted: true }
    })
    res.json({ message: "patient "+ patientId +" deleted successfully." });
} catch (error) {
    res.status(404).json({ message: error.message });
    }
});

module.exports = router;