build:
	npm i --legacy-peer-deps && npm run build:firefox && cd dist_firefox && zip -r -FS ../obsidian-bridge-firefox *
