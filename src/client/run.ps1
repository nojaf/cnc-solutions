yarn build
docker run --rm -it --name cnc -v "${PWD}\public:/usr/share/nginx/html:ro" -p 9000:80 nginx