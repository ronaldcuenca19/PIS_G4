'use client'
import Link from "next/link";
import Menu from '@/componentes/menu';
//import Footer from '@/componentes/footer';
import mensajes from "@/componentes/Mensajes";
import { obtenerR } from "@/hooks/Conexion";
import { useState, useEffect } from "react";

export default function Page() {
    const [obt, setObt] = useState(false);
    const [sensor, setSensor] = useState([]);

    useEffect(() => {
        if (!obt) {
            obtenerR('admin/sensor').then((info) => {
                console.log(info)
                if (info.code === 200) {
                    // Filtrar las personas cuya cuenta esté activa (estado = true)
                    const motasActivas = info.datos.filter(sensor => sensor.estado === true);
                    setSensor(motasActivas);
                    setObt(true);
                } else {
                    mensajes("Error al listar sensores", "Error", "error");
                }
            });
        }
    }, [obt]);

    const handleBaja = (externalId) => {
        obtenerR('admin/sensor/cambiarEstado/' + externalId + '/' + false).then((info) => {
            console.log(info)
            if (info.code === 200) {
                mensajes("Sensor dado de baja", "Informacion", "success")
            } else {
                mensajes("Error al listar sensores", "Error", "error");
            }
        });
    };

    return (

        <div className="row">
            <Menu />
            <h1 style={{ textAlign: "center" }}>Motas Registradas</h1>
            <div className="container-fluid">
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Buscar usuario" aria-describedby="button-addon2" />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2">Buscar</button>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 mb-4 text-center">
                            <div className="btn-group" role="group">
                                <Link href="/mota/registrar" className="btn btn-success font-weight-bold">Registrar</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <table className="table table-bordered" style={{ borderColor: "ActiveBorder" }}>
                        <thead className="table-active">
                            <tr>
                                <th >id</th>
                                <th >Nombre</th>
                                <th >Descripcion</th>
                                <th >Tipo Sensor</th>
                                <th >Administrar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sensor.map((dato, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{dato.nombre}</td>
                                    <td>{dato.descripcion}</td>
                                    <td>{dato.tipo_sensor}</td>
                                    <td>
                                        {<Link style={{ marginRight: "5px" }} href="/sensor/editar/[external]" as={`sensor/editar/${dato.id}`} className="btn btn-warning font-weight-bold">Editar</Link>}
                                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            Bajar Mota
                                        </button>
                                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLabel">Confirmacion</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        Estas seguro que quieres bajar esta mota?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={()=>handleBaja(dato.id)}>Confirmar</button>
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


