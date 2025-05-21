ACT_DOCKER_IMAGE_TAG = what3words/act-gha-runner
ACT_DOCKERFILE_FILEPATH = dockerfiles/act.Dockerfile
DOCKER = docker
LOGS_DIR = tmp/logs

.PHONY: all
all: setup install

.PHONY: setup
setup:
	@echo "🤖🐳 Building docker image"
	@mkdir -p $(LOGS_DIR)
	@if command -v $(DOCKER) &>/dev/null; then $(DOCKER) build . -t $(ACT_DOCKER_IMAGE_TAG) -f $(ACT_DOCKERFILE_FILEPATH) 2>&1| tee tmp/logs/docker-$(currDateTime).txt; else echo "‼️ Docker command not found"; exit 1; fi
	@echo "🤖🔨 Registering asdf plugins"
	@# asdf api does not allow for multiple plugin registrations atm: https://github.com/asdf-vm/asdf/issues/276#issuecomment-2611566684
	@cat .tool-versions | cut -d' ' -f1 | grep "^[^\#]" | xargs -I{} asdf plugin add {}
	@echo "🤖🕵️‍♂️ Registered asdf plugins"
	@asdf plugin list
	$(eval currDateTime=$(shell date "+%Y%m%d%H%M"))
	@echo "🤖🐚 Setup environment"
	@if test ! -f .env; then cp example.env .env;fi
	@echo "🤖✅ Setup complete"

.PHONY: install
install:
	@echo "🤖📦 Installing asdf plugins"
	@asdf install
	@echo "🤖📦 Installing npm dependencies"
	@npm install
	@echo "🤖📦 Installing wrappers"
	@./scripts/install-wrappers.sh
	@echo "🤖✅ Install complete"

.PHONY: clean
clean:
	@echo "🤖🐳 Stopping docker containers"
	@if command -v $(DOCKER) &>/dev/null; then $(DOCKER) stop $$($(DOCKER) ps -aq --filter ancestor=$(ACT_DOCKER_IMAGE_TAG)); else echo "‼️ Docker command not found"; exit 1; fi
	@echo "🤖🧹 Cleaning up workspaces"
	@npm run clean
	@echo "🤖🧹 Cleaning up root workspace"
	@npm run clean:workspace
	@echo "🤖🧹 Removing asdf plugins"
	@cat .tool-versions | cut -d' ' -f1 | grep "^[^\#]" | xargs -I{} asdf plugin remove {}
	@echo "🤖🧹 Removing wrapper binaries"
	@find .wrappers ! -name '*w' -delete
	@echo "🤖✅ Cleanup complete"