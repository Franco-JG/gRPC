// Importamos librerias para usar RPC
import colors from '@colors/colors';    // Agrega colores en la terminal
import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

// Cargamos una definición del paquete gRPC como una jerarquía de objetos gRPC 
const packageDefinition = loadSync('conversion.proto');
const conversion_proto = loadPackageDefinition(packageDefinition).conversion;

// Función que hace la conversion, recibimos un obj
function convertirLongitud(call, callback) {
    const valor = call.request.valorP;
    const unidadOrigen = call.request.unidadOrigenP;
    const unidadDestino = call.request.unidadDestinoP;

    // 1 unidad y su equivalente en metros
    const factores = {
        'pulgada': 0.0254,      //1 pulgada = 0.0254 metros
        'pie': 0.3048,
        'yarda': 0.9144,
        'milla': 1609.344
    };

    const valorEnMetros = valor * factores[unidadOrigen];

    let resultado;
    switch (unidadDestino) {
        case 'cm':
            resultado = valorEnMetros * 100;
            break;
        case 'm':
            resultado = valorEnMetros;
            break;
        case 'km':
            resultado = (valorEnMetros / 1000);
            break;
        default:
            callback({ message: 'Unidad de destino no válida'});    // Regresamos un obj como el error
            return;
    }
    callback(null, { resultado: resultado });   // Regresamos un obj como la respuesta 
    console.log(`Respuesta enviada: ${resultado.toFixed(1).toString().yellow}`);
}

const port = '8080'

function main() {
    // Creamos el servidor RPC
    const server = new Server();

    // Hacemos bind del service en proto con la función en server
    server.addService(conversion_proto.Conversion.service, {
        convertirLongitudProto: convertirLongitud,
    });
    server.bindAsync(`localhost:${port}`, ServerCredentials.createInsecure(), () => {
        console.log(`Servidor gRPC en ejecución en el puerto ${port.yellow}`.green);
    });
}

main();
