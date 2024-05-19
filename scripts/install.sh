cd ../server
./gradlew publish
./gradlew clean assemble

cd ../client
npm i
cd ../dev-proxy
npm i
