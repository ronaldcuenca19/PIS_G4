'use client'
import mensajes from "@/componentes/Mensajes";
import { obtenerNT } from "@/hooks/Conexion";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [datoClimatico, setDatoClimatico] = useState([]);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [obt, setObt] = useState(false);

    useEffect(() => {
        if (!obt) {
            obtenerNT('admin/datosClimaticos').then((info) => {
                console.log(info)
                if (info.code === 200) {
                    // Filtrar las personas cuya cuenta esté activa (estado = true)
                    //const datosFecha = info.datos.filter(datosClimaticos => datosClimaticos.fecha === true);
                    setDatoClimatico(info.datos);
                    setDatosFiltrados(info.datos)
                    setObt(true);
                } else {
                    mensajes("Error al listar usuarios", "Error", "error");
                }
            });
        }
    }, [obt]);


    const buscarDatos = () => {
        const datosPorFecha = datoClimatico.filter(dato => {
          const fechaDato = new Date(dato.fecha);
          return fechaDato.toDateString() === fechaSeleccionada.toDateString();
        });
        if (datosPorFecha.length > 0) {
            setDatosFiltrados(datosPorFecha);
        } else {
            mensajes("La fecha seleccionada no se encuentra en los datos", "Información", "info");
        }
    }

      const datosCompletos = () => {
        setDatosFiltrados(datoClimatico);
      }


    return (
        <div className="row">
            <h1 style={{ textAlign: "center" }}>Datos Climaticos Registrados</h1>
            <div className="container-fluid">
                <div className="input-group mb-3">
                    <DatePicker
                        selected={fechaSeleccionada}
                        onChange={(date) => setFechaSeleccionada(date)}
                        className="form-control"
                        placeholderText="Buscar dato"
                    />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={buscarDatos}>Buscar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={datosCompletos}>Datos Totales</button>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 mb-4 text-center">
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <table className="table table-bordered" style={{ borderColor: "ActiveBorder" }}>
                        <thead className="table-active">
                            <tr>
                                <th >id</th>
                                <th >Fecha</th>
                                <th >Temperatura</th>
                                <th >Presion</th>
                                <th >Humedad</th>
                                <th >Mota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map((dato, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{dato.fecha}</td>
                                    <td>{dato.temperatura}</td>
                                    <td>{dato.humedad}</td>
                                    <td>{dato.presion}</td>
                                    <td>{dato.id_mota}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
