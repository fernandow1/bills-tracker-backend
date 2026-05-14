#!/bin/sh
# Extraer los nameservers del sistema configurados por Railway (que soportan IPv6)
# IMPORTANTE: Nginx requiere que las IPs IPv6 estén entre corchetes [].
DNS_IP=$(awk 'BEGIN{ORS=" "} $1=="nameserver" { if ($2 ~ /:/) {print "["$2"]"} else {print $2} }' /etc/resolv.conf)

# Inyectamos globalmente una directiva resolver para Nginx antes de que arranque
echo "resolver $DNS_IP valid=10s ipv6=on;" > /etc/nginx/conf.d/00-resolver.conf
