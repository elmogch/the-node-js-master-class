/*
 * Crear y exportar variables de configruacion
 */
  

// Contenerodr de variables 
var environments = {};

// localhost environment (default)
environments.localhost = {
	'httpPort': 3000,
	'httpsPort': 3001,
	'envName': 'localhost'
};

// Determinar el environment obtenido desde la línea de comando
var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Checar el environment actual es alguno de los definidos, o usar el default
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.localhost;

// Exportar el módulo
module.exports = environmentToExport;