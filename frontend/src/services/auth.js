import jwt from "jsonwebtoken";
export const JWT_KEY = "segredo";
export const isAuthenticated = () => localStorage.getItem(JWT_KEY) !== null;
export const getToken = () => localStorage.getItem(JWT_KEY);
export const logando = token => {
  localStorage.setItem(JWT_KEY, token);
    try {
        console.log(JWT_KEY,token)
        const decode = jwt.verify(token, JWT_KEY)
        return decode;
      
    } catch (error) {
      const fail = "Falha"
      return fail;
        
    }

};


export const logout = () => {
  localStorage.removeItem(JWT_KEY);
};
