const express=require('express');
const cors=require('cors')

const app = express()

//BodyParser Middleware
app.use(express.json());
app.use(cors())

// Appel de routes
const medecinRouter =require("./routes/medecin.route")
app.use('/api/medecins', medecinRouter);
const patientRouter =require("./routes/patient.route")
app.use('/api/patients', patientRouter);
const specialiteRouter =require("./routes/specialite.route")
app.use('/api/specialite', specialiteRouter);
const RendezVousRouter =require("./routes/rendezVous.route")
app.use('/api/rendezVous', RendezVousRouter);

const userRoute =require("./routes/user.route")
app.use('/api/users', userRoute);

const AbsenceRouter =require("./routes/abscence.route")
app.use('/api/abscence', AbsenceRouter);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
