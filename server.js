// Importamos librerias para usar RPC
import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

// Cargamos una definición del paquete gRPC como una jerarquía de objetos gRPC 
const packageDefinition = loadSync('conversion.proto');
const conversion_proto = loadPackageDefinition(packageDefinition).conversion;

// Funcion que hace la conversion,
function convertirLongitud(call, callback) {
    const valor = call.request.valor;
    const unidadOrigen = call.request.unidadOrigen;
    const unidadDestino = call.request.unidadDestino;

    // 1 unidad y su equivalente en metros
    const factores = {
        'pulgada': 0.0254,      //1 pulgada = 0.0254 metros
        'pie': 0.3048,
        'yarda': 0.9144,
        'milla': 1609.344
    };

    const valorEnMetros = valor * factores[unidadOrigen];   //Lo convierte a metros

    let resultado;
    switch (unidadDestino) {
        case 'cm':
            resultado = valorEnMetros * 100;
            break;
        case 'm':
            resultado = valorEnMetros;
            break;
        case 'km':
            resultado = valorEnMetros / 1000;
            break;
        default:
            callback({ message: 'Unidad de destino no válida' });
            return;
    }

    callback(null, { resultado: resultado });
}

const port = '8080'

function main() {
    const server = new Server();
    server.addService(conversion_proto.Conversion.service, {
        convertirLongitud: convertirLongitud,
    });
    server.bindAsync(`localhost:${port}`, ServerCredentials.createInsecure(), () => {
        console.log(`Servidor gRPC en ejecución en el puerto ${port}`);
    });
}

main();
