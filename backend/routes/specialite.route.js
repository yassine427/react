const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
router.post('/', async (req, res) => {
    const {designation,cout } = req.body;
    
    try {
       
        const specialite = await prisma.specialite.create({
            data: {
                designation:designation,
                cout : cout
            }
        });
        res.json({ specialite });
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
        const specialite = await prisma.specialite.findMany(
            
        
        )

         res.json(specialite)
        } catch (error) {
         res.status(500).json({
        message: "Something went wrong",
       })
       }
});
router.get('/:specid', async (req, res, )=> {
    const { specid } = req.params
    
    try {
        const specialite = await prisma.specialite.findUnique({
            where: {
                specid: Number(specid),
            },
         
                include: {
                medecin: {
                    include:{
                        utilisateur: true
            }
           
        }
    }}
    )
        
        
       res.json(specialite)
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong",
        })
      }

});


router.put('/:specid', async (req, res)=> {
    const specid  = req.params.specid;
    const {designation,cout} = req.body;

    try {
         const specialite = await prisma.specialite.update({
            data: {
                designation:designation,
                cout : cout
            },
            where: { specid: Number(specid)},

        })
        res.json({specialite})
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong",
        })
      }
   
});

router.delete('/:specid', async (req, res)=> {
    const  specid  = req.params.specid;
    try {
    
    await prisma.specialite.delete({
        where: { specid: Number(specid) },
    })
    res.json({ message: "specialite "+ specid +" deleted successfully." });
} catch (error) {
    res.status(404).json({ message: error.message });
    }
});

module.exports = router;
