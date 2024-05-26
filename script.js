// Variable global para almacenar los datos del archivo JSON
let data;

const checkbox = document.getElementById('checkbox');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const input3 = document.getElementById('input3');
const input1Container = document.getElementById('input1-container');
const input2Container = document.getElementById('input2-container');
const errorElement = document.getElementById('error-result');
const resultElement = document.getElementById('result');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        input1Container.style.display = 'none';
        input2Container.style.display = 'block';
    } else {
        input1Container.style.display = 'block';
        input2Container.style.display = 'none';
    }

    errorElement.style.display = 'none';
    resultElement.style.display = 'none';
});

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
    let isNewPatent = checkbox.checked;

    isValidNewPatentValues = (input2.value.toString() + input3.value.toString()).replace(/\s/g, "") != "";
    isValidPatentValues = input1.value.toString().replace(/\s/g, "") != "";
    
    if (isNewPatent ? isValidNewPatentValues : isValidPatentValues) {
        let patentInput = input1.value.toString() + input2.value.toString() + input3.value.toString();

        patentInput = patentInput.toString().replace(/\s/g, "").toUpperCase();

        await loadJSON();

        // const regex2016to2023 = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
        // const regex1995to2016 = /^[A-Z]{3}\d{3}$/;
        const regexBefore1995 = /^[QRSTUVWXYZ]{3}$/;
        if (isNewPatent) {
            const resultItems = data.patentes.filter(item => item.patente.startsWith(patentInput.substring(0, 2)) && item.patente.includes("-"));
            const result = checkNumbersLicense(patentInput.substring(3, 6), resultItems);
            if (result) {
                changeDisplayStyle(resultElement, errorElement);
                resultElement.innerHTML = `${result.anio}`;
            } else {
                changeDisplayStyle(errorElement, resultElement);
                errorElement.innerHTML = 'No se encontró un año';
            }
        } else if (!isNewPatent) {
            let foundPatent = null;
            for (let i = 0; i < data.patentes.length; i++) {
                let rangoPatente = data.patentes[i].rango;
                if (checkLetterRange(patentInput, rangoPatente)) {
                    foundPatent = data.patentes[i];
                    break; // Rompe el bucle cuando se encuentra una coincidencia válida dentro del rango
                }
            }

            if (foundPatent) {
                changeDisplayStyle(resultElement, errorElement);
                resultElement.innerHTML = `${foundPatent.anio}`;
            } else if (regexBefore1995.test(patentInput)) {
                changeDisplayStyle(resultElement, errorElement);
                resultElement.innerHTML = 'Antes del 1995';
            }
            else {
                changeDisplayStyle(errorElement, resultElement);
                errorElement.innerHTML = 'No se encontró un año';
            }
        } else {
            changeDisplayStyle(errorElement, resultElement);
            errorElement.innerHTML = 'No se encontró un año';
        }
    } else {
        changeDisplayStyle(errorElement, resultElement);
        errorElement.innerHTML = 'Ingrese la info';
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
        if (match) {
            const itemNumber = parseInt(match[1], 10);
            const [start, end] = item.rango[0].split("-");
            // console.log("start: ", start, "end: ", end);
            if (itemNumber >= start && itemNumber <= end) {
                return item;
            }
        }
    });
    return result;
}

const changeDisplayStyle = (block, none) => {
    block.style.display = 'block';
    none.style.display = 'none';
}