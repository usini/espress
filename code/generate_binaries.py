import json
import os
import configparser
import shutil 

compile_enable = True
copy_enable = True
clean_after = False
inkscape_path = "C:\\Program Files\\Inkscape\\bin\\inkscape.exe"
#platformio_path = os.path.expanduser('~') + "\\.platformio\\packages\\"
#boot_app_path = "framework-arduinoespressif32\\tools\\partitions"
#bootloader_path = "framework-arduinoespressif32\\tools\\sdk\\esp32\\bin"

platformio_path = "C:\\Users\\remi\\OneDrive\FIRM\\"
boot_app_path = ""
bootloader_path = ""

config = configparser.ConfigParser()

print("~~~~~~~~~~~~~~~ Welcome to µsini Espress Maker ! ~~~~~~~~~~~~~~~~~~~~~~~~~~")

print("---- boards/boards.json ---")
f = open("../boards/boards.json")
boards = json.load(f)
print(boards)
f.close()
print("------------------------------")
print(" ")

print("--- apps/apps.json ---")
f = open("../apps/apps.json")
components = json.load(f)
print(components)
f.close()
print("----------------------------")
print(" ")

components_path=[d for d in os.listdir(os.getcwd()) if os.path.isdir(d)]
components_path.remove("template")

def generate_firmware(app, folder):
    if(compile_enable):
        status = os.system("pio run --silent -d " + folder)
        if status == 0:
            print(" [BUILD] ---> Success!")
        else:
            print(" [BUILD] ---> Failed!")

def generate_filesystem(app, folder):
    little_fs_enable = False
    if(compile_enable):
        # Read Platformio.ini for current application
        config.read(folder + "\\platformio.ini")
        build_filesystem = None
        try:
            build_filesystem = config["esp32"]["board_build.filesystem"]
        except:
            pass
        if build_filesystem == "littlefs":
            little_fs_enable = True
            status = os.system("pio run --target buildfs --silent -d " + folder)
            if status == 0:
                print(" [BUILD FS] ---> Success!")
            else:
                print(" [BUILD FS] ---> Failed!")
            print("    ---> LITTLEFS Partitions")

def clean_app(folder):
      if(clean_after):
        try:
            shutil.rmtree(folder +"\\.pio")
            shutil.rmtree(folder + "\\.vscode")
        except:
            print("No need to delete .pio or .vscode")
        print(" [CLEAN] ---> Success!")

def generate_all_apps():
    print("------------------ Firmware generator ----------------- ")
    for component in components_path:
        app_path = os.getcwd() + "\\" + component + "\\"
        
        apps = [d for d in os.listdir(app_path)]
        for app in apps:
            print(" <-------> " + app + " <--------> ")
            generate_firmware(app, app_path + "\\" + app)
            generate_filesystem(app, app_path + "\\" + app)
            copy_app(component, app_path, app)
            clean_app(app_path + "\\" + app)
            print(" <-------------------------------->")
            print(" ")
   
def copy_app(directory, app_path, app):
    for board in boards.keys():
        config.read(app_path + app + "\\platformio.ini")
        print("  [COPY] --> " + board)
        
        little_fs_enable = False
        try:
            build_filesystem = config["esp32"]["board_build.filesystem"]
            little_fs_enable = True
        except:
            pass

        # Get manifest for current board
        files_to_copy = []
        final_path = "..\\apps\\" + directory + "\\boards\\" + board + "\\bins\\" + app + "\\"
        if(board != "uno"):
            if(little_fs_enable):
                manifest_file = board + "/manifest_littlefs.json"
            else:
                manifest_file = board + "/manifest.json"
            f = open("template/manifest/" + manifest_file)
            manifest_json = json.load(f)
            f.close()

            manifest_json["name"] = config["platformio"]["description"].strip("\"")
            #print(manifest_json)

            #print(manifest_json["builds"][0]["parts"][0]["path"])
            #print(manifest_json["builds"][0]["parts"][2]["path"])
            if(manifest_json["builds"][0]["chipFamily"] == "ESP32"):
                files_to_copy.append(platformio_path + boot_app_path + "\\" + manifest_json["builds"][0]["parts"][2]["path"])
                files_to_copy.append(platformio_path + bootloader_path + "\\" + manifest_json["builds"][0]["parts"][0]["path"])
                files_to_copy.append(app_path + app + "\\.pio\\build\\" + board +  "\\firmware.bin")
                files_to_copy.append(app_path + app + "\\.pio\\build\\" + board + "\\partitions.bin")
            if(manifest_json["builds"][0]["chipFamily"] == "ESP8266"):
                files_to_copy.append(app_path + app + "\\.pio\\build\\" + board +  "\\firmware.bin")  
            if(little_fs_enable):
                files_to_copy.append(app_path + app + "\\.pio\\build\\" + board + "\\littlefs.bin")
            
            
        else:
            files_to_copy.append(app_path + app + "\\.pio\\build\\" + board + "\\firmware.hex")

        print(files_to_copy)
        print(final_path)

        if(copy_enable):
            for file_to_copy in files_to_copy:
                os.makedirs(os.path.dirname(final_path), exist_ok=True)
                shutil.copy(file_to_copy, final_path)
                if(board != "uno"):
                    with open(final_path + "manifest.json", "w+", encoding="utf-8") as f:
                        f.write(json.dumps(manifest_json))
        config.clear()

generate_all_apps()

