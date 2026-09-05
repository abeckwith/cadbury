#!/bin/sh
cd /Users/anthonybeckwith/Documents/CodingProjects/cadbury
python3 -m http.server
open -a "Google Chrome" http://localhost:8000/index.html
