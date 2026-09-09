const API = "https://jsonplaceholder.typicode.com/users";
export const fetchUser = async () => {
    try{
        const response = await fetch(API);
        if(!response.ok){
            throw new Error("Failed to fetch users");

        }
    
    const data = await response.json();
    return data;

}
catch(error){
    console.log("API ERROR", error);
    throw error;
}
};