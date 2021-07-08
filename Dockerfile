FROM alpine:edge

# Installs latest Chromium (89) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /github/workspace \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /github/workspace

ADD src /github/workspace

# 
RUN npm install

# Run everything after as non-privileged user.
USER pptruser

ENTRYPOINT ["entrypoint.sh"]
