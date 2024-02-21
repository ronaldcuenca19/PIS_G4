'use client'
import Link from "next/link";
import Menu from '@/componentes/menu';
//import Footer from '@/componentes/footer';
import mensajes from "@/componentes/Mensajes";
import { obtenerB } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtilClient";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

export default function Page() {
    const router = useRouter();
    const token = getToken();
    const [obt, setObt] = useState(false);
    const [personas, setPersonas] = useState([]);

    useEffect(() => {
        // Verificar el rol del usuario almacenado en sessionStorage
        const rol = sessionStorage.getItem('rol');
        if (rol !== 'administrador'|| !token)  {
            // Si el usuario no tiene el rol adecuado, redirigir a una página de acceso denegado
            router.push('/InicioSesion'); // Reemplaza '/acceso-denegado' con la ruta de la página de acceso denegado
        }
    }, []);

    useEffect(() => {
         if (!obt) {
            obtenerB('admin/personas', token).then((info) => {
                console.log(info)
                if (info.code === 200) {
                    // Filtrar las personas cuya cuenta esté activa (estado = true)
                    const personasActivas = info.datos.filter(persona => persona.cuenta.estado === true);
                    setPersonas(personasActivas);
                    setObt(true);
                } else {
                    mensajes("Error al listar usuarios", "Error", "error");
                }
            });
        }
    }, [obt]);

    const handleBaja = (externalId) => {
        obtenerB('admin/personas/cambiarEstado/' + externalId + '/' + false, token).then((info) => {
            console.log(info)
            if (info.code === 200) {
                mensajes("Cuenta dada de baja", "Informacion", "success")
            } else {
                mensajes("Error al listar usuarios", "Error", "error");
            }
        });
    };

    return (

        <div className="row">
            <h1 style={{ color: '#205375' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Usuarios Registrados</h1>
            <div className="container-fluid" >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 mb-4 text-center">
                            <div className="btn-group" role="group">
                                <Link href="/persona/registrar" className="btn btn-success font-weight-bold" style={{fontSize:'25px'}}>Registrar</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12" style={{ width: '2000px' , marginLeft:'-350px'}}>
                    <table className="table table-bordered" style={{ borderColor: "ActiveBorder" , fontSize:'25px'}}>
                        <thead className="table-active">
                            <tr>
                                <th >id</th>
                                <th >Apellidos</th>
                                <th >Nombres</th>
                                <th >Celular</th>
                                <th >Cedula</th>
                                <th >Correo</th>
                                <th >Administrar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.map((dato, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{dato.apellidos}</td>
                                    <td>{dato.nombres}</td>
                                    <td>{dato.celular}</td>
                                    <td>{dato.cedula}</td>
                                    <td>{dato.cuenta.correo}</td>
                                    <td style={{width:'280px'}}>
                                        {<Link style={{ marginRight: "15px" , fontSize:'20px'}} href="/persona/editar/[external]" as={`persona/editar/${dato.id}`} className="btn btn-warning font-weight-bold">Editar</Link>}
                                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{fontSize:'20px'}}>
                                            Bajar Cuenta
                                        </button>
                                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLabel">Confirmacion</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        Estas seguro que quieres bajar esta cuenta?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style={{fontSize:'20px'}}>Cancelar</button>
                                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style={{fontSize:'20px'}} onClick={()=>handleBaja(dato.id)}>Confirmar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}




