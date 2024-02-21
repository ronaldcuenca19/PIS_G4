'use client';
import mensajes from "@/componentes/Mensajes";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { obtenerB, modificar } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtilClient";
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
  const [persona, setPersona] = useState([]);
  const [obt, setObt] = useState(false);
  
  const validationShema = Yup.object().shape({
    nombres: Yup.string().required('Ingrese los nombres'),
    apellidos: Yup.string().required('ingrese los apellidos'),
    cedula: Yup.string().required('Ingrese un nro cedula'),
    celular: Yup.string().required('ingrese un telefono'),
    correo: Yup.string().required('Ingrese un correo electronico').email('Se requiere correo valido'),
    clave: Yup.string().required('ingrese su clave')
  });

  const formOptions = { resolver: yupResolver(validationShema) };
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;

  const sendData = (data) => {

    var datos = {
      'nombres': data.nombres,
      'apellidos': data.apellidos,
      'cedula': data.cedula,
      'celular': data.celular,
      'correo': data.correo,
      'clave': data.clave,
    };
    
    useEffect(() => {
      if(!token){
          router.push('/InicioSesion');
      }
    });

    modificar("admin/personas/put/"+external, datos, token).then((info) => {
      if (info.code !== 200) {
        mensajes("El usuario no se pudo modificar", "Error", "error")
      } else {
        mensajes("Usuario modificado correctamente", "exito", "success")
        router.push("/persona");
      }
    });
  };
  
  //obtener los datos de las personas por el external
  if (!obt) {
    obtenerB("admin/personas/get/" + external, token).then((info) => {
      console.log(info)
      if (info.code === 200) {
        const PersonaD = info.datos;
        //console.log(PersonaD);
        setPersona(PersonaD);
        setObt(true);
      } else {
        mensajes("No se pudo obtener usuarios", "Error", "error");
      }
    });
  };
  //se obtienen los datos a modificar en los txt
  useEffect(() => {
    if (persona) {
      setValue('nombres', persona.nombres);
      setValue('apellidos', persona.apellidos);
      setValue('celular', persona.celular);
      setValue('cedula', persona.cedula);
      if (persona.cuenta) {
        setValue('correo', persona.cuenta.correo);
      }
    }
  }, [persona, setValue]);

  return (
    <div className="row justify-content-center" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="d-flex flex-column" >
        <h1 style={{ color: '#205375' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Editar Usuario</h1>
        <div className='container-fluid' style={{ border: '4px solid #ccc', padding: '20px', borderRadius: '10px', width: '1000px' }}>
          <br />
          <form className="user" onSubmit={handleSubmit(sendData)}>

            {/*Ingresar nombre y apellido*/}
            <div className="row mb-4">
              <div className="col">
                <input {...register('nombres')} name="nombres" id="nombres" className={`form-control ${errors.nombres ? 'is-invalid' : ''}`} placeholder='Ingrese los nombres' style={{ fontSize: '25px' }}/>
                <label className="form-label" style={{ color: '#205375' }}>Nombres</label>
                <div className='alert alert-danger invalid-feedback'>{errors.nombres?.message}</div>
              </div>
              <div className="col">
                <input {...register('apellidos')} name="apellidos" id="apellidos" className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} placeholder='Ingrese los apellidos' style={{ fontSize: '25px' }}/>
                <label className="form-label" style={{ color: '#205375' }}>Apellidos</label>
                <div className='alert alert-danger invalid-feedback'>{errors.apellidos?.message}</div>
              </div>
            </div>

            {/*Ingresar cedula y telefono*/}
            <div className="row mb-4">
              <div className="col">
                <input {...register('cedula')} name="cedula" id="cedula" className={`form-control ${errors.cedula ? 'is-invalid' : ''}`} placeholder='Ingrese numero de cedula' autocomplete="off" style={{ fontSize: '25px' }}/>
                <label className="form-label" style={{ color: '#205375' }}>Cédula</label>
                <div className='alert alert-danger invalid-feedback'>{errors.cedula?.message}</div>
              </div>
              <div className="col">
                <input {...register('celular')} name="celular" id="celular" className={`form-control ${errors.celular ? 'is-invalid' : ''}`} placeholder='Ingrese numero de celular' autocomplete="off" style={{ fontSize: '25px' }}/>
                <label className="form-label" style={{ color: '#205375' }}>celular</label>
                <div className='alert alert-danger invalid-feedback'>{errors.celular?.message}</div>
              </div>
            </div>

            {/*Ingresar correo y clave*/}
            <div className="row mb-4">
              <div className="col">
                <input {...register('correo')} name="correo" id="correo" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} placeholder='Ingrese correo electronico' autocomplete="off" style={{ fontSize: '25px' }}/>
                <label className="form-label" style={{ color: '#205375' }}>Correo</label>
                <div className='alert alert-danger invalid-feedback'>{errors.correo?.message}</div>
              </div>
              <div className="col">
                <input {...register('clave')} name="clave" id="clave" className={`form-control ${errors.clave ? 'is-invalid' : ''}`} placeholder='Ingrese una clave' autocomplete="off" style={{ fontSize: '25px' }}/>
                <label className="form-label" style={{ color: '#205375' }}>Clave</label>
                <div className='alert alert-danger invalid-feedback'>{errors.clave?.message}</div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
            <Link href="/persona" className="btn btn-danger mr-3" style={{ background: 'red', fontSize:'25px'}}>
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
