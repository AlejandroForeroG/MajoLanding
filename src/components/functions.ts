// funciones.ts

interface Valores {
  [key: string]: {
    poblacion?: number;
    tasanatalidad?: number;
    tasamortalidad?: number;
  };
}

type SetValores = React.Dispatch<React.SetStateAction<Valores>>;

export const handleChange = (
  etapa: string,
  campo: string,
  valor: number,
  valores: Valores,
  setValores: SetValores
) => {
  setValores((prevValores) => ({
    ...prevValores,
    [etapa.toLowerCase()]: {
      ...prevValores[etapa.toLowerCase()],
      [campo.toLowerCase()]: valor,
    },
  }));
};

export const calculoDensopoblacional = (n: number): number => {
  const b = -0.005;
  const res = Math.exp(b * n);
  return res;
};

export const multiplicar = (vector: number[], matriz: number[][]): number[] => {
  if (matriz.length !== vector.length) {
    throw new Error(
      "Las dimensiones no son compatibles para la multiplicación de matriz y vector."
    );
  }

  const resultado: number[] = [];
  for (let i = 0; i < matriz.length; i++) {
    let suma = 0;
    for (let j = 0; j < vector.length; j++) {
      suma += matriz[i][j] * vector[j];
    }
    resultado.push(suma);
  }

  return resultado;
};

export const sumatoria = (vector: number[]): number => {
  return vector.reduce((acumulador, valor) => acumulador + valor, 0);
};

export const calcularTasaFertilidad = (poblacion: number[]): number[] => {
  const sum = sumatoria(poblacion);
  return poblacion.map((valor, indice) =>
    indice === poblacion.length - 1
      ? parseFloat((poblacion[0] / poblacion[4]).toFixed(2))
      : 0
  );
};

export const calcularTasaMortalidad = (tasasFertilidad: number[]): number[] => {
  return tasasFertilidad.map((valor, indice, array) => {
    if (indice === array.length - 1) {
      return 0;
    } else {
      return parseFloat((array[indice + 1] / valor).toFixed(2));
    }
  });
};
