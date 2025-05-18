    

const RENDEZ_VOUS_API="/rendezVous/"

export const fetchRendezVousNonEff=async(dateRendezVous,filter=false)=>{
    const res =await fetch(process.env.API_URL+RENDEZ_VOUS_API+`?dateRDV=${dateRendezVous}`,{cache:'no-store'})
    if (!res.ok){
        throw new Error('Failed to fetch data')
    }
    const data = await res.json();

  if (filter) 
    return data.filter(filter); // `filter` doit être une fonction
  else 
    return data;
}

export const fetchRendezVousEff=async(dateRendezVous,filter=false)=>{
    const res =await fetch(process.env.API_URL+RENDEZ_VOUS_API+'effectuer'+`?dateRDV=${dateRendezVous}`,{cache:'no-store'})
    if (!res.ok){
        throw new Error('Failed to fetch data')
    }
    const data = await res.json();

  if (filter) 
    return data.filter(filter); // `filter` doit être une fonction
  else 
    return data;
}

export const fetchRendezVousById=async(RendezVousId)=>{
    const res=await fetch(process.env.API_URL+RENDEZ_VOUS_API+`${RendezVousId}`,{
        method:'GET'

    });
    const resp=res.json();
    return resp;
}
export const deleteRendezVous=async(RendezVousId) =>{
    const res = await fetch(process.env.API_URL+RENDEZ_VOUS_API+`${RendezVousId}`,{
        method: 'DELETE'
    });
    const response = await res.json();
    return response;

}

export const addRendezVous=async(RendezVous)=> {
    console.log(RendezVous)
    const res = await fetch(process.env.API_URL+RENDEZ_VOUS_API, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(RendezVous),
    });
    const response = await res.json();
    return response;
}

export const editRendezVous=async(RendezVous) =>{
    console.log(RendezVous.id+"idred "+RendezVous)
    console.log(RendezVous)
    const res = await fetch(process.env.API_URL+RENDEZ_VOUS_API+`${RendezVous.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(RendezVous),
    });
    const response = await res.json();
    return response;
}


