# create our own runner image due to https://nektosact.com/usage/runners.html#default-runners-are-intentionally-incomplete
FROM cypress/browsers:latest

RUN apt update && apt install -y \
    # install required xvfb-run dependencies
    xauth \
    # install optional node-gyp build
    python3 \
    python3-pip \
    # install gh dependencies
    wget \
    jq \
    && rm -rf /var/lib/apt/lists/*

# install gh (https://github.com/cli/cli/blob/trunk/docs/install_linux.md#debian-ubuntu-linux-raspberry-pi-os-apt)
RUN mkdir -p -m 755 /etc/apt/keyrings \
    && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    && cat $out | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt update \
    && apt install gh -y
