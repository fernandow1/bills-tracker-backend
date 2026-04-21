FROM nginx:alpine

# The official nginx image automatically processes .template files
# located in /etc/nginx/templates and outputs them to /etc/nginx/conf.d
# We configure it to look for .template.prod files instead to process UPSTREAM_URL correcty and output default.conf.
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=".template.prod"
COPY templates /etc/nginx/templates

# Copiar el script que extrae el DNS de Railway para resolución dinámica
COPY entrypoint-resolver.sh /docker-entrypoint.d/00-set-resolver.sh
RUN chmod +x /docker-entrypoint.d/00-set-resolver.sh
