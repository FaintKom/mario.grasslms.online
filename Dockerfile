# Static portfolio site for mario.grasslms.online
# Built from nginx:alpine. Serves .html files at root.

FROM nginx:1.27-alpine

# Replace default nginx config with our minimal static-server config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy site assets into nginx html root.
COPY index.html /usr/share/nginx/html/index.html
COPY block-a-lesson-generation.html /usr/share/nginx/html/block-a-lesson-generation.html
COPY block-b-lesson-review.html /usr/share/nginx/html/block-b-lesson-review.html
COPY block-c-interactive-exercises.html /usr/share/nginx/html/block-c-interactive-exercises.html
COPY block-d-content-tools.html /usr/share/nginx/html/block-d-content-tools.html
COPY block-e-knowledge-rag.html /usr/share/nginx/html/block-e-knowledge-rag.html

# Healthcheck — nginx must respond.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost/healthz || exit 1

EXPOSE 80
