set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

build version:
    docker build -t battle-ships:{{version}} .

publish version: (build version)
    docker tag battle-ships:{{version}} ghcr.io/benni043/battle-ships:{{version}}
    docker push ghcr.io/benni043/battle-ships:{{version}}