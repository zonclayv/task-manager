docker rm $(docker ps -a -q) -f

docker build -t="mongodb" .
docker run -d -p 27017:27017 --name mongodb mongo

// docker run -it --link mongodb:db mongo mongorestore -h db -db task-manager ./build/dump

mongorestore --db task-manager /home/haidash/work/project/task-manager/build/backend/dump
