import { stdin, exit } from "process";
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
const packageDefinition = loadSync('conversion.proto');
const conversion_proto = loadPackageDefinition(packageDefinition).conversion;
const port = '8080'
function llamarServidorGRPC(valor, unidadOrigen, unidadDestino) {
    const client = new conversion_proto.Conversion('localhost:8080', credentials.createInsecure());

    client.convertirLongitud({ valor: valor, unidadOrigen: unidadOrigen, unidadDestino: unidadDestino }, (error, response) => {
        if (error) {
            console.error('Error:', error.message);
        } else {
            console.log(`Resultado:\n${valor} ${unidadOrigen}(s) es igual a ${response.resultado} ${unidadDestino}(s)`);
        }
    });
}

// Ejemplo de uso
const valor = 20;
const unidadOrigen = 'yarda';
const unidadDestino = 'cm';

console.log('Podrás convetir de pulgada, pie, yarda, milla\na centimetros, metros y kilometros\nSolo debes ingresar ');

stdin.on('data', (data) => {
    if(data.toString().trim() != 'salir'){
        // Procesar los datos recibidos
        let entrada = data.toString().trim().split(' ')
        console.log('Has ingresado:', entrada);
        console.log(entrada[0]);
        console.log(entrada[1]);
        console.log(entrada[2]);

        llamarServidorGRPC(entrada[0], entrada[1], entrada[2]);
    }else{
        exit();
    }
  });