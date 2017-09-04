# M2M System Source Api

PROJECT = "Gateway"

# Test unitarios con mocha.
#
# Antes del test ejecuta los lints de la librería "standard"
# Se utiliza Nyc de Istambul para generar cobertura de test
test: ;@echo "Testing ${PROJECT}....."; \
	standard "./*.js" \"./src/**/*.js\" \"./test/**/*.js\"; \
	./node_modules/.bin/nyc --reporter=lcov --reporter=html --reporter=text ./node_modules/mocha/bin/mocha -t 10000; \
	mkdir -p ./reports && cp -r ./coverage ./reports && rm -rf ./coverage; \
	echo 'Codecoverage generado en ./reports/coverage'

# Servidor de nodejs con nodemon
dev: ;@echo "Starting ${PROJECT} development server....."; \
	export NODE_PATH=.; \
	export DEBUG=gw*; \
	export PORT=3100; \
	nodemon index.js

# test + git push + pm2 deploy
deploy: ;@echo "Deploying ${PROJECT}....."; \
	npm test
	git push origin master
	pm2 deploy ecosystem.config.js production update

# Instalación de paquetes npm con "npm install"
install: ;@echo "Installing ${PROJECT}....."; \
	npm install

# Elimina el directorio node_modules
clean: ;
	rm -rf node_modules

# Ejecuta plato para analisis de calidad de código.
# Todavía no hay un mínimo definido para el proyecto.
code-quality: ;@echo ""; \
	./node_modules/.bin/plato -r -d reports/code-quality -t 'M2M SimsManager Code Quality' -n src

.PHONY: test
