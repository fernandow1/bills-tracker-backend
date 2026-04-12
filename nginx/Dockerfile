FROM nginx:alpine

# Restrict envsubst to only replace these exact variables.
# This prevents it from mistakenly trying to replace internal Nginx variables
# like $host or $remote_addr if they happen to exist in the environment.
ENV NGINX_ENVSUBST_FILTER="\$PORT \$UPSTREAM_URL"

# The official nginx image automatically processes .template files
# located in /etc/nginx/templates and outputs them to /etc/nginx/conf.d
COPY templates /etc/nginx/templates
