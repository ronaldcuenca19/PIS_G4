'use client';
import mensajes from "@/componentes/Mensajes";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { get, useForm } from 'react-hook-form';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { obtenerR, guardar } from "@/hooks/Conexion";
import {getCuenta, getToken} from "@/hooks/SessionUtilClient";
import Menu from '@/componentes/menu';

export default function Page() {
  const router = useRouter();

  const validationShema = Yup.object().shape({
    ip: Yup.string()
      .required('Ingrese la IP de la mota Maestro')
      .test('ip-validation', 'Ingrese una dirección IP válida', value =>
        isValidIPAddress(value)
      ),
    descripcion: Yup.string().required('ingrese la descripcion para la mota ingresada'),
    rol: Yup.string().required('ingrese el rol que desempeñara la mota'),
  });

  const formOptions = { resolver: yupResolver(validationShema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;


  //Metodo para guard
  const sendData = (data) => {
    console.log('Datos a enviar al backend:', data);
    console.log('hola march',getCuenta());

    var datos = {
      'ip': data.ip,
      'descripcion': data.descripcion,
      'rol': data.rol,
      'persona': getCuenta()
    };

    guardar('admin/mota/save', datos).then((info) => {
      console.log(info);
      if (info.code !== 200) {
        mensajes("Mota no se pudo guardar", "Error", "error")
      } else {
        mensajes("Mota guardada correctamente", "Informacion", "success")
        router.push("/mota");
      }
    });
  };

  //validacion IP
  function isValidIPAddress(value) {
    // Expresión regular para validar una dirección IP
    const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

    // Verificar si el valor coincide con la expresión regular
    return ipAddressRegex.test(value);
  }

  return (
    <div className="wrapper" >
      <Menu />
      <center>
        <div className="d-flex flex-column" style={{ width: 700 }}>

          <h1 style={{ textAlign: "center", fontSize: "1.5em" }}>Registrar Mota</h1>

          <div className='container-fluid' style={{ border: '4px solid #ccc', padding: '20px', borderRadius: '10px', maxWidth: '1000px', margin: 'auto' }}>

            <div className="container-fluid" >

              <img className="card" src="/img/user.png" style={{ width: 90, height: 90 }} />
            </div>
            <br />
            <form className="mota" onSubmit={handleSubmit(sendData)}>

              {/*Ingresar nombre y apellido*/}
              <div className="row mb-4">
                <div className="col">
                  <input {...register('ip')} name="ip" id="ip" className={`form-control ${errors.ip ? 'is-invalid' : ''}`} placeholder='Ingrese ip vàlida' autocomplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.ip?.message}</div>
                </div>
                <div className="col">
                  <input {...register('descripcion')} name="descripcion" id="descripcion" className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} placeholder='Ingrese una descripcion para la mota' autocomplete="off"/>
                  <div className='alert alert-danger invalid-feedback'>{errors.descripcion?.message}</div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col">
                  <select {...register('rol')} name="rol" id="rol" className={`form-control ${errors.rol ? 'is-invalid' : ''}`}>
                    <option value="">Elija un rol</option>
                    <option value="MAESTRO">MAESTRO</option>
                    <option value="ESCLAVO">ESCLAVO</option>
                  </select>
                  <div className='alert alert-danger invalid-feedback'>{errors.rol?.message}</div>
                </div>
              </div>

              <Link href="/mota" className="btn btn-danger" style={{ flex: '1', marginRight: '4px' }}>
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

  )
};