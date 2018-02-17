#!/bin/bash

for filename in *.wav
	do
		ffmpeg -i $filename -acodec libopus -b:a 32k -vbr on -compression_level 10 -ac 1 ./ogg/${filename/.wav/}.ogg
	done
