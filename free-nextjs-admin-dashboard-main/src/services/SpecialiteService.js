const SPECIALITE_API="/specialite/"
export const fetchSpecialites=async()=>{
    const res =await fetch(process.env.API_URL+SPECIALITE_API,{cache:'no-store'})
    if (!res.ok){
        throw new Error('Failed to fetch data')
    }
    const response=await res.json();
return response;
}
export const fetchSpecialiteById=async(SpecialiteId)=>{
    const res=await fetch(process.env.API_URL+SPECIALITE_API+`${SpecialiteId}`,{
        method:'GET'

    });
    const resp=res.json();
    return resp;
}