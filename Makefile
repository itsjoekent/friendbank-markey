start:
	docker-compose build
	docker-compose up

unit-test-api:
	docker-compose -f api-test.docker-compose.yml build
	docker-compose -f api-test.docker-compose.yml up
