'use client';
import mensajes from "@/componentes/Mensajes";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import Link from "next/link";
import { getToken } from "@/hooks/SessionUtilClient";
import { useRouter } from 'next/navigation';
import { obtenerB, obtenerNB, modificar } from "@/hooks/Conexion";
import { useEffect, useState } from "react";
import Menu from '@/componentes/menu';
export default function Page({ params }) {
  useEffect(() => {
    // Verificar el rol del usuario almacenado en sessionStorage
    const rol = sessionStorage.getItem('rol');
    if (rol !== 'administrador'|| !token)  {
        // Si el usuario no tiene el rol adecuado, redirigir a una página de acceso denegado
        router.push('/InicioSesion'); // Reemplaza '/acceso-denegado' con la ruta de la página de acceso denegado
    }
}, []);

  const { external } = params;
  const token = getToken();
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
  
    

    modificar("admin/sensor/put/"+external, datos, token).then((info) => {
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
    obtenerB("admin/sensor/get/" + external, token).then((info) => {
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
    obtenerNB('admin/mota', token).then((info) => {
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
    <div className="row justify-content-center" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="d-flex flex-column" >
        <h1 style={{ color: '#205375' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Editar Sensor</h1>
        <div className='container-fluid' style={{ border: '4px solid #ccc', padding: '20px', borderRadius: '10px', width: '1000px' }}>
            <br />
            <form className="sensor" onSubmit={handleSubmit(sendData)}>

              {/*Ingresar nombre y apellido*/}
              <div className="row mb-4">
                <div className="col">
                  <input {...register('nombre')} name="nombre" id="nombre" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} placeholder='Ingrese un nombre para el sensor' autocomplete="off" style={{ fontSize: '25px' }}/>
                  <label className="form-label" style={{ color: '#1b4f72' }}>Nombre</label>
                  <div className='alert alert-danger invalid-feedback'>{errors.nombre?.message}</div>
                </div>
                <div className="col">
                  <input {...register('descripcion')} name="descripcion" id="descripcion" className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} placeholder='Ingrese descripcion para el sensor' autocomplete="off" style={{ fontSize: '25px' }}/>
                  <label className="form-label" style={{ color: '#1b4f72' }}>Descripción</label>
                  <div className='alert alert-danger invalid-feedback'>{errors.descripcion?.message}</div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col">
                  <select {...register('tipo_sensor')} name="tipo_sensor" id="tipo_sensor" className={`form-control ${errors.tipo_sensor ? 'is-invalid' : ''}`}style={{ fontSize: '25px' }}>
                    <option value="">Elija el tipo del sensor</option>
                    <option value="TEMPERATURA/HUMEDAD">TEMPERATURA/HUMEDAD</option>
                    <option value="TEMPERATURA/PRESION">TEMPERATURA/PRESION</option>
                    <option value="OTROS">OTROS</option>
                  </select>
                  <label className="form-label" style={{ color: '#1b4f72' }}>Tipo de Sensor</label>
                  <div className='alert alert-danger invalid-feedback'>{errors.sensor?.message}</div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col">
                  <select {...register('mota')} name="mota" id="mota" className={`form-control ${errors.mota ? 'is-invalid' : ''}`}style={{ fontSize: '25px' }}>
                    <option value="">Elija a que mota pertenecera</option>
                    {mota.map((aux, i) => (
                      <option key={i} value={aux.id}>
                        {`${aux.ip} ${aux.descripcion}`}
                      </option>
                    ))}
                  </select>
                  <label className="form-label" style={{ color: '#1b4f72' }}>Mota</label>
                  <div className='alert alert-danger invalid-feedback'>{errors.sensor?.message}</div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-4">
                  <Link href="/sensor" className="btn btn-danger mr-3" style={{ background: 'red', fontSize:'25px'}}>
                CANCELAR
              </Link>
                <button type='submit' className="btn btn-success ml-3" style={{ background: '#205375', marginLeft: '20px', fontSize:'25px' }}>
                  GUARDAR
                </button>
              </div>
            </form>
          </div>
        </div>
      <br />
    </div>
  );
}