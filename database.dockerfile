FROM postgres

ENV POSTGRES_USER ccims-user
ENV POSTGRES_PASSWORD ccims-password
ENV POSTGRES_DB ccims

RUN mkdir -p /docker-entrypoint-initdb.d

ADD init-db.sh /docker-entrypoint-initdb.d/init-db.sh
ADD init-db.sql /schema/init-db.sql
