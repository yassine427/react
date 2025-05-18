const express = require('express');
const { PrismaClient } = require('@prisma/client')
const router = express.Router();
const  jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient()
//Generate Token 
const generateToken=(user) =>{
    return jwt.sign({user}, process.env.TOKEN, { expiresIn: '60s' });
  }
//login
router.post('/login', async (req, res) =>  {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(404).send({ success: false, message: "All fields are required" })
        }

        let user = await prisma.utilisateur.findFirst(
            {  where: {
                    email: email,
                 }}
        )
        if (!user) {
            return res.status(404).send({ success: false, message: "Account doesn't exists" })
        } else {
      let isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) {res.status(400).json({success: false, message:'Please verify your credentials'}); return;}
       const token = generateToken(user);
       const refreshToken = generateRefreshToken(user);
       res.status(200).json({ 
        success: true, 
        token,
        refreshToken,
        user
    })
   }
 } catch (error) {
    res.status(404).json({ message: error.message });
}
});
function generateRefreshToken(user) {
    return jwt.sign({user}, process.env.REFRESH_TOKEN, { expiresIn: '1y' });
  }
  router.post('/refreshToken', async (req, res, )=> {  
    const refreshtoken = req.body.refreshToken;
      if (!refreshtoken) {
       return res.status(404).json({ success: false,message: 'Token Not Found' });
          }
      else {
          jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) {
              return res.status(406).json({success: false, message: 'Unauthorized Access' });
            }
            else {
             const token = generateToken(user);
   
             const refreshToken = generateRefreshToken(user);
     
            res.status(200).json({
             token,
             refreshToken
           })
              }
          });
         }
     
    });
    router.post('/register', async (req, res) => {
      const { nom, prenom, email, password, tel, imageart, sexe, invitationCode } = req.body;
    
      if (!invitationCode) {
        return res.status(400).json({ success: false, message: "Invitation code is required." });
      }
    
      try {
        const codeEntry = await prisma.invitationCode.findUnique({
          where: { code: invitationCode }
        });
    
        if (!codeEntry) {
          return res.status(400).json({ success: false, message: "Invalid invitation code." });
        }
        if (codeEntry.isUsed) {
          return res.status(400).json({ success: false, message: "Invitation code has already been used." });
        }
        if (codeEntry.expiresAt && codeEntry.expiresAt < new Date()) {
          return res.status(400).json({ success: false, message: "Invitation code has expired." });
        }
    
        const existingUser = await prisma.utilisateur.findUnique({
          where: { email: email }
        });
        if (existingUser) {
          return res.status(409).json({ success: false, message: "Account with this email already exists." });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const result = await prisma.$transaction(async (tx) => {
          const utilisateur = await tx.utilisateur.create({
            data: {
              nom,
              prenom,
              email,
              tel: tel,
              imageart: imageart || null,
              sexe,
              password: hashedPassword,
              role: "patient",
              deleted: false
            }
          });
    
          const patient = await tx.patient.create({
            data: {
              numDossier: null,
              utilisateur: {
                connect: { id: utilisateur.id }
              }
            }
          });
    
          const updatedCode = await tx.invitationCode.update({
            where: { id: codeEntry.id },
            data: {
              isUsed: true,
              usedAt: new Date()
            }
          });
    
          return { utilisateur, patient };
        });
    
        const userResponse = { ...result.utilisateur };
        delete userResponse.password;
    
        res.status(201).json({
          success: true,
          message: "Account created successfully",
          user: userResponse
        });
    
      } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 'P2002') {
          const target = error.meta?.target;
          if (target?.includes('email')) {
            return res.status(409).json({ success: false, message: "Account with this email already exists." });
          } else if (target?.includes('numDossier')) {
            return res.status(409).json({ success: false, message: "Patient record number (numDossier) already exists." });
          } else if (target?.includes('code')) {
            return res.status(500).json({ success: false, message: "Error processing invitation code. Please try again." });
          }
        }
        res.status(500).json({ success: false, message: "Something went wrong during registration.", error: error.message });
      }
    });
    
    function generateSixDigitCode() {
      const min = 100000;
      const max = 999999;
      const code = Math.floor(Math.random() * (max - min + 1)) + min;
      return code.toString();
    }
    
    async function generateAndStoreCodeInternal() {
      let attempt = 0;
      const maxAttempts = 10;
      while (attempt < maxAttempts) {
        const newCode = generateSixDigitCode();
        const now = new Date();
        try {
          const existingActiveCode = await prisma.invitationCode.findFirst({
            where: {
              code: newCode,
              isUsed: false,
              OR: [{ expiresAt: { gt: now } }]
            }
          });
          if (!existingActiveCode) {
            const createdCode = await prisma.invitationCode.create({
              data: {
                code: newCode,
                expiresAt: new Date(now.getTime() + 5 * 60 * 1000)
              }
            });
            console.log('Generated 6-Digit Code:', createdCode.code);
            return createdCode;
          } else {
            console.log(`Code ${newCode} is already active, retrying...`);
            attempt++;
          }
        } catch (error) {
          console.error(`Error during code generation attempt ${attempt + 1}:`, error);
          attempt++;
          if (attempt >= maxAttempts) throw error;
        }
      }
      throw new Error(`Failed to generate suitable code after ${maxAttempts} attempts.`);
    }
    
    router.post('/registration-codes', async (req, res) => {
      try {
        const newInvitationCode = await generateAndStoreCodeInternal();
        res.status(201).json({
          success: true,
          message: "Invitation code generated successfully.",
          invitationCode: newInvitationCode.code
        });
      } catch (error) {
        console.error("Failed to generate invitation code:", error);
        res.status(500).json({
          success: false,
          message: error.message || "Failed to generate invitation code due to an internal error."
        });
      }
    });
  module.exports = router;