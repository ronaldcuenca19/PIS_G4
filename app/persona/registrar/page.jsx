'use client';
import mensajes from "@/componentes/Mensajes";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { obtenerR, guardar } from "@/hooks/Conexion";
import { useState } from "react";
import Menu from '@/componentes/menu';

export default function Page() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [obt, setObt] = useState(false);
  
  const validationShema = Yup.object().shape({
    nombres: Yup.string().required('Ingrese los nombres'),
    apellidos: Yup.string().required('ingrese los apellidos'),
    cedula: Yup.string().required('Ingrese un nro cedula'),
    celular: Yup.string().required('ingrese un telefono'),
    rol: Yup.string().required('Seleccione un rol'),
    correo: Yup.string().required('Ingrese un correo electronico').email('Se requiere correo valido'),
    clave: Yup.string().required('ingrese su clave')
  });

  const formOptions = { resolver: yupResolver(validationShema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;


  //Metodo para guard
  const sendData = (data) => {
    console.log('Datos a enviar al backend:', data);

    var datos = {
      'nombres': data.nombres,
      'apellidos': data.apellidos,
      'cedula': data.cedula,
      'celular': data.celular,
      'correo': data.correo,
      'clave': data.clave,
      'rol': data.rol
    };

    guardar('admin/personas/save', datos).then((info) => {
      console.log(info);
      if (info.code !== 200) {
        mensajes("Usuario no se pudo guardar", "Error", "error")
      } else {
        mensajes("Usuario guardado correctamente", "Informacion", "success")
        router.push("/persona");
      }
    });
  };

  //obtener mota 
  if (!obt) {
    obtenerR('admin/rol').then((info) => {
      console.log(info)
      if (info.code === 200) {
        setRoles(info.datos);
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

          <h1 style={{ textAlign: "center", fontSize: "1.5em" }}>Registrar Usuario</h1>

          <div className='container-fluid' style={{ border: '4px solid #ccc', padding: '20px', borderRadius: '10px', maxWidth: '1000px', margin: 'auto' }}>

            <div className="container-fluid" >

              <img className="card" src="/img/user.png" style={{ width: 90, height: 90 }} />
            </div>
            <br />
            <form className="user" onSubmit={handleSubmit(sendData)}>

              {/*Ingresar nombre y apellido*/}
              <div className="row mb-4">
                <div className="col">
                  <input {...register('nombres')} name="nombres" id="nombres" className={`form-control ${errors.nombres ? 'is-invalid' : ''}`} placeholder='Ingrese los nombres'/>
                  <div className='alert alert-danger invalid-feedback'>{errors.nombres?.message}</div>
                </div>
                <div className="col">
                  <input {...register('apellidos')} name="apellidos" id="apellidos" className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} placeholder='Ingrese los apellidos' />
                  <div className='alert alert-danger invalid-feedback'>{errors.apellidos?.message}</div>
                </div>
              </div>

              {/*Ingresar cedula y telefono*/}
              <div className="row mb-4">
                <div className="col">
                  <input {...register('cedula')} name="cedula" id="cedula" className={`form-control ${errors.cedula ? 'is-invalid' : ''}`} placeholder='Ingrese numero de cedula' autocomplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.cedula?.message}</div>
                </div>
                <div className="col">
                  <input {...register('celular')} name="celular" id="celular" className={`form-control ${errors.celular ? 'is-invalid' : ''}`} placeholder='Ingrese numero de celular' autocomplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.celular?.message}</div>
                </div>
              </div>

              {/*Ingresar correo y clave*/}
              <div className="row mb-4">
                <div className="col">
                  <input {...register('correo')} name="correo" id="correo" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} placeholder='Ingrese correo electronico' autoComplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.correo?.message}</div>
                </div>
                <div className="col">
                  <input {...register('clave')} type = "password" name="clave" id="clave" className={`form-control ${errors.clave ? 'is-invalid' : ''}`} placeholder='Ingrese una clave' autoComplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.clave?.message}</div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col">
                  <select {...register('rol')} name="rol" id="rol" className={`form-control ${errors.rol ? 'is-invalid' : ''}`}>
                    <option>Elija un rol</option>
                    {roles.map((aux, i) => (
                      <option key={i} value={aux.id}>
                        {`${aux.nombre}`}
                      </option>
                    ))}
                  </select>
                  <div className='alert alert-danger invalid-feedback'>{errors.rol?.message}</div>
                </div>

              </div>

              <Link href="/persona" className="btn btn-danger" style={{ flex: '1', marginRight: '4px' }}>
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
