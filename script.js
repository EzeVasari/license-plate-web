// Variable global para almacenar los datos del archivo JSON
let data;

// Función para cargar el archivo JSON
const loadJSON = () => {
    return fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
};

// Función para determinar el año de la patente
const determinarAnio = async () => {
    let patentInput = document.getElementById('patentInput').value.toUpperCase();
    const resultElement = document.getElementById('result');

    patentInput = patentInput.toString().replace(/\s/g, "").toUpperCase();
    console.log("patentInput: ", patentInput);

    await loadJSON();

    const regex2016to2023 = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    const regex1995to2016 = /^[A-Z]{3}\d{3}$/;
    const regexBefore1995 = /^[QRSTUVWXYZ]{3}\d{3}$/;

    if (regex2016to2023.test(patentInput)) {
        const resultItems = data.patentes.filter(item => item.patente.startsWith(patentInput.substring(0,2)) && item.patente.includes("-"));
        const result = checkNumbersLicense(patentInput.substring(3, 6), resultItems);
        console.log("result: ", result);
        if(result){
            resultElement.innerHTML = `La patente corresponde a ${result.anio}`;
        }else {
            resultElement.innerHTML = 'No se encontró un año para esa patente';
        }
    } else if (regex1995to2016.test(patentInput)) {
        let foundPatent = null;
        for (let i = 0; i < data.patentes.length; i++) {
            let rangoPatente = data.patentes[i].rango;
            if (checkLetterRange(patentInput, rangoPatente)) {
                foundPatent = data.patentes[i];
                break; // Rompe el bucle cuando se encuentra una coincidencia válida dentro del rango
            }
        }

        if (foundPatent) {
            resultElement.innerHTML = `La patente corresponde al año ${foundPatent.anio}`;
        } else if (regexBefore1995.test(patentInput)) {
            resultElement.innerHTML = 'La patente corresponde a autos patentados antes del año 1995';
        }
        else {
            resultElement.innerHTML = 'No se encontró un año para esa patente';
        }
    } else {
        resultElement.innerHTML = 'No se encontró un año para esa patente';
    }
};

const checkLetterRange = (letters, range) => {
    let result = false;
    if (range?.toString()) {
        if (range.includes(letters.substring(0, 2))) {
            result = true;
        }
    }
    return result;
}

const checkNumbersLicense = (number, items) => {
    const result = items.find(item => {
        const match = item.patente.match(/-(\d+)/);
        console.log("item: ", item);
        console.log("match: ", match);
        if (match) {
            const itemNumber = parseInt(match[1], 10);
            const [start, end] = item.rango[0].split("-");
            console.log("start: ", start, "end: ", end);
            if (itemNumber >= start && itemNumber <= end) {
                return item;
            }
        }
    });
    return result;
}