// tests/userService.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const { getUserById } = require('../app/models/userModels');
const { dbConnect } = require('../config/mysql');

describe('Función de Obtención de Usuario por ID', function() {
    let connectionStub;
    let dbConnectStub;
    let consoleLogSpy;

    beforeEach(function() {
        connectionStub = {
            query: sinon.stub(),
            end: sinon.stub()
        };
        dbConnectStub = sinon.stub().returns(connectionStub);

        // Mock de console.log para capturar la salida
        //consoleLogSpy = sinon.spy(console, 'log');
    });

    /*afterEach(function() {
        // Restaurar console.log al finalizar cada prueba
        consoleLogSpy.restore();
    });
*/
    it('debería obtener un usuario correctamente si existe en la base de datos', function(done) {
        const userId = 1;
        const fakeUser = {
            idUser: userId,
            Username: 'usuarioEjemplo',
            Password: 'contraseña123',
            Name: 'Nombre Ejemplo',
            DNI: '12345678',
            Legajo: 'A123',
            TypeOfUser: 'ALUMNO',
            Mail: 'usuario@example.com',
            Phone: '1234567890',
            University: 'UNT'
        };

        connectionStub.query.callsFake((query, values, callback) => {
            // Simular que se encontró el usuario en la base de datos
            callback(null, [fakeUser]);
        });

        getUserById(userId, (err, user) => {
            expect(err).to.be.null;
            expect(user).to.deep.equal(fakeUser); // Comparar usando deep.equal para objetos
            expect(connectionStub.query.calledOnce).to.be.true;
            expect(connectionStub.end.calledOnce).to.be.true;

            // Comparar con la salida de console.log
           // expect(consoleLogSpy.calledWith('Usuario obtenido correctamente')).to.be.true;

            done();
        });
    });

    it('debería retornar null si no se encuentra ningún usuario con el ID especificado', function(done) {
        const userId = 999; // Usuario inexistente

        connectionStub.query.callsFake((query, values, callback) => {
            // Simular que no se encontró ningún usuario con el ID especificado
            callback(null, []);
        });

        getUserById(userId, (err, user) => {
            expect(err).to.be.null;
            expect(user).to.be.null;
            expect(connectionStub.query.calledOnce).to.be.true;
            expect(connectionStub.end.calledOnce).to.be.true;

            // Comparar con la salida de console.log
            expect(consoleLogSpy.calledWith('No se encontró ningún usuario con el ID especificado')).to.be.true;

            done();
        });
    });

    it('debería manejar errores al obtener el usuario', function(done) {
        const userId = 1;
        const fakeError = new Error("Error al obtener el usuario");

        connectionStub.query.callsFake((query, values, callback) => {
            // Simular un error al consultar la base de datos
            callback(fakeError);
        });

        getUserById(userId, (err, user) => {
            expect(err).to.equal(fakeError); // Comparar directamente el error
            expect(user).to.be.null;
            expect(connectionStub.query.calledOnce).to.be.true;
            expect(connectionStub.end.calledOnce).to.be.true;

            // No se espera ninguna salida de console.log en caso de error

            done();
        });
    });
});