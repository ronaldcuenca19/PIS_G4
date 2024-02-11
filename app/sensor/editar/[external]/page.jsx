'use client';
import mensajes from "@/componentes/Mensajes";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { obtenerP, obtenerR, modificar } from "@/hooks/Conexion";
import { useEffect, useState } from "react";
import Menu from '@/componentes/menu';
export default function Page({ params }) {
  const { external } = params;
  // console.log(external);
  const router = useRouter();
  const [sensor, setSensor] = useState([]);
  const [mota, setMotas] = useState([]);
  const [obt, setObt] = useState(false);
  
  const validationShema = Yup.object().shape({
    nombre: Yup.string().required('Ingrese el nombre del sensor'),
    descripcion: Yup.string().required('Ingrese la descripcion para el sensor'),
    tipo_sensor: Yup.string().required('Ingrese el tipo de sensor'),
    mota: Yup.string().required('Seleccione una mota'),
  });

  const formOptions = { resolver: yupResolver(validationShema) };
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;

  const sendData = (data) => {

    var datos = {
        'nombre': data.nombre,
        'descripcion': data.descripcion,
        'tipo_sensor': data.tipo_sensor,
        'mota': data.mota
      };
  
    

    modificar("admin/sensor/put/"+external, datos).then((info) => {
      if (info.code !== 200) {
        mensajes("La mota no se pudo modificar", "Error", "error")
      } else {
        mensajes("Mota modificada correctamente", "exito", "success")
        router.push("/sensor");
      }
    });
  };
  
  //obtener los datos de las personas por el external
  if (!obt) {
    obtenerP("admin/sensor/get/" + external).then((info) => {
      console.log(info.datos)
      if (info.code === 200) {
        const sensorAux = info.datos;
        //console.log(PersonaD);
        setSensor(sensorAux);
        setObt(true);
      } else {
        mensajes("No se pudo obtener usuarios", "Error", "error");
      }
    });
  };
  //se obtienen los datos a modificar en los txt
  useEffect(() => {
    if (sensor) {
      setValue('nombre', sensor.nombre);
      setValue('descripcion', sensor.descripcion);
      setValue('tipo_sensor', sensor.tipo_sensor);
      if (sensor.mota) {
        console.log(sensor.mota.external_id);
        setValue('mota', sensor.mota.external_id) ;
      }
    }
  }, [sensor, setValue]);

  if (!obt) {
    obtenerR('admin/mota').then((info) => {
      console.log(info)
      if (info.code === 200) {
        setMotas(info.datos);
        setObt(true);
      } else if (info.code !== 200 && info.tag === "Acceso denegado") {
        //router.push("/principal")
      } else {
        mensajes("Error al listar usuarios", "Error", "error");
      }
    });
  };


  return (
    <div className="wrapper" >
      <Menu />
      <center>
        <div className="d-flex flex-column" style={{ width: 700 }}>

          <h1 style={{ textAlign: "center", fontSize: "1.5em" }}>Editar Sensor</h1>

          <div className='container-fluid' style={{ border: '4px solid #ccc', padding: '20px', borderRadius: '10px', maxWidth: '1000px', margin: 'auto' }}>

            <div className="container-fluid" >

              <img className="card" src="/img/user.png" style={{ width: 90, height: 90 }} />
            </div>
            <br />
            <form className="sensor" onSubmit={handleSubmit(sendData)}>

              {/*Ingresar nombre y apellido*/}
              <div className="row mb-4">
                <div className="col">
                  <input {...register('nombre')} name="nombre" id="nombre" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} placeholder='Ingrese un nombre para el sensor' autocomplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.nombre?.message}</div>
                </div>
                <div className="col">
                  <input {...register('descripcion')} name="descripcion" id="descripcion" className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} placeholder='Ingrese descripcion para el sensor' autocomplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.descripcion?.message}</div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col">
                  <select {...register('tipo_sensor')} name="tipo_sensor" id="tipo_sensor" className={`form-control ${errors.tipo_sensor ? 'is-invalid' : ''}`}>
                    <option value="">Elija el tipo del sensor</option>
                    <option value="TEMPERATURA/HUMEDAD">TEMPERATURA/HUMEDAD</option>
                    <option value="TEMPERATURA/PRESION">TEMPERATURA/PRESION</option>
                    <option value="OTROS">OTROS</option>
                  </select>
                  <div className='alert alert-danger invalid-feedback'>{errors.sensor?.message}</div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col">
                  <select {...register('mota')} name="mota" id="mota" className={`form-control ${errors.mota ? 'is-invalid' : ''}`}>
                    <option value="">Elija a que mota pertenecera</option>
                    {mota.map((aux, i) => (
                      <option key={i} value={aux.id}>
                        {`${aux.ip} ${aux.descripcion}`}
                      </option>
                    ))}
                  </select>
                  <div className='alert alert-danger invalid-feedback'>{errors.sensor?.message}</div>
                </div>
              </div>

              <Link href="sensor" className="btn btn-danger" style={{ flex: '1', marginRight: '4px' }}>
                Cancelar
              </Link>

              <button type='submit' className="btn btn-success" style={{ flex: '1', marginLeft: '4px' }}>
                Guardar
              </button>

            </form>

          </div>
        </div>
      </center>
      <br />
    </div>
  );
}