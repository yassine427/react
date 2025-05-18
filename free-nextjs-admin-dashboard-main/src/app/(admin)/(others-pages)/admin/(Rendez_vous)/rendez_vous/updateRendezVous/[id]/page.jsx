import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {fetchSpecialites} from "../../../../../../../../services/SpecialiteService"
import {fetchMedecins} from "../../../../../../../../services/MedecinService"
import {fetchPatientById, fetchPatients} from "../../../../../../../../services/PatientService"

import {fetchRendezVousById}from "../../../../../../../../services/RendezVousService"
import UpdateRendezVous from "../../../../../../../../components/Rendez_vous/UpdateDateRendez";

const getsSpecialites=async()=>{
    const data=await fetchSpecialites()
    return data;
}
const getsMedecins=async()=>{
    const data=await fetchMedecins()
    return data;
}
const getsRendezVous=async(id)=>{
    const data=await fetchRendezVousById(id)
    return data;
}
const UpdateRendezVous1 = async({params}) => {

    const specialites=await getsSpecialites()
    const medecins=await getsMedecins()
    const patient =await getsRendezVous(params.id)
    return (  <>
          <PageBreadcrumb pageTitle="Nouveau Rendez Vous" />
            <UpdateRendezVous specialites={specialites} 
             medecins={medecins} patient={patient} />
    
    
    </>);
}

export default UpdateRendezVous1;