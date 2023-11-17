import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
export function Operation() {
  const etapas = ["Semilla", "Plantula", "Juvenil 1", "Juvenil 2", "Adulto"];
  const [ylim, setYlim] = useState(null);
  const options = {
    scales: {
      y: {
        max: ylim,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Predicciones de población Tacoma stans",
      },
    },
  };

  const DatosInvestigacion = {
    semilla: {
      poblacioninicial: 20600,
      tasamortalidad: 0.0038,
    },
    plantula: {
      poblacioninicial: 80,
      tasamortalidad: 0.687,
    },
    "juvenil 1": {
      poblacioninicial: 55,
      tasamortalidad: 0.81,
    },
    "juvenil 2": {
      poblacioninicial: 45,
      tasamortalidad: 0.88,
    },
    adulto: {
      poblacioninicial: 40,
      tasanatalidad: 515,
      tasamortalidad: 0,
    },
  };
  const [iteraciones, setIteraciones] = useState(1000);
  const [valores, setValores] = useState(
    etapas.reduce((acc, etapa) => {
      const etapaLowerCase = etapa.toLowerCase();
      acc[etapaLowerCase] = {
        poblacioninicial:
          acc[etapaLowerCase]?.poblacioninicial ||
          DatosInvestigacion[etapaLowerCase]?.poblacioninicial ||
          undefined,
        tasanatalidad:
          acc[etapaLowerCase]?.tasanatalidad ||
          DatosInvestigacion[etapaLowerCase]?.tasanatalidad ||
          undefined,
        tasamortalidad:
          acc[etapaLowerCase]?.tasamortalidad ||
          DatosInvestigacion[etapaLowerCase]?.tasamortalidad ||
          undefined,
      };
      return acc;
    }, {})
  );

  const [data, setData] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [recalcular, setRecalcular] = useState(false);

  const handleChange = (etapa, campo, valor) => {
    console.log(valores);
    setValores((prevValores) => ({
      ...prevValores,
      [etapa.toLowerCase()]: {
        ...prevValores[etapa.toLowerCase()],
        [campo.toLowerCase()]: valor,
      },
    }));
  };

  const calcularMatrizLeslie = () => {
    let poblacioninicial = [];
    const tiempo = [];
    const iteracion = iteraciones; // Número de iteraciones

    for (let i = 0; i < etapas.length; i++) {
      poblacioninicial.push(
        parseInt(valores[etapas[i].toLowerCase()].poblacioninicial)
      );
    }

    const graficas = [
      [poblacioninicial[0]], // Semilla
      [poblacioninicial[1]], // Plantula
      [poblacioninicial[2]], // Juvenil 1
      [poblacioninicial[3]], // Juvenil 2
      [poblacioninicial[4]], // Adulto
    ];

    const matriz = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    for (let i = 0; i < etapas.length; i++) {
      const natalidad = valores[etapas[i].toLowerCase()].tasanatalidad ?? 0;
      matriz[0][i] = natalidad;
    }

    for (let i = 0; i < etapas.length - 1; i++) {
      const mortalidad = valores[etapas[i].toLowerCase()].tasamortalidad ?? 0;
      matriz[i + 1][i] = mortalidad;
    }

    matriz[4][4] = valores["adulto"].tasamortalidad ?? 0;
    for (let k = 0; k < iteracion; k++) {
      tiempo.push(k*10); // Añadir tiempo (iteración) a la gráfica

      let nuevaPoblacion = [];
      for (let i = 0; i < matriz.length; i++) {
        let suma = 0;
        for (let j = 0; j < matriz[i].length; j++) {
          suma += matriz[i][j] * poblacioninicial[j];
        }
        nuevaPoblacion.push(suma);
        graficas[i].push(suma); // Añadir a la gráfica correspondiente
      }
      poblacioninicial = [...nuevaPoblacion];
    }

    console.log(graficas);
    console.log(tiempo);

    const datasets = [
      {
        label: "Semilla",
        data: graficas[0],
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Rojo
        borderColor: "rgba(255, 99, 132, 1)",
        pointRadius: 0,
      },
      {
        label: "Plantula",
        data: graficas[1],
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Azul
        borderColor: "rgba(54, 162, 235, 1)",
        pointRadius: 0,
      },
      {
        label: "Juvenil 1",
        data: graficas[2],
        backgroundColor: "rgba(255, 206, 86, 0.2)", // Amarillo
        borderColor: "rgba(255, 206, 86, 1)",
        pointRadius: 0,
      },
      {
        label: "Juvenil 2",
        data: graficas[3],
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Verde
        borderColor: "rgba(75, 192, 192, 1)",
        pointRadius: 0,
      },
      {
        label: "Adulto",
        data: graficas[4],
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Morado
        borderColor: "rgba(153, 102, 255, 1)",
        pointRadius: 0,
      },
    ];

    const data = {
      labels: tiempo,
      datasets,
    };
    setData(data);
    setResultado(matriz);
    setRecalcular(false);
  };

  useEffect(() => {
    if (recalcular) {
      calcularMatrizLeslie();
    }
  }, [recalcular]);

  useEffect(() => {
    calcularMatrizLeslie();
  }, [iteraciones]); // Agregado para recalcular al cambiar iteraciones

  return (
    <div className="container mx-auto">
      <h3 class="text-lg text-center font-bold mb-3 text-gray-800">Resultados</h3>
      <p className="mb-4 text-center mt-4">
        Los siguientes datos son los datos obtenidos de la investigación, se
        pueden modificar, excepto las tasas de fertlidad de los 4 primeros
        estadios debido a que estos no producen semillas
      </p>

      <p className="mb-4 text-center mt-4">
        Por favor ingresa los de fertilidad, Paso y población inicial para cada
        estadio
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-400 to-blue-300 p-4 rounded-md">
          <p className="text-sm font-bold mb-2">Valores</p>
          <div className="space-y-2">
            {["Poblacion Inicial", "Tasa fertilidad", "Tasa Cambio"].map(
              (campo) => (
                <input
                  key={campo}
                  type="text"
                  value={campo}
                  className="w-full border rounded-md p-2 text-sm bg-blue-100"
                  disabled="true"
                />
              )
            )}
          </div>
        </div>
        {etapas.map((etapa) => (
          <div
            key={etapa.toLowerCase()}
            className="bg-gradient-to-r from-lime-400 to-lime-300 p-4 rounded-md"
          >
            <p className="text-sm font-bold mb-2">{etapa}</p>
            <div className="space-y-2">
              {["PoblacionInicial", "TasaNatalidad", "TasaMortalidad"].map(
                (campo) => (
                  <input
                    key={campo}
                    type="number"
                    value={valores[etapa.toLowerCase()][campo.toLowerCase()]}
                    onChange={(e) => handleChange(etapa, campo, e.target.value)}
                    className="w-full border rounded-md p-2 text-sm bg-lime-100"
                    disabled={campo === "TasaNatalidad" && etapa !== "Adulto"}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setRecalcular(true)}
          className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition duration-300 "
        >
          Calcular
        </button>
      </div>

      {resultado && (
        <div className="mt-4">
          <div class="mt-5">
            <Line data={data} options={options} />
          </div>
          <div className="flex flex-col items-center space-y-2 w-full mt-5 mb-5">
            <div className="flex items-center space-x-2 w-full">
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={iteraciones}
                onChange={(e) => setIteraciones(e.target.value)}
                className="flex-grow w-full bg-blue-400 rounded-md overflow-hidden appearance-none h-4"
              />
              <span className="text-sm">{iteraciones * 10}</span>
            </div>
            <label className="text-sm">Rango de Tiempo</label>
          </div>
          <div className="flex flex-col items-center space-y-2 w-full mt-5 mb-5">
            <div className="flex items-center space-x-2 w-full">
              <input
                type="range"
                min="10"
                max="100000"
                step="100"
                value={ylim}
                onChange={(e) => setYlim(e.target.value)}
                className="flex-grow w-full bg-blue-400 rounded-md overflow-hidden appearance-none h-4"
              />
              <span className="text-sm">{ylim}</span>
            </div>
            <label className="text-sm">Rango vertical</label>
          </div>
          <div className="flex">
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-l-md shadow-lg w-52 mr-3">
              <p className="text-xl font-bold mb-4 text-white">
                Poblaciones Iniciales
              </p>
              <div className="space-y-4">
                {etapas.map((etapa, i) => (
                  <input
                    key={i}
                    type="number"
                    value={valores[etapa.toLowerCase()].poblacioninicial}
                    className="w-full border-0 rounded-md p-2 text-sm bg-white shadow-inner"
                    disabled
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-lime-400 to-lime-300 p-6 rounded-md shadow-lg">
              <p className="text-2xl font-bold mb-4 text-white">
                Matriz de Leslie
              </p>
              <div className="space-y-4">
                {resultado.map((fila, i) => (
                  <div key={i} className="flex space-x-2">
                    {fila.map((valor, j) => (
                      <input
                        key={j}
                        type="number"
                        value={valor}
                        className="w-full border-0 rounded-md p-2 text-sm bg-white shadow-inner"
                        disabled
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
