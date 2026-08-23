@echo off
set GIT_PATH="C:\Program Files\Git\bin\git.exe"
%GIT_PATH% add .
%GIT_PATH% commit -m "Implemented high-fidelity redesign for Careers page and Footer"
%GIT_PATH% push origin main
