#!/usr/bin/env bash
RUSTC_VERSION=nightly-2021-03-15

docker build -t chevdor/srtool-dev:$RUSTC_VERSION .

echo You can now run:
echo docker run --rm -it chevdor/srtool-dev:$RUSTC_VERSION build
echo or
echo docker run --rm -it -e SLEEP=0.01 chevdor/srtool-dev:$RUSTC_VERSION build
