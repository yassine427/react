const USER_API = process.env.API_URL + "/users";

export const registerUser = async (data) => {
  const res = await fetch(`${USER_API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Erreur lors de la création du compte";
    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch (parseError) {
      console.error("registerUser - Non-JSON error response:", await res.text());
    }
    throw new Error(errorMessage);
  }

  return await res.json();
};
