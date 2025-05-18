import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewRendezVous from "../../../../../../../components/Rendez_vous/NewDateRendez";
import {fetchSpecialites} from "../../../../../../../services/SpecialiteService"
import {fetchMedecins} from "../../../../../../../services/MedecinService"
import {fetchPatients} from "../../../../../../../services/PatientService"
import { fetchAbscence } from "@/services/AbscenceService";
import { fetchRendezVousNonEff } from "@/services/RendezVousService";


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
const getsrendezVouss=async()=>{
    const data=await fetchRendezVousNonEff(0)
    return data;
}
const getsAbscences=async()=>{
    const data=await fetchAbscence()
    return data;
}

const NewRendezVous1 = async() => {
    const rend=await getsrendezVouss()
    const abscences=await getsAbscences()
    const specialites=await getsSpecialites()
    const medecins=await getsMedecins()
    const patients =await getsPatients()
    return (  <>
          <PageBreadcrumb pageTitle="Nouveau Rendez Vous" />
            <NewRendezVous specialites={specialites} rendez_vous={rend} abscences={abscences}
             medecins={medecins} patients={patients} />
    
    
    </>);
}

export default NewRendezVous1;