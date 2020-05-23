start:
	docker-compose build
	docker-compose up

unit-test-api-cleanup:
	docker-compose down -v --remove-orphans

unit-test-api:
	make unit-test-api-cleanup
	docker-compose -f api-test.docker-compose.yml build
	docker-compose -f api-test.docker-compose.yml up --abort-on-container-exit
