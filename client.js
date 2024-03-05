// Importamos librerías necesarias
import colors from '@colors/colors';    // Agrega colores en la terminal
import { stdin, exit } from "process";
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

// Cargamos una definición del paquete gRPC como una jerarquía de objetos gRPC 
const packageDefinition = loadSync('conversion.proto');
const conversion_proto = loadPackageDefinition(packageDefinition).conversion;

function llamarServidorRPC(valor, unidadOrigen, unidadDestino) {
    // Hacemos la conexión con el servidor
    const client = new conversion_proto.Conversion('localhost:8080', credentials.createInsecure());
    // Enviamos los parámetros como un obj y recibimos la respuesta mediante el callback
    client.convertirLongitudProto({ valorP: valor, unidadOrigenP: unidadOrigen, unidadDestinoP: unidadDestino }, (error, response) => {
        if (error) {
            console.error(error.details.red);
        } else {
            console.log(`Resultado:\n${valor.yellow} ${unidadOrigen}(s) es aproximadamente: ${response.resultado.toFixed(1).toString().yellow} ${unidadDestino}(s)`.green);
        }
    });
}
console.log(`Podrás convetir de ${'pulgada'.yellow}, ${'pie'.yellow}, ${'yarda'.yellow}, ${'milla'.yellow} a centimetros (${'cm'.cyan}), metros (${'m'.cyan}) y kilometros (${'km'.cyan}).\nSolo debes ingresar: cantidad ${'unidad1'.yellow} ${'unidad2'.cyan}.\nEjemplo: 20 pie cm`);

// Recibimos los parámetros por la terminal
stdin.on('data', (data) => {
    if(data.toString().trim() != 'salir'){
        // Procesamos los datos recibidos
        let entrada = data.toString().trim().split(' ')
        llamarServidorRPC(entrada[0], entrada[1], entrada[2]);
    }else{
        exit();
    }
  });