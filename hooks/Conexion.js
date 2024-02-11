let URL = "http://localhost:3001/api/";
let URLS = "http://localhost:3001/";

//devolver la url
export function url_api() {
  return URL;
}

//documentos

export async function obtenerR(recurso) {
  let headers = {};

  headers = {
      'Accept': 'application/json',
      "Content-Type": "application/json",
  };

  const response = await (await fetch(URL + recurso, {
      method: "GET",
      headers: headers,
      cache: 'no-store'
  })).json();
  return response;
}

export async function guardar(recurso, data, key = "") {
  let headers = {};
      headers = {
          'Accept': 'application/json',
          "Content-Type": "application/json",
      };

  const response = await (fetch(URL + recurso, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
  }));

  return await response.json();
}

export async function modificar(recurso, data, key = "") {
  let headers = {};
      headers = {
          'Accept': 'application/json',
          "Content-Type": "application/json",
      };

  const response = await (fetch(URL + recurso, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data)
  }));

  return await response.json();
}

//este si vale
export async function login(recurso, data, key = "") {
  let headers = {};

  if (key !== "") {
      headers = {
          'Accept': "application/json",
          "Content-Type": "application/json",
          "TOKEN-API": key,
      };
  } else {
      headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
      };
  }

  const response = await fetch(URL + recurso, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
  });

  return await response.json();
}


export async function obtenerP(recurso) {
  let headers = {};
  headers = {
    'Accept': "application/json",
  };

  const response = await (
    await fetch(URL + recurso, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    })
  ).json();
  return response;
}

export async function enviarLibro(recurso, imagen, data, key = "", rol) {
  const formData = new FormData();

  for (let i = 0; i < imagen.length; i++) {
    formData.append("images", imagen[i]); // Agregar cada imagen al FormData
  }

  formData.append("libros", JSON.stringify(data));

  let headers = {};

  headers = {
    //'Accept': 'application/json',
    // "Content-Type": "application/json",
    "TOKEN-API": key,
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: formData,
  });

  return await response.json();
}
export const enviarVenta = async (recurso, data, array, key = "") => {
  const formData = new FormData();
  array.forEach((element) => {
    formData.append("dataDes", JSON.stringify(element));
  });
  formData.append("factura", JSON.stringify(data));

  const cabeceras = {
    "TOKEN-API": key,
  };

  const datos = await (
    await fetch(URL + recurso, {
      method: "POST",
      headers: cabeceras,
      body: formData,
    })
  ).json();
  return datos;
};
