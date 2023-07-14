docker pull postgres
docker run -itd -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -p 5432:5432 -v /data:/var/lib/postgresql/data --name postgresql postgres

#connect via cli

docker exec -it postgresql bash
>psql -h localhost -p 5432 -U admin -W -f create.sql


docker run -p 5050:5050 \
    -e 'PGADMIN_DEFAULT_EMAIL=user@domain.com' \
    -e 'PGADMIN_DEFAULT_PASSWORD=SuperSecret' \
    -d dpage/pgadmin4
    pagdmin





