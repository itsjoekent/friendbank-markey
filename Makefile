unit-test-api:
	docker-compose -f api-test.docker-compose.yml build
	docker-compose -f api-test.docker-compose.yml up
