import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewRendezVous from "../../../../../../components/Rendez_vousMed/NewDateRendez";
import {fetchSpecialites} from "../../../../../../services/SpecialiteService"
import {fetchMedecins} from "../../../../../../services/MedecinService"
import {fetchPatients} from "../../../../../../services/PatientService"
import {fetchAbscence} from "../../../../../../services/AbscenceService"

const getsSpecialites=async()=>{
    const data=await fetchSpecialites()
    return data;
}
const getsMedecins=async()=>{
    const data=await fetchMedecins()
    return data;
}
const getsPatients=async()=>{
    const data=await fetchPatients()
    return data;
}
const getsAbscences=async()=>{
    const data=await fetchAbscence()
    return data;
}

const NewRendezVous1 = async() => {
    const abscences =await getsAbscences()
    const specialites=await getsSpecialites()
    const medecins=await getsMedecins()
    const patients =await getsPatients()
    return (  <>
          <PageBreadcrumb pageTitle="Nouveau Rendez Vous" />
            <NewRendezVous specialites={specialites} 
             medecins={medecins} abscences={abscences} patients={patients} />
    
    
    </>);
}

export default NewRendezVous1;