import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
const packageDefinition = loadSync('conversion.proto');
const conversion_proto = loadPackageDefinition(packageDefinition).conversion;

function llamarServidorGRPC(valor, unidadOrigen, unidadDestino) {
    const client = new conversion_proto.Conversion('localhost:50051', credentials.createInsecure());

    client.convertirLongitud({ valor: valor, unidadOrigen: unidadOrigen, unidadDestino: unidadDestino }, (error, response) => {
        if (error) {
            console.error('Error:', error.message);
        } else {
            console.log(`Resultado: ${response.resultado}`);
        }
    });
}

// Ejemplo de uso
const valor = 20;
const unidadOrigen = 'milla';
const unidadDestino = 'km';

llamarServidorGRPC(valor, unidadOrigen, unidadDestino);
