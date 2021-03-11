FROM busybox
LABEL author="chevdor"
LABEL app="srtool"

WORKDIR /srtool-mock
ENV PATH="/srtool-mock:${PATH}" 

COPY scripts/* .
COPY replays/srtool-polkadot-0.8.28_build-nocolor.log build.log

# Number of ms between line outputs, you never compiled that fast ;-)
# God values are anything between 0 and 0.1. Beyond that, it will start
# feeling very 'real'!
ENV SLEEP=0

CMD [ "build" ]
