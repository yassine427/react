    

const ABSCENCE_API="/abscence/"

export const fetchAbscence=async(filter=false)=>{
    const res =await fetch(process.env.API_URL+ABSCENCE_API,{cache:'no-store'})
    if (!res.ok){
        throw new Error('Failed to fetch data')
    }
    const data = await res.json();

  if (filter) 
    return data.filter(filter); // `filter` doit être une fonction
  else 
    return data;
}



export const fetchAbscenceById=async(AbscenceId)=>{
    const res=await fetch(process.env.API_URL+ABSCENCE_API+`${AbscenceId}`,{
        method:'GET'

    });
    const resp=res.json();
    return resp;
}
export const deleteAbscence=async(AbscenceId) =>{
    const res = await fetch(process.env.API_URL+ABSCENCE_API+`${AbscenceId}`,{
        method: 'DELETE'
    });
    const response = await res.json();
    return response;

}

export const addAbscence=async(Abscence)=> {
    console.log(Abscence)
    const res = await fetch(process.env.API_URL+ABSCENCE_API, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(Abscence),
    });
    const response = await res.json();
    return response;
}

export const editAbscence=async(Abscence) =>{
    console.log(Abscence.id+"idred "+Abscence)
    console.log(Abscence)
    const res = await fetch(process.env.API_URL+ABSCENCE_API+`${Abscence.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(Abscence),
    });
    const response = await res.json();
    return response;
}


