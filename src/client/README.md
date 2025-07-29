# Client

Develop using

> yarn develop

REST API endpoints:

> https://cncsolutions-backend.azurewebsites.net/umbraco/api/graph/tree

Uses Node 20!

## Generate still for homepage video

ffmpeg -i home.mp4 -vframes 1 -q:v 2 still.jpg

## Generate compressed videos

ffmpeg -i input.mp4 -crf 23 -preset medium -acodec aac -b:a 128k ./output/home.mp4
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 28 -b:v 1M -c:a libopus -b:a 128k ./output/home.webm
