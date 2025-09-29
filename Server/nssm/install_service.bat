nssm install MegNxt-S2M-App "C:\\Program Files (x86)\\MegNxt\\S2M\\App\\s2m-app-v0.0.1.exe" "--static-dir" "C:\\ProgramData\\MegNxt\\S2M\\App\\ProjectFiles"
nssm set MegNxt-S2M-App Description "service to host point cloud files"
nssm set MegNxt-S2M-App AppDirectory "C:\\ProgramData\\MegNxt\\S2M\\App\\ProjectFiles"
nssm set MegNxt-S2M-App AppStdout "C:\\ProgramData\\MegNxt\\S2M\\App\\service.log"
nssm set MegNxt-S2M-App AppStderr "C:\\ProgramData\\MegNxt\\S2M\\App\\serviceError.log"
nssm set MegNxt-S2M-App AppNoConsole 0
nssm set MegNxt-S2M-App Start SERVICE_AUTO_START

nssm start MegNxt-S2M-App