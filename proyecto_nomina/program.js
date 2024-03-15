const readlineSync = require('readline-sync');

let otroEmpleado = 1;
let subsidioEstrato = 0;
let subsidioSector = 0;
let subsidioEstudioHijos = 0;
let costoVueloExtranjero = 0;
let nivelAcademicoHijo = 0;
let empleadoTieneHijos = 0;
let nominaMujeres = 0;
let nominaHombres = 0;
let empleadoMasCostoso = {};
let gastoSubsidiosSecundaria = 0;
let gastoPasajesExtranjeros = 0;

let empleados = []; // Inicialización del arreglo de empleados

console.info('PARAMETRIZACIÓN DEL SISTEMA');
const subsidioHijosPrimaria = +readlineSync.question(`Ingrese el valor de subsidio por los hijos de primaria: `);
const subsidioHijosSecundaria = +readlineSync.question(`Ingrese el valor de subsidio por los hijos de secundaria: `);
const subsidioHijosUniversidad = +readlineSync.question(`Ingrese el valor de subsidio por los hijos de universidad: `);

do {
    console.info('DATOS DEL EMPLEADO');
    const nombreEmpleado = readlineSync.question(`Ingrese el nombre del empleado: `);
    const sexoEmpleado = readlineSync.question(`Ingrese el sexo del empleado: F/M`).toLowerCase();
    const salarioEmpleado = +readlineSync.question(`Ingrese el salario del empleado: `);
    const estratoEmpleado = +readlineSync.question(`Ingrese el estrato del empleado: `);
    
    // Calcular subsidio según estrato
    if (estratoEmpleado === 1) {
        subsidioEstrato = salarioEmpleado * 0.15;
    } else if (estratoEmpleado === 2) {
        subsidioEstrato = salarioEmpleado * 0.10;
    } else if (estratoEmpleado === 3) {
        subsidioEstrato = salarioEmpleado * 0.05;
    }

    const nacionalidadEmpleado = +readlineSync.question(`¿El empleado es extranjero? si=1, no=0: `);
    if (nacionalidadEmpleado === 1) {
        costoVueloExtranjero = +readlineSync.question(`¿Cuánto cuesta el vuelo para visitar a su familia? `);
    }

    const ubicacionEmpleado = +readlineSync.question(`Seleccione la sector de vivienda del empleado: \nUrbano = 1\nRural = 2\n`);
    if (ubicacionEmpleado === 2) {
        subsidioSector = 35000;
    }

    // Registro de hijos
    let hijos = [];
    empleadoTieneHijos = +readlineSync.question(`¿El empleado tiene hijos? si=1, no=0: `);
    if (empleadoTieneHijos === 1) {
        do {
            const nombreHijo = readlineSync.question(`Nombre del hijo: `);
            const nivelAcademicoHijo = +readlineSync.question(`Seleccione el nivel actual de estudio de su hijo: \nPrimaria = 1\nSecuendaria = 2\nUniversidad = 3\n`);

            // Asociar subsidio de estudio según nivel académico del hijo
            if (nivelAcademicoHijo === 1) {
                subsidioEstudioHijos = subsidioHijosPrimaria;
            } else if (nivelAcademicoHijo === 2) {
                subsidioEstudioHijos = subsidioHijosSecundaria;
            } else if (nivelAcademicoHijo === 3) {
                subsidioEstudioHijos = subsidioHijosUniversidad;
            }

            hijos.push({ nombre: nombreHijo, nivelAcademico: nivelAcademicoHijo });
            otroHijo = +readlineSync.question(`¿Desea agregar otro hijo? si=1, no=0: `);
        } while (otroHijo === 1);
    }

    // Calcular costo de pasajes para empleados extranjeros
    if (nacionalidadEmpleado === 1) {
        gastoPasajesExtranjeros += costoVueloExtranjero * 2; // Dos vuelos al año
    }

    // Calcular costos de subsidios de secundaria
    for (let i = 0; i < hijos.length; i++) {
        if (hijos[i].nivelAcademico === 2) {
            gastoSubsidiosSecundaria += subsidioHijosSecundaria;
        }
    }

    // Registro de empleados
    empleados.push({
        nombre: nombreEmpleado,
        sexo: sexoEmpleado,
        salario: salarioEmpleado,
        estrato: estratoEmpleado,
        subsidioEstrato: subsidioEstrato,
        nacionalidad: nacionalidadEmpleado,
        costoVuelo: costoVueloExtranjero,
        ubicacion: ubicacionEmpleado,
        hijos: hijos
    });

    otroEmpleado = +readlineSync.question(`¿Desea registrar otro empleado? si=1, no=0: `);
} while (otroEmpleado === 1);

// Calcular costos totales
let costoTotalNomina = 0;
for (let i = 0; i < empleados.length; i++) {
    let costoEmpleado = empleados[i].salario + empleados[i].subsidioEstrato + subsidioSector + empleados[i].costoVuelo;
    for (let j = 0; j < empleados[i].hijos.length; j++) {
        costoEmpleado += subsidioEstudioHijos;
    }
    costoTotalNomina += costoEmpleado;

    // Calcular nómina diferenciada por sexo
    if (empleados[i].sexo === 'f') {
        nominaMujeres += empleados[i].salario;
    } else if (empleados[i].sexo === 'm') {
        nominaHombres += empleados[i].salario;
    }

    // Encontrar empleado que más cuesta
    if (i === 0 || empleados[i].salario > empleadoMasCostoso.salario) {
        empleadoMasCostoso = empleados[i];
    }
}

console.info(`1. El costo total de la nómina es: ${costoTotalNomina}`);
console.info(`2. El costo de la nómina de los hombres es: ${nominaHombres}`);
console.info(`3. El costo de la nómina de las mujeres es: ${nominaMujeres}`);
console.info(`4. El empleado que más dinero le cuesta es: ${empleadoMasCostoso.nombre}`);
console.info(`5. El dinero gastado en subsidios para los hijos en secundaria es: ${gastoSubsidiosSecundaria}`);
console.info(`6. El dinero gastado en pasajes para los empleados extranjeros es: ${gastoPasajesExtranjeros}`);
