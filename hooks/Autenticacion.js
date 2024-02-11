import { login } from "./Conexion";
import { save, saveToken } from "./SessionUtil";

export async function inicio_sesion(data) {
        const sesion = await login('login', data, "");
        console.log(sesion);

        if (sesion.code === 200 ) {
            saveToken(sesion.data.token);
            save('user',sesion.data.user);
            save('external', sesion.data.external);
            save('rol', sesion.data.rol);
            console.log("revisarFACADE");
            console.log(sesion.data.token);
            console.log(sesion.data.user);
            console.log(sesion.data.id);

    
        }

        return sesion;
}
