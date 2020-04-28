unit-test-api:
	docker-compose -f api-test.docker-compose.yml build
	docker-compose -f api-test.docker-compose.yml up

# unit-test-api-clean:
# 	docker container rm /mongo || true
#
# unit-test-api:
# 	make unit-test-api-clean
#
# 	docker network create markey-organizing-network || true
#
# 	docker run --network markey-organizing-network \
# 		-e MONGO_INITDB_ROOT_USERNAME=admin \
# 		-e MONGO_INITDB_ROOT_PASSWORD=secret \
# 		-p 27017:27017 \
# 		--name mongo \
# 		-d mongo:4
#
# 	docker build . -f ./api-test.dockerfile -t ed-markey-relational-organizing
#
# 	docker run --rm \
# 		-e PORT=5000 \
# 		-e MONGODB_URL=mongodb://admin:secret@mongo:27017 \
# 		--network markey-organizing-network \
# 		ed-markey-relational-organizing \
# 		node src/api.js
