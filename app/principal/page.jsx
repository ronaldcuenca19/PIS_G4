'use client';
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { obtenerB } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtilClient";
import Chart from 'chart.js/auto';
import { io } from 'socket.io-client';
import DatePicker from "react-datepicker";

const socket = io('http://localhost:3002');

export default function Page() {
  const token = getToken();
  const chartContainerRef = useRef(null);
  const presionChartContainerRef = useRef(null);
  const humedadChartContainerRef = useRef(null);
  const [weatherChart, setWeatherChart] = useState(null);
  const [weatherChart2, setWeatherChart2] = useState(null);
  const [weatherChart3, setWeatherChart3] = useState(null);
  const [datosClimaticos, setDatosClimaticos] = useState([]);
  const [activeTab, setActiveTab] = useState('Temperatura');
  const [obtTemperatura, setObtTemperatura] = useState(false);
  const [obtPresion, setObtPresion] = useState(false);
  const [obtHumedad, setObtHumedad] = useState(false);
  const [prediccion, setPrediccion] = useState([]);
  const [prediccion2, setPrediccion2] = useState([]);
  const [prediccion3, setPrediccion3] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [datoClimatico, setDatoClimatico] = useState([]);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [obt, setObt] = useState(false);

  useEffect(() => {
    socket.on('actualizarDato', (data) => {
      console.log(data);
      setDatosClimaticos(data);
    });
  }, []);

  useEffect(() => {
    if (!obtTemperatura) {
      obtenerB('admin/prediccion', token)
        .then((info) => {
          if (info.code === 200) {
            const prediccionT = info.datos.filter(prediccionClima => prediccionClima.prediccion.tipoDato === 'temperatura');
            setPrediccion(prediccionT);
            setObtTemperatura(true);
          } else {
            mensajes("Error al listar predicciones de temperatura", "Error", "error");
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos de predicción de temperatura:', error);
        });
    }
  }, [obtTemperatura]);

  useEffect(() => {
    if (!obtPresion) {
      obtenerB('admin/prediccion', token)
        .then((info) => {
          if (info.code === 200) {
            const prediccionP = info.datos.filter(prediccionClima => prediccionClima.prediccion.tipoDato === 'presion');
            setPrediccion2(prediccionP);
            setObtPresion(true);
          } else {
            mensajes("Error al listar predicciones de presión", "Error", "error");
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos de predicción de presión:', error);
        });
    }
  }, [obtPresion]);

  useEffect(() => {
    if (!obtHumedad) {
      obtenerB('admin/prediccion', token)
        .then((info) => {
          if (info.code === 200) {
            const prediccionH = info.datos.filter(prediccionClima => prediccionClima.prediccion.tipoDato === 'humedad');
            setPrediccion3(prediccionH);
            setObtHumedad(true);
          } else {
            mensajes("Error al listar predicciones de humedad", "Error", "error");
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos de predicción de humedad:', error);
        });
    }
  }, [obtHumedad])

  //-----------------------------------------------------------------------------------------------------------------

  const drawChart = () => {
    const ctx = chartContainerRef.current.getContext('2d');
    if (weatherChart2) {
      weatherChart2.destroy();
    }
    if (weatherChart3) {
      weatherChart3.destroy();
    }
    if (weatherChart) {
      weatherChart.destroy();
    }
    const labels = prediccion.slice(0, 10).map(entry => {
      const hora = new Date(entry.fecha).getHours();
      return hora < 10 ? `0${hora}:00` : `${hora}:00`;
    });
  
    const data = prediccion.slice(0, 10).map(entry => entry.prediccion.prediccion);
  
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Predicción de Temperatura',
          data: data,
          borderColor: 'blue',
          borderWidth: 1
        }]
      },
      options: {
        // Opciones del gráfico
      }
    });
    setWeatherChart(chart);
  };
  
  const drawChart2 = () => {
    const ctx2 = presionChartContainerRef.current.getContext('2d');
    if (weatherChart) {
      weatherChart.destroy();
    }
    if (weatherChart3) {
      weatherChart3.destroy();
    }
    if (weatherChart2) {
      weatherChart2.destroy();
    }
    const labels2 = prediccion2.slice(0, 10).map(entry => {
      const hora = new Date(entry.fecha).getHours();
      return hora < 10 ? `0${hora}:00` : `${hora}:00`;
    });
  
    const data2 = prediccion2.slice(0, 10).map(entry => entry.prediccion.prediccion);
  
    const chart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: labels2,
        datasets: [{
          label: 'Predicción de Presión',
          data: data2,
          borderColor: 'red',
          borderWidth: 1
        }]
      },
      options: {
        // Opciones del gráfico
      }
    });
  
    setWeatherChart2(chart2);
  };

  const drawChart3 = () => {
    const ctx2 = humedadChartContainerRef.current.getContext('2d');
    if (weatherChart) {
      weatherChart.destroy();
    }
    if (weatherChart2) {
      weatherChart2.destroy();
    }

    if (weatherChart3) {
      weatherChart3.destroy();
    }
    const labels2 = prediccion3.slice(0, 10).map(entry => {
      const hora = new Date(entry.fecha).getHours();
      return hora < 10 ? `0${hora}:00` : `${hora}:00`;
    });
  
    const data3 = prediccion3.slice(0, 10).map(entry => entry.prediccion.prediccion);
  
    const chart3 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: labels2,
        datasets: [{
          label: 'Predicción de Presión',
          data: data3,
          borderColor: 'green',
          borderWidth: 1
        }]
      },
      options: {
        // Opciones del gráfico
      }
    });
  
    setWeatherChart3(chart3);
  };
  

  useEffect(() => {
    if (presionChartContainerRef.current && prediccion2.length > 0) {
      drawChart2();
    }
  }, [presionChartContainerRef.current, prediccion2]);

  useEffect(() => {
    if (chartContainerRef.current && prediccion.length > 0) {
      drawChart();
    }
  }, [chartContainerRef.current, prediccion]);
  useEffect(() => {
    if (humedadChartContainerRef.current && prediccion3.length > 0) {
      drawChart3();
    }
  }, [humedadChartContainerRef.current, prediccion3]);

  

  const renderContent = () => {
    switch (activeTab) {
      case 'Temperatura':
        return (
          <>
            <div style={{ textAlign: 'center' }}>
              <h3>Gráfico de Temperatura</h3>
              <canvas ref={chartContainerRef} />
            </div>
            <p>Contenido de Temperatura</p>
          </>
        );
      case 'Presion':
        return (
          <>
            <div style={{ textAlign: 'center' }}>
              <h3>Gráfico de Presión</h3>
              <canvas ref={presionChartContainerRef} />
            </div>
            <p>Contenido de Presión</p>
          </>
        );
      case 'Humedad':
        return (
          <>
            <div style={{ textAlign: 'center' }}>
              <h3>Gráfico de Humedad</h3>
              <canvas ref={humedadChartContainerRef} />
            </div>
            <p>Contenido de Humedad</p>
          </>
        );
      default:
        return <p>Contenido de Temperatura</p>;
    }
  };
  
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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 mb-4 text-center">
            </div>
          </div>
        </div>
        <div className="row">
        <h2 style={{ color: '#205375'}}>Clima en Tiempo Real</h2>
  {datosClimaticos.map((datoClimatico, index) => (
    <div className="col-md-4">
      {datoClimatico.fecha === '' ? (
        <div className="card" style={{ borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.15)" }}>
          <div className="card-body">
            <h5 className="card-title">Servidor: {datoClimatico.id_mota}</h5>
            <h5 className="card-title">Mota fuera de servicio</h5>
          </div>
        </div>
      ) : (
        <div className="card" style={{ borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.15)" }} key={datoClimatico.id_mota}>
          <div className="card-body">
            <h5 className="card-title">Mota: {datoClimatico.id_mota}</h5>
            <p className="card-text">Fecha: {datoClimatico.fecha}</p>
            <p className="card-text">Temperatura: {datoClimatico.temperatura}</p>
            <p className="card-text">Presion: {datoClimatico.presion}</p>
            <p className="card-text">Humedad: {datoClimatico.humedad}</p>
          </div>
        </div>
      )}
    </div>
  ))}
</div>

<div className="row" style={{marginTop:'40px'}}>
<h2 style={{ color: '#205375'}}>Prediccion Climatica</h2>
            < div className="card" style={{ width: '100%', margin: '0 auto' }}>
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'Temperatura' ? 'active' : ''}`} onClick={() => setActiveTab('Temperatura')}>Temperatura</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'Humedad' ? 'active' : ''}`} onClick={() => setActiveTab('Humedad')}>Humedad</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'Presion' ? 'active' : ''}`} onClick={() => setActiveTab('Presion')}>Presion</a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {renderContent()}
              </div>
            </div>
            </div>

      </div>
    </div>
  )
}
